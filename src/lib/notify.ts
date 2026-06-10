// Server-only helper to email the official guide about their bookings. Links
// point at /guide (the guide can't open /admin). Skips sending if the guide
// is also an admin recipient, to avoid duplicate emails.

import { adminEmails, officialGuideId } from '@/lib/config'
import { sendEmail } from '@/lib/email'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

export async function notifyGuide(subject: string, text: string) {
  // Notifications must never break the booking flow — swallow any failure.
  try {
    const guideId = officialGuideId()
    if (!guideId) return

    const admin = createSupabaseAdminClient()
    const { data } = await admin.auth.admin.getUserById(guideId)
    const email = data?.user?.email
    if (!email) return
    if (adminEmails().includes(email.toLowerCase())) return // already notified as admin

    await sendEmail({ to: email, subject, text })
  } catch (err) {
    console.error('notifyGuide failed:', err)
  }
}
