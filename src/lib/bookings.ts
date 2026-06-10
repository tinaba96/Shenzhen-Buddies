// Shared booking-resolution logic (approve / decline) used by both the
// operator (/admin) and the official guide (/guide). Returns an error message
// on failure or null on success; callers handle auth and redirects.

import { formatDay, formatHourRange, formatMoney, type BookingRow } from '@/lib/booking'
import { officialGuideId, siteUrl } from '@/lib/config'
import { sendEmail } from '@/lib/email'
import { notifyGuide } from '@/lib/notify'
import { stripe } from '@/lib/stripe'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

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
      'id, tourist_id, day, start_hour, end_hour, status, note, amount_cents, currency, stripe_payment_intent_id, created_at',
    )
    .eq('id', id)
    .eq('status', 'pending')
    .maybeSingle<BookingRow>()
  if (!booking) return 'That request was already handled.'

  // Declining a paid booking refunds it. Do this BEFORE marking rejected so a
  // refund failure leaves the booking actionable instead of silently lost.
  let refunded = false
  if (nextStatus === 'rejected' && booking.stripe_payment_intent_id) {
    try {
      await stripe().refunds.create({
        payment_intent: booking.stripe_payment_intent_id,
      })
      refunded = true
    } catch (err) {
      console.error('Refund failed:', err)
      return 'Refund failed — issue it in Stripe, then decline again.'
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
