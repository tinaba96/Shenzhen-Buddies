-- Seed reviews for the demo accounts so the rating filter and per-card
-- star indicators on /browse + /u/[id] have real data.
--
-- ============================================================================
-- DEV/STAGING ONLY. Run AFTER demo_users.sql.
-- ============================================================================
--
-- Each guide gets reviews from ~4 tourists.
-- Each tourist gets reviews from ~3 guides.
-- Stars skew positive (3–5) with a varied mix.
-- Bypasses the "must have prior conversation" RLS because the SQL editor
-- runs as postgres (BYPASSRLS).
--
-- Idempotent: the reviews_one_per_pair unique constraint means re-running
-- skips existing (reviewer, reviewee) pairs.
--
-- Clean up:
--   delete from public.reviews
--   where reviewer_id in (select id from auth.users where email like 'tourist+%@test.com' or email like 'guide+%@test.com')
--      or reviewee_id in (select id from auth.users where email like 'tourist+%@test.com' or email like 'guide+%@test.com');

do $$
declare
  i int;
  j int;
  tourist_id uuid;
  guide_id uuid;
  reviewer_id uuid;
  reviewee_id uuid;
  s int;
  b text;

  -- 10 varied review bodies cycled by index.
  bodies text[] := array[
    'Great day. They totally got my interests, took me to spots I would never have found alone.',
    'Patient, knowledgeable, easy to plan with. Already telling friends to message them.',
    'Honestly the best part of the trip. Real conversation, real local intel.',
    'Funny, warm, and full of stories. Five stars from me.',
    'Solid hangout. Some communication friction at first but figured each other out fast.',
    'Made the city feel like home for an afternoon.',
    'Knows where the good food is — that''s all I needed.',
    'Cool person, totally my vibe. Would meet up again.',
    'A bit shy at first but really lovely once we got going.',
    'Generous with their time. Showed me a side of Shenzhen I didn''t know existed.'
  ];
begin
  --
  -- Guides reviewed by tourists (4 tourists per guide → 80 reviews)
  --
  for i in 0..19 loop
    select id into guide_id from auth.users
      where email = 'guide+' || lpad(i::text, 3, '0') || '@test.com';
    if guide_id is null then continue; end if;

    for j in 0..3 loop
      select id into tourist_id from auth.users
        where email = 'tourist+' || lpad(((i + j * 5) % 20)::text, 3, '0') || '@test.com';
      if tourist_id is null then continue; end if;

      -- Star distribution: 5,5,4,5,4,3,5,4,5,5...
      s := 3 + (((i + j) * 7) % 3); -- 3..5
      if (i + j) % 4 = 0 then s := 5; end if;
      b := bodies[((i + j * 3) % 10) + 1];

      insert into public.reviews (reviewer_id, reviewee_id, stars, body)
      values (tourist_id, guide_id, s, b)
      on conflict (reviewer_id, reviewee_id) do nothing;
    end loop;
  end loop;

  --
  -- Tourists reviewed by guides (3 guides per tourist → 60 reviews)
  --
  for i in 0..19 loop
    select id into tourist_id from auth.users
      where email = 'tourist+' || lpad(i::text, 3, '0') || '@test.com';
    if tourist_id is null then continue; end if;

    for j in 0..2 loop
      select id into guide_id from auth.users
        where email = 'guide+' || lpad(((i + j * 7) % 20)::text, 3, '0') || '@test.com';
      if guide_id is null then continue; end if;

      s := 3 + (((i + j) * 5) % 3); -- 3..5
      if (i + j) % 3 = 0 then s := 5; end if;
      b := bodies[((i + j * 4) % 10) + 1];

      insert into public.reviews (reviewer_id, reviewee_id, stars, body)
      values (guide_id, tourist_id, s, b)
      on conflict (reviewer_id, reviewee_id) do nothing;
    end loop;
  end loop;
end $$;

-- Sanity check (uncomment):
-- select reviewee_id, count(*), round(avg(stars)::numeric, 1)
-- from public.reviews
-- where reviewee_id in (select id from auth.users where email like 'tourist+%@test.com' or email like 'guide+%@test.com')
-- group by reviewee_id
-- order by avg(stars) desc limit 10;
