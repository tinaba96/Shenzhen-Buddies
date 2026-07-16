# Shenzhen Buddies

By **Tensai Tech Inc.** — peer-to-peer travel buddy matching, starting in
Shenzhen. International travelers find a local who shares their interests;
the local shows them around.

> Repo slug remains `shenzhen-buddies` (lowercase, hyphenated) for npm/URL
> conventions, but anywhere user-facing the product is "Shenzhen Buddies".

**Stack:** Next.js 16 (App Router), TypeScript, Tailwind v4, Supabase
(Auth + Postgres + Storage + Realtime), Stripe (subscriptions), deployed on
Vercel.

## Features

- Email + password auth (with email-confirm route handler)
- Profile creation/edit with photo upload (Supabase Storage)
- Browse other profiles, filtered by role / city, sorted by match score
- Match scoring: shared languages + hobbies + traits + same-city bonus +
  complementary-role bonus
- Profile detail pages at `/u/[id]`
- 1:1 direct messaging with Supabase Realtime; unread badges per conversation
- Reviews & ratings (1–5 stars + optional text), only writeable once you and
  the reviewee have exchanged at least one message; profile reviews appear
  publicly once the threshold of 3+ reviews is reached
- Subscriptions via Stripe Checkout with 14-day free trial and a customer
  portal (`/pricing`)

## Local setup

1. **Supabase project** — create one (or use an existing one) and copy from
   Settings → API:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only secret;
     used by the Stripe webhook to write rows that bypass RLS)

2. **Environment variables**
   ```bash
   cp .env.local.example .env.local
   # paste values from Supabase + Stripe into .env.local
   ```

3. **Database schema** — open the Supabase SQL editor and run each migration
   **in order**:
   - `supabase/migrations/0001_init.sql` — `profiles` + RLS
   - `supabase/migrations/0002_avatars.sql` — `avatar_path` column + public
     `avatars` storage bucket
   - `supabase/migrations/0003_chat.sql` — `conversations`, `messages`,
     RLS, `get_or_create_conversation` RPC, Realtime publication
   - `supabase/migrations/0004_reviews.sql` — `reviews` + RLS (insert
     requires prior message history)
   - `supabase/migrations/0005_notifications.sql` — per-user `last_read_at`
     on conversations + `mark_conversation_read` RPC
   - `supabase/migrations/0006_subscriptions.sql` — `subscriptions` mirror
     of Stripe state (only needed if you wire up Stripe)
   - `supabase/migrations/0007_match_role_constraint.sql` — guide↔tourist
     constraint on conversations
   - `supabase/migrations/0008_bookings.sql` — `availability_windows` +
     `bookings` for the single-guide beta (one booking per day, enforced by
     an exclusion constraint)
   - `supabase/migrations/0009_booking_payments.sql` — adds Stripe payment
     columns + `pending_payment` hold state to `bookings`
   - continue running the remaining files **in order** through
     `supabase/migrations/0015_paypal_payments.sql` (0015 adds PayPal columns
     — `payment_provider`, `paypal_order_id`, `paypal_capture_id`)

4. **Auth settings** (Supabase dashboard → Authentication → URL Configuration)
   - **Site URL:** `http://localhost:3000` (plus your Vercel URL once deployed)
   - **Redirect URLs:** add `http://localhost:3000/auth/confirm` (plus the
     production equivalent).
   - For pilot testing you can turn **off** "Confirm email" under
     Authentication → Providers → Email. Re-enable before public launch.

5. **Stripe** — powers premium subscriptions (`/pricing`) **and** one-time
   booking payments (`/guide`). Leave `STRIPE_SECRET_KEY` blank during pilot to
   disable both: bookings then skip checkout and go straight to admin review.
   - Create a Stripe account, switch to **test mode**.
   - (Subscriptions only) Create a **Product** with a recurring **Price** and
     copy the price ID (`price_...`).
   - Copy your test secret key (`sk_test_...`).
   - Configure a webhook endpoint at `<your-site-url>/api/stripe/webhook`
     listening for:
     - `checkout.session.completed` — confirms a paid booking / subscription
     - `checkout.session.expired` — frees the held day if a booking checkout
       is abandoned
     - `customer.subscription.created/updated/deleted` — subscription sync
     Copy its signing secret (`whsec_...`).
   - Paste into `.env.local`: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
     `NEXT_PUBLIC_STRIPE_PRICE_ID` (price ID only needed for subscriptions).
   - Booking pricing is a flat CA$10/hour (5–15h), set in `src/lib/booking.ts`
     (`HOURLY_RATE_CENTS`, `CURRENCY`). Declining a paid booking auto-refunds.
   - Promo codes are managed in the Stripe dashboard (Coupons → Promotion
     codes). They're validated via Stripe and applied to **both** card and
     PayPal from a single field on the payment page. A 100%-off code makes a
     free booking (hides PayPal, uses the $0 card path).

6. **PayPal** (optional second booking-payment method)
   - After the booking form, tourists land on a payment page
     (`/guide/pay/[id]`) offering **card (Stripe)** and, if configured,
     **PayPal**. Leave the PayPal vars blank to show card only.
   - Create an app at <https://developer.paypal.com/dashboard/> — the Sandbox
     and Live tabs each expose a **Client ID** and **Secret** (different pairs).
   - Paste into `.env.local`: `PAYPAL_ENV` (`sandbox` or `live`),
     `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, and
     `NEXT_PUBLIC_PAYPAL_CLIENT_ID` (same value as `PAYPAL_CLIENT_ID`).
   - `PAYPAL_ENV` must match the credentials pasted — sandbox keys against
     `sandbox`, live keys against `live`, or PayPal returns `401
     invalid_client`. Test with a Sandbox buyer account (Developer dashboard →
     Testing Tools → Sandbox Accounts).
   - Declining or cancelling a PayPal booking refunds via PayPal automatically
     (Stripe bookings refund via Stripe) — the app routes refunds by provider.

7. **Single-guide beta mode** (optional)
   - Sign the operator's guide up as a normal **guide** account and fill in
     their profile.
   - Set `OFFICIAL_GUIDE_ID` to that account's auth user id (Supabase
     dashboard → Authentication → Users). While it is set, `/browse`
     redirects to `/guide`, where tourists book that guide (5–15 hour slots)
     instead of matching. Unset it to restore the matching experience.
   - Set `ADMIN_EMAILS` (comma-separated) — those accounts get an **Admin**
     nav link to `/admin` to publish availability and approve/decline
     requests.
   - Set `GMAIL_USER` + `GMAIL_APP_PASSWORD` (+ optional `EMAIL_FROM`) for
     booking emails (new request → admins; approve/decline → tourist). On the
     Gmail account, turn on 2-Step Verification and generate an **App
     password** (Google Account → Security → App passwords); paste it into
     `GMAIL_APP_PASSWORD`. Gmail sends the mail itself, so the `@gmail.com`
     From reaches inboxes without owning a domain. Leave blank locally and
     emails are logged to the server console instead.

8. **Run**
   ```bash
   npm run dev
   ```
   Open <http://localhost:3000>.

## Deploy to Vercel

1. Push to GitHub, import the repo in Vercel.
2. Add env vars in Vercel project settings:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, and the three `STRIPE_*` /
   `NEXT_PUBLIC_STRIPE_PRICE_ID` if you're enabling subscriptions. For the
   single-guide beta also add `OFFICIAL_GUIDE_ID`, `ADMIN_EMAILS`,
   `GMAIL_USER`, `GMAIL_APP_PASSWORD`, and `EMAIL_FROM`. To enable PayPal add
   `PAYPAL_ENV` (`live`), `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, and
   `NEXT_PUBLIC_PAYPAL_CLIENT_ID`.
3. Update Supabase Auth → URL Configuration with your Vercel URL.
4. In Stripe, edit the webhook endpoint to point at your Vercel URL.

## Code layout

```
src/
  app/
    page.tsx                       landing
    login/                         email + password login
    signup/                        email + password signup
    profile/                       protected: create / edit profile
    browse/                        protected: discover other profiles
    u/[id]/                        public profile detail + review form
    messages/                      conversations list
    messages/[id]/                 thread view (client realtime)
    pricing/                       subscription page (Stripe Checkout)
    auth/confirm/route.ts          email-confirmation callback
    api/stripe/webhook/route.ts    Stripe webhook handler
    layout.tsx                     root layout (header + footer)
  components/
    Avatar.tsx                     image / initials fallback
    SubmitButton.tsx               useFormStatus pending state
    StarRating.tsx                 display + input variants
  lib/
    avatars.ts                     public-URL helper
    matching.ts                    score function for browse
    stripe.ts                      Stripe SDK + entitlement helper
    supabase/
      client.ts                    browser client
      server.ts                    server client (cookies-bound)
      admin.ts                     service-role client (webhook only)
      proxy.ts                     session refresh in src/proxy.ts
  proxy.ts                         runs on every request
supabase/
  migrations/                      run in order in the SQL editor
```

> **Note:** Next.js 16 renamed middleware to **proxy**. The file is
> `src/proxy.ts`, exporting a `proxy` function. Same purpose as the old
> middleware. Production build must use webpack
> (`"build": "next build --webpack"` in package.json) — the default
> Turbopack output skips build-traces that Vercel's adapter needs to
> register serverless functions.
