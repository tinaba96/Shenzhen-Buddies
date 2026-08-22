-- The Premium subscription was removed from the product (2026-08): the perks
-- it advertised were never enforced anywhere in the app, and a per-booking
-- marketplace has no use for a tourist-side recurring charge. The table only
-- ever mirrored Stripe state, so dropping it loses nothing Stripe holds.
-- 0006_subscriptions.sql stays in history; this reverses it.

drop table if exists public.subscriptions;
