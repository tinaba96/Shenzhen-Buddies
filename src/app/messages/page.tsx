import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Avatar } from '@/components/Avatar'
import { avatarPublicUrl } from '@/lib/avatars'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type Conversation = {
  id: string
  user_a_id: string
  user_b_id: string
  updated_at: string
  user_a_last_read_at: string
  user_b_last_read_at: string
}

type ProfileLite = {
  id: string
  display_name: string
  avatar_path: string | null
  updated_at: string
}

type MessageRow = {
  conversation_id: string
  content: string
  sender_id: string
  created_at: string
}

export default async function MessagesIndexPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: convs } = await supabase
    .from('conversations')
    .select(
      'id, user_a_id, user_b_id, updated_at, user_a_last_read_at, user_b_last_read_at',
    )
    .order('updated_at', { ascending: false })
    .returns<Conversation[]>()

  const counterpartIds = (convs ?? [])
    .map((c) => (c.user_a_id === user.id ? c.user_b_id : c.user_a_id))
    .filter((id, i, a) => a.indexOf(id) === i)

  const profilesById = new Map<string, ProfileLite>()
  if (counterpartIds.length) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_path, updated_at')
      .in('id', counterpartIds)
      .returns<ProfileLite[]>()
    for (const p of profiles ?? []) profilesById.set(p.id, p)
  }

  const lastByConv = new Map<string, MessageRow>()
  const unreadByConv = new Map<string, number>()
  if (convs?.length) {
    const { data: allMessages } = await supabase
      .from('messages')
      .select('conversation_id, content, sender_id, created_at')
      .in(
        'conversation_id',
        convs.map((c) => c.id),
      )
      .order('created_at', { ascending: false })
      .returns<MessageRow[]>()

    const readByConv = new Map<string, string>()
    for (const c of convs) {
      const myReadAt =
        c.user_a_id === user.id ? c.user_a_last_read_at : c.user_b_last_read_at
      readByConv.set(c.id, myReadAt)
    }

    for (const m of allMessages ?? []) {
      if (!lastByConv.has(m.conversation_id)) lastByConv.set(m.conversation_id, m)
      const myReadAt = readByConv.get(m.conversation_id)
      if (
        m.sender_id !== user.id &&
        myReadAt &&
        new Date(m.created_at).getTime() > new Date(myReadAt).getTime()
      ) {
        unreadByConv.set(
          m.conversation_id,
          (unreadByConv.get(m.conversation_id) ?? 0) + 1,
        )
      }
    }
  }

  const totalUnread = Array.from(unreadByConv.values()).reduce((a, b) => a + b, 0)

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <div className="mb-6 flex items-center gap-2">
        <h1 className="text-2xl font-semibold">Messages</h1>
        {totalUnread > 0 && (
          <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-medium text-white">
            {totalUnread} unread
          </span>
        )}
      </div>

      {(convs?.length ?? 0) === 0 ? (
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div
            className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 30% 20%, rgba(245,158,11,0.25), transparent 50%), radial-gradient(circle at 70% 80%, rgba(244,63,94,0.25), transparent 50%)',
            }}
          />
          <div className="relative">
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 to-rose-200 text-zinc-800 shadow-sm dark:from-amber-900/40 dark:to-rose-900/40 dark:text-zinc-100">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-semibold">No conversations yet</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Find someone on Browse who shares your interests and start the
              first hello.
            </p>
            <Link
              href="/browse"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Browse buddies
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
          {convs!.map((c) => {
            const otherId = c.user_a_id === user.id ? c.user_b_id : c.user_a_id
            const other = profilesById.get(otherId)
            const last = lastByConv.get(c.id)
            const unread = unreadByConv.get(c.id) ?? 0
            return (
              <li key={c.id}>
                <Link
                  href={`/messages/${c.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                >
                  <Avatar
                    src={avatarPublicUrl(other?.avatar_path, other?.updated_at)}
                    name={other?.display_name}
                    size={44}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p
                        className={`truncate ${unread > 0 ? 'font-semibold' : 'font-medium'}`}
                      >
                        {other?.display_name ?? 'Unknown user'}
                      </p>
                      <span className="text-xs text-zinc-500">
                        {formatRelative(last?.created_at ?? c.updated_at)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`truncate text-sm ${
                          unread > 0
                            ? 'text-zinc-900 dark:text-zinc-100'
                            : 'text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        {last
                          ? `${last.sender_id === user.id ? 'You: ' : ''}${last.content}`
                          : 'No messages yet — say hi!'}
                      </p>
                      {unread > 0 && (
                        <span className="flex-shrink-0 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          {unread}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime()
  const diff = Date.now() - then
  if (diff < 60_000) return 'just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`
  if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)}d`
  return new Date(iso).toLocaleDateString()
}
