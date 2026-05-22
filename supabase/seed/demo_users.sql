-- Seed 20 tourist + 20 guide demo accounts with rich varied profiles.
--
-- ============================================================================
-- WARNING — RUN IN A DEV/STAGING SUPABASE PROJECT ONLY.
-- ============================================================================
-- Inserts directly into auth.users / auth.identities (bypassing the Auth API),
-- then inserts public.profiles rows. Safe in your own project. Never run
-- against a shared/production auth database.
--
-- Emails:  tourist+000…019@test.com   /   guide+000…019@test.com
-- Password: password
--
-- Each profile gets a unique deterministic photo from pravatar.cc, stored
-- in profiles.avatar_path as a full URL. The Next.js `avatarPublicUrl()`
-- helper passes external URLs through unchanged.
--
-- Idempotent on re-run (skips emails that already exist).
--
-- Clean up:
--   delete from auth.users
--     where email like 'tourist+%@test.com' or email like 'guide+%@test.com';
--   (cascade removes profiles, conversations, messages, reviews)
--
-- Pre-reqs:
--   - 0001 … 0005 migrations applied
--   - Auth → Providers → Email → "Confirm email" is OFF
--   - pgcrypto extension (enabled by default on Supabase)

do $$
declare
  i int;
  uid uuid;
  user_email text;
  hashed text;

  --
  -- 20 TOURISTS
  --
  t_name text[] := array[
    'Sarah Kennedy', 'Marco Rossi', 'Anna Schmidt', 'Carlos García', 'Liam O''Brien',
    'Sofia López', 'Olivia Wilson', 'Noah Lee', 'Isabella Park', 'Aiden Nguyen',
    'Mia Chen', 'Lucas Müller', 'Zoe Tanaka', 'Emma Dubois', 'Ethan Williams',
    'Charlotte Bergström', 'Mason Fernandez', 'Amelia Hartmann', 'Logan Kovács', 'Harper Jansen'
  ];

  t_city text[] := array[
    'London', 'Milan', 'Berlin', 'Madrid', 'Dublin',
    'Mexico City', 'Toronto', 'Seoul', 'San Francisco', 'Ho Chi Minh City',
    'Vancouver', 'Hamburg', 'Tokyo', 'Paris', 'Sydney',
    'Stockholm', 'Buenos Aires', 'Vienna', 'Budapest', 'Amsterdam'
  ];

  t_bio text[] := array[
    'Two-week visit to test if Shenzhen feels like the future people say it does. Marketing PM by trade, photographer on weekends. Want hidden tea houses + a serious dim sum crawl.',
    'Architect from Milan studying the new skyline up close. Trading espresso etiquette for a guided walk through the SEG Plaza district. Italian/English/limited Spanish — please don''t expect Mandarin.',
    'Backpacking through southern China. Slow travel, real food, no tour buses. Looking for someone who can decode a Cantonese menu and split a Tsingtao with me.',
    'Software dev visiting from Madrid — show me Huaqiangbei? Want to build a custom keyboard and eat my body weight in xiaolongbao.',
    'Photographer chasing golden hour. Skyline spots wanted. I''ll trade Dublin pub recommendations for the best rooftop in Futian.',
    'Designer and illustrator, three days in OCT-Loft. Need someone who knows the galleries that don''t show up on Xiaohongshu.',
    'Heading to Dafen for the painting alleys, with a side quest for the best independent bookstores in Shenzhen. Bring snacks.',
    'On a 36-hour layover. Make it count: street-level food + the wildest building in the city. Will pay in karaoke duets.',
    'Yoga teacher, looking for quiet parks and great vegetarian food. I love the chaos of cities but need green space to recover.',
    'Visiting cousins — would love to see Shenzhen through a local''s eyes. Vietnamese in soul, fluent in pho-induced euphoria.',
    'Chinese-Canadian, finally visiting the country my parents left at twenty. Conversational Mandarin (barely). Bring patience and snacks.',
    'Electronics engineer here for Huaqiangbei. Want to find weird breakouts, eat dumplings, and not get lost in the metro.',
    'Designer from Tokyo, here for a week. Want to see how Shenzhen does design differently. Karaoke night non-negotiable.',
    'Art student visiting for the OCT-Loft scene. Hoping to meet working artists, eat well, and get lost in book markets.',
    'Bouldering trip — anyone climb here? Otherwise I''ll settle for hiking and street food. Open to anything.',
    'Architect researching contemporary residential towers. Recommendations for the most surprising buildings welcome.',
    'Tango dancer and food obsessive. Will follow anyone to the best beef and the smokiest dive bar in town.',
    'Music student visiting a friend. Open to any live music — jazz, indie, classical. Coffee shop recommendations also welcome.',
    'Photographer and travel writer. Want the city that doesn''t make it into magazines.',
    'Cycling around southern China for a month. Need to find bike-friendly routes and the best banh mi outside Vietnam.'
  ];

  t_hobbies text[] := array[
    'photography,tea,dim sum,architecture,hiking,jazz',
    'architecture,coffee,design,sketching,walking,wine',
    'street food,markets,hiking,trains,history,reading',
    'electronics,3D printing,makers,gaming,beer,running',
    'photography,rooftops,sunsets,whiskey,music,storytelling',
    'art,illustration,galleries,mezcal,vintage shopping,coffee',
    'painting,bookstores,museums,coffee,walking,podcasts',
    'food,architecture,K-pop,running,karaoke,coffee',
    'yoga,vegetarian food,parks,meditation,journaling,hiking',
    'pho,coffee,scooters,music,family meals,markets',
    'family history,calligraphy,bookstores,tea,museums,markets',
    'electronics,soldering,dumplings,beer,techno,running',
    'design,karaoke,coffee,sneakers,illustration,architecture',
    'art,books,wine,vintage,sketching,museums',
    'bouldering,hiking,surfing,coffee,beer,trail running',
    'architecture,design,coffee,minimalism,hiking,reading',
    'tango,food,bars,music,running,books',
    'live music,jazz,coffee,piano,reading,walking',
    'photography,writing,coffee,whiskey,trains,markets',
    'cycling,trails,coffee,beer,gravel riding,markets'
  ];

  t_lang text[] := array[
    'English,French',
    'Italian,English,Spanish',
    'German,English',
    'Spanish,English,Portuguese',
    'English,Irish',
    'Spanish,English,French',
    'English,French,Mandarin',
    'Korean,English',
    'English,Korean',
    'Vietnamese,English,Mandarin',
    'English,Mandarin',
    'German,English',
    'Japanese,English',
    'French,English',
    'English',
    'Swedish,English,German',
    'Spanish,English,Italian',
    'German,English,French',
    'Hungarian,English,German',
    'Dutch,English,German'
  ];

  t_traits text[] := array[
    'curious,outgoing,patient,observant',
    'creative,thoughtful,direct,energetic',
    'easygoing,curious,relaxed,witty',
    'playful,fast,direct,curious',
    'observant,quiet,creative,patient',
    'creative,warm,curious,observant',
    'quiet,curious,thoughtful,kind',
    'energetic,decisive,fun,outgoing',
    'calm,thoughtful,warm,patient',
    'warm,easygoing,curious,playful',
    'curious,thoughtful,kind,observant',
    'focused,detail-oriented,direct,curious',
    'creative,playful,observant,quiet',
    'creative,curious,thoughtful,warm',
    'adventurous,easygoing,fun,energetic',
    'thoughtful,quiet,detail-oriented,curious',
    'passionate,energetic,warm,fun',
    'thoughtful,observant,kind,calm',
    'observant,patient,curious,witty',
    'easygoing,energetic,relaxed,curious'
  ];

  --
  -- 20 GUIDES (all Shenzhen-based)
  --
  g_name text[] := array[
    'Lin Chen', 'Wei Zhang', 'Mei Wang', 'Hao Liu', 'Yan Zhao',
    'Ling Sun', 'Bo Wu', 'Yu Zhou', 'Xin Hu', 'Min Tang',
    'Tao Yang', 'Hua Li', 'Jing Chen', 'Feng Wang', 'Bao Liu',
    'Qiang Zhao', 'Ming Sun', 'Lei Wu', 'Lan Zhou', 'Yong Hu'
  ];

  g_bio text[] := array[
    'Born here, grew up in Luohu, now in Futian. I know every alley shortcut and every dim sum cart. Architecture geek on weekends.',
    'Designer at OCT-Loft, gallery openings most weeks. Coffee snob, late-night dumpling apologist. Let me show you the art scene.',
    'Tea ceremony enthusiast. I run a small teahouse off Shennan Road and know every leaf farmer in Yunnan worth visiting.',
    'Software engineer by day, food-stall connoisseur by night. Huaqiangbei is my second home. Will rate every bao with you on a 10-point rubric.',
    'Yoga instructor and trail runner. Best parks, best brunch, best quiet morning spots. Looking for people who like to start the day moving.',
    'Native Cantonese speaker, English teacher. Weekend hiker — I know every trail in Wutong Mountain. Patient with beginners.',
    'Photographer obsessed with rooftops and golden hour. Will get us to the best skyline view in the city, no permission slips required.',
    'Architect, second-generation Shenzhener. My grandfather was a fisherman in Shekou before all of this. Long memory, lots of stories.',
    'Maker and electronics hobbyist. I shop Huaqiangbei like a second home. Drone builder, weekend solderer, mediocre baker.',
    'Chef at a small Sichuanese spot in Nanshan. I''ll take you somewhere even my mother doesn''t know about.',
    'Bookstore owner in OCT — small shop, mostly Chinese literature in translation. Tea and slow afternoons.',
    'DJ at a small Nanshan club. Underground scene insider. Take you to the spots tourists never find.',
    'Architect, runner, hiker. Started rock climbing last year and now I can''t shut up about it. Patient with first-timers.',
    'Marketing manager, foodie. I have a spreadsheet of every dim sum place worth visiting in greater Shenzhen and Hong Kong. Yes, really.',
    'Painter at Dafen — yes, I do reproductions, but my originals are upstairs. Coffee and canvas is my idea of a perfect day.',
    'Software architect, daily Wutong Mountain hiker. Looking to share my favorite trail variations with travelers.',
    'Translator, foodie, casual karaoke threat. Mandarin / Cantonese / English / passable Korean. Will translate menus with commentary.',
    'Coffee roaster — own a small place near Nanshan park. Will geek out about beans for as long as you''ll listen.',
    'Photographer and travel planner. Worked at a magazine for ten years. Now freelance, doing what I want, where I want.',
    'Marketer and amateur historian. I''ll tell you why every neighborhood is named what it''s named. Patient with questions.'
  ];

  g_hobbies text[] := array[
    'dim sum,architecture,running,karaoke,jazz,cooking',
    'art,design,coffee,galleries,illustration,jazz',
    'tea,calligraphy,history,reading,hiking,porcelain',
    'electronics,makers,street food,bao,gaming,running',
    'yoga,running,brunch,tea,journaling,trails',
    'hiking,trails,Cantonese cuisine,teaching,reading,birds',
    'photography,rooftops,sunsets,coffee,running,whiskey',
    'architecture,history,running,calligraphy,tea,seafood',
    'electronics,3D printing,drones,baking,coffee,gaming',
    'cooking,Sichuanese food,markets,fermentation,wine,reading',
    'books,tea,calligraphy,reading,walking,vinyl',
    'DJing,vinyl,techno,bars,coffee,karaoke',
    'running,hiking,climbing,architecture,coffee,sketching',
    'dim sum,spreadsheets,wine,running,reading,karaoke',
    'painting,art,coffee,jazz,sketching,markets',
    'hiking,trails,software,beer,reading,birds',
    'translation,karaoke,food,wine,jazz,reading',
    'coffee,roasting,running,jazz,reading,dim sum',
    'photography,writing,travel planning,wine,running,markets',
    'history,museums,books,tea,calligraphy,walking'
  ];

  g_lang text[] := array[
    'Mandarin,Cantonese,English',
    'Mandarin,English,Japanese',
    'Mandarin,Cantonese,English',
    'Mandarin,English',
    'Mandarin,English,French',
    'Mandarin,Cantonese,English',
    'Mandarin,English',
    'Mandarin,Cantonese,English',
    'Mandarin,English',
    'Mandarin,Cantonese,English',
    'Mandarin,English',
    'Mandarin,English,Korean',
    'Mandarin,English',
    'Mandarin,Cantonese,English',
    'Mandarin,English',
    'Mandarin,English,German',
    'Mandarin,Cantonese,English,Korean',
    'Mandarin,English',
    'Mandarin,English,French',
    'Mandarin,Cantonese,English'
  ];

  g_traits text[] := array[
    'warm,welcoming,patient,observant',
    'creative,thoughtful,curious,playful',
    'calm,patient,thoughtful,observant',
    'focused,witty,sharp,fun',
    'calm,warm,thoughtful,patient',
    'kind,patient,energetic,observant',
    'observant,creative,fun,detail-oriented',
    'thoughtful,patient,wise,warm',
    'curious,resourceful,sharp,playful',
    'warm,patient,generous,observant',
    'quiet,thoughtful,patient,kind',
    'energetic,fun,outgoing,playful',
    'energetic,patient,direct,curious',
    'fun,direct,detail-oriented,warm',
    'creative,quiet,observant,thoughtful',
    'calm,reliable,observant,patient',
    'warm,witty,outgoing,sharp',
    'thoughtful,curious,patient,direct',
    'creative,direct,observant,kind',
    'patient,thoughtful,wise,warm'
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
        hobbies, languages, personality_traits, visibility, avatar_path
      ) values (
        uid, 'tourist',
        t_name[i + 1],
        t_bio[i + 1],
        t_city[i + 1],
        string_to_array(t_hobbies[i + 1], ','),
        string_to_array(t_lang[i + 1], ','),
        string_to_array(t_traits[i + 1], ','),
        'public',
        'https://i.pravatar.cc/300?u=' || user_email
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
        hobbies, languages, personality_traits, visibility, avatar_path
      ) values (
        uid, 'guide',
        g_name[i + 1],
        g_bio[i + 1],
        'Shenzhen',
        string_to_array(g_hobbies[i + 1], ','),
        string_to_array(g_lang[i + 1], ','),
        string_to_array(g_traits[i + 1], ','),
        'public',
        'https://i.pravatar.cc/300?u=' || user_email
      );
    end if;

  end loop;
end $$;

-- Sanity check (uncomment):
-- select role, count(*) from public.profiles where id in (
--   select id from auth.users where email like 'tourist+%@test.com' or email like 'guide+%@test.com'
-- ) group by role;
