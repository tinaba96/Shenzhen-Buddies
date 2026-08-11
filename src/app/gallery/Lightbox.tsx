'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef } from 'react'
import { ShareLinks } from '@/components/ShareLinks'
import { locationLabel, type PublicGalleryItem } from '@/content/gallery'
import { track } from '@/lib/analytics'

// The share buttons are plain <button type="button"> inside panelRef, so this
// selector already reaches them and the trap needs no change to include them.
const FOCUSABLE = 'a[href], button:not([disabled]), video[controls]'

// The full-size view. Mounted only while an item is open, so the keyboard
// handlers and the scroll lock exist only when they should.
export function Lightbox({
  items,
  index,
  onNavigate,
  onClose,
  ctaHref,
  isAdmin,
  shareBaseUrl,
}: {
  items: PublicGalleryItem[]
  index: number
  onNavigate: (next: number) => void
  onClose: () => void
  ctaHref: string
  isAdmin: boolean
  shareBaseUrl: string
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const item = items[index]

  // Arrows wrap, as they do in every gallery a visitor has used before.
  const step = useCallback(
    (delta: number) => {
      onNavigate((index + delta + items.length) % items.length)
    },
    [index, items.length, onNavigate],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') step(-1)
      else if (e.key === 'ArrowRight') step(1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, step])

  // Move focus into the dialog once, on open. Focus goes back to the tile that
  // opened it on close — GalleryGrid owns that half, since it holds the refs.
  useEffect(() => {
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
  }, [])

  // Tab must not escape into the page behind the overlay.
  const trapTab = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !panelRef.current) return
    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  if (!item) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} — photo ${index + 1} of ${items.length}`}
      onKeyDown={trapTab}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
    >
      {/* Clicking the backdrop closes, same as Esc. */}
      <button
        type="button"
        aria-hidden
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <div
        ref={panelRef}
        className="relative flex max-h-full w-full max-w-4xl flex-col gap-4 overflow-y-auto"
      >
        <div className="flex items-center justify-between gap-3 text-white">
          <p className="text-xs uppercase tracking-wide text-white/60">
            {locationLabel(item.location)}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-center">
          {item.kind === 'video' ? (
            <video
              src={item.src}
              poster={item.poster}
              controls
              playsInline
              preload="none"
              className="max-h-[65vh] w-auto rounded-xl"
            />
          ) : (
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="max-h-[65vh] w-auto rounded-xl object-contain"
            />
          )}
        </div>

        <div className="text-white">
          <h2 className="text-lg font-semibold">{item.title}</h2>
          {item.caption && (
            <p className="mt-1 text-sm text-white/70">{item.caption}</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link
              href={ctaHref}
              onClick={() =>
                track('content_cta_click', {
                  surface: 'gallery',
                  placement: 'lightbox',
                  target: ctaHref,
                })
              }
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200"
            >
              Have a local show you this
              <span aria-hidden>→</span>
            </Link>
            {items.length > 1 && (
              <div className="flex items-center gap-2">
                <NavButton label="Previous photo" onClick={() => step(-1)}>
                  <path d="m15 18-6-6 6-6" />
                </NavButton>
                <NavButton label="Next photo" onClick={() => step(1)}>
                  <path d="m9 18 6-6-6-6" />
                </NavButton>
              </div>
            )}
          </div>

          {/* The clean link, not the URL in the address bar: that one carries
              whatever ?loc= and campaign params the visitor arrived with. */}
          <ShareLinks
            url={`${shareBaseUrl}/gallery?photo=${item.id}`}
            title={item.title}
            campaign={item.id}
            surface="gallery"
            isAdmin={isAdmin}
            tone="onDark"
            className="mt-4"
          />
        </div>
      </div>
    </div>
  )
}

function NavButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        {children}
      </svg>
    </button>
  )
}
