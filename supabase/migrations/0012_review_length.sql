-- Raise the review body length limit from 500 to 5000 chars.
-- Run after 0011_consent.sql.

alter table public.reviews drop constraint if exists reviews_body_check;
alter table public.reviews add constraint reviews_body_check
  check (body is null or length(body) <= 5000);
