-- Tighten reviews: only allow a tourist to review a guide AFTER the tour has
-- actually finished (an approved booking whose end time, in Shenzhen time, is
-- in the past). Drops the looser message-history / any-approved-booking paths.
-- Run after 0015_review_after_booking.sql.

drop policy if exists "Reviews: reviewer can insert with message history" on public.reviews;
drop policy if exists "Reviews: reviewer can insert" on public.reviews;
create policy "Reviews: reviewer can insert"
  on public.reviews for insert to authenticated
  with check (
    reviewer_id = auth.uid()
    and reviewer_id <> reviewee_id
    -- A confirmed booking whose tour has already ended (Shenzhen = UTC+8).
    and exists (
      select 1 from public.bookings b
      where b.tourist_id = auth.uid()
        and b.status = 'approved'
        and ((b.day + (b.end_hour || ' hours')::interval)
              at time zone 'Asia/Shanghai') < now()
    )
    -- And the person being reviewed is a guide.
    and exists (
      select 1 from public.profiles p
      where p.id = reviewee_id and p.role = 'guide'
    )
  );
