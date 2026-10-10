-- Guest tour requests: the no-account way to ask for a tour (see
-- GUEST_REQUESTS in src/lib/booking.ts). A request is not a booking: there
-- is no slot, no gap rule and no tourist account. The guide reads the
-- contact details from the email (and /admin) and settles the day in chat.
--
-- Run by hand in the Supabase SQL editor, like 0017–0019.

create table public.tour_requests (
  id uuid primary key default gen_random_uuid(),
  package_slug text not null,
  package_title text not null,
  hours int check (hours between 1 and 8),
  name text not null check (char_length(name) between 1 and 80),
  email text check (email is null or char_length(email) <= 120),
  phone text check (phone is null or char_length(phone) <= 40),
  whatsapp text check (whatsapp is null or char_length(whatsapp) <= 40),
  wechat text check (wechat is null or char_length(wechat) <= 80),
  preferred_dates text check (preferred_dates is null or char_length(preferred_dates) <= 200),
  message text check (message is null or char_length(message) <= 500),
  locale text,
  status text not null default 'new' check (status in ('new', 'handled')),
  ip text,
  user_agent text,
  created_at timestamptz not null default now(),
  -- A request with no way to reach the visitor is useless.
  constraint tour_requests_has_contact check (
    coalesce(email, phone, whatsapp, wechat) is not null
  )
);

create index tour_requests_created_idx on public.tour_requests (created_at desc);

-- Service role only: the form inserts through the admin client and /admin
-- reads through it. No policies on purpose — nothing here should be
-- readable or writable from the browser.
alter table public.tour_requests enable row level security;
