'use client'

import { useState } from 'react'

// Shows a WeChat ID with a copy button. WeChat has no web deep link for
// adding a contact, so the realistic flow is: copy the ID, open WeChat,
// Add Contacts → search. The copied state resets after a moment.
export function WeChatId({
  id,
  copyLabel = 'Copy ID',
  copiedLabel = 'Copied',
}: {
  id: string
  copyLabel?: string
  copiedLabel?: string
}) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked (http, permissions). The ID is still
      // selectable text, so nothing else to do.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <code className="select-all rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
        {id}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-live="polite"
        className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {copied ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
            <path d="m5 12 5 5L20 7" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  )
}
