// Shared types and pure helpers for the beta booking flow.
// All hours are whole-hour wall-clock times in Shenzhen (0–24).

export const MIN_BOOKING_HOURS = 4
export const MAX_BOOKING_HOURS = 8

// Pricing: a flat CA$10/hour, charged once at booking time.
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
  return hours * HOURLY_RATE_CENTS
}

// 5000 -> "CA$50.00"
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

// Statuses that hold the day (block other tourists from booking it).
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
