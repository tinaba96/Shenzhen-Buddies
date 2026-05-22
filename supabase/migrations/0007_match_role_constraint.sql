-- Enforce that conversations only exist between a tourist and a guide.
-- Updates the get_or_create_conversation RPC to refuse same-role pairs.
-- Run after 0003_chat.sql.

create or replace function public.get_or_create_conversation(other_id uuid)
returns uuid
language plpgsql as $$
declare
  me uuid := auth.uid();
  my_role text;
  other_role text;
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

  select role into my_role from public.profiles where id = me;
  select role into other_role from public.profiles where id = other_id;

  if my_role is null then
    raise exception 'create your profile first' using errcode = '22023';
  end if;
  if other_role is null then
    raise exception 'that user has no profile yet' using errcode = '22023';
  end if;
  if my_role = other_role then
    raise exception 'guides and tourists must match across roles' using errcode = '22023';
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
