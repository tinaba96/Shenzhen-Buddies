'use server'

import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import {
  ACTIVE_BOOKING_STATUSES,
  formatDay,
  formatHourRange,
  formatMoney,
  todayInShenzhen,
  type BookingRow,
} from '@/lib/booking'
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

  const day = String(formData.get('day') ?? '')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) fail('Pick a valid day.')
  if (day < todayInShenzhen()) fail('That day has already passed.')

  const startHour = Number(formData.get('start_hour'))
  const endHour = Number(formData.get('end_hour'))
  if (!Number.isInteger(startHour) || startHour < 0 || startHour > 23) {
    fail('Pick a valid start hour.')
  }
  if (!Number.isInteger(endHour) || endHour < 1 || endHour > 24) {
    fail('Pick a valid end hour.')
  }
  if (endHour <= startHour) fail('End must be after start.')

  const admin = createSupabaseAdminClient()
  const { error } = await admin
    .from('availability_windows')
    .insert({ day, start_hour: startHour, end_hour: endHour })
  if (error) {
    if (error.code === '23P01') {
      fail('That window overlaps an existing one on the same day.')
    }
    fail(error.message)
  }

  revalidatePath('/admin')
  redirect('/admin?saved=1')
}

export async function deleteAvailability(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') ?? '')
  if (!id) fail('Missing window id.')

  const admin = createSupabaseAdminClient()
  const { data: window } = await admin
    .from('availability_windows')
    .select('id, day, start_hour, end_hour')
    .eq('id', id)
    .maybeSingle<{ id: string; day: string; start_hour: number; end_hour: number }>()
  if (!window) fail('Window not found.')

  // Don't pull a window out from under live requests — resolve those first.
  // (Any active booking, incl. one mid-checkout, holds its whole day.)
  const { count } = await admin
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('day', window.day)
    .in('status', ACTIVE_BOOKING_STATUSES)
  if ((count ?? 0) > 0) {
    fail('That day has a pending or confirmed booking — handle it first.')
  }

  await admin.from('availability_windows').delete().eq('id', id)

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
