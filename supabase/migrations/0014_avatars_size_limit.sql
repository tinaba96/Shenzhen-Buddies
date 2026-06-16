-- Raise the avatars bucket size limit from 5 MB to 10 MB. Uploads are
-- compressed client-side, but this leaves headroom if compression is skipped.
-- Run after 0013_cover_image.sql.

update storage.buckets
set file_size_limit = 10485760 -- 10 MB
where id = 'avatars';
