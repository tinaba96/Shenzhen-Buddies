import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Avatar } from '@/components/Avatar'
import { avatarPublicUrl } from '@/lib/avatars'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { MessageList, type Message } from './MessageList'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}

type Conversation = {
  id: string
  user_a_id: string
  user_b_id: string
}

type ProfileLite = {
  id: string
  display_name: string
  avatar_path: string | null
  updated_at: string
  role: 'guide' | 'tourist'
  city: string
}

export default async function ThreadPage({ params, searchParams }: Props) {
  const { id } = await params
  const { error: queryError } = await searchParams

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: conversation } = await supabase
    .from('conversations')
    .select('id, user_a_id, user_b_id')
    .eq('id', id)
    .maybeSingle<Conversation>()

  if (!conversation) notFound()
  if (conversation.user_a_id !== user.id && conversation.user_b_id !== user.id) {
    notFound()
  }

  const otherId =
    conversation.user_a_id === user.id ? conversation.user_b_id : conversation.user_a_id

  const { data: other } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_path, updated_at, role, city')
    .eq('id', otherId)
    .maybeSingle<ProfileLite>()

  // Mark read BEFORE fetching messages so we don't lose unread state on a
  // message that arrives in the window between SELECT and the RPC.
  await supabase.rpc('mark_conversation_read', { c_id: id })

  const { data: messages } = await supabase
    .from('messages')
    .select('id, conversation_id, sender_id, content, created_at')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true })
    .returns<Message[]>()

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6">
      <header className="flex items-center gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <Link
          href="/messages"
          aria-label="Back to messages"
          className="rounded-md p-1.5 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <Avatar
          src={avatarPublicUrl(other?.avatar_path, other?.updated_at)}
          name={other?.display_name}
          size={40}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">
            {other?.display_name ?? 'Unknown user'}
          </p>
          <p className="truncate text-xs text-zinc-500">
            {other ? `${other.role === 'guide' ? 'Guide' : 'Tourist'} · ${other.city}` : ''}
          </p>
        </div>
      </header>

      {queryError && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          {queryError}
        </p>
      )}

      <MessageList
        conversationId={id}
        currentUserId={user.id}
        initialMessages={messages ?? []}
      />
    </main>
  )
}
