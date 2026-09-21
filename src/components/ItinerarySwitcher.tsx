'use client'

import { useState } from 'react'

import type { ItineraryVariant } from '@/content/packages'

// The itinerary timeline, with a length toggle when the package has been
// written for more than one tour length. Only the chosen length is in the
// DOM: a 2-hour and a 3-hour timeline stacked would be the wall of text the
// toggle exists to avoid. Anything that touches the dictionary (the "2 hours"
// labels, the group's name) arrives pre-formatted from the server page,
// because functions cannot cross the server/client boundary.
type Props = {
  variants: ItineraryVariant[]
  // One label per variant, e.g. "2 hours", in the page's language.
  labels: string[]
  groupLabel: string
  // What renders before anyone clicks — the advertised length, chosen
  // server-side so the first paint agrees with the card and the JSON-LD.
  initialIndex: number
}

export function ItinerarySwitcher({
  variants,
  labels,
  groupLabel,
  initialIndex,
}: Props) {
  const [index, setIndex] = useState(initialIndex)
  const variant = variants[index] ?? variants[0]
  // Beats sit one level under the variant title when there is one, and
  // directly under the section heading when there is not — no skipped level
  // either way.
  const Beat = variant.title ? 'h4' : 'h3'

  return (
    <div>
      {variants.length > 1 && (
        <div
          role="group"
          aria-label={groupLabel}
          className="mt-6 inline-flex rounded-full border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900"
        >
          {variants.map((v, i) => {
            const active = i === index
            return (
              <button
                key={v.hours}
                type="button"
                aria-pressed={active}
                onClick={() => setIndex(i)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  active
                    ? 'bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-900'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                {labels[i]}
              </button>
            )
          })}
        </div>
      )}

      {variant.title && (
        <h3 className="mt-6 text-xl font-semibold tracking-tight">
          {variant.title}
        </h3>
      )}

      <ol className="mt-8">
        {variant.beats.map((beat, i) => (
          <li key={beat.at} className="relative flex gap-5 pb-8 last:pb-0">
            {/* The connector. Absolute so it runs behind the dot and stops
                at the last beat rather than trailing into space. */}
            {i < variant.beats.length - 1 && (
              <span
                aria-hidden
                className="absolute bottom-0 left-[0.4375rem] top-6 w-px bg-gradient-to-b from-amber-400/60 to-rose-400/20"
              />
            )}
            <span
              aria-hidden
              className="relative mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 ring-4 ring-white dark:ring-black"
            />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs tabular-nums text-zinc-400">
                {beat.at}
              </p>
              <Beat className="mt-1 text-lg font-semibold">{beat.title}</Beat>
              {beat.body && (
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {beat.body}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
