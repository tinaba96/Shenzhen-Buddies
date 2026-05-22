'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const MAX_MESSAGE_LENGTH = 4000

export async function sendMessage(formData: FormData) {
  const conversationId = String(formData.get('conversation_id') ?? '')
  const content = String(formData.get('content') ?? '').trim()

  if (!conversationId) redirect('/messages')
  if (!content) redirect(`/messages/${conversationId}`)
  if (content.length > MAX_MESSAGE_LENGTH) {
    redirect(`/messages/${conversationId}?error=message_too_long`)
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId,
    sender_id: user.id,
    content,
  })

  if (error) {
    redirect(`/messages/${conversationId}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath(`/messages/${conversationId}`)
  revalidatePath('/messages')
  redirect(`/messages/${conversationId}`)
}
