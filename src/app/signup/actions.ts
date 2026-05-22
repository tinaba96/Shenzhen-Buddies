'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function signup(formData: FormData) {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  const supabase = await createSupabaseServerClient()
  const { error, data } = await supabase.auth.signUp({ email, password })

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  }

  // If email confirmation is required in Supabase Auth settings, no session is
  // issued yet — the user must click the link sent to their inbox.
  if (!data.session) {
    redirect('/signup?check_email=1')
  }

  revalidatePath('/', 'layout')
  redirect('/profile')
}
