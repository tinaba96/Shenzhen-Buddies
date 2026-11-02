-- Thumbs on reviews. A review now carries a thumb (up/down) and, optionally,
-- a 1–5 star rating; the guide's profile shows both the star average and the
-- number of thumbs up. Until now the post-tour page stored its thumb as 5 or
-- 1 stars, so those rows get their thumb back from the stars.
--
-- Run by hand in the Supabase SQL editor, like 0017–0020, BEFORE deploying
-- the code that writes `thumb` — until then every review submit fails.

alter table public.reviews
  add column if not exists thumb text check (thumb in ('up', 'down'));

-- Stars become optional (the existing 1–5 check still applies when set).
alter table public.reviews alter column stars drop not null;

-- Thumb-era rows were stored as exactly 5 (up) or 1 (down).
update public.reviews set thumb = 'up' where thumb is null and stars = 5;
update public.reviews set thumb = 'down' where thumb is null and stars = 1;

-- Every review says something: a thumb, stars, or both.
alter table public.reviews drop constraint if exists reviews_has_rating;
alter table public.reviews add constraint reviews_has_rating
  check (thumb is not null or stars is not null);
