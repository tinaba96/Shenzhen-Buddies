// Shared booking-resolution logic (approve / decline) used by both the
// operator (/admin) and the official guide (/guide). Returns an error message
// on failure or null on success; callers handle auth and redirects.

import {
  cancellationRefundPercent,
  CURRENCY,
  formatDay,
  formatHourRange,
  formatMoney,
  hoursUntilTourStart,
  type BookingRow,
} from '@/lib/booking'
import { adminEmails, officialGuideId, siteUrl } from '@/lib/config'
import { sendEmail } from '@/lib/email'
import { notifyGuide } from '@/lib/notify'
import { refundPaypalCapture } from '@/lib/paypal'
import { stripe } from '@/lib/stripe'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

// Which processor holds a paid booking's money, and the id needed to refund it.
// PayPal wins if a capture id is present; otherwise fall back to Stripe (older
// rows predate payment_provider, so we don't rely on it being set).
function paidPaymentRef(b: {
  stripe_payment_intent_id: string | null
  paypal_capture_id: string | null
}): { provider: 'stripe' | 'paypal'; ref: string } | null {
  if (b.paypal_capture_id) return { provider: 'paypal', ref: b.paypal_capture_id }
  if (b.stripe_payment_intent_id) {
    return { provider: 'stripe', ref: b.stripe_payment_intent_id }
  }
  return null
}

export async function resolveBookingById(
  id: string,
  nextStatus: 'approved' | 'rejected',
): Promise<string | null> {
  if (!id) return 'Missing booking id.'

  const admin = createSupabaseAdminClient()
  // Read the paid booking first so we can refund before flipping status.
  const { data: booking } = await admin
    .from('bookings')
    .select(
      'id, tourist_id, day, start_hour, end_hour, status, note, amount_cents, currency, stripe_payment_intent_id, payment_provider, paypal_capture_id, created_at',
    )
    .eq('id', id)
    .eq('status', 'pending')
    .maybeSingle<BookingRow>()
  if (!booking) return 'That request was already handled.'

  // Declining a paid booking refunds it. Do this BEFORE marking rejected so a
  // refund failure leaves the booking actionable instead of silently lost.
  let refunded = false
  if (nextStatus === 'rejected') {
    const payment = paidPaymentRef(booking)
    if (payment) {
      try {
        if (payment.provider === 'paypal') {
          await refundPaypalCapture({ captureId: payment.ref })
        } else {
          await stripe().refunds.create({ payment_intent: payment.ref })
        }
        refunded = true
      } catch (err) {
        console.error('Refund failed:', err)
        return 'Refund failed — issue it manually in Stripe/PayPal, then decline again.'
      }
    }
  }

  // Guard on status so a double-click (or two people) can't re-resolve.
  const { data: updated } = await admin
    .from('bookings')
    .update({ status: nextStatus })
    .eq('id', id)
    .eq('status', 'pending')
    .select('id')
    .maybeSingle<{ id: string }>()
  if (!updated) return 'That request was already handled.'

  const { data: touristAuth } = await admin.auth.admin.getUserById(
    booking.tourist_id,
  )
  const touristEmail = touristAuth?.user?.email

  const guideId = officialGuideId()
  let guideName = 'your guide'
  if (guideId) {
    const { data: guide } = await admin
      .from('profiles')
      .select('display_name')
      .eq('id', guideId)
      .maybeSingle<{ display_name: string }>()
    if (guide?.display_name) guideName = guide.display_name
  }

  const when = `${formatDay(booking.day)}, ${formatHourRange(booking.start_hour, booking.end_hour)}`

  // Email the tourist. Failures are logged inside sendEmail, never thrown.
  if (touristEmail) {
    if (nextStatus === 'approved') {
      await sendEmail({
        to: touristEmail,
        subject: `Your Shenzhen Buddies booking is confirmed — ${formatDay(booking.day)}`,
        text: [
          'Great news — your booking is confirmed!',
          '',
          `Guide: ${guideName}`,
          `When: ${when}`,
          '',
          `See your bookings: ${siteUrl()}/guide`,
          '',
          'See you in Shenzhen!',
        ].join('\n'),
      })
    } else {
      const refundLine = refunded
        ? booking.amount_cents != null
          ? `You've been fully refunded ${formatMoney(booking.amount_cents, booking.currency ?? undefined)} — it should appear on your statement within a few business days.`
          : "You've been fully refunded — it should appear on your statement within a few business days."
        : null
      await sendEmail({
        to: touristEmail,
        subject: 'Update on your Shenzhen Buddies booking request',
        text: [
          `Unfortunately we couldn't confirm your request for ${when}.`,
          ...(refundLine ? [refundLine] : []),
          '',
          'The time slot has been freed up — please pick another day or time.',
          '',
          `Pick a new slot: ${siteUrl()}/guide`,
        ].join('\n'),
      })
    }
  }

  // Keep the guide informed about their own bookings (links to /guide).
  if (nextStatus === 'approved') {
    await notifyGuide(
      `Booking confirmed — ${when}`,
      [
        'A booking on your calendar is now confirmed.',
        '',
        `When: ${when}`,
        booking.note ? `Note: ${booking.note}` : 'Note: —',
        '',
        `See your bookings: ${siteUrl()}/guide`,
      ].join('\n'),
    )
  } else {
    await notifyGuide(
      `Booking declined — ${when}`,
      [
        `The booking request for ${when} was declined and the tourist refunded.`,
        'Your day is free again.',
        '',
        `See your bookings: ${siteUrl()}/guide`,
      ].join('\n'),
    )
  }

  return null
}

// Tourist-initiated cancellation of their own booking. Returns the refund
// applied (per the cancellation policy) or an error message.
export async function cancelBookingByTourist(
  bookingId: string,
  touristId: string,
): Promise<{ error: string } | { refundCents: number; refundPercent: number }> {
  if (!bookingId) return { error: 'Missing booking id.' }

  const admin = createSupabaseAdminClient()
  const { data: booking } = await admin
    .from('bookings')
    .select(
      'id, tourist_id, day, start_hour, end_hour, status, note, amount_cents, currency, stripe_payment_intent_id, payment_provider, paypal_capture_id, created_at',
    )
    .eq('id', bookingId)
    .maybeSingle<BookingRow>()
  if (!booking) return { error: 'Booking not found.' }
  if (booking.tourist_id !== touristId) return { error: 'That is not your booking.' }
  if (booking.status !== 'pending' && booking.status !== 'approved') {
    return { error: 'This booking can no longer be cancelled.' }
  }

  const hoursUntil = hoursUntilTourStart(booking.day, booking.start_hour, Date.now())
  const refundPercent = cancellationRefundPercent(booking.status, hoursUntil)
  const refundCents =
    booking.amount_cents != null
      ? Math.round((booking.amount_cents * refundPercent) / 100)
      : 0

  // Claim the cancellation first (guarded on current status) so a concurrent
  // approve/decline can't collide, then issue the refund.
  const { data: updated } = await admin
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)
    .eq('status', booking.status)
    .select('id')
    .maybeSingle<{ id: string }>()
  if (!updated) return { error: 'This booking was just updated — please refresh.' }

  const payment = paidPaymentRef(booking)
  if (refundCents > 0 && payment) {
    try {
      const isFull = refundCents === booking.amount_cents
      if (payment.provider === 'paypal') {
        await refundPaypalCapture(
          isFull
            ? { captureId: payment.ref }
            : {
                captureId: payment.ref,
                amountCents: refundCents,
                currency: booking.currency ?? CURRENCY,
              },
        )
      } else {
        await stripe().refunds.create(
          isFull
            ? { payment_intent: payment.ref }
            : { payment_intent: payment.ref, amount: refundCents },
        )
      }
    } catch (err) {
      // The booking is already cancelled (day freed). Log so the refund can be
      // issued manually; don't fail the cancellation.
      console.error('Cancellation refund failed:', err)
    }
  }

  const when = `${formatDay(booking.day)}, ${formatHourRange(booking.start_hour, booking.end_hour)}`
  const refundText =
    refundCents > 0
      ? `Refund: ${formatMoney(refundCents, booking.currency ?? undefined)} (${refundPercent}%).`
      : 'No refund applies under the cancellation policy.'

  const { data: touristAuth } = await admin.auth.admin.getUserById(touristId)
  if (touristAuth?.user?.email) {
    await sendEmail({
      to: touristAuth.user.email,
      subject: `Your Shenzhen Buddies booking is cancelled — ${formatDay(booking.day)}`,
      text: [
        `Your booking for ${when} has been cancelled.`,
        refundText,
        refundCents > 0 ? 'Refunds take a few business days to appear.' : '',
        '',
        `Book another day: ${siteUrl()}/guide`,
      ]
        .filter(Boolean)
        .join('\n'),
    })
  }

  await sendEmail({
    to: adminEmails(),
    subject: `Booking cancelled by tourist — ${when}`,
    text: [
      `A tourist cancelled their booking for ${when}.`,
      refundText,
      'The day is free again.',
    ].join('\n'),
  })

  await notifyGuide(
    `Booking cancelled — ${when}`,
    [
      `A tourist cancelled their booking for ${when}.`,
      'Your day is free again.',
      '',
      `See your bookings: ${siteUrl()}/guide`,
    ].join('\n'),
  )

  return { refundCents, refundPercent }
}

// PayPal capture cleared: flip the held booking to a paid 'pending' awaiting
// review and notify everyone. Mirrors the Stripe webhook's markBookingPaid, but
// records the PayPal capture id so refunds route back to PayPal. Guarded on
// 'pending_payment' so a retried capture can't double-notify. Returns true if
// this call was the one that marked it paid.
export async function finalizePaypalBooking(params: {
  bookingId: string
  captureId: string
  amountCents: number
  currency: string
}): Promise<boolean> {
  const admin = createSupabaseAdminClient()
  const { data: booking } = await admin
    .from('bookings')
    .update({
      status: 'pending',
      payment_provider: 'paypal',
      paypal_capture_id: params.captureId,
      amount_cents: params.amountCents,
      currency: params.currency,
    })
    .eq('id', params.bookingId)
    .eq('status', 'pending_payment')
    .select('id, tourist_id, day, start_hour, end_hour, note, amount_cents, currency')
    .maybeSingle<{
      id: string
      tourist_id: string
      day: string
      start_hour: number
      end_hour: number
      note: string | null
      amount_cents: number | null
      currency: string | null
    }>()
  // Already processed (or never a hold) — nothing to notify.
  if (!booking) return false

  const { data: tourist } = await admin
    .from('profiles')
    .select('display_name')
    .eq('id', booking.tourist_id)
    .maybeSingle<{ display_name: string }>()
  const { data: touristAuth } = await admin.auth.admin.getUserById(
    booking.tourist_id,
  )
  const paid =
    booking.amount_cents != null
      ? formatMoney(booking.amount_cents, booking.currency ?? undefined)
      : '—'
  const when = `${formatDay(booking.day)}, ${formatHourRange(booking.start_hour, booking.end_hour)}`

  await sendEmail({
    to: adminEmails(),
    subject: `New paid booking — ${when}`,
    text: [
      'A paid booking request is waiting for review. (Paid via PayPal.)',
      '',
      `Tourist: ${tourist?.display_name ?? 'Unknown'} (${touristAuth?.user?.email ?? 'no email'})`,
      `Day: ${formatDay(booking.day)}`,
      `Time: ${formatHourRange(booking.start_hour, booking.end_hour)} (${booking.end_hour - booking.start_hour} hours)`,
      `Paid: ${paid}`,
      booking.note ? `Note: ${booking.note}` : 'Note: —',
      '',
      'If you decline, the tourist is automatically refunded.',
      `Approve or decline it here: ${siteUrl()}/admin`,
    ].join('\n'),
  })

  if (touristAuth?.user?.email) {
    await sendEmail({
      to: touristAuth.user.email,
      subject: `We received your booking request — ${formatDay(booking.day)}`,
      text: [
        'Thanks! We’ve received your booking request and your payment.',
        '',
        `Day: ${formatDay(booking.day)}`,
        `Time: ${formatHourRange(booking.start_hour, booking.end_hour)} (${booking.end_hour - booking.start_hour} hours)`,
        `Paid: ${paid}`,
        booking.note ? `Your note: ${booking.note}` : '',
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

  await notifyGuide(
    `New booking request — ${when}`,
    [
      'A new booking request just came in for you.',
      '',
      `Day: ${formatDay(booking.day)}`,
      `Time: ${formatHourRange(booking.start_hour, booking.end_hour)} (${booking.end_hour - booking.start_hour} hours)`,
      booking.note ? `Note: ${booking.note}` : 'Note: —',
      '',
      'Approve or decline it on your dashboard:',
      `${siteUrl()}/guide`,
    ].join('\n'),
  )

  return true
}
