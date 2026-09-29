// Who may tip, for which tour. Shared by the Stripe tip action
// (guide/review/[id]/actions.ts) and the PayPal tip routes
// (api/paypal/create-tip, capture-tip) so the rule lives in one place: the
// signed-in tourist's own booking, confirmed, and already finished.

import type { SupabaseClient } from '@supabase/supabase-js'
import { hoursUntilTourStart, type BookingRow } from '@/lib/booking'
import { officialGuideId } from '@/lib/config'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export type TipBooking = Pick<
  BookingRow,
  'id' | 'tourist_id' | 'day' | 'start_hour' | 'end_hour' | 'status'
>

export type TipEligibility =
  | {
      ok: true
      user: { id: string; email?: string }
      booking: TipBooking
      // The RLS-scoped client used for the check, so callers that go on to
      // write (the review upsert) need not build a second one.
      supabase: SupabaseClient
    }
  | { ok: false; reason: 'signed_out' | 'not_found' | 'not_approved' | 'not_finished' }

export async function checkTipEligibility(
  bookingId: string,
): Promise<TipEligibility> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, reason: 'signed_out' }

  // RLS already limits a tourist to their own rows; the explicit tourist_id
  // filter keeps the intent visible.
  const { data: booking } = await supabase
    .from('bookings')
    .select('id, tourist_id, day, start_hour, end_hour, status')
    .eq('id', bookingId)
    .eq('tourist_id', user.id)
    .maybeSingle<TipBooking>()
  if (!booking) return { ok: false, reason: 'not_found' }
  if (booking.status !== 'approved') return { ok: false, reason: 'not_approved' }
  if (hoursUntilTourStart(booking.day, booking.end_hour, Date.now()) > 0) {
    return { ok: false, reason: 'not_finished' }
  }
  return { ok: true, user: { id: user.id, email: user.email }, booking, supabase }
}

// The official guide's display name for receipts and emails.
export async function officialGuideDisplayName(): Promise<string> {
  const guideId = officialGuideId()
  if (!guideId) return 'your guide'
  const admin = createSupabaseAdminClient()
  const { data: guide } = await admin
    .from('profiles')
    .select('display_name')
    .eq('id', guideId)
    .maybeSingle<{ display_name: string }>()
  return guide?.display_name || 'your guide'
}
