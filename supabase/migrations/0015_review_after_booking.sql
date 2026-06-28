-- Allow a tourist to review a guide they booked (a confirmed/approved booking),
-- in addition to the original message-history path. The single-guide booking
-- flow has no messaging, so requiring message history blocked legitimate
-- post-trip reviews. Run after 0014_avatars_size_limit.sql.

drop policy if exists "Reviews: reviewer can insert with message history" on public.reviews;
drop policy if exists "Reviews: reviewer can insert" on public.reviews;
create policy "Reviews: reviewer can insert"
  on public.reviews for insert to authenticated
  with check (
    reviewer_id = auth.uid()
    and reviewer_id <> reviewee_id
    and (
      -- Original path: they've exchanged at least one message.
      exists (
        select 1
        from public.conversations c
        join public.messages m on m.conversation_id = c.id
        where ((c.user_a_id = auth.uid() and c.user_b_id = reviewee_id)
            or (c.user_b_id = auth.uid() and c.user_a_id = reviewee_id))
      )
      -- Booking path: they have a confirmed booking and the reviewee is a guide.
      or (
        exists (
          select 1 from public.bookings b
          where b.tourist_id = auth.uid() and b.status = 'approved'
        )
        and exists (
          select 1 from public.profiles p
          where p.id = reviewee_id and p.role = 'guide'
        )
      )
    )
  );
