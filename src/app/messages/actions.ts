'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function startConversationWith(formData: FormData) {
  const otherId = String(formData.get('other_id') ?? '')
  if (!otherId) redirect('/browse?error=missing_user')

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data, error } = await supabase.rpc('get_or_create_conversation', {
    other_id: otherId,
  })
  if (error || !data) {
    redirect(`/browse?error=${encodeURIComponent(error?.message ?? 'conversation_failed')}`)
  }

  redirect(`/messages/${data}`)
}
