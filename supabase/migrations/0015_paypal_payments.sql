-- PayPal as an alternative one-time payment for bookings, alongside Stripe.
-- Run after 0009_booking_payments.sql. Existing paid bookings are Stripe, so
-- payment_provider defaults to null and is set to 'stripe' / 'paypal' when a
-- payment completes. Refunds branch on payment_provider (Stripe vs PayPal).
alter table public.bookings
  add column if not exists payment_provider text
    check (payment_provider in ('stripe', 'paypal')),
  add column if not exists paypal_order_id text,
  add column if not exists paypal_capture_id text;
