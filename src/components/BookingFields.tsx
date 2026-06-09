'use client'

import { useState } from 'react'
import { formatHour, formatMoney, HOURLY_RATE_CENTS } from '@/lib/booking'

type StartOption = { hour: number; maxDuration: number }

// Start-time + end-time pickers with a live "10:00 → 18:00" summary so the
// tourist can set exactly when their day starts and ends and see the cost.
// The duration (end − start) is derived and submitted as a hidden field, so
// the parent server form keeps its start_hour / duration contract.
export function BookingFields({
  startOptions,
  minHours,
  maxHours,
}: {
  startOptions: StartOption[]
  minHours: number
  maxHours: number
}) {
  const firstStart = startOptions[0]?.hour ?? 0
  const [startHour, setStartHour] = useState(firstStart)
  const [endHour, setEndHour] = useState(firstStart + minHours)

  const selected =
    startOptions.find((o) => o.hour === startHour) ?? startOptions[0]
  const maxDuration = Math.min(maxHours, selected?.maxDuration ?? maxHours)

  // End times that keep the day within the allowed length and the guide's hours.
  const minEnd = startHour + minHours
  const maxEnd = startHour + maxDuration
  const endOptions: number[] = []
  for (let h = minEnd; h <= maxEnd; h++) endOptions.push(h)

  // Clamp so the value stays valid when the start time changes.
  const effectiveEnd = Math.min(Math.max(endHour, minEnd), maxEnd)
  const duration = effectiveEnd - startHour
  const priceCents = duration * HOURLY_RATE_CENTS

  return (
    <div className="space-y-4">
      {/* Submitted to the server action; UI uses start + end. */}
      <input type="hidden" name="duration" value={duration} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Start time</span>
          <select
            name="start_hour"
            value={startHour}
            onChange={(e) => setStartHour(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          >
            {startOptions.map((o) => (
              <option key={o.hour} value={o.hour}>
                {formatHour(o.hour)}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">End time</span>
          <select
            value={effectiveEnd}
            onChange={(e) => setEndHour(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          >
            {endOptions.map((h) => (
              <option key={h} value={h}>
                {formatHour(h)} ({h - startHour}h)
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Live summary: start → end · hours · price */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">{formatHour(startHour)}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-zinc-400">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
          <span className="font-semibold">{formatHour(effectiveEnd)}</span>
          <span className="text-zinc-500">· {duration} hours</span>
        </div>
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {formatMoney(priceCents)}
        </span>
      </div>
      <p className="text-xs text-zinc-500">
        Days run {minHours}–{maxHours} hours.
      </p>
    </div>
  )
}
