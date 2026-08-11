'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { siteUrl } from '@/lib/config'
import { nextParam, safeNextPath } from '@/lib/redirects'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function signup(formData: FormData) {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  // Where the visitor was headed before they hit the auth wall (e.g. the day
  // they picked on /guide). Falls back to their profile.
  const next = safeNextPath(String(formData.get('next') ?? ''))

  const supabase = await createSupabaseServerClient()
  // Carries `next` across the email-confirmation round trip. Without it the
  // confirmation link Supabase builds knows nothing about where the visitor was
  // headed, /auth/confirm falls back to /profile, and someone who picked a day
  // on /guide loses it at the one step where they cannot see it happen.
  //
  // This is the app's half only: it lands in the template as {{ .RedirectTo }},
  // so the Supabase email template has to forward it (…/auth/confirm?token_hash=
  // {{ .TokenHash }}&type=email&next=…). If the template drops it, /auth/confirm
  // still falls back safely — the promise on /guide is worded not to depend on it.
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl()}/auth/confirm${next ? `?next=${encodeURIComponent(next)}` : ''}`,
    },
  })

  if (error) {
    redirect(
      `/signup?error=${encodeURIComponent(error.message)}${nextParam(next)}`,
    )
  }

  // If email confirmation is required in Supabase Auth settings, no session is
  // issued yet — the user must click the link sent to their inbox.
  if (!data.session) {
    redirect(`/signup?check_email=1${nextParam(next)}`)
  }

  revalidatePath('/', 'layout')
  redirect(next ?? '/profile')
}
