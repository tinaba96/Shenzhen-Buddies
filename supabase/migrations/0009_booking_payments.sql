-- Stripe one-time payment for bookings. Run after 0008_bookings.sql.
-- Tourists pay at request time; the day is held during checkout, the booking
-- becomes payable→paid via webhook, and a declined booking is refunded.

alter table public.bookings
  add column if not exists stripe_session_id text,
  add column if not exists stripe_payment_intent_id text,
  add column if not exists amount_cents int,
  add column if not exists currency text;

-- New 'pending_payment' state: the booking is created and the day is held
-- the instant checkout starts, before money has moved. It becomes 'pending'
-- once Stripe confirms payment, or 'cancelled' if the checkout expires.
alter table public.bookings drop constraint if exists bookings_status_check;
alter table public.bookings add constraint bookings_status_check
  check (status in ('pending_payment', 'pending', 'approved', 'rejected', 'cancelled'));

-- The day-level hold must also cover the pre-payment state, so two tourists
-- can't both be in checkout for the same day.
alter table public.bookings drop constraint if exists bookings_one_per_day;
alter table public.bookings add constraint bookings_one_per_day
  exclude using btree (day with =)
  where (status in ('pending_payment', 'pending', 'approved'));

-- Tourists now create rows in 'pending_payment' (was 'pending'). Everything
-- after payment is driven by the webhook / admin via the service-role client.
drop policy if exists "Bookings: tourist can request" on public.bookings;
create policy "Bookings: tourist can request"
  on public.bookings for insert to authenticated
  with check (
    tourist_id = auth.uid()
    and status = 'pending_payment'
    and day >= current_date
    and exists (
      select 1
      from public.availability_windows w
      where w.day = bookings.day
        and w.start_hour <= bookings.start_hour
        and w.end_hour >= bookings.end_hour
    )
  );
