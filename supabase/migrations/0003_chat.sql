-- 1:1 direct messaging.
-- Run in the Supabase SQL editor after 0001_init.sql and 0002_avatars.sql.

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_a_id uuid not null references auth.users(id) on delete cascade,
  user_b_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint conversations_user_pair unique (user_a_id, user_b_id),
  constraint conversations_user_order check (user_a_id < user_b_id)
);

create index if not exists conversations_user_a_idx
  on public.conversations (user_a_id, updated_at desc);
create index if not exists conversations_user_b_idx
  on public.conversations (user_b_id, updated_at desc);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (length(content) > 0 and length(content) <= 4000),
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_idx
  on public.messages (conversation_id, created_at);

create or replace function public.bump_conversation_on_message()
returns trigger language plpgsql as $$
begin
  update public.conversations
    set updated_at = now()
    where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists messages_bump_conversation on public.messages;
create trigger messages_bump_conversation
  after insert on public.messages
  for each row execute function public.bump_conversation_on_message();

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

drop policy if exists "Conversations: participants can read" on public.conversations;
create policy "Conversations: participants can read"
  on public.conversations for select to authenticated
  using (user_a_id = auth.uid() or user_b_id = auth.uid());

drop policy if exists "Conversations: participants can insert" on public.conversations;
create policy "Conversations: participants can insert"
  on public.conversations for insert to authenticated
  with check (user_a_id = auth.uid() or user_b_id = auth.uid());

drop policy if exists "Conversations: participants can update" on public.conversations;
create policy "Conversations: participants can update"
  on public.conversations for update to authenticated
  using (user_a_id = auth.uid() or user_b_id = auth.uid())
  with check (user_a_id = auth.uid() or user_b_id = auth.uid());

drop policy if exists "Messages: participants can read" on public.messages;
create policy "Messages: participants can read"
  on public.messages for select to authenticated
  using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and (c.user_a_id = auth.uid() or c.user_b_id = auth.uid())
    )
  );

drop policy if exists "Messages: sender can insert" on public.messages;
create policy "Messages: sender can insert"
  on public.messages for insert to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.user_a_id = auth.uid() or c.user_b_id = auth.uid())
    )
  );

create or replace function public.get_or_create_conversation(other_id uuid)
returns uuid
language plpgsql as $$
declare
  me uuid := auth.uid();
  a uuid;
  b uuid;
  cid uuid;
begin
  if me is null then
    raise exception 'unauthenticated' using errcode = '42501';
  end if;
  if other_id = me then
    raise exception 'cannot message yourself' using errcode = '22023';
  end if;
  if me < other_id then a := me; b := other_id; else a := other_id; b := me; end if;

  select id into cid from public.conversations
    where user_a_id = a and user_b_id = b;
  if cid is null then
    insert into public.conversations (user_a_id, user_b_id) values (a, b)
      returning id into cid;
  end if;
  return cid;
end;
$$;

-- Realtime: stream INSERTs on messages to subscribed clients.
do $$
begin
  alter publication supabase_realtime add table public.messages;
exception
  when duplicate_object then null;
end $$;
