'use client'

import { useState } from 'react'
import {
  DEFAULT_FREE_TOUR_LENGTH,
  FREE_TOUR_LENGTHS,
  formatHour,
} from '@/lib/booking'

type StartOption = { hour: number; maxDuration: number }

// The free-pilot replacement for BookingFields: instead of start + end time
// dropdowns, the tourist picks one of the fixed free lengths and a start time.
// Same wire contract as BookingFields — start_hour + a hidden duration — so
// the server action and everything behind it is unchanged. BookingFields
// itself is kept for the day paid bookings come back (FREE_TOURS in
// lib/booking).
export function FreeBookingFields({
  startOptions,
}: {
  startOptions: StartOption[]
}) {
  // A length is offered only if some start hour leaves room for it that day.
  const available = FREE_TOUR_LENGTHS.filter((l) =>
    startOptions.some((o) => o.maxDuration >= l),
  )
  const defaultLength = available.includes(DEFAULT_FREE_TOUR_LENGTH)
    ? DEFAULT_FREE_TOUR_LENGTH
    : (available[available.length - 1] ?? DEFAULT_FREE_TOUR_LENGTH)

  const [length, setLength] = useState(defaultLength)
  const validStarts = startOptions.filter((o) => o.maxDuration >= length)
  const [startHour, setStartHour] = useState(validStarts[0]?.hour ?? 0)

  // Keep the start valid when the length changes (a late start may fit 2h
  // but not 3h).
  const effectiveStart = validStarts.some((o) => o.hour === startHour)
    ? startHour
    : (validStarts[0]?.hour ?? 0)
  const endHour = effectiveStart + length

  return (
    <div className="space-y-4">
      {/* Submitted to the server action; the UI is length + start. */}
      <input type="hidden" name="duration" value={length} />
      <input type="hidden" name="start_hour" value={effectiveStart} />

      <div>
        <span className="text-sm font-medium">Tour length</span>
        <div className="mt-1.5 grid grid-cols-2 gap-3">
          {FREE_TOUR_LENGTHS.map((l) => {
            const selected = l === length
            const offered = available.includes(l)
            return (
              <button
                key={l}
                type="button"
                disabled={!offered}
                aria-pressed={selected}
                onClick={() => setLength(l)}
                className={`rounded-xl border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  selected
                    ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900'
                    : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-900'
                }`}
              >
                <span className="block text-base font-semibold">
                  {l} hour tour
                </span>
                <span
                  className={`block text-xs ${selected ? 'opacity-80' : 'text-emerald-600 dark:text-emerald-400'}`}
                >
                  Free
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Start time</span>
        <select
          value={effectiveStart}
          onChange={(e) => setStartHour(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
        >
          {validStarts.map((o) => (
            <option key={o.hour} value={o.hour}>
              {formatHour(o.hour)}
            </option>
          ))}
        </select>
      </label>

      {/* Live summary: start → end · hours · free */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">{formatHour(effectiveStart)}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-zinc-400">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
          <span className="font-semibold">{formatHour(endHour)}</span>
          <span className="text-zinc-500">· {length} hours</span>
        </div>
        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          Free
        </span>
      </div>
    </div>
  )
}
