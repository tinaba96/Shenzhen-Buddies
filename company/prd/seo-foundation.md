# PRD — SEO & Share Foundation (P0)

**Owner:** product-manager · **Build:** `engineer` · **Verify:** `qa-engineer` · **Metrics:** `data-analyst`
**Status:** ready to build · **Est:** 1 dev-day for R1–R3 + R5–R6 and the R7–R10 add-ons — **excludes the R4 OG image**, which is an `art-director` dependency on a separate clock and must not be counted against the engineering day. · **Date:** 2026-08-09

---

## 1. Background

The site has ~10 indexable public routes (`/`, `/explore`, `/about`, `/contact`, `/pricing`, `/welcome`, `/privacy`, `/terms`, `/cancellation`, `/u/[id]`) and **zero SEO infrastructure**:

| Missing | Consequence (measured by reading the repo, not guessed) |
|---|---|
| `app/sitemap.ts` | Google discovers pages only by crawl luck. No Search Console submission possible. |
| `app/robots.ts` | Private routes (`/admin`, `/messages`, `/profile`, `/api`) are crawlable. No sitemap pointer. |
| `metadataBase` in `layout.tsx` | All OG/Twitter image URLs resolve **relative** → link previews break on every share. |
| `opengraph-image` | Every Instagram-bio / WhatsApp / Slack share of the site renders as a bare grey box. |
| JSON-LD | No `Organization` / `Article` / `FAQPage` entity. Invisible to AI answer engines. |
| Canonical URLs | `/explore` and `/explore?x=` are separate documents to a crawler. |

This is a **multiplier**, not a feature. Every blog post and gallery page shipped before this is worth strictly less. Build it first.

## 2. Target KPI (one)

**Indexed-page count in Google Search Console** — from 0 (no property) to ≥ 10 within 21 days of ship.

Secondary observation (not a target): share-preview render rate — a manually verified checklist that a link to `/`, `/explore`, and `/guide` renders a card with image + title in the Facebook Sharing Debugger and X Card Validator. (`/gallery` and `/blog` do not exist at P0; they join the checklist in the sprint that ships them.)

**Hypothesis:** Without a sitemap + `metadataBase`, the Instagram-driven traffic the studio is generating this cycle lands on a site that (a) cannot be indexed reliably and (b) previews as a grey box when a follower shares it. Fixing both costs 1 day and permanently raises the ceiling on every content initiative after it.

## 3. Requirements

### R1 — `app/sitemap.ts`
Next 16 `MetadataRoute.Sitemap` convention (verified in `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md`).

- Include **only routes that exist today**: `/`, `/explore`, `/guide`, `/about`, `/contact`, `/pricing`, `/welcome`, `/privacy`, `/terms`, `/cancellation`.
- `priority`: `/` = 1.0, `/explore` `/guide` = 0.8, legal = 0.3.
- **Do not pre-register `/gallery`, `/blog`, or any blog slug.** A sitemap entry for a 404 is a crawl-trust cost with no upside. Each route is added to `sitemap.ts` **in the sprint that ships it** — this is an explicit acceptance criterion in `gallery.md` and `blog.md`, not a P0 line item.
- **Exclude** `/u/[id]` — user profiles are personal data (PIPL/GDPR surface). Route to `legal-compliance` before ever indexing them.
- Base URL: **import the existing `siteUrl()` from `src/lib/config.ts`** — same helper in `robots.ts` and `layout.tsx`, so all three agree by construction. It already resolves `NEXT_PUBLIC_SITE_URL` against a `DEFAULT_SITE_URL` fallback and strips the trailing slash; do not read `process.env` directly or add a second fallback constant. `NEXT_PUBLIC_SITE_URL` is **already** in `.env.local.example` (line 35) — no new env var, no new doc line. The founder's custom domain, once chosen, is a one-line Vercel env change; **no domain is hardcoded anywhere.**

### R2 — `app/robots.ts`
```
Allow: /
Disallow: /admin, /api, /messages, /profile, /auth, /reset-password, /forgot-password, /u
Sitemap: <SITE_URL>/sitemap.xml
```

### R3 — `metadataBase` + default OG in `src/app/layout.tsx`
Extend the existing `metadata` export with `metadataBase: new URL(siteUrl())` (same import as R1), `openGraph` (type `website`, siteName, locale `en_US`), `twitter: { card: 'summary_large_image' }`, and `alternates.canonical: '/'`.

### R4 — Static OG images
`app/opengraph-image.png` (1200×630) as the site-wide default. Route the design to `art-director` — brand palette per `marketing/brand-brief.md`, positioning line "Don't tour Shenzhen. Have a friend there." Per-route overrides (`app/blog/opengraph-image.png`, `app/gallery/opengraph-image.png`) are **v1.1, not v1**.

### R5 — `Organization` JSON-LD in the root layout
Per `node_modules/next/dist/docs/01-app/02-guides/json-ld.md`, including the mandatory `.replace(/</g, '\\u003c')` XSS scrub. Fields: `name`, `url`, `logo`, `description`, `sameAs` (Instagram once live).

### R6 — Per-page canonicals
Add `alternates: { canonical: '<path>' }` to the existing `metadata` export on `/explore`, `/about`, `/contact`, `/pricing`, `/welcome`.

### R7 — Exclude `/sitemap.xml` and `/robots.txt` from the proxy matcher (~10 min)
`src/proxy.ts` currently matches everything except `_next/*`, `favicon.ico`, and image extensions. Both new metadata routes would therefore run `updateSession()` — a Supabase auth round-trip — on **every crawler hit**. Add `sitemap.xml` and `robots.txt` to the negative lookahead alongside `favicon.ico`. Cheap, and it keeps a bot from touching the auth path at all.

### R8 — A GA4 `track()` helper in `src/lib/analytics.ts` (~0.5 day)
`src/components/Analytics.tsx` today loads gtag and emits **one `gtag('config')` call and nothing else** — there is no event API anywhere in the repo. Every instrumentation table in `gallery.md` and `blog.md` is therefore unbuildable until this exists. It is a **dependency of both**, so it ships here.

- `track(event: string, params?: Record<string, string | number | boolean>)`, typed, callable from client components.
- **No-ops safely** when `NEXT_PUBLIC_GA_ID` is unset or `window.gtag` is undefined (dev, preview, and SSR must never throw).
- **Consent behavior, stated so it is not decided by accident:** GA4 loads only when `NEXT_PUBLIC_GA_ID` is set, so environment is the current consent gate — there is no cookie banner today. `track()` sends **no PII**: no email, no `user_id`, no free-text, no message content. Params are enum-ish strings and counts only. If `legal-compliance` later requires a consent banner for EU/UK visitors, `track()` is the single choke point that gets gated — which is the main reason it is one function rather than scattered `gtag()` calls.

### R9 — Close the Instagram loop (~0.5 day)
The company is actively spending on Instagram this cycle, and today a click from the bio arrives **untagged and unattributable**, with no path back. Three small pieces:

- **UTM convention**, documented in `README.md` so the studio applies it unprompted: `?utm_source=instagram&utm_medium=social&utm_campaign=<slug>` on every bio and story link. Without it, Instagram traffic is indistinguishable from direct and the gallery/blog KPIs are unreadable.
- **IG handle in the footer** and in the R5 `sameAs` array — the field is already reserved there.
- **One "seen on Instagram" module**: a single footer or landing strip linking to the profile. One surface, not a per-page treatment.

Instagram is the only live traffic source; making it measurable and bidirectional beats any single page here.

### R10 — A WebP conversion script for founder photos (~15 lines)
The founder is shooting photos this week; without this they arrive as multi-MB JPEGs and blow the ≤300 KB budget in `gallery.md`. Add `scripts/img.mjs` using **`sharp`, which is already present as a transitive Next dependency** — no new package. Reads a source dir, resizes longest edge to 1600px, converts to WebP, writes to `public/gallery/`, prints each output's `width`/`height`/KB so the `GalleryItem` fields can be pasted in. Document the one-line invocation in `README.md`. Fifteen lines that remove a manual step from every photo, forever.

## 3b. Sequencing (this supersedes the P0/P1/P2 labels on the three PRDs)

Ordered by revenue proximity, not by document. Each step is shippable alone.

| # | Step | Why here |
|---|---|---|
| 1 | **CTA / public-preview fix + OG image (R4) + `metadataBase` (R3)** | The live funnel defect. Anonymous visitors now get a read-only `/guide` preview, so every content CTA points at `/guide` (or `/browse`) directly instead of a login wall. Shares stop rendering as grey boxes. Nothing else compounds until traffic that arrives can convert. |
| 2 | **Replace stock photos on `/` and `/guide`** (`gallery.md` R2) | `/guide` is the page that closes the booking and `/` is the page that receives the Instagram click. Both currently sell "places only locals know" with stock imagery of somewhere else. Higher-traffic and higher-intent than `/explore`. |
| 3 | **Instagram loop (R9)** + **`track()` helper (R8)** | Makes step 1 and 2 measurable. Instrument before building more surfaces, not after. |
| 4 | **12-photo gallery** (`gallery.md`) | Now cheap: the asset pipeline (R10) and the event API (R8) already exist. |
| 5 | **`sitemap.ts` / `robots.ts` / JSON-LD (R1, R2, R5, R6, R7)** | Indexing has a 2–8 week lag but zero conversion effect. It pays off later, so it is scheduled once the routes it should list actually exist. |
| 6 | **Blog** (`blog.md`) | Last, and still gated. Reassess against guide-supply work before starting. |

## 4. Out of scope

Dynamic OG image generation (`ImageResponse`) · hreflang / i18n · `/u/[id]` indexing · Bing/Yandex verification · schema for reviews (needs real reviews first — fabricating them is a trust violation) · paid SEO tooling.

## 5. Acceptance criteria

1. `npm run lint` and `npm run build` pass.
2. `curl localhost:3000/sitemap.xml` returns valid XML containing every route listed in R1 and **no URL that 404s** — specifically no `/gallery`, no `/blog`, no `/u/`, no `/admin`.
3. `curl localhost:3000/robots.txt` contains the `Sitemap:` line with an absolute URL.
4. No file in the diff contains a hardcoded domain string; `sitemap.ts`, `robots.ts`, and `layout.tsx` all resolve their base URL through `siteUrl()`.
5. View-source on `/` shows absolute `og:image`, `og:title`, `og:description`, `twitter:card`, `<link rel="canonical">`.
6. `Organization` JSON-LD passes the Rich Results Test (or `validator.schema.org`) with 0 errors, and `sameAs` contains the Instagram profile.
7. No `dangerouslySetInnerHTML` without the `<` scrub.
8. `/sitemap.xml` and `/robots.txt` do not invoke the Supabase session proxy (verify: no auth call in the server log on a cold `curl`).
9. `track()` is a no-op — not a throw — with `NEXT_PUBLIC_GA_ID` unset, and with GA enabled a test event appears in GA DebugView carrying no PII.
10. `scripts/img.mjs` converts a sample JPEG to a WebP ≤ 300 KB and prints usable `width`/`height`.

## 6. Measurement

Founder task (one-way door — needs founder action, not engineer): verify the domain in Google Search Console and submit `/sitemap.xml`. `data-analyst` reads indexed-count weekly.

## 7. Strongest case against

*"Nobody is searching for this site; sitemaps on a zero-traffic domain do nothing."*
Half true — a sitemap alone generates no demand. It is justified anyway because (a) `metadataBase` + OG image fix a **live** defect on the Instagram funnel the company is actively feeding this cycle, and (b) indexing has a 2–8 week lag, so it must be paid for before content exists, not after. If we only did one thing here, it would be R3 + R4.
