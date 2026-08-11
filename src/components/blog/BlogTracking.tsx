'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

import { track } from '@/lib/analytics'

// The blog's GA4 surface. Everything here goes through track(), which no-ops
// when GA is not configured, so none of this throws in dev or preview.
//
// These four events are what makes the day-90 kill gate on the blog readable.
// Without them the question "did any of this produce a signup" has no answer,
// and the decision to keep writing posts gets made on vibes.

// Fires once per mount. Used for the post view and for the listing's pillar
// filter, which is a server-rendered link rather than a click handler — the
// filtered page loading *is* the filter event.
export function TrackOnMount({
  event,
  params,
}: {
  event: string
  params: Record<string, string | number | boolean>
}) {
  const sent = useRef(false)

  useEffect(() => {
    if (sent.current) return
    sent.current = true
    track(event, params)
    // Deliberately mount-only: params is a fresh object literal every render,
    // so depending on it would re-fire the event on every parent re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

// Fires once when the reader passes 75% of the page. That threshold is the
// difference between "landed and bounced" and "actually read it", which is the
// only engagement signal worth having on a three-post blog.
export function ScrollDepth({ slug }: { slug: string }) {
  const sent = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (sent.current) return
      const scrollable = document.body.scrollHeight - window.innerHeight
      // A page shorter than the viewport has nothing to scroll, so treat it as
      // read rather than never firing.
      const depth =
        scrollable <= 0 ? 1 : (window.scrollY + window.innerHeight) / document.body.scrollHeight

      if (depth >= 0.75) {
        sent.current = true
        track('content_scroll_75', { slug })
        window.removeEventListener('scroll', onScroll)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [slug])

  return null
}

// The one place a blog CTA is rendered. `href` is resolved on the server from
// isSingleGuideMode() and passed in, so this component cannot be the reason a
// CTA points somewhere it should not.
export function BlogCta({
  slug,
  placement,
  href,
  label,
  sub,
}: {
  slug: string
  placement: 'inline' | 'end'
  href: string
  label: string
  sub?: string
}) {
  const onClick = () =>
    track('content_cta_click', { surface: 'blog', placement, slug, target: href })

  if (placement === 'end') {
    return (
      <section className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100 via-rose-50 to-rose-100 px-6 py-12 text-center dark:from-amber-950/40 dark:via-zinc-900 dark:to-rose-950/40">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {label}
        </h2>
        {sub && (
          <p className="mx-auto mt-3 max-w-md text-zinc-700 dark:text-zinc-300">
            {sub}
          </p>
        )}
        <Link
          href={href}
          onClick={onClick}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {label}
          <span aria-hidden>→</span>
        </Link>
      </section>
    )
  }

  return (
    <aside className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/60">
      <p className="text-base font-semibold">{label}</p>
      {sub && (
        <p className="mt-1.5 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
          {sub}
        </p>
      )}
      <Link
        href={href}
        onClick={onClick}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Find a buddy
        <span aria-hidden>→</span>
      </Link>
    </aside>
  )
}

// Wraps the related-post links so the "did one post lead to another" question
// is answerable. Plain Link everywhere else.
export function RelatedPostLink({
  fromSlug,
  toSlug,
  className,
  children,
}: {
  fromSlug: string
  toSlug: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={`/blog/${toSlug}`}
      onClick={() =>
        track('related_post_click', { from_slug: fromSlug, to_slug: toSlug })
      }
      className={className}
    >
      {children}
    </Link>
  )
}
