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
  FREE_TOUR_LENGTHS,
  FREE_TOURS,
  HOLD_EXPIRY_MINUTES,
  isLiveBooking,
  MAX_BOOKING_HOURS,
  MIN_BOOKING_HOURS,
  todayInShenzhen,
  type AvailabilityWindow,
  type BookingStatus,
} from '@/lib/booking'
import {
  adminEmails,
  isAdminEmail,
  isSingleGuideMode,
  officialGuideId,
  siteUrl,
} from '@/lib/config'
import { sendEmail } from '@/lib/email'
import { fill } from '@/i18n'
import { getI18n } from '@/i18n/server'
import { describeGuideNotify, notifyGuide } from '@/lib/notify'
import { validatePromoCode } from '@/lib/promo'
import { stripe } from '@/lib/stripe'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'

// The official guide manages their own availability from /guide. Operators
// (admins) can do it too, here or from /admin.
//
// /guide itself is a public preview, so every action in this file re-checks
// auth here rather than leaning on a page-level redirect.
async function requireGuideOrAdmin() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/guide')
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
  if (!user) redirect('/login?next=/guide')

  const result = await cancelBookingByTourist(
    String(formData.get('id') ?? ''),
    user.id,
  )
  if ('error' in result) {
    // The tourist reads this, so it is worded in their language.
    const e = (await getI18n()).t.booking.errors
    availFail(
      {
        missing: e.cancelMissing,
        not_found: e.cancelNotFound,
        not_yours: e.cancelNotYours,
        closed: e.cancelClosed,
        changed: e.cancelChanged,
      }[result.error],
    )
  }
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

  const day = String(formData.get('day') ?? '')

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  // The booking form is the auth wall for the public /guide preview. Send
  // anonymous visitors to log in and back to the day they picked.
  if (!user) {
    redirect(
      `/login?next=${encodeURIComponent(
        /^\d{4}-\d{2}-\d{2}$/.test(day) ? `/guide?day=${day}` : '/guide',
      )}`,
    )
  }

  // Errors go back to the page as ?error= text, so they are written in the
  // visitor's language here. Emails below stay English (they go to staff).
  const { locale, meta, t } = await getI18n()
  const e = t.booking.errors

  const { data: myProfile } = await supabase
    .from('profiles')
    .select('role, display_name')
    .eq('id', user.id)
    .maybeSingle<{ role: 'guide' | 'tourist'; display_name: string }>()
  if (myProfile?.role !== 'tourist') {
    fail(e.touristsOnly)
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    fail(e.pickDay)
  }
  if (day < todayInShenzhen()) {
    fail(e.pastDay)
  }
  // Free tours ask for a review in return; the checkbox is required in the
  // form, this catches a request sent without it.
  if (FREE_TOURS && formData.get('review_pledge') !== 'yes') {
    fail(t.request.errors.pledge, day)
  }

  const startHour = Number(formData.get('start_hour'))
  const duration = Number(formData.get('duration'))
  if (!Number.isInteger(startHour) || startHour < 0 || startHour > 23) {
    fail(e.startTime, day)
  }
  if (
    !Number.isInteger(duration) ||
    duration < MIN_BOOKING_HOURS ||
    duration > MAX_BOOKING_HOURS
  ) {
    fail(
      fill(e.lengthRange, { min: MIN_BOOKING_HOURS, max: MAX_BOOKING_HOURS }),
      day,
    )
  }
  // Free pilot: only the fixed package lengths, not any value in the range.
  if (FREE_TOURS && !FREE_TOUR_LENGTHS.includes(duration)) {
    fail(
      fill(e.freeLengths, { lengths: FREE_TOUR_LENGTHS.join(e.or) }),
      day,
    )
  }
  const endHour = startHour + duration
  // Amount is computed server-side and never trusted from the client.
  const amountCents = amountCentsForHours(duration)

  const note = String(formData.get('note') ?? '').trim().slice(0, 500) || null

  const admin = createSupabaseAdminClient()

  // Free abandoned holds on this day — anyone's checkout that expired (incl.
  // ones the Stripe expiry webhook missed) — so a dead hold can't lock its
  // hours forever or trip the exclusion constraint on insert.
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
  // previous checkout) so they can retry without tripping the overlap lock.
  await admin
    .from('bookings')
    .delete()
    .eq('tourist_id', user.id)
    .eq('day', day)
    .eq('status', 'pending_payment')

  // One booking at a time: a tourist with a live tour anywhere on the
  // calendar (awaiting review, confirmed, or a fresh hold; not yet over)
  // can't request another. Own holds for THIS day were just dropped, so a
  // retry on the same day passes. The bookings_one_at_a_time trigger
  // (migration 0019) backstops the race between two submissions.
  const { data: myUpcoming, error: myUpcomingError } = await admin
    .from('bookings')
    .select('day, start_hour, end_hour, status, created_at')
    .eq('tourist_id', user.id)
    .gte('day', todayInShenzhen())
    .in('status', ACTIVE_BOOKING_STATUSES)
    .returns<
      {
        day: string
        start_hour: number
        end_hour: number
        status: BookingStatus
        created_at: string
      }[]
    >()
  if (myUpcomingError) {
    fail(e.checkBookings, day)
  }
  const live = (myUpcoming ?? []).find((b) => isLiveBooking(b, Date.now()))
  if (live) {
    // English keeps formatDay's exact output; others use their own date order.
    const when =
      locale === 'en'
        ? formatDay(live.day)
        : new Date(`${live.day}T00:00:00`).toLocaleDateString(meta.intlLocale, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
    fail(
      fill(
        e.liveBooked,
        {
          when: fill(
            t.booking.dateTime,
            {
              date: when,
              time: formatHourRange(live.start_hour, live.end_hour),
            },
            locale,
          ),
        },
        locale,
      ),
      day,
    )
  }

  // Recheck the slot is still bookable: inside a published window and at
  // least BOOKING_GAP_HOURS clear of every active booking on the day (incl.
  // another tourist mid-checkout — stale holds were just cleaned up above).
  const { data: windows } = await supabase
    .from('availability_windows')
    .select('id, day, start_hour, end_hour')
    .eq('day', day)
    .returns<AvailabilityWindow[]>()
  if (!windows?.length) {
    fail(e.notAvailable, day)
  }

  const { data: activeBookings, error: activeError } = await admin
    .from('bookings')
    .select('start_hour, end_hour')
    .eq('day', day)
    .in('status', ACTIVE_BOOKING_STATUSES)
    .returns<{ start_hour: number; end_hour: number }[]>()
  if (activeError) {
    fail(e.checkAvailability, day)
  }
  const dayBookings = activeBookings ?? []

  const segments = windows.flatMap((w) => bookableSegments(w, dayBookings))
  if (!fitsInSegments(segments, startHour, endHour)) {
    fail(
      fill(e.slotTaken, { range: formatHourRange(startHour, endHour) }),
      day,
    )
  }

  // Create the booking as a hold first — this locks the hours via the
  // exclusion constraint before the tourist leaves for Stripe.
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
    // 23P01 = exclusion constraint violation: someone grabbed those hours
    // (or ones within the gap) between our check and the insert.
    if (error?.code === '23P01') {
      fail(e.justBooked, day)
    }
    // SB001 = the bookings_one_at_a_time trigger, 23505 = the per-day
    // unique index: this tourist's other request landed first (two tabs).
    if (error?.code === 'SB001' || error?.code === '23505') {
      fail(e.alreadyBooked, day)
    }
    // Anything else is a database error: log it for us, and show the tourist
    // a sentence in their language rather than Postgres's English.
    console.error('Booking insert failed:', error)
    fail(e.createFailed, day)
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

  // Free pilot (or no Stripe key): skip payment entirely — flip the hold to a
  // reviewable 'pending' request and notify everyone, same as the paid path
  // does after checkout.
  if (FREE_TOURS || !process.env.STRIPE_SECRET_KEY) {
    await admin
      .from('bookings')
      .update({ status: 'pending' })
      .eq('id', booking.id)
    // Guide first, so the admin email can say whether the guide was reached.
    const guideNotified = await notifyGuide(
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
    await sendEmail({
      to: adminEmails(),
      subject: `New booking request — ${formatDay(day)}, ${formatHourRange(startHour, endHour)}`,
      text: [
        FREE_TOURS
          ? 'A new booking request is waiting for review. (Free pilot — no payment taken.)'
          : 'A new booking request is waiting for review. (Payment is disabled — no Stripe key configured.)',
        '',
        `Tourist: ${myProfile.display_name} (${user.email ?? 'no email'})`,
        `Day: ${formatDay(day)}`,
        `Time: ${formatHourRange(startHour, endHour)} (${duration} hours)`,
        note ? `Note: ${note}` : 'Note: —',
        '',
        describeGuideNotify(guideNotified),
        '',
        `Approve or decline it here: ${siteUrl()}/admin`,
      ].join('\n'),
    })
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
          FREE_TOURS
            ? 'We’ll confirm your day by email within 3 business days. The tour is free — there’s nothing to pay.'
            : 'We’ll confirm your day by email within 3 business days. If we can’t confirm it, you’ll be refunded in full.',
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

  // Hold created — send the tourist to the payment page to choose card (Stripe)
  // or PayPal. The hold keeps the hours locked until a payment completes
  // (status -> pending) or the hold expires and self-heals.
  revalidatePath('/guide')
  redirect(`/guide/pay/${booking.id}`)
}

// Start Stripe Checkout for an existing held booking. Invoked from the payment
// page's "Pay by card" button. PayPal takes a separate route (/api/paypal/*).
export async function startStripeCheckout(formData: FormData) {
  const bookingId = String(formData.get('booking_id') ?? '')
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=${encodeURIComponent(`/guide/pay/${bookingId}`)}`)

  const admin = createSupabaseAdminClient()
  const { data: booking } = await admin
    .from('bookings')
    .select('id, tourist_id, day, start_hour, end_hour, status, amount_cents')
    .eq('id', bookingId)
    .maybeSingle<{
      id: string
      tourist_id: string
      day: string
      start_hour: number
      end_hour: number
      status: string
      amount_cents: number | null
    }>()
  if (
    !booking ||
    booking.tourist_id !== user.id ||
    booking.status !== 'pending_payment'
  ) {
    redirect(
      `/guide?error=${encodeURIComponent('That booking is no longer awaiting payment.')}`,
    )
  }

  const duration = booking.end_hour - booking.start_hour

  // Apply a promo code (validated against Stripe, the source of truth) as a
  // Checkout discount so Stripe applies it and records the redemption. A
  // 100%-off code yields a $0 Checkout, which Stripe handles and the webhook
  // marks paid.
  const promoInput = String(formData.get('promo_code') ?? '')
  let discounts: Array<{ promotion_code: string }> | undefined
  if (promoInput) {
    const promo = await validatePromoCode(promoInput, booking.amount_cents ?? 0)
    if (!promo) {
      redirect(
        `/guide/pay/${booking.id}?error=${encodeURIComponent('That promo code is not valid.')}`,
      )
    }
    discounts = [{ promotion_code: promo.promotionCodeId }]
  }

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

  let checkoutUrl: string
  try {
    // WeChat Pay only works once the live account is eligible AND it's active
    // in the dashboard. Listing it otherwise 400s the whole Checkout (taking
    // card/Apple Pay down with it), so gate it behind an env flag — flip
    // STRIPE_WECHAT_PAY=on once Stripe marks it active, no code change needed.
    const wechatPay = process.env.STRIPE_WECHAT_PAY === 'on'

    const session = await stripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: wechatPay
        ? ['card', 'link', 'wechat_pay']
        : ['card', 'link'],
      ...(wechatPay
        ? { payment_method_options: { wechat_pay: { client: 'web' as const } } }
        : {}),
      // Discount comes from the payment page's shared promo field (validated
      // above), not Stripe's own promo field — so the same code drives PayPal
      // too. discounts and allow_promotion_codes are mutually exclusive.
      ...(discounts ? { discounts } : {}),
      expires_at: Math.floor(Date.now() / 1000) + CHECKOUT_EXPIRY_MINUTES * 60,
      customer_email: user.email ?? undefined,
      line_items: [
        {
          quantity: duration,
          price_data: {
            currency: CURRENCY,
            unit_amount: amountCentsForHours(1),
            product_data: {
              name: `Tour with ${guideName} — ${formatDay(booking.day)}`,
              description: `${formatHourRange(booking.start_hour, booking.end_hour)} · ${duration} hours`,
            },
          },
        },
      ],
      metadata: { booking_id: booking.id, user_id: user.id },
      payment_intent_data: {
        metadata: { booking_id: booking.id, user_id: user.id },
      },
      success_url: `${siteUrl()}/guide?paid=1`,
      cancel_url: `${siteUrl()}/guide/pay/${booking.id}?cancelled=1`,
    })
    if (!session.url) throw new Error('Stripe did not return a checkout URL')

    await admin
      .from('bookings')
      .update({ stripe_session_id: session.id })
      .eq('id', booking.id)
    checkoutUrl = session.url
  } catch (err) {
    // Keep the hold so they can retry or pay with PayPal instead.
    console.error('Stripe checkout creation failed:', err)
    redirect(
      `/guide/pay/${booking.id}?error=${encodeURIComponent('Could not start card payment. Try again or use PayPal.')}`,
    )
  }

  redirect(checkoutUrl)
}
