-- Beta booking flow for Shenzhen-Buddies: a single operator-managed guide,
-- admin-published availability windows, and tourist booking requests.
-- Run in the Supabase SQL editor after 0007_match_role_constraint.sql.

-- Needed for the "no overlapping time ranges per day" exclusion constraints.
create extension if not exists btree_gist;

-- Days/hours the official guide is available, published from /admin.
-- Hours are whole-hour wall-clock times in Shenzhen (0–24).
create table if not exists public.availability_windows (
  id uuid primary key default gen_random_uuid(),
  day date not null,
  start_hour int not null check (start_hour between 0 and 23),
  end_hour int not null check (end_hour between 1 and 24),
  created_at timestamptz not null default now(),
  constraint availability_windows_valid_range check (end_hour > start_hour),
  -- Windows on the same day must not overlap (keeps the picker unambiguous).
  constraint availability_windows_no_overlap
    exclude using gist (day with =, int4range(start_hour, end_hour) with &&)
);

create index if not exists availability_windows_day_idx
  on public.availability_windows (day);

alter table public.availability_windows enable row level security;

-- Anyone signed in can see when the guide is available. Writes go through the
-- service-role client in the /admin server actions only (no insert/update/
-- delete policies on purpose).
drop policy if exists "Availability: authenticated can read" on public.availability_windows;
create policy "Availability: authenticated can read"
  on public.availability_windows for select to authenticated using (true);

-- Tourist booking requests against the official guide's availability.
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  tourist_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  start_hour int not null check (start_hour between 0 and 23),
  end_hour int not null check (end_hour between 1 and 24),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'cancelled')),
  note text check (note is null or length(note) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_valid_range check (end_hour > start_hour),
  -- Tours run from 5 to 15 hours.
  constraint bookings_duration check (end_hour - start_hour between 5 and 15),
  -- One booking per day: with a single operator-managed guide, a pending or
  -- approved booking blocks the WHOLE day the moment it is created — even a
  -- 5-hour tour. Rejected/cancelled bookings drop out of the constraint,
  -- freeing the day again.
  constraint bookings_one_per_day
    exclude using btree (day with =)
    where (status in ('pending', 'approved'))
);

create index if not exists bookings_tourist_idx
  on public.bookings (tourist_id, created_at desc);
create index if not exists bookings_day_idx on public.bookings (day);

-- Reuse the existing public.set_updated_at function (created in 0001_init.sql).
drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

alter table public.bookings enable row level security;

drop policy if exists "Bookings: tourist can read own" on public.bookings;
create policy "Bookings: tourist can read own"
  on public.bookings for select to authenticated
  using (tourist_id = auth.uid());

-- Tourists create their own pending requests, and only inside a published
-- availability window on a current/future day. Status changes (approve/
-- reject) go through the service-role client in the /admin server actions.
drop policy if exists "Bookings: tourist can request" on public.bookings;
create policy "Bookings: tourist can request"
  on public.bookings for insert to authenticated
  with check (
    tourist_id = auth.uid()
    and status = 'pending'
    and day >= current_date
    and exists (
      select 1
      from public.availability_windows w
      where w.day = bookings.day
        and w.start_hour <= bookings.start_hour
        and w.end_hour >= bookings.end_hour
    )
  );
