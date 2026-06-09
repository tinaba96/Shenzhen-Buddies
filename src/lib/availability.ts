// Shared availability-window logic used by both the operator (/admin) and the
// official guide (/guide). Each function returns an error message on failure
// or null on success; the calling server action handles redirects.

import {
  ACTIVE_BOOKING_STATUSES,
  HOLD_EXPIRY_MINUTES,
  todayInShenzhen,
} from '@/lib/booking'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

export async function createAvailabilityWindow(
  day: string,
  startHour: number,
  endHour: number,
): Promise<string | null> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return 'Pick a valid day.'
  if (day < todayInShenzhen()) return 'That day has already passed.'
  if (!Number.isInteger(startHour) || startHour < 0 || startHour > 23) {
    return 'Pick a valid start hour.'
  }
  if (!Number.isInteger(endHour) || endHour < 1 || endHour > 24) {
    return 'Pick a valid end hour.'
  }
  if (endHour <= startHour) return 'End must be after start.'

  const admin = createSupabaseAdminClient()
  const { error } = await admin
    .from('availability_windows')
    .insert({ day, start_hour: startHour, end_hour: endHour })
  if (error) {
    if (error.code === '23P01') {
      return 'That window overlaps an existing one on the same day.'
    }
    return error.message
  }
  return null
}

export async function removeAvailabilityWindow(id: string): Promise<string | null> {
  if (!id) return 'Missing window id.'

  const admin = createSupabaseAdminClient()
  const { data: window } = await admin
    .from('availability_windows')
    .select('id, day, start_hour, end_hour')
    .eq('id', id)
    .maybeSingle<{
      id: string
      day: string
      start_hour: number
      end_hour: number
    }>()
  if (!window) return 'Window not found.'

  // Free abandoned holds on this day first so a dead checkout doesn't block
  // removing the window.
  const staleCutoffIso = new Date(
    Date.now() - HOLD_EXPIRY_MINUTES * 60_000,
  ).toISOString()
  await admin
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('day', window.day)
    .eq('status', 'pending_payment')
    .lt('created_at', staleCutoffIso)

  // Don't pull a window out from under live requests — resolve those first.
  const { count } = await admin
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('day', window.day)
    .in('status', ACTIVE_BOOKING_STATUSES)
  if ((count ?? 0) > 0) {
    return 'That day has a pending or confirmed booking — handle it first.'
  }

  await admin.from('availability_windows').delete().eq('id', id)
  return null
}
