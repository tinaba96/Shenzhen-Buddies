'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type Item = { href: string; label: string }

// Mobile-only hamburger menu. Mirrors the desktop nav so every destination on
// the PC header is reachable on small screens too. Hidden at md and up.
export function MobileMenu({
  links,
  account,
}: {
  links: Item[]
  account: Item[]
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const close = () => setOpen(false)

  // Close on Escape; lock body scroll while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop below the sticky header */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-x-0 bottom-0 top-14 z-30 cursor-default bg-black/30 backdrop-blur-sm"
          />
          {/* Dropdown panel */}
          <nav className="fixed inset-x-0 top-14 z-40 border-b border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
              <ul className="py-1">
                {links.map((l) => (
                  <Row key={l.href} item={l} active={pathname === l.href} onNavigate={close} />
                ))}
              </ul>
              <div className="my-2 border-t border-zinc-100 dark:border-zinc-800" />
              <ul className="pb-2">
                {account.map((a) => (
                  <Row key={a.href} item={a} active={pathname === a.href} onNavigate={close} />
                ))}
              </ul>
            </div>
          </nav>
        </>
      )}
    </div>
  )
}

function Row({
  item,
  active,
  onNavigate,
}: {
  item: Item
  active: boolean
  onNavigate: () => void
}) {
  return (
    <li>
      <Link
        href={item.href}
        onClick={onNavigate}
        className={`flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium transition ${
          active
            ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
            : 'text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900'
        }`}
      >
        {item.label}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-zinc-400">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </Link>
    </li>
  )
}
