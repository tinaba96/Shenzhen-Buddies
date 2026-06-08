'use client'

import { useState } from 'react'

// Click-to-copy promo code chip. Used on the marketing landing page so people
// can grab the code and paste it into Stripe Checkout's promo field.
export function PromoCode({
  code,
  className = '',
}: {
  code: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked (e.g. insecure context) — no-op, the code is visible.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy promo code ${code}`}
      className={`group inline-flex items-center gap-2 font-mono text-lg font-bold tracking-[0.2em] transition ${className}`}
    >
      <span>{code}</span>
      <span className="inline-flex items-center gap-1 rounded-md border border-current/30 px-2 py-0.5 font-sans text-[11px] font-medium tracking-normal opacity-80 transition group-hover:opacity-100">
        {copied ? (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy
          </>
        )}
      </span>
    </button>
  )
}
