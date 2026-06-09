'use server'

import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import {
  createAvailabilityWindow,
  removeAvailabilityWindow,
} from '@/lib/availability'
import { formatDay, formatHourRange, formatMoney, type BookingRow } from '@/lib/booking'
import { isAdminEmail, officialGuideId, siteUrl } from '@/lib/config'
import { sendEmail } from '@/lib/email'
import { stripe } from '@/lib/stripe'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  if (!isAdminEmail(user.email)) notFound()
  return user
}

function fail(message: string): never {
  redirect(`/admin?error=${encodeURIComponent(message)}`)
}

export async function addAvailability(formData: FormData) {
  await requireAdmin()
  const error = await createAvailabilityWindow(
    String(formData.get('day') ?? ''),
    Number(formData.get('start_hour')),
    Number(formData.get('end_hour')),
  )
  if (error) fail(error)
  revalidatePath('/admin')
  redirect('/admin?saved=1')
}

export async function deleteAvailability(formData: FormData) {
  await requireAdmin()
  const error = await removeAvailabilityWindow(String(formData.get('id') ?? ''))
  if (error) fail(error)
  revalidatePath('/admin')
  redirect('/admin?deleted=1')
}

async function resolveBooking(
  formData: FormData,
  nextStatus: 'approved' | 'rejected',
) {
  await requireAdmin()

  const id = String(formData.get('id') ?? '')
  if (!id) fail('Missing booking id.')

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
  if (!booking) fail('That request was already handled.')

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
      fail('Refund failed — issue it in Stripe, then decline again.')
    }
  }

  // Guard on status so a double-click (or two admins) can't re-resolve.
  const { data: updated, error } = await admin
    .from('bookings')
    .update({ status: nextStatus })
    .eq('id', id)
    .eq('status', 'pending')
    .select('id')
    .maybeSingle<{ id: string }>()
  if (error) fail(error.message)
  if (!updated) fail('That request was already handled.')

  // Email the tourist. Failures are logged inside sendEmail, never thrown.
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

  revalidatePath('/admin')
  revalidatePath('/guide')
  redirect(`/admin?${nextStatus}=1`)
}

export async function approveBooking(formData: FormData) {
  await resolveBooking(formData, 'approved')
}

export async function rejectBooking(formData: FormData) {
  await resolveBooking(formData, 'rejected')
}
