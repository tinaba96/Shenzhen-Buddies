-- Per-user "last read" tracking for conversations.
-- Adds two columns on conversations (one per participant) and a helper
-- RPC for marking a conversation read.
-- Run after 0003_chat.sql.

alter table public.conversations
  add column if not exists user_a_last_read_at timestamptz not null default now(),
  add column if not exists user_b_last_read_at timestamptz not null default now();

create or replace function public.mark_conversation_read(c_id uuid)
returns void
language plpgsql as $$
declare
  me uuid := auth.uid();
begin
  if me is null then return; end if;
  update public.conversations
    set user_a_last_read_at = case when user_a_id = me then now() else user_a_last_read_at end,
        user_b_last_read_at = case when user_b_id = me then now() else user_b_last_read_at end
  where id = c_id
    and (user_a_id = me or user_b_id = me);
end;
$$;
