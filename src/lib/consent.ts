// Records a tourist's agreement to the Terms + Cancellation Policy when they
// book. Writes go through the service-role client (consent_logs is append-only
// from clients). Best-effort: a logging failure must not break the booking,
// and bookings.terms_version is the atomic fallback record.

import { POLICY_VERSION } from '@/lib/policy'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

export async function logBookingConsent(params: {
  userId: string
  bookingId: string
  ip: string | null
  userAgent: string | null
}) {
  try {
    const admin = createSupabaseAdminClient()
    const rows = ['terms', 'cancellation'].map((document) => ({
      user_id: params.userId,
      booking_id: params.bookingId,
      document,
      version: POLICY_VERSION,
      ip: params.ip,
      user_agent: params.userAgent,
    }))
    await admin.from('consent_logs').insert(rows)
  } catch (err) {
    console.error('logBookingConsent failed:', err)
  }
}
