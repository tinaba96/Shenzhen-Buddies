'use client'

import { useEffect, useRef, useState, useTransition } from 'react'

import { LOCALES, LOCALE_META, type Locale } from '@/i18n/config'
import { setLocale } from '@/lib/actions/locale'

type Labels = {
  label: string
  choose: string
  switchTo: string
  note: string
}

// The language menu. Two variants of the same list so the header and the
// footer can share one behaviour: 'button' is the compact globe control in the
// nav, 'inline' is the always-open row at the foot of the page.
export function LanguageSwitcher({
  current,
  labels,
  variant = 'button',
  align = 'right',
}: {
  current: Locale
  labels: Labels
  variant?: 'button' | 'inline'
  align?: 'left' | 'right'
}) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  // Tracks which row was clicked so the spinner lands on that row rather than
  // on all of them.
  const [target, setTarget] = useState<Locale | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const choose = (locale: Locale) => {
    if (locale === current) {
      setOpen(false)
      return
    }
    setTarget(locale)
    startTransition(async () => {
      await setLocale(locale)
      setOpen(false)
      setTarget(null)
    })
  }

  // Close on Escape and on a click outside. Both are on the document because
  // the panel is positioned, not modal — there is no backdrop to catch them.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onPointer)
    }
  }, [open])

  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {LOCALES.map((locale) => {
          const meta = LOCALE_META[locale]
          const active = locale === current
          return (
            <button
              key={locale}
              type="button"
              lang={meta.htmlLang}
              onClick={() => choose(locale)}
              disabled={pending}
              aria-current={active ? 'true' : undefined}
              className={
                active
                  ? 'rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white dark:bg-white dark:text-zinc-900'
                  : 'rounded-full border border-zinc-300 px-3 py-1.5 text-xs text-zinc-600 transition hover:border-zinc-400 hover:text-zinc-900 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-white'
              }
            >
              {meta.endonym}
              {pending && target === locale && <Spinner />}
            </button>
          )
        })}
      </div>
    )
  }

  const meta = LOCALE_META[current]

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={labels.label}
        className="group inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white/70 px-2.5 py-1.5 text-xs font-medium text-zinc-600 backdrop-blur transition hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700/80 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-white"
      >
        <GlobeIcon />
        <span className="tabular-nums">{meta.short}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={`h-3 w-3 text-zinc-400 transition duration-300 ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          aria-label={labels.choose}
          // Opaque, not translucent. The panel opens over the hero photograph
          // on every page that has one, and at 90% the headline behind it read
          // straight through the language names.
          className={`sb-pop absolute top-[calc(100%+0.5rem)] z-50 w-60 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-2xl shadow-black/20 dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/60 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          <p className="px-3 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
            {labels.choose}
          </p>
          <ul>
            {LOCALES.map((locale) => {
              const m = LOCALE_META[locale]
              const active = locale === current
              return (
                <li key={locale}>
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    lang={m.htmlLang}
                    disabled={pending}
                    onClick={() => choose(locale)}
                    title={labels.switchTo.replace('{language}', m.endonym)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition disabled:opacity-60 ${
                      active
                        ? 'bg-gradient-to-r from-amber-100 to-rose-100 font-medium text-zinc-900 dark:from-amber-500/15 dark:to-rose-500/15 dark:text-white'
                        : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        aria-hidden
                        className={`inline-flex h-6 w-7 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold ${
                          active
                            ? 'bg-gradient-to-br from-amber-400 to-rose-500 text-white shadow-sm'
                            : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        {m.short}
                      </span>
                      {m.endonym}
                    </span>
                    {pending && target === locale ? (
                      <Spinner />
                    ) : active ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                        className="h-3.5 w-3.5"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>
          <p className="px-3 pb-2 pt-2 text-[11px] leading-snug text-zinc-400">
            {labels.note}
          </p>
        </div>
      )}
    </div>
  )
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-3.5 w-3.5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden
      className="ml-1 h-3.5 w-3.5 animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.2-8.6" />
    </svg>
  )
}
