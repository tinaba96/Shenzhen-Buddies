'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Fragment, useEffect, useRef, useState } from 'react'
import { thumbnailSrc, type PublicGalleryItem } from '@/content/gallery'
import { track } from '@/lib/analytics'
import { Lightbox } from './Lightbox'

// next/image's `priority` prop is deprecated in Next 16. Its replacement,
// `preload`, injects a <link rel="preload"> and the docs call it the wrong
// tool when several images could be the LCP element depending on viewport —
// which is exactly a 2/3/4-column grid. So the first row loads eagerly at a
// high fetch priority and everything below the fold stays lazy. Raising this
// number costs Lighthouse points: the eager images compete with each other.
const EAGER_ITEMS = 4

// A CTA lands after every 8th tile. At ~12 items that fires once, which is the
// point — more often and it reads as an ad break in the middle of the photos.
const CTA_EVERY = 8

// Rewrites only `photo`, so an active ?loc= and any campaign UTMs the visitor
// arrived with survive a photo-browsing session.
function urlWithPhoto(id: string | null): string {
  const params = new URLSearchParams(window.location.search)
  if (id) params.set('photo', id)
  else params.delete('photo')
  const query = params.toString()
  return `${window.location.pathname}${query ? `?${query}` : ''}`
}

export function GalleryGrid({
  items,
  activeLocation,
  ctaHref,
  initialIndex,
  isAdmin,
  shareBaseUrl,
}: {
  items: PublicGalleryItem[]
  activeLocation: string
  ctaHref: string
  // Set when the visitor arrived on /gallery?photo=<id>. Seeding state with it
  // rather than opening from an effect is what puts the photo in the initial
  // HTML instead of one frame after hydration.
  initialIndex: number | null
  isAdmin: boolean
  shareBaseUrl: string
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(initialIndex)
  const triggers = useRef<(HTMLButtonElement | null)[]>([])
  // Whether the entry the lightbox is sitting on is one we pushed. A
  // deep-linked arrival did not push anything, so closing it must not call
  // back() — that would send the visitor off the site instead of to the grid.
  const pushed = useRef(false)

  useEffect(() => {
    track('gallery_view', { loc: activeLocation, item_count: items.length })
  }, [activeLocation, items.length])

  // A shared link that opens straight into a photo opened a photo, and should
  // count as one. Without this every link the founder posts reads as a bounce.
  const deepLinkCounted = useRef(false)
  useEffect(() => {
    if (deepLinkCounted.current || initialIndex === null) return
    deepLinkCounted.current = true
    const item = items[initialIndex]
    if (item) {
      track('gallery_item_open', {
        item_id: item.id,
        location: item.location,
        kind: item.kind,
      })
    }
    // Mount-only: this is about how the page was entered, not about later state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // After a Back or Forward the URL is the source of truth, not our state.
  // This is what makes Back close the lightbox rather than leave the page with
  // it still open, and what makes Forward reopen the same photo.
  useEffect(() => {
    const onPopState = () => {
      const id = new URLSearchParams(window.location.search).get('photo')
      const next = id ? items.findIndex((item) => item.id === id) : -1
      pushed.current = false
      setOpenIndex(next === -1 ? null : next)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [items])

  const open = (index: number) => {
    const item = items[index]
    // The first open pushes exactly one entry, so Back has something sane to
    // do. Every move after that replaces it: browsing 30 photos must not cost
    // 30 presses of Back to get out of the gallery.
    if (openIndex === null) {
      window.history.pushState(null, '', urlWithPhoto(item.id))
      pushed.current = true
    } else {
      window.history.replaceState(null, '', urlWithPhoto(item.id))
    }
    setOpenIndex(index)
    track('gallery_item_open', {
      item_id: item.id,
      location: item.location,
      kind: item.kind,
    })
  }

  const navigate = (next: number) => {
    window.history.replaceState(null, '', urlWithPhoto(items[next].id))
    setOpenIndex(next)
  }

  const close = () => {
    // Send focus back to the tile that opened the dialog, so a keyboard user
    // resumes where they were instead of at the top of the document.
    if (openIndex !== null) triggers.current[openIndex]?.focus()
    setOpenIndex(null)
    if (pushed.current) {
      // Pop the entry we pushed so the history stack is left exactly as it was
      // found. State is already cleared above rather than waiting on the
      // popstate this triggers — back() is async and the delay is visible.
      pushed.current = false
      window.history.back()
    } else {
      window.history.replaceState(null, '', urlWithPhoto(null))
    }
  }

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <Fragment key={item.id}>
            <li>
              <button
                type="button"
                ref={(el) => {
                  triggers.current[i] = el
                }}
                onClick={() => open(i)}
                aria-label={`Open ${item.title}`}
                className="group block w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <span className="relative block aspect-[4/3] overflow-hidden">
                  <Image
                    src={thumbnailSrc(item)}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    loading={i < EAGER_ITEMS ? 'eager' : 'lazy'}
                    fetchPriority={i < EAGER_ITEMS ? 'high' : 'auto'}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  {item.kind === 'video' && (
                    <span
                      aria-hidden
                      className="absolute bottom-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  )}
                </span>
              </button>
            </li>
            {(i + 1) % CTA_EVERY === 0 && (
              <li className="col-span-full">
                <GridCta href={ctaHref} />
              </li>
            )}
          </Fragment>
        ))}
      </ul>

      {openIndex !== null && (
        <Lightbox
          items={items}
          index={openIndex}
          onNavigate={navigate}
          onClose={close}
          ctaHref={ctaHref}
          isAdmin={isAdmin}
          shareBaseUrl={shareBaseUrl}
        />
      )}
    </>
  )
}

function GridCta({ href }: { href: string }) {
  return (
    <Link
      href={href}
      onClick={() =>
        track('content_cta_click', {
          surface: 'gallery',
          placement: 'grid',
          target: href,
        })
      }
      className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 px-6 py-5 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
    >
      Have a local show you this
      <span aria-hidden>→</span>
    </Link>
  )
}
