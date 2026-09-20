// Shared types and pure helpers for the beta booking flow.
// All hours are whole-hour wall-clock times in Shenzhen (0–24).

// Free-pilot mode. While true, tours cost nothing and come only in the fixed
// lengths below — the paid flow (Stripe/PayPal checkout, hourly pricing,
// refunds) stays in the codebase untouched and comes back by flipping this
// to false. Nothing else needs to change: every constant below derives from it.
export const FREE_TOURS = true

// The only lengths a tourist can pick while the pilot is free. Whole hours
// because start_hour/end_hour are integer columns; 3 is the default the form
// preselects.
export const FREE_TOUR_LENGTHS = [2, 3]
export const DEFAULT_FREE_TOUR_LENGTH = 3

export const MIN_BOOKING_HOURS = FREE_TOURS ? 2 : 4
export const MAX_BOOKING_HOURS = FREE_TOURS ? 3 : 8

// Pricing: a flat CA$10/hour, charged once at booking time (paid mode only —
// amountCentsForHours() returns 0 while FREE_TOURS is on).
export const HOURLY_RATE_CENTS = 1000
export const CURRENCY = 'cad'

// The Stripe Checkout session lifetime (Stripe's minimum). After this the
// session expires and the tourist can no longer pay on it.
export const CHECKOUT_EXPIRY_MINUTES = 30

// When the app treats a 'pending_payment' hold as abandoned and stops letting
// it block the day. Set a few minutes BEYOND the checkout expiry so that by
// the time we free a day, the original payer's session is already expired —
// they can't complete payment, so freeing it for others can't double-book.
// This also self-heals if the checkout.session.expired webhook is missed.
export const HOLD_EXPIRY_MINUTES = 35

export function isHoldExpired(
  status: BookingStatus,
  createdAtMs: number,
  nowMs: number,
): boolean {
  return (
    status === 'pending_payment' &&
    nowMs - createdAtMs > HOLD_EXPIRY_MINUTES * 60_000
  )
}

// Hours from `nowMs` until the tour starts. Shenzhen is UTC+8 (no DST).
export function hoursUntilTourStart(
  day: string,
  startHour: number,
  nowMs: number,
): number {
  const startMs = Date.parse(
    `${day}T${String(startHour).padStart(2, '0')}:00:00+08:00`,
  )
  return (startMs - nowMs) / 3_600_000
}

// Refund percentage for a tourist-initiated cancellation:
// - Not yet confirmed (pending): always 100% (the operator hadn't committed).
// - Confirmed (approved): 100% if ≥72h before, 90% if 24–72h before
//   (10% cancellation fee), 20% if <24h before (80% fee).
export function cancellationRefundPercent(
  status: BookingStatus,
  hoursUntil: number,
): number {
  if (status === 'pending') return 100
  if (status !== 'approved') return 0
  if (hoursUntil >= 72) return 100
  if (hoursUntil >= 24) return 90
  return 20
}

export function amountCentsForHours(hours: number): number {
  if (FREE_TOURS) return 0
  return hours * HOURLY_RATE_CENTS
}

// 5000 -> "$50.00" (en-CA renders CAD as a bare "$"; packages.ts uses en-US where "CA$" is wanted)
export function formatMoney(cents: number, currency: string = CURRENCY): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100)
}

export type AvailabilityWindow = {
  id: string
  day: string // YYYY-MM-DD
  start_hour: number
  end_hour: number
}

export type BookingStatus =
  | 'pending_payment'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled'

// Statuses that hold their hours (block other tourists from booking them or
// anything within BOOKING_GAP_HOURS of them).
export const ACTIVE_BOOKING_STATUSES: BookingStatus[] = [
  'pending_payment',
  'pending',
  'approved',
]

export type BookingRow = {
  id: string
  tourist_id: string
  day: string // YYYY-MM-DD
  start_hour: number
  end_hour: number
  status: BookingStatus
  note: string | null
  amount_cents: number | null
  currency: string | null
  stripe_payment_intent_id: string | null
  payment_provider: 'stripe' | 'paypal' | null
  paypal_capture_id: string | null
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

// Minimum free time between two tours on the same day, so the guide can wrap
// up, travel, and prepare for the next tourist. A 13:00 end followed by a
// 15:00 start is allowed; 14:00 is not. Mirrored by the
// bookings_no_overlap_with_gap exclusion constraint (migration 0018) — keep
// the two in sync.
export const BOOKING_GAP_HOURS = 2

// Bookable segments of an availability window once the day's active bookings
// are carved out, each padded by BOOKING_GAP_HOURS on both sides. `booked` is
// every active booking on the window's day (from any window); ones that don't
// touch this window are ignored. Only segments that still fit a
// minimum-length tour are returned, sorted by start.
export function bookableSegments(
  window: TimeRange,
  booked: TimeRange[],
): FreeSegment[] {
  const blocked = booked
    .map((b) => ({
      start: b.start_hour - BOOKING_GAP_HOURS,
      end: b.end_hour + BOOKING_GAP_HOURS,
    }))
    .sort((a, b) => a.start - b.start)

  const segments: FreeSegment[] = []
  let cursor = window.start_hour
  for (const b of blocked) {
    if (b.end <= cursor) continue // entirely before the free cursor
    if (b.start >= window.end_hour) break // entirely after the window
    if (b.start > cursor) segments.push({ start: cursor, end: b.start })
    cursor = Math.max(cursor, b.end)
  }
  if (cursor < window.end_hour) {
    segments.push({ start: cursor, end: window.end_hour })
  }
  return segments.filter((s) => s.end - s.start >= MIN_BOOKING_HOURS)
}

// True if [start, end) fits entirely inside one of the free segments.
export function fitsInSegments(
  segments: FreeSegment[],
  start: number,
  end: number,
): boolean {
  return segments.some((s) => s.start <= start && end <= s.end)
}
