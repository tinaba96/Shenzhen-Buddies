// Shared types and pure helpers for the beta booking flow.
// All hours are whole-hour wall-clock times in Shenzhen (0–24).

export const MIN_BOOKING_HOURS = 5
export const MAX_BOOKING_HOURS = 15

export type AvailabilityWindow = {
  id: string
  day: string // YYYY-MM-DD
  start_hour: number
  end_hour: number
}

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

export type BookingRow = {
  id: string
  tourist_id: string
  day: string // YYYY-MM-DD
  start_hour: number
  end_hour: number
  status: BookingStatus
  note: string | null
  created_at: string
}

export type TimeRange = { start_hour: number; end_hour: number }

export type FreeSegment = { start: number; end: number }

export function formatHour(hour: number): string {
  return `${hour}:00`
}

export function formatHourRange(start: number, end: number): string {
  return `${formatHour(start)} – ${formatHour(end)}`
}

// e.g. "Wed, Jun 10, 2026" — parsed at local midnight so the calendar day
// never shifts with the server timezone.
export function formatDay(day: string): string {
  return new Date(`${day}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Today's calendar date (YYYY-MM-DD) in Shenzhen.
export function todayInShenzhen(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Shanghai' })
}

// Bookable segments of an availability window: the whole window, if it can
// fit a minimum-length tour. (Days with an active booking are excluded
// entirely upstream — one booking blocks the whole day.)
export function bookableSegments(window: TimeRange): FreeSegment[] {
  if (window.end_hour - window.start_hour < MIN_BOOKING_HOURS) return []
  return [{ start: window.start_hour, end: window.end_hour }]
}

// True if [start, end) fits entirely inside one of the free segments.
export function fitsInSegments(
  segments: FreeSegment[],
  start: number,
  end: number,
): boolean {
  return segments.some((s) => s.start <= start && end <= s.end)
}
