'use client'

import { useEffect, useState } from 'react'

export function FilterDrawer({
  activeCount,
  children,
}: {
  activeCount: number
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  // Lock body scroll while open + close on Escape.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-1.5 text-sm font-medium shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden
        >
          <path d="M22 3H2l8 9.46V19l4 2v-8.54z" />
        </svg>
        Filters
        {activeCount > 0 && (
          <span className="rounded-full bg-zinc-900 px-1.5 py-0.5 text-[10px] font-semibold text-white dark:bg-white dark:text-zinc-900">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close filters"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-zinc-900">
            <div className="flex flex-shrink-0 items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
              <div>
                <h2 className="text-lg font-semibold">Filters</h2>
                <p className="text-xs text-zinc-500">
                  {activeCount > 0
                    ? `${activeCount} active`
                    : 'Refine your matches'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-md p-1.5 text-zinc-500 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden
                >
                  <path d="m18 6-12 12" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
          </div>
        </div>
      )}
    </>
  )
}
