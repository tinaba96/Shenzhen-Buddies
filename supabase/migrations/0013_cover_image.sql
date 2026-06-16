-- Optional profile cover/background image. Stored in the existing public
-- "avatars" bucket at <user-id>/cover.<ext>, so no new bucket or policy is
-- needed. Run after 0012_review_length.sql.

alter table public.profiles add column if not exists cover_path text;
