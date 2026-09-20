-- More than one booking per day, as long as tours are at least two hours
-- apart. Until now a single pending/approved booking (or a fresh checkout
-- hold) locked the WHOLE day via bookings_one_per_day. Replace that with a
-- range exclusion: two active bookings on the same day may not come within
-- BOOKING_GAP_HOURS (2, see src/lib/booking.ts) of each other, so the guide
-- always has at least two hours to wrap up, travel, and prepare for the next
-- tourist. Extending every booking's range by the gap on one side is enough:
-- [10,13) vs [15,18) becomes [10,15) vs [15,20), which do NOT overlap, so a
-- 13:00 end followed by a 15:00 start is allowed; a 14:00 start is not.
--
-- The app enforces the same rule (bookableSegments in src/lib/booking.ts);
-- the constraint is the backstop against races between two tourists. A
-- second, partial unique index backstops the app's "one active booking per
-- tourist per day" rule the same way (two tabs submitting at once).
--
-- Run in the Supabase SQL editor after 0017_free_pilot_duration.sql, BEFORE
-- deploying the matching code (the old day lock would otherwise reject the
-- second same-day slot the picker now offers).

-- Already created in 0008_bookings.sql; needed for `day with =` in GiST.
create extension if not exists btree_gist;

alter table public.bookings drop constraint if exists bookings_one_per_day;
alter table public.bookings drop constraint if exists bookings_no_overlap_with_gap;
alter table public.bookings add constraint bookings_no_overlap_with_gap
  exclude using gist (
    day with =,
    int4range(start_hour, end_hour + 2) with &&
  )
  where (status in ('pending_payment', 'pending', 'approved'));

-- One active booking per tourist per day. requestBooking deletes the
-- tourist's own abandoned checkout hold for the day before inserting, so a
-- retry never collides with itself. Violations surface as 23505.
create unique index if not exists bookings_one_per_tourist_per_day
  on public.bookings (tourist_id, day)
  where (status in ('pending_payment', 'pending', 'approved'));
