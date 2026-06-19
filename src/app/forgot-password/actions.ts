'use server'

import { redirect } from 'next/navigation'
import { siteUrl } from '@/lib/config'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get('email') ?? '')

  const supabase = await createSupabaseServerClient()
  // The recovery email links to /auth/confirm (token_hash flow), which
  // verifies the OTP and forwards to /reset-password to set a new password.
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl()}/reset-password`,
  })

  if (error) {
    redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`)
  }

  // Always land on the same "sent" state — don't reveal whether the email
  // exists.
  redirect('/forgot-password?sent=1')
}
