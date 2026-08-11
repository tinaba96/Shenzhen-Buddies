'use client'

import Link from 'next/link'
import type { LocationId, LocationMeta } from '@/content/gallery'
import { track } from '@/lib/analytics'

// Real links, not buttons over useState: a filtered view stays shareable
// (the studio can post "every Huaqiangbei shot we have"), survives reload and
// back, and costs no client-side filtering. This component is only a client
// component so the chip click can be counted — with JS off the links still
// navigate and the server still filters.
export function GalleryFilters({
  locations,
  active,
}: {
  locations: LocationMeta[]
  active: LocationId | null
}) {
  return (
    <nav aria-label="Filter photos by location">
      <ul className="flex flex-wrap justify-center gap-2">
        <li>
          <Chip href="/gallery" loc="all" active={active === null}>
            All
          </Chip>
        </li>
        {locations.map((l) => (
          <li key={l.id}>
            <Chip
              href={`/gallery?loc=${l.id}`}
              loc={l.id}
              active={active === l.id}
            >
              {l.short}
            </Chip>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function Chip({
  href,
  loc,
  active,
  children,
}: {
  href: string
  loc: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'true' : undefined}
      onClick={() => track('gallery_filter', { loc })}
      className={`inline-flex rounded-full border px-4 py-1.5 text-sm font-medium transition ${
        active
          ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900'
          : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-white'
      }`}
    >
      {children}
    </Link>
  )
}
