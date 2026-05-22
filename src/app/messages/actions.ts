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

  // Pre-check roles for a friendly error before hitting the RPC.
  const [{ data: me }, { data: other }] = await Promise.all([
    supabase.from('profiles').select('role').eq('id', user.id).maybeSingle<{ role: 'guide' | 'tourist' }>(),
    supabase.from('profiles').select('role').eq('id', otherId).maybeSingle<{ role: 'guide' | 'tourist' }>(),
  ])

  if (!me) {
    redirect('/profile?error=create_profile_first')
  }
  if (!other) {
    redirect(`/u/${otherId}?error=user_has_no_profile`)
  }
  if (me.role === other.role) {
    redirect(`/u/${otherId}?error=same_role_no_match`)
  }

  const { data, error } = await supabase.rpc('get_or_create_conversation', {
    other_id: otherId,
  })
  if (error || !data) {
    redirect(`/u/${otherId}?error=${encodeURIComponent(error?.message ?? 'conversation_failed')}`)
  }

  redirect(`/messages/${data}`)
}
