-- Subscription tracking. Mirrors a Stripe subscription, owned by one user.
-- The webhook handler keeps this in sync with Stripe events.
-- Run after 0001_init.sql.

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text not null unique,
  status text not null,
  price_id text,
  current_period_end timestamptz,
  trial_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_customer_idx
  on public.subscriptions (stripe_customer_id);

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

alter table public.subscriptions enable row level security;

-- Users can read their own subscription. The webhook writes via the
-- service role (bypassing RLS), so no INSERT/UPDATE policies are needed here.
drop policy if exists "Subscriptions: owner can read" on public.subscriptions;
create policy "Subscriptions: owner can read"
  on public.subscriptions for select to authenticated
  using (user_id = auth.uid());
