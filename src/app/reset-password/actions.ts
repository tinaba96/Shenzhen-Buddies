'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function updatePassword(formData: FormData) {
  const password = String(formData.get('password') ?? '')
  const confirm = String(formData.get('confirm') ?? '')

  if (password.length < 8) {
    redirect(
      `/reset-password?error=${encodeURIComponent('Password must be at least 8 characters.')}`,
    )
  }
  if (password !== confirm) {
    redirect(
      `/reset-password?error=${encodeURIComponent('Passwords do not match.')}`,
    )
  }

  const supabase = await createSupabaseServerClient()
  // The recovery link established a session via /auth/confirm. Without it the
  // update has no user to act on, so the link must have expired.
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect(
      `/forgot-password?error=${encodeURIComponent('Your reset link expired. Request a new one.')}`,
    )
  }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/profile?password_updated=1')
}
