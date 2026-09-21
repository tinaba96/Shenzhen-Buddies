-- Free pilot: one live booking per tourist at a time. A tourist who already
-- has a tour awaiting review, confirmed, or held for checkout — and not yet
-- over — cannot request another one, on any day, until it ends or is
-- cancelled/declined. The app checks this first (requestBooking in
-- src/app/guide/actions.ts, isLiveBooking in src/lib/booking.ts) and shows a
-- friendly message; this trigger is the backstop for two simultaneous
-- submissions from the same account. It cannot be a unique index because
-- "not yet over" depends on the clock.
--
-- Only INSERT needs guarding: cancelled/rejected are terminal, so a row never
-- goes back from inactive to active by UPDATE.
--
-- Run in the Supabase SQL editor after 0018_booking_gap.sql.

create or replace function public.bookings_one_at_a_time()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  -- Wall-clock time in Shenzhen, to compare against day + end_hour (which
  -- are Shenzhen wall-clock values, see src/lib/booking.ts).
  shenzhen_now timestamp := (now() at time zone 'Asia/Shanghai');
begin
  if new.status not in ('pending_payment', 'pending', 'approved') then
    return new;
  end if;

  -- Serialize inserts per tourist, so two requests racing each other can't
  -- both pass the check below. Released when the transaction ends.
  perform pg_advisory_xact_lock(hashtext(new.tourist_id::text));

  if exists (
    select 1
    from public.bookings b
    where b.tourist_id = new.tourist_id
      and b.id <> new.id
      and b.status in ('pending_payment', 'pending', 'approved')
      -- An abandoned checkout hold stops counting after HOLD_EXPIRY_MINUTES
      -- (35, src/lib/booking.ts), same as everywhere else in the app.
      and (b.status <> 'pending_payment'
           or b.created_at > now() - interval '35 minutes')
      -- Still counts until the tour's end time has passed.
      and (b.day + make_interval(hours => b.end_hour)) > shenzhen_now
  ) then
    raise exception 'one_booking_at_a_time'
      using errcode = 'SB001',
            hint = 'This tourist already has a live booking.';
  end if;

  return new;
end
$$;

drop trigger if exists bookings_one_at_a_time on public.bookings;
create trigger bookings_one_at_a_time
  before insert on public.bookings
  for each row execute function public.bookings_one_at_a_time();
