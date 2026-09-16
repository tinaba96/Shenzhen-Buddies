// Server-only helper to email the official guide about their bookings. Links
// point at /guide (the guide can't open /admin).
//
// The guide and the admins are notified SEPARATELY and ALWAYS — different
// emails, different links — even when one person holds both roles with the
// same address. An earlier version skipped the guide email whenever the
// guide's address was also an admin address; that "dedupe" is exactly how a
// booking request went unnoticed, so it is gone.
//
// The result says what happened so the caller can put it in the admin email:
// a guide email that silently did not go out is indistinguishable from one
// that did, unless someone writes it down.

import { officialGuideId } from '@/lib/config'
import { sendEmail } from '@/lib/email'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

export type GuideNotifyResult =
  | { sent: true; to: string }
  | { sent: false; reason: string }

export async function notifyGuide(
  subject: string,
  text: string,
): Promise<GuideNotifyResult> {
  // Notifications must never break the booking flow — swallow any failure.
  try {
    const guideId = officialGuideId()
    if (!guideId) {
      return { sent: false, reason: 'OFFICIAL_GUIDE_ID is not set on the server' }
    }

    const admin = createSupabaseAdminClient()
    const { data, error } = await admin.auth.admin.getUserById(guideId)
    if (error) {
      return { sent: false, reason: `could not look up OFFICIAL_GUIDE_ID: ${error.message}` }
    }
    const email = data?.user?.email
    if (!email) {
      return { sent: false, reason: 'the OFFICIAL_GUIDE_ID account has no email address' }
    }

    const result = await sendEmail({ to: email, subject, text })
    return result.ok
      ? { sent: true, to: email }
      : { sent: false, reason: `sending to ${email} failed (${result.error})` }
  } catch (err) {
    console.error('notifyGuide failed:', err)
    return { sent: false, reason: err instanceof Error ? err.message : String(err) }
  }
}

// One line for the admin email: "Guide notified: g@x.com" or why not.
export function describeGuideNotify(r: GuideNotifyResult): string {
  return r.sent
    ? `Guide notified: ${r.to}`
    : `GUIDE NOT NOTIFIED — ${r.reason}. Please contact the guide directly.`
}
