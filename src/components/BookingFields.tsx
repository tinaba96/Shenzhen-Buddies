'use client'

import { useState } from 'react'
import { formatHour, formatMoney, HOURLY_RATE_CENTS } from '@/lib/booking'

type StartOption = { hour: number; maxDuration: number }

// Start-time + duration pickers with a live "10:00 → 18:00" summary so the
// tourist can see exactly when their day ends and what it costs. Renders the
// real <select name=…> fields, so it submits inside the parent server form.
export function BookingFields({
  startOptions,
  minHours,
  maxHours,
}: {
  startOptions: StartOption[]
  minHours: number
  maxHours: number
}) {
  const [startHour, setStartHour] = useState(startOptions[0]?.hour ?? 0)
  const [duration, setDuration] = useState(minHours)

  const selected =
    startOptions.find((o) => o.hour === startHour) ?? startOptions[0]
  const maxDuration = Math.min(maxHours, selected?.maxDuration ?? maxHours)

  // Durations that still fit from the chosen start time.
  const durations: number[] = []
  for (let h = minHours; h <= maxDuration; h++) durations.push(h)

  // Clamp so the value stays valid when the start time changes.
  const effectiveDuration = Math.min(Math.max(duration, minHours), maxDuration)
  const endHour = startHour + effectiveDuration
  const priceCents = effectiveDuration * HOURLY_RATE_CENTS

  return (
    <div className="space-y-4">
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
          <span className="text-sm font-medium">Duration</span>
          <select
            name="duration"
            value={effectiveDuration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          >
            {durations.map((h) => (
              <option key={h} value={h}>
                {h} hours — {formatMoney(h * HOURLY_RATE_CENTS)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Live summary: start → end */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">{formatHour(startHour)}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-zinc-400">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
          <span className="font-semibold">{formatHour(endHour)}</span>
          <span className="text-zinc-500">· {effectiveDuration} hours</span>
        </div>
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {formatMoney(priceCents)}
        </span>
      </div>
    </div>
  )
}
