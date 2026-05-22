-- Seed 20 tourist + 20 guide demo accounts.
--
-- ============================================================================
-- WARNING — RUN IN A DEV/STAGING SUPABASE PROJECT ONLY.
-- ============================================================================
-- This inserts directly into auth.users / auth.identities, bypassing the
-- normal Auth API. It's safe in your own project but never run it against a
-- shared/production auth database.
--
-- All accounts share password "password". Emails follow the pattern
--   tourist+000@test.com … tourist+019@test.com
--   guide+000@test.com   … guide+019@test.com
-- They use the "+NNN@test.com" form so a single inbox doesn't matter and
-- they're trivially searchable in the Supabase Auth dashboard.
--
-- Idempotent: existing emails are skipped on re-run.
--
-- To wipe all demo accounts later:
--   delete from auth.users where email like 'tourist+%@test.com' or email like 'guide+%@test.com';
-- The cascade on public.profiles + auth.identities handles the rest.
--
-- Pre-reqs:
--   - 0001_init.sql through 0005_notifications.sql have been run
--   - pgcrypto extension is enabled (it is by default on Supabase)
--   - Authentication → Providers → Email → "Confirm email" is OFF
--     (or these accounts get pre-confirmed via email_confirmed_at = now())

do $$
declare
  i int;
  uid uuid;
  user_email text;
  hashed text;

  tourist_names text[] := array[
    'Sarah K.', 'Marco R.', 'Anna S.', 'Carlos G.', 'Liam B.',
    'Sofia L.', 'Olivia W.', 'Noah L.', 'Isabella P.', 'Aiden N.',
    'Mia C.', 'Lucas M.', 'Zoe T.', 'Emma D.', 'Ethan W.',
    'Charlotte B.', 'Mason F.', 'Amelia H.', 'Logan K.', 'Harper J.'
  ];

  guide_names text[] := array[
    'Lin Chen', 'Wei Zhang', 'Mei Wang', 'Hao Liu', 'Yan Zhao',
    'Ling Sun', 'Bo Wu', 'Yu Zhou', 'Xin Hu', 'Min Tang',
    'Tao Yang', 'Hua Li', 'Jing Chen', 'Feng Wang', 'Bao Liu',
    'Qiang Zhao', 'Ming Sun', 'Lei Wu', 'Lan Zhou', 'Yong Hu'
  ];

  tourist_cities text[] := array[
    'Shenzhen', 'Shenzhen', 'Shenzhen', 'Hong Kong', 'Shenzhen',
    'Shenzhen', 'Guangzhou', 'Shenzhen', 'Shenzhen', 'Macau'
  ];

  tourist_bios text[] := array[
    'Visiting for two weeks. Looking for hiking partners and serious food intel.',
    'Designer, three days in Shenzhen, would love to see OCT-Loft with a local.',
    'My Mandarin is awful and I need someone patient. Coffee on me.',
    'Software dev visiting from Tokyo — show me Huaqiangbei?',
    'Photographer chasing golden hour. Skyline spots wanted.',
    'Backpacking through southern China. Slow travel, real food, no tour buses.',
    'Heading to Dafen for the painting alleys — anyone want to tag along?',
    'On a layover, only have one afternoon. Make it count.',
    'Yoga teacher, looking for quiet parks and great vegetarian food.',
    'Architecture nerd, in town to see the new towers up close.'
  ];

  tourist_hobby_sets text[] := array[
    'hiking,photography,street food',
    'art galleries,cafes,jazz',
    'rooftop bars,architecture,design',
    'electronics,gadgets,makerspaces',
    'photography,street food,museums',
    'reading,coffee,hiking',
    'painting,art,museums',
    'food,coffee,walking',
    'yoga,vegetarian food,parks',
    'architecture,history,photography'
  ];

  tourist_language_sets text[] := array[
    'English',
    'English,Italian',
    'English,German',
    'English,Japanese',
    'English,Spanish',
    'English,French',
    'English,Portuguese',
    'English,Korean',
    'English,Hindi',
    'English,Dutch'
  ];

  tourist_trait_sets text[] := array[
    'curious,outgoing,easygoing',
    'creative,playful,relaxed',
    'adventurous,energetic,fun',
    'curious,direct,thoughtful',
    'observant,calm,curious',
    'easygoing,kind,patient',
    'creative,quiet,curious',
    'fast,decisive,fun',
    'calm,thoughtful,warm',
    'curious,detail-oriented,focused'
  ];

  guide_bios text[] := array[
    'Born here, can show you the alleys Google Maps misses.',
    'Coffee, design, late-night dumplings. Happy to translate at any of them.',
    'Local for 10+ years. Architecture geek, decent cook, terrible singer.',
    'Native Cantonese, English teacher, weekend hiker. I know every trail.',
    'Designer at OCT-Loft — happy to show you the indie art scene.',
    'Software engineer by day, food-stall connoisseur by night.',
    'Tea ceremony enthusiast — let me show you the real spots, not the tourist ones.',
    'Photographer who knows every rooftop in Futian.',
    'Maker / electronics hobbyist. I shop Huaqiangbei like a second home.',
    'Yoga instructor and runner. Best parks, best brunch.'
  ];

  guide_hobby_sets text[] := array[
    'hiking,street food,karaoke',
    'coffee,design,dumplings',
    'architecture,cooking,music',
    'hiking,Cantonese cuisine,trails',
    'art,design,gallery openings',
    'food,bars,jazz',
    'tea ceremonies,calligraphy,history',
    'photography,rooftops,sunsets',
    'electronics,makers,3D printing',
    'yoga,running,brunch'
  ];

  guide_language_sets text[] := array[
    'Mandarin,Cantonese,English',
    'Mandarin,English',
    'Mandarin,Cantonese,English,French',
    'Mandarin,Cantonese,English',
    'Mandarin,English,Japanese',
    'Mandarin,English,Korean',
    'Mandarin,Cantonese,English',
    'Mandarin,English',
    'Mandarin,English',
    'Mandarin,English,Spanish'
  ];

  guide_trait_sets text[] := array[
    'warm,welcoming,easygoing',
    'patient,thoughtful,curious',
    'witty,knowledgeable,sharp',
    'kind,reliable,calm',
    'creative,playful,direct',
    'energetic,fun,outgoing',
    'calm,observant,wise',
    'detail-oriented,patient,creative',
    'curious,resourceful,sharp',
    'energetic,kind,warm'
  ];

begin
  hashed := crypt('password', gen_salt('bf'));

  for i in 0..19 loop
    --
    -- TOURIST i
    --
    user_email := 'tourist+' || lpad(i::text, 3, '0') || '@test.com';

    if not exists (select 1 from auth.users where email = user_email) then
      uid := gen_random_uuid();

      insert into auth.users (
        id, instance_id, aud, role, email, encrypted_password,
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at, confirmation_token, email_change,
        email_change_token_new, recovery_token
      ) values (
        uid, '00000000-0000-0000-0000-000000000000', 'authenticated',
        'authenticated', user_email, hashed, now(),
        '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
        now(), now(), '', '', '', ''
      );

      insert into auth.identities (
        provider_id, user_id, identity_data, provider,
        last_sign_in_at, created_at, updated_at
      ) values (
        uid::text, uid,
        jsonb_build_object('sub', uid::text, 'email', user_email, 'email_verified', true),
        'email', now(), now(), now()
      );

      insert into public.profiles (
        id, role, display_name, bio, city,
        hobbies, languages, personality_traits, visibility
      ) values (
        uid, 'tourist',
        tourist_names[(i % 20) + 1],
        tourist_bios[(i % 10) + 1],
        tourist_cities[(i % 10) + 1],
        string_to_array(tourist_hobby_sets[(i % 10) + 1], ','),
        string_to_array(tourist_language_sets[(i % 10) + 1], ','),
        string_to_array(tourist_trait_sets[(i % 10) + 1], ','),
        'public'
      );
    end if;

    --
    -- GUIDE i
    --
    user_email := 'guide+' || lpad(i::text, 3, '0') || '@test.com';

    if not exists (select 1 from auth.users where email = user_email) then
      uid := gen_random_uuid();

      insert into auth.users (
        id, instance_id, aud, role, email, encrypted_password,
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at, confirmation_token, email_change,
        email_change_token_new, recovery_token
      ) values (
        uid, '00000000-0000-0000-0000-000000000000', 'authenticated',
        'authenticated', user_email, hashed, now(),
        '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
        now(), now(), '', '', '', ''
      );

      insert into auth.identities (
        provider_id, user_id, identity_data, provider,
        last_sign_in_at, created_at, updated_at
      ) values (
        uid::text, uid,
        jsonb_build_object('sub', uid::text, 'email', user_email, 'email_verified', true),
        'email', now(), now(), now()
      );

      insert into public.profiles (
        id, role, display_name, bio, city,
        hobbies, languages, personality_traits, visibility
      ) values (
        uid, 'guide',
        guide_names[(i % 20) + 1],
        guide_bios[(i % 10) + 1],
        'Shenzhen',
        string_to_array(guide_hobby_sets[(i % 10) + 1], ','),
        string_to_array(guide_language_sets[(i % 10) + 1], ','),
        string_to_array(guide_trait_sets[(i % 10) + 1], ','),
        'public'
      );
    end if;

  end loop;
end $$;

-- Quick sanity check (uncomment to run):
-- select role, count(*) from public.profiles where id in (
--   select id from auth.users where email like 'tourist+%@test.com' or email like 'guide+%@test.com'
-- ) group by role;
