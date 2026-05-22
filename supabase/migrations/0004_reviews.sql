-- Reviews & ratings for Shenzhen-Buddies.
-- Run in the Supabase SQL editor after 0001_init.sql, 0002_avatars.sql, and 0003_chat.sql.

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid not null references auth.users(id) on delete cascade,
  reviewee_id uuid not null references auth.users(id) on delete cascade,
  stars int not null check (stars between 1 and 5),
  body text check (body is null or length(body) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reviews_no_self check (reviewer_id <> reviewee_id),
  constraint reviews_one_per_pair unique (reviewer_id, reviewee_id)
);

create index if not exists reviews_reviewee_idx on public.reviews (reviewee_id, created_at desc);

-- Reuse the existing public.set_updated_at function (created in 0001_init.sql).
drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

alter table public.reviews enable row level security;

drop policy if exists "Reviews: authenticated can read" on public.reviews;
create policy "Reviews: authenticated can read"
  on public.reviews for select to authenticated using (true);

drop policy if exists "Reviews: reviewer can insert with message history" on public.reviews;
create policy "Reviews: reviewer can insert with message history"
  on public.reviews for insert to authenticated
  with check (
    reviewer_id = auth.uid()
    and reviewer_id <> reviewee_id
    and exists (
      select 1
      from public.conversations c
      join public.messages m on m.conversation_id = c.id
      where ((c.user_a_id = auth.uid() and c.user_b_id = reviewee_id)
          or (c.user_b_id = auth.uid() and c.user_a_id = reviewee_id))
    )
  );

drop policy if exists "Reviews: author can update own" on public.reviews;
create policy "Reviews: author can update own"
  on public.reviews for update to authenticated
  using (reviewer_id = auth.uid())
  with check (reviewer_id = auth.uid());

drop policy if exists "Reviews: author can delete own" on public.reviews;
create policy "Reviews: author can delete own"
  on public.reviews for delete to authenticated
  using (reviewer_id = auth.uid());
