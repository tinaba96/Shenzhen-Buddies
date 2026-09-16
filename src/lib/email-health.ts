// What the admin page shows about outgoing mail, so a missing Gmail app
// password or a wrong OFFICIAL_GUIDE_ID is visible on the dashboard instead
// of only in server logs. sendEmail() never throws, which is right for the
// booking flow and wrong for finding out why nobody got an email.

import { adminEmails, officialGuideId } from '@/lib/config'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

export type EmailHealth = {
  // Gmail SMTP credentials present on this server.
  smtpConfigured: boolean
  smtpUser: string | null
  // Where admin notifications go.
  adminRecipients: string[]
  // Where guide notifications go, or why they cannot.
  guideEmail: string | null
  guideProblem: string | null
}

export async function emailHealth(): Promise<EmailHealth> {
  const smtpUser = process.env.GMAIL_USER?.trim() || null
  const smtpConfigured = !!smtpUser && !!process.env.GMAIL_APP_PASSWORD?.trim()

  let guideEmail: string | null = null
  let guideProblem: string | null = null
  const guideId = officialGuideId()
  if (!guideId) {
    guideProblem = 'OFFICIAL_GUIDE_ID is not set on the server.'
  } else {
    try {
      const { data, error } = await createSupabaseAdminClient().auth.admin.getUserById(guideId)
      if (error) guideProblem = `OFFICIAL_GUIDE_ID does not match a user: ${error.message}`
      else if (!data?.user?.email) guideProblem = 'The OFFICIAL_GUIDE_ID account has no email address.'
      else guideEmail = data.user.email
    } catch (err) {
      guideProblem = err instanceof Error ? err.message : String(err)
    }
  }

  return {
    smtpConfigured,
    smtpUser,
    adminRecipients: adminEmails(),
    guideEmail,
    guideProblem,
  }
}
