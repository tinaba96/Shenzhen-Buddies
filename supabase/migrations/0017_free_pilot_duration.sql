-- Free pilot: tourists book fixed-length free tours (2 or 3 hours — see
-- FREE_TOUR_LENGTHS in src/lib/booking.ts) instead of paid 4–8 hour days.
-- Widen the duration check to 2–8 so the free lengths fit while the old paid
-- range stays valid for when payments come back (flip FREE_TOURS to false).
-- The app enforces the exact allowed lengths; this constraint is the backstop.
--
-- Nothing else changes: free bookings are still inserted as 'pending_payment'
-- (satisfying the existing insert policy) and immediately flipped to 'pending'
-- by the service-role client, exactly like the no-Stripe pilot path always did.
--
-- Run in the Supabase SQL editor after 0016_review_after_tour.sql.

alter table public.bookings drop constraint if exists bookings_duration;
alter table public.bookings add constraint bookings_duration
  check (end_hour - start_hour between 2 and 8);
