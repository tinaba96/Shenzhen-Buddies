'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { SubmitButton } from '@/components/SubmitButton'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { sendMessage } from './actions'

export type Message = {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
}

type Props = {
  conversationId: string
  currentUserId: string
  initialMessages: Message[]
}

// Module-level cache so React StrictMode's double-mount doesn't create two
// Supabase clients (each opening its own WebSocket).
let cachedClient: SupabaseClient | null = null
function browserClient(): SupabaseClient {
  if (!cachedClient) cachedClient = createSupabaseBrowserClient()
  return cachedClient
}

export function MessageList({ conversationId, currentUserId, initialMessages }: Props) {
  // Realtime-only arrivals; merged with initialMessages on render.
  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const messages = useMemo(() => {
    const have = new Set(initialMessages.map((m) => m.id))
    const additions = realtimeMessages.filter((m) => !have.has(m.id))
    if (additions.length === 0) return initialMessages
    return [...initialMessages, ...additions].sort((a, b) =>
      a.created_at.localeCompare(b.created_at),
    )
  }, [initialMessages, realtimeMessages])

  useEffect(() => {
    const supabase = browserClient()
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const msg = payload.new as Message
          setRealtimeMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev
            return [...prev, msg]
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId])

  useEffect(() => {
    const el = containerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages.length])

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Skip IME composition (Chinese/Japanese candidate commit fires Enter).
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      e.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <div className="mt-4 flex flex-1 flex-col">
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950"
        style={{ minHeight: '40vh', maxHeight: '60vh' }}
      >
        {messages.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">
            No messages yet. Say hi!
          </p>
        ) : (
          <ul className="space-y-2">
            {messages.map((m) => {
              const mine = m.sender_id === currentUserId
              return (
                <li
                  key={m.id}
                  className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                      mine
                        ? 'rounded-br-sm bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                        : 'rounded-bl-sm bg-white text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{m.content}</p>
                    <p
                      className={`mt-1 text-[10px] ${
                        mine ? 'text-zinc-300 dark:text-zinc-500' : 'text-zinc-500'
                      }`}
                    >
                      {formatTime(m.created_at)}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <form action={sendMessage} className="mt-3 flex items-end gap-2">
        <input type="hidden" name="conversation_id" value={conversationId} />
        <textarea
          name="content"
          required
          rows={1}
          maxLength={4000}
          placeholder="Write a message…"
          onKeyDown={onKeyDown}
          className="flex-1 resize-none rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
        />
        <SubmitButton
          pendingLabel="…"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Send
        </SubmitButton>
      </form>
      <p className="mt-1 text-right text-[10px] text-zinc-500">
        Enter to send · Shift + Enter for a new line
      </p>
    </div>
  )
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}
