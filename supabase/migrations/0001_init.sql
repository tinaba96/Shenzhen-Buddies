-- Profiles table for Shenzhen-Buddies.
-- Run this in the Supabase SQL editor on a fresh project.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('guide', 'tourist')),
  display_name text not null,
  bio text,
  city text not null default 'Shenzhen',
  hobbies text[] not null default '{}',
  languages text[] not null default '{}',
  personality_traits text[] not null default '{}',
  visibility text not null default 'public' check (visibility in ('public', 'private')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "View public profiles or own profile" on public.profiles;
create policy "View public profiles or own profile"
  on public.profiles for select
  to authenticated
  using (visibility = 'public' or id = auth.uid());

drop policy if exists "Insert own profile" on public.profiles;
create policy "Insert own profile"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());

drop policy if exists "Update own profile" on public.profiles;
create policy "Update own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());
