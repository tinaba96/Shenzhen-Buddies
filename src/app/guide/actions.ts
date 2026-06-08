'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  ACTIVE_BOOKING_STATUSES,
  amountCentsForHours,
  bookableSegments,
  CURRENCY,
  fitsInSegments,
  formatDay,
  formatHourRange,
  MAX_BOOKING_HOURS,
  MIN_BOOKING_HOURS,
  todayInShenzhen,
  type AvailabilityWindow,
} from '@/lib/booking'
import { adminEmails, isSingleGuideMode, officialGuideId, siteUrl } from '@/lib/config'
import { sendEmail } from '@/lib/email'
import { stripe } from '@/lib/stripe'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'

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

  // Drop this tourist's own abandoned hold for the day (if they bailed out of
  // a previous checkout) so they can retry without tripping the day lock.
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

    const session = await stripe().checkout.sessions.create({
      mode: 'payment',
      // Hold expires in 30 min (Stripe minimum), then the day frees up.
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
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
      cancel_url: `${siteUrl()}/guide?day=${day}&payment_cancelled=1`,
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
