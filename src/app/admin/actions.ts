'use server'

import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import {
  createAvailabilityWindow,
  removeAvailabilityWindow,
} from '@/lib/availability'
import { resolveBookingById } from '@/lib/bookings'
import { isAdminEmail, siteUrl } from '@/lib/config'
import { sendEmail } from '@/lib/email'
import { notifyGuide } from '@/lib/notify'
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
  const error = await resolveBookingById(
    String(formData.get('id') ?? ''),
    nextStatus,
  )
  if (error) fail(error)
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

// "Send test email" on the admin dashboard: one mail to the admin pressing
// the button and one to the guide, through the exact same code the booking
// flow uses, so a dead Gmail app password or a wrong OFFICIAL_GUIDE_ID shows
// up here instead of on the first real booking.
export async function sendTestEmail() {
  const user = await requireAdmin()
  const stamp = new Date().toISOString()
  const adminResult = user.email
    ? await sendEmail({
        to: user.email,
        subject: 'Shenzhen Buddies — test email',
        text: [
          `This is a test sent from the admin dashboard at ${stamp}.`,
          'If you are reading it, booking emails to admins are working.',
          '',
          `Dashboard: ${siteUrl()}/admin`,
        ].join('\n'),
      })
    : { ok: false as const, error: 'your admin account has no email address' }
  const guide = await notifyGuide(
    'Shenzhen Buddies — test email',
    [
      `This is a test sent from the admin dashboard at ${stamp}.`,
      'If you are reading it, booking emails to the guide are working.',
      '',
      `Your dashboard: ${siteUrl()}/guide`,
    ].join('\n'),
  )
  revalidatePath('/admin')
  const parts = [
    adminResult.ok
      ? `Admin: sent to ${user.email}`
      : `Admin: NOT sent — ${adminResult.error}`,
    guide.sent ? `Guide: sent to ${guide.to}` : `Guide: NOT sent — ${guide.reason}`,
  ]
  redirect(`/admin?emailtest=${encodeURIComponent(parts.join(' · '))}`)
}
