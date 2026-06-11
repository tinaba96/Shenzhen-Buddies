-- Consent / audit log for Terms of Service + Cancellation Policy acceptance.
-- Booking implies agreement (the form states so), recorded here for audit.
-- Run after 0010_booking_duration.sql.

-- Stamp each booking with the policy version it was made under (atomic with
-- the booking, so every booking carries proof of the version agreed to).
alter table public.bookings add column if not exists terms_version text;

-- Append-only consent log: one row per (document) accepted, with context.
create table if not exists public.consent_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete set null,
  document text not null,          -- 'terms' | 'cancellation'
  version text not null,           -- e.g. '2026-06-11'
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists consent_logs_user_idx
  on public.consent_logs (user_id, created_at desc);
create index if not exists consent_logs_booking_idx
  on public.consent_logs (booking_id);

alter table public.consent_logs enable row level security;

-- Users can read their own consent records. Writes go through the service-role
-- client only (no insert/update/delete policies), so the log is effectively
-- append-only and immutable from clients.
drop policy if exists "Consent: owner can read" on public.consent_logs;
create policy "Consent: owner can read"
  on public.consent_logs for select to authenticated
  using (user_id = auth.uid());
