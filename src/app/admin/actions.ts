'use server'

import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import {
  createAvailabilityWindow,
  removeAvailabilityWindow,
} from '@/lib/availability'
import { resolveBookingById } from '@/lib/bookings'
import { isAdminEmail } from '@/lib/config'
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
