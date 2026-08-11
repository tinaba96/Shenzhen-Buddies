'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { nextParam, safeNextPath } from '@/lib/redirects'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  // Where the visitor was headed before they hit the auth wall (e.g. the day
  // they picked on /guide). Falls back to their profile.
  const next = safeNextPath(String(formData.get('next') ?? ''))

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect(
      `/login?error=${encodeURIComponent(error.message)}${nextParam(next)}`,
    )
  }

  revalidatePath('/', 'layout')
  redirect(next ?? '/profile')
}
