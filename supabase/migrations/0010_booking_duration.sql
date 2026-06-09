-- Narrow the booking duration to 4–8 hours (was 5–15). Run after
-- 0009_booking_payments.sql. The app enforces the same range in
-- src/lib/booking.ts (MIN_BOOKING_HOURS / MAX_BOOKING_HOURS).

alter table public.bookings drop constraint if exists bookings_duration;
alter table public.bookings add constraint bookings_duration
  check (end_hour - start_hour between 4 and 8);
