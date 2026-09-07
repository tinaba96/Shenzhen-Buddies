'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  formatHour,
  MAX_BOOKING_HOURS,
  MIN_BOOKING_HOURS,
} from '@/lib/booking'
import { addGuideAvailability } from './actions'

// The add-availability form the official guide sees on /guide. The old
// version was a native date field and two bare dropdowns — opening the OS
// date picker for every single day, with nothing showing which days were
// already open. This one puts the next two weeks on screen as tap targets,
// marks the days that already have windows, and offers the ranges the guide
// actually uses as one-tap presets. The submitted contract is unchanged:
// day / start_hour / end_hour into addGuideAvailability.

const DAYS_SHOWN = 14

const PRESETS = [
  { label: 'Morning', start: 9, end: 13 },
  { label: 'Afternoon', start: 13, end: 18 },
  { label: 'Evening', start: 17, end: 22 },
  { label: 'Full day', start: 9, end: 22 },
]

// Day strings are calendar dates in Shenzhen ('YYYY-MM-DD'); adding a day is
// pure date math, so UTC keeps it from shifting with the viewer's timezone.
function addDays(day: string, n: number): string {
  const d = new Date(`${day}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

function dayParts(day: string): { weekday: string; dayNum: string; month: string } {
  const d = new Date(`${day}T00:00:00`)
  return {
    weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
    dayNum: d.toLocaleDateString('en-US', { day: 'numeric' }),
    month: d.toLocaleDateString('en-US', { month: 'short' }),
  }
}

function longDay(day: string): string {
  return new Date(`${day}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

// Local submit button so it can be disabled until a day is picked —
// components/SubmitButton only knows about the pending state.
function AddButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending}
      className="w-full rounded-full bg-zinc-900 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      {pending ? 'Adding…' : disabled ? 'Pick a day first' : 'Open this day for booking'}
    </button>
  )
}

export function AvailabilityEditor({
  openDays,
  today,
}: {
  // Days that already have at least one window — marked in the grid.
  openDays: string[]
  today: string
}) {
  const [day, setDay] = useState<string | null>(null)
  // '' = the two-week grid is in charge; a value = "another date" input is.
  const [customDay, setCustomDay] = useState('')
  const [startHour, setStartHour] = useState(9)
  const [endHour, setEndHour] = useState(22)

  const gridDays = Array.from({ length: DAYS_SHOWN }, (_, i) =>
    addDays(today, i),
  )
  const open = new Set(openDays)

  // End must leave room for the shortest bookable tour.
  const startOptions: number[] = []
  for (let h = 0; h <= 24 - MIN_BOOKING_HOURS; h++) startOptions.push(h)
  const endOptions: number[] = []
  for (let h = startHour + MIN_BOOKING_HOURS; h <= 24; h++) endOptions.push(h)
  const effectiveEnd = Math.max(endHour, startHour + MIN_BOOKING_HOURS)

  const selectDay = (d: string) => {
    setDay(d)
    setCustomDay('')
  }

  return (
    <form
      action={addGuideAvailability}
      className="mt-3 space-y-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <input type="hidden" name="day" value={day ?? ''} />
      <input type="hidden" name="start_hour" value={startHour} />
      <input type="hidden" name="end_hour" value={effectiveEnd} />

      {/* 1 · Day */}
      <div>
        <p className="text-sm font-semibold">1 · Pick a day</p>
        <div className="mt-2.5 grid grid-cols-4 gap-2 sm:grid-cols-7">
          {gridDays.map((d, i) => {
            const parts = dayParts(d)
            const selected = d === day
            return (
              <button
                key={d}
                type="button"
                onClick={() => selectDay(d)}
                aria-pressed={selected}
                className={`relative flex flex-col items-center rounded-xl border py-2.5 transition ${
                  selected
                    ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-900'
                }`}
              >
                <span className="text-[10px] font-medium uppercase tracking-wide opacity-70">
                  {i === 0 ? 'Today' : parts.weekday}
                </span>
                <span className="text-lg font-semibold leading-tight">
                  {parts.dayNum}
                </span>
                <span className="text-[10px] opacity-70">{parts.month}</span>
                {open.has(d) && (
                  <span
                    title="Already has open hours"
                    className={`absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full ${
                      selected ? 'bg-amber-300' : 'bg-amber-500'
                    }`}
                  />
                )}
              </button>
            )
          })}
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-sm">
          <label htmlFor="avail-custom-day" className="text-zinc-500">
            Further out?
          </label>
          <input
            id="avail-custom-day"
            type="date"
            min={today}
            value={customDay}
            onChange={(e) => {
              setCustomDay(e.target.value)
              setDay(e.target.value || null)
            }}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          already has open hours — you can still add a second window that day
        </p>
      </div>

      {/* 2 · Hours */}
      <div>
        <p className="text-sm font-semibold">2 · Pick your hours</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {PRESETS.map((p) => {
            const active = startHour === p.start && effectiveEnd === p.end
            return (
              <button
                key={p.label}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setStartHour(p.start)
                  setEndHour(p.end)
                }}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  active
                    ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900'
                    : 'border-zinc-300 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
                }`}
              >
                {p.label}{' '}
                <span className="opacity-60">
                  {formatHour(p.start)}–{formatHour(p.end)}
                </span>
              </button>
            )
          })}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-medium text-zinc-500">From</span>
            <select
              value={startHour}
              onChange={(e) => {
                const h = Number(e.target.value)
                setStartHour(h)
                if (endHour < h + MIN_BOOKING_HOURS) {
                  setEndHour(h + MIN_BOOKING_HOURS)
                }
              }}
              className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-base dark:border-zinc-700 dark:bg-zinc-950"
            >
              {startOptions.map((h) => (
                <option key={h} value={h}>
                  {formatHour(h)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-zinc-500">Until</span>
            <select
              value={effectiveEnd}
              onChange={(e) => setEndHour(Number(e.target.value))}
              className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-base dark:border-zinc-700 dark:bg-zinc-950"
            >
              {endOptions.map((h) => (
                <option key={h} value={h}>
                  {formatHour(h)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* 3 · Confirm */}
      <div className="space-y-3">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-950">
          {day ? (
            <>
              <span className="font-semibold">{longDay(day)}</span>
              <span className="text-zinc-500"> · </span>
              <span className="font-semibold">
                {formatHour(startHour)} – {formatHour(effectiveEnd)}
              </span>
              <span className="text-zinc-500">
                {' '}
                · open for {effectiveEnd - startHour} hours — tourists book any{' '}
                {MIN_BOOKING_HOURS}–{MAX_BOOKING_HOURS}h inside
              </span>
            </>
          ) : (
            <span className="text-zinc-500">
              Pick a day above to see what you are opening.
            </span>
          )}
        </div>
        <AddButton disabled={!day} />
      </div>
    </form>
  )
}
