'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import {
  createAvailabilityWindow,
  removeAvailabilityWindow,
} from '@/lib/availability'
import { cancelBookingByTourist, resolveBookingById } from '@/lib/bookings'
import { logBookingConsent } from '@/lib/consent'
import { POLICY_VERSION } from '@/lib/policy'
import {
  ACTIVE_BOOKING_STATUSES,
  amountCentsForHours,
  bookableSegments,
  CHECKOUT_EXPIRY_MINUTES,
  CURRENCY,
  fitsInSegments,
  formatDay,
  formatHourRange,
  HOLD_EXPIRY_MINUTES,
  MAX_BOOKING_HOURS,
  MIN_BOOKING_HOURS,
  todayInShenzhen,
  type AvailabilityWindow,
} from '@/lib/booking'
import {
  adminEmails,
  isAdminEmail,
  isSingleGuideMode,
  officialGuideId,
  siteUrl,
} from '@/lib/config'
import { sendEmail } from '@/lib/email'
import { notifyGuide } from '@/lib/notify'
import { stripe } from '@/lib/stripe'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'

// The official guide manages their own availability from /guide. Operators
// (admins) can do it too, here or from /admin.
async function requireGuideOrAdmin() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const isGuide = officialGuideId() !== null && user.id === officialGuideId()
  if (!isGuide && !isAdminEmail(user.email)) notFound()
  return user
}

function availFail(message: string): never {
  redirect(`/guide?error=${encodeURIComponent(message)}`)
}

export async function addGuideAvailability(formData: FormData) {
  await requireGuideOrAdmin()
  const error = await createAvailabilityWindow(
    String(formData.get('day') ?? ''),
    Number(formData.get('start_hour')),
    Number(formData.get('end_hour')),
  )
  if (error) availFail(error)
  revalidatePath('/guide')
  redirect('/guide?avail_saved=1')
}

export async function deleteGuideAvailability(formData: FormData) {
  await requireGuideOrAdmin()
  const error = await removeAvailabilityWindow(String(formData.get('id') ?? ''))
  if (error) availFail(error)
  revalidatePath('/guide')
  redirect('/guide?avail_deleted=1')
}

export async function approveGuideBooking(formData: FormData) {
  await requireGuideOrAdmin()
  const error = await resolveBookingById(
    String(formData.get('id') ?? ''),
    'approved',
  )
  if (error) availFail(error)
  revalidatePath('/guide')
  revalidatePath('/admin')
  redirect('/guide?approved=1')
}

export async function rejectGuideBooking(formData: FormData) {
  await requireGuideOrAdmin()
  const error = await resolveBookingById(
    String(formData.get('id') ?? ''),
    'rejected',
  )
  if (error) availFail(error)
  revalidatePath('/guide')
  revalidatePath('/admin')
  redirect('/guide?declined=1')
}

// A tourist cancelling their own booking (refund per the cancellation policy).
export async function cancelOwnBooking(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const result = await cancelBookingByTourist(
    String(formData.get('id') ?? ''),
    user.id,
  )
  if ('error' in result) availFail(result.error)
  revalidatePath('/guide')
  revalidatePath('/admin')
  redirect(`/guide?cancelled=1&refund_cents=${result.refundCents}`)
}

function fail(message: string, day?: string): never {
  const dayParam = day ? `&day=${encodeURIComponent(day)}` : ''
  redirect(`/guide?error=${encodeURIComponent(message)}${dayParam}`)
}

export async function requestBooking(formData: FormData) {
  if (!isSingleGuideMode()) redirect('/browse')

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: myProfile } = await supabase
    .from('profiles')
    .select('role, display_name')
    .eq('id', user.id)
    .maybeSingle<{ role: 'guide' | 'tourist'; display_name: string }>()
  if (myProfile?.role !== 'tourist') {
    fail('Only tourists can request a booking. Set your role on your profile.')
  }

  const day = String(formData.get('day') ?? '')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    fail('Pick a day first.')
  }
  if (day < todayInShenzhen()) {
    fail('That day has already passed — pick another one.')
  }

  const startHour = Number(formData.get('start_hour'))
  const duration = Number(formData.get('duration'))
  if (!Number.isInteger(startHour) || startHour < 0 || startHour > 23) {
    fail('Pick a valid start time.', day)
  }
  if (
    !Number.isInteger(duration) ||
    duration < MIN_BOOKING_HOURS ||
    duration > MAX_BOOKING_HOURS
  ) {
    fail(
      `Tours run from ${MIN_BOOKING_HOURS} to ${MAX_BOOKING_HOURS} hours.`,
      day,
    )
  }
  const endHour = startHour + duration
  // Amount is computed server-side and never trusted from the client.
  const amountCents = amountCentsForHours(duration)

  const note = String(formData.get('note') ?? '').trim().slice(0, 500) || null

  const admin = createSupabaseAdminClient()

  // Free abandoned holds on this day — anyone's checkout that expired (incl.
  // ones the Stripe expiry webhook missed) — so a dead hold can't lock the
  // day forever or trip the exclusion constraint on insert.
  const staleCutoffIso = new Date(
    Date.now() - HOLD_EXPIRY_MINUTES * 60_000,
  ).toISOString()
  await admin
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('day', day)
    .eq('status', 'pending_payment')
    .lt('created_at', staleCutoffIso)

  // Drop this tourist's own current hold for the day (if they bailed out of a
  // previous checkout) so they can retry without tripping the day lock.
  await admin
    .from('bookings')
    .delete()
    .eq('tourist_id', user.id)
    .eq('day', day)
    .eq('status', 'pending_payment')

  // Recheck the day is still bookable. Any active booking (incl. another
  // tourist mid-checkout) holds the whole day.
  const { data: windows } = await supabase
    .from('availability_windows')
    .select('id, day, start_hour, end_hour')
    .eq('day', day)
    .returns<AvailabilityWindow[]>()
  if (!windows?.length) {
    fail('The guide is not available on that day.', day)
  }

  const { count: activeCount } = await admin
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('day', day)
    .in('status', ACTIVE_BOOKING_STATUSES)
  if ((activeCount ?? 0) > 0) {
    fail('Sorry — that day was just booked by someone else.', day)
  }

  const segments = windows.flatMap(bookableSegments)
  if (!fitsInSegments(segments, startHour, endHour)) {
    fail(
      `${formatHourRange(startHour, endHour)} is outside the guide's hours on that day — pick a listed slot.`,
      day,
    )
  }

  // Create the booking as a hold first — this locks the day via the exclusion
  // constraint before the tourist leaves for Stripe.
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      tourist_id: user.id,
      day,
      start_hour: startHour,
      end_hour: endHour,
      note,
      status: 'pending_payment',
      amount_cents: amountCents,
      currency: CURRENCY,
      terms_version: POLICY_VERSION,
    })
    .select('id')
    .single<{ id: string }>()
  if (error || !booking) {
    // 23P01 = exclusion constraint violation: someone grabbed the day
    // between our check and the insert.
    if (error?.code === '23P01') {
      fail('Sorry — that day was just booked by someone else.', day)
    }
    fail(error?.message ?? 'Could not create the booking.', day)
  }

  // Record the tourist's agreement to the Terms + Cancellation Policy (booking
  // implies agreement, per the form) for audit. Best-effort.
  const h = await headers()
  await logBookingConsent({
    userId: user.id,
    bookingId: booking.id,
    ip: h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
    userAgent: h.get('user-agent'),
  })

  // Pilot fallback: with no Stripe key, skip payment and behave like before
  // (mark paid-equivalent 'pending' and notify admins).
  if (!process.env.STRIPE_SECRET_KEY) {
    await admin
      .from('bookings')
      .update({ status: 'pending' })
      .eq('id', booking.id)
    await sendEmail({
      to: adminEmails(),
      subject: `New booking request — ${formatDay(day)}, ${formatHourRange(startHour, endHour)}`,
      text: [
        'A new booking request is waiting for review. (Payment is disabled — no Stripe key configured.)',
        '',
        `Tourist: ${myProfile.display_name} (${user.email ?? 'no email'})`,
        `Day: ${formatDay(day)}`,
        `Time: ${formatHourRange(startHour, endHour)} (${duration} hours)`,
        note ? `Note: ${note}` : 'Note: —',
        '',
        `Approve or decline it here: ${siteUrl()}/admin`,
      ].join('\n'),
    })
    await notifyGuide(
      `New booking request — ${formatDay(day)}, ${formatHourRange(startHour, endHour)}`,
      [
        'A new booking request just came in for you.',
        '',
        `Day: ${formatDay(day)}`,
        `Time: ${formatHourRange(startHour, endHour)} (${duration} hours)`,
        note ? `Note: ${note}` : 'Note: —',
        '',
        'Approve or decline it on your dashboard:',
        `${siteUrl()}/guide`,
      ].join('\n'),
    )
    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: `We received your booking request — ${formatDay(day)}`,
        text: [
          'Thanks! We’ve received your booking request.',
          '',
          `Day: ${formatDay(day)}`,
          `Time: ${formatHourRange(startHour, endHour)} (${duration} hours)`,
          note ? `Your note: ${note}` : '',
          '',
          'We’ll confirm your day by email within 3 business days. If we can’t confirm it, you’ll be refunded in full.',
          `Cancellation policy: ${siteUrl()}/cancellation`,
          '',
          `View your booking anytime: ${siteUrl()}/guide`,
          '',
          'See you in Shenzhen!',
        ]
          .filter(Boolean)
          .join('\n'),
      })
    }
    revalidatePath('/guide')
    redirect('/guide?requested=1')
  }

  // Start Stripe Checkout. The day stays held until payment succeeds
  // (status -> pending via webhook) or the session expires (-> cancelled).
  let checkoutUrl: string
  try {
    let guideName = 'your guide'
    const guideId = officialGuideId()
    if (guideId) {
      const { data: guide } = await admin
        .from('profiles')
        .select('display_name')
        .eq('id', guideId)
        .maybeSingle<{ display_name: string }>()
      if (guide?.display_name) guideName = guide.display_name
    }

    // WeChat Pay only works once the live account is eligible AND it's active
    // in the dashboard. Listing it otherwise 400s the whole Checkout (taking
    // card/Apple Pay down with it), so gate it behind an env flag — flip
    // STRIPE_WECHAT_PAY=on once Stripe marks it active, no code change needed.
    const wechatPay = process.env.STRIPE_WECHAT_PAY === 'on'

    const session = await stripe().checkout.sessions.create({
      mode: 'payment',
      // Card (Apple/Google Pay ride on this) + Stripe Link — but no BNPL like
      // Klarna/Affirm. WeChat Pay (one-time only) is added when enabled.
      payment_method_types: wechatPay
        ? ['card', 'link', 'wechat_pay']
        : ['card', 'link'],
      // WeChat Pay needs its client surface set per session; 'web' renders a
      // scannable QR in Checkout.
      ...(wechatPay
        ? { payment_method_options: { wechat_pay: { client: 'web' as const } } }
        : {}),
      // Show a promo-code field. Codes are created in the Stripe dashboard
      // (10/30/50/70/100% off); only people who know one can apply it, and
      // Stripe validates redemption/limits/expiry server-side.
      allow_promotion_codes: true,
      // Session expires after the checkout window (Stripe minimum), after
      // which the tourist can no longer pay and the day frees up.
      expires_at: Math.floor(Date.now() / 1000) + CHECKOUT_EXPIRY_MINUTES * 60,
      customer_email: user.email ?? undefined,
      line_items: [
        {
          quantity: duration,
          price_data: {
            currency: CURRENCY,
            unit_amount: amountCentsForHours(1),
            product_data: {
              name: `Tour with ${guideName} — ${formatDay(day)}`,
              description: `${formatHourRange(startHour, endHour)} · ${duration} hours`,
            },
          },
        },
      ],
      metadata: { booking_id: booking.id, user_id: user.id },
      payment_intent_data: {
        metadata: { booking_id: booking.id, user_id: user.id },
      },
      success_url: `${siteUrl()}/guide?paid=1`,
      cancel_url: `${siteUrl()}/guide/cancel?day=${day}`,
    })
    if (!session.url) throw new Error('Stripe did not return a checkout URL')

    await admin
      .from('bookings')
      .update({ stripe_session_id: session.id })
      .eq('id', booking.id)
    checkoutUrl = session.url
  } catch (err) {
    // Roll back the hold so the day isn't stuck if checkout couldn't start.
    await admin.from('bookings').delete().eq('id', booking.id)
    console.error('Stripe checkout creation failed:', err)
    fail('Could not start payment. Please try again.', day)
  }

  revalidatePath('/guide')
  redirect(checkoutUrl)
}
