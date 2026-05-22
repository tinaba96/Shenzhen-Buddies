# Shenzhen-Buddies

Peer-to-peer travel buddy matching, starting in Shenzhen. International
travelers find a local who shares their interests; the local shows them around.

**Stack:** Next.js 16 (App Router), TypeScript, Tailwind v4, Supabase
(Auth + Postgres), deployed on Vercel.

## MVP slice

Auth (email + password) and profile creation/edit. Matching, chat, reviews,
notifications, and subscriptions come later.

## Local setup

1. **Supabase project** — create one (or use an existing one) and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public API key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Environment variables**
   ```bash
   cp .env.local.example .env.local
   # paste the URL and anon key into .env.local
   ```

3. **Database schema** — open the Supabase SQL editor and run
   `supabase/migrations/0001_init.sql`. This creates the `profiles` table and
   row-level security policies.

4. **Auth settings** (Supabase dashboard → Authentication → URL Configuration)
   - **Site URL:** `http://localhost:3000` (and your Vercel URL once deployed)
   - **Redirect URLs:** add `http://localhost:3000/auth/confirm` and the
     production equivalent.

   For fast pilot testing you can turn **off** "Confirm email" under
   Authentication → Providers → Email. Re-enable it before any real launch.

5. **Run**
   ```bash
   npm run dev
   ```
   Open <http://localhost:3000>.

## Deploy to Vercel

1. Push to GitHub, import the repo in Vercel.
2. Add the two `NEXT_PUBLIC_SUPABASE_*` env vars in the Vercel project
   settings.
3. Update Supabase Auth → URL Configuration with your Vercel URL.

## Code layout

```
src/
  app/
    page.tsx                 landing
    login/                   email + password login
    signup/                  email + password signup
    profile/                 protected: create / edit profile
    auth/confirm/route.ts    email-confirmation callback
    layout.tsx               root layout
  lib/supabase/
    client.ts                browser client (use in client components)
    server.ts                server client (server components, actions)
    proxy.ts                 session-refresh helper for proxy.ts
  proxy.ts                   runs the session refresh on every request
supabase/
  migrations/0001_init.sql   profiles table + RLS policies
```

> Note: in Next.js 16, middleware was renamed to **proxy**. The file is
> `src/proxy.ts`, exporting a `proxy` function. Same purpose as the old
> middleware.
