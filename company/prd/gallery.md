# PRD — Gallery (Real-Photo Library + `/gallery`) (P1)

**Owner:** product-manager · **Build:** `engineer` · **Verify:** `qa-engineer` · **Safety:** `trust-safety` (consent) · **Assets:** founder + `art-director`
**Status:** ready to build · **Est:** 3 dev-days (engine) + founder photo sourcing · **Date:** 2026-08-09

---

## 1. Background

Two facts make this the highest-value of the three content initiatives:

1. **There is a live credibility defect, and it is bigger than one page.** `src/app/explore/page.tsx` ships with a comment in the source: *"PLACEHOLDER PHOTOS — generic Unsplash imagery, not Shenzhen-specific."* Counted, not estimated: **all 15 Unsplash references on `/explore` are stock**, and Unsplash appears in **12 files site-wide** — including **6 on `/`** and **5 on `/guide`**. So the two pages that matter most are also the two that were not on the original list: `/` receives the Instagram bio click, and `/guide` is where the booking is actually decided. A follower lands on a page selling *"places only locals know"* illustrated by a generic skyline and a close-up of a paint palette. Credibility is the product (`marketing/assets/README.md`).
2. **The current 30-day mission is Instagram + a content library** (`company-brief.md` §1). A structured, typed, reusable photo library is the *same asset* the studio needs for posts. One build, two consumers.

The gallery is not a new destination to be marketed. It is **the asset layer** that `/explore`, `/blog`, `/`, and the studio all read from.

## 2. Target KPI (one)

**Signup rate of sessions that view ≥1 gallery surface, vs. sessions that do not.**
Baseline unknown (pre-launch). Ship instrumentation with the feature; read after 300 gallery sessions.

**Hypothesis:** Replacing stock imagery with real, specific, geotagged Shenzhen photos raises trust enough to lift landing→signup by ≥30% relative. Social proof is the term of the revenue formula this moves — *booking conversion*, not supply, not retention.

**What would make this a NO:** after 300 gallery-touching sessions, signup rate is ≤ non-gallery sessions. Then the gallery is decoration: strip it to a 6-photo strip on `/` and stop producing photos. (This comparison is **observational, not causal** — self-selection is real. `data-analyst` must label it as such. A true A/B test is not worth running below ~1,000 sessions/week.)

## 3. Strategy answers

### Taxonomy: **location-primary, theme-secondary**
One filter axis in v1 — **location** — because it maps 1:1 to the six tiles already on `/explore`, which makes internal linking free and gives the blog its neighborhood pillar for nothing. `themes[]` is stored on every item and used for blog-post image lookup and studio search, but is **not** a second filter row in v1. Two filter axes on ~12 items produces almost entirely empty result sets. The full seven-location table stays as the **type**, so later batches need no migration — but only 2–3 locations have items at launch, and only those render chips.

| `location` id | Label |
|---|---|
| `futian` | Futian — the modern downtown |
| `oct-loft` | OCT-Loft — art & design |
| `dafen` | Dafen Village — oil-painting alleys |
| `huaqiangbei` | Huaqiangbei — electronics megamarket |
| `shekou` | Shekou & the coast |
| `dongmen` | Dongmen — old-town street food |
| `other` | Elsewhere in Shenzhen (not shown as a filter chip) |

`themes`: `food` · `tech` · `art` · `nightlife` · `nature` · `street` · `people`

### Mix — honest version
The requested split (destination / guide spotlight / user experience) cannot be met at launch, because **there are zero completed bookings, therefore zero real traveler-experience photos.** Fabricating them is off-limits.

| Bucket | Launch target (12) | Steady state (post first 20 bookings) |
|---|---|---|
| Place / destination | **~75%** (9 of 12) | 45% |
| Guide / people (consented) | **~25%** (3 of 12) | 30% |
| Traveler experience in progress | **0 at launch** — there are no completed bookings, so there is nothing real to show | 25% |

The guide bucket does double duty: it is supply-side recruitment proof ("people like me do this"), and supply is the company's binding constraint.

### Launch volume: **12 items across 2–3 locations, Huaqiangbei first**
Revised down from 40. That floor was arithmetic for a *complete* filter grid, but completeness is not what v1 buys — v1 exists to be wrong faster. 12 photos is one realistic shooting week and answers the only question that matters: *does real imagery instead of stock change signup rate?*

Concentrate, don't spread: **Huaqiangbei first** (the studio's best hook), then 1–2 more. 6 photos in one location beats 2 in six — invariant 5 will not render a chip that cannot fill a row. 12 covers `/` and `/guide` (R2 ranks 1–2) plus a small `/gallery`; `/explore` finishes as later batches arrive. **Video: none required in v1; cap at 6.**

## 4. Data model

`src/content/gallery.ts` — a typed TS module. **No DB table, no migration, no CMS.** Rationale: content is admin-only and code-deployed (stated constraint); a table means a migration (one-way door per `playbook.md` §1.4) + RLS + an admin UI, for zero added capability.

```ts
export type LocationId =
  | 'futian' | 'oct-loft' | 'dafen' | 'huaqiangbei' | 'shekou' | 'dongmen' | 'other'
export type Theme =
  | 'food' | 'tech' | 'art' | 'nightlife' | 'nature' | 'street' | 'people'

export type GalleryItem = {
  id: string                 // stable kebab id, e.g. 'huaqiangbei-aisle-night-01'
  kind: 'image' | 'video'
  src: string                // '/gallery/<id>.webp' | absolute Supabase Storage URL (video)
  poster?: string            // REQUIRED when kind === 'video'
  width: number              // REQUIRED — intrinsic px, prevents CLS
  height: number             // REQUIRED
  alt: string                // REQUIRED, non-empty, descriptive (a11y + image SEO)
  title: string
  caption?: string           // 1 sentence, brand voice, names the specific thing
  location: LocationId
  themes: Theme[]            // ≥1
  people: 'none' | 'consented'
  consentRef?: string        // REQUIRED when people === 'consented'; source filename per marketing/assets/README.md
  capturedAt?: string        // 'YYYY-MM'
  credit?: string
  relatedPostSlug?: string   // deep-link into /blog/<slug>
  featured?: boolean         // eligible for the landing-page strip
}
```

**Build-time invariants** — implement `assertGalleryValid()` and call it at module load so a violation fails `npm run build`, not production:
1. `id` unique.
2. `people === 'consented'` ⇒ `consentRef` non-empty.
3. `kind === 'video'` ⇒ `poster` set and `src` ends `.mp4`.
4. `alt` non-empty, `themes.length ≥ 1`, `width`/`height` > 0.
5. Every `location` chip rendered has ≥ 4 items, or it is not rendered.

**What invariant 2 does and does not buy** (corrected after `trust-safety` review — the earlier claim that "an unconsented person's photo is not representable in the type" was false):

- **The type prevents an unrecorded consent *claim*. It does not prevent an unconsented *person*.** `people` is one scalar for the whole frame; consent is per person. A consented guide standing in a Huaqiangbei aisle with four recognisable bystanders behind them is a valid `people: 'consented'` item with a valid `consentRef` — it passes `assertGalleryValid()`, passes review, and contains four people who consented to nothing. In a crowded electronics market that is the normal case, not the edge case, and Huaqiangbei is the first location being shot.
- **`consentRef` is checked non-empty, not checked real.** `consentRef: 'x'` passes the build. Nothing in the codebase verifies a ledger record exists behind the token.

Closing the real gap is a **process control, not a type**: the shooting protocol at `marketing/assets/CONSENT.md` — shoot places, not faces; strangers get composition changes (shoot from behind, wait them out, crop below the chin, step back until faces are mush), never a shutter press. The build invariant is the backstop for the protocol, not a substitute for it.

### Asset storage
- **Images → `/public/gallery/`**, committed. WebP, longest edge ≤ 1600px, **≤ 300 KB each** (~4 MB for 12, and still fine for Vercel static well past 100). Conversion uses `scripts/img.mjs` from `seo-foundation.md` R10 — the sharp-based script that also prints the `width`/`height` these items require.
- **Video → Supabase Storage public bucket `gallery`**, not git. MP4/H.264, ≤ 8 MB, ≤ 20 s, muted-loop-friendly, poster frame exported as WebP into `/public/gallery/`.

## 5. Page structure & requirements

### R1 — `/gallery`
- Server component. Header: one line of brand-voice copy, not a title-only page.
- Filter: location chips (`All` + chips with ≥4 items). Implemented as **URL search param** `?loc=huaqiangbei` — server-filtered.
  **Justification, corrected: this is for shareability and zero client JS, not for SEO.** `?loc=` variants canonicalize back to `/gallery` (below), which by design excludes them from search impressions entirely — so no SEO claim can rest on them. What the param actually buys: a filtered view is a **linkable URL** the studio can drop in an Instagram story or a blog post ("every Huaqiangbei shot we have"), it survives a page reload and a back button, and it costs **zero client-side JavaScript** versus a `useState` filter. Those are the reasons; they are sufficient on their own.
- Grid: 2 cols mobile / 3 sm / 4 lg. `next/image` with explicit `width`/`height` and `sizes`. **`priority` on the first 2–4 items only** — one viewport's worth. Eight `priority` images all preload at once, compete with each other and with the LCP element, and reliably *lower* the Lighthouse score this PRD sets at ≥85. Everything below the fold is lazy. **Note:** the codebase currently uses raw `<img>` with an eslint-disable in `/explore`; migrate the gallery to `next/image` and add `remotePatterns` to `next.config.ts` if any remote host remains.
- Lightbox: client component, keyboard `Esc`/`←`/`→`, focus trap, `role="dialog"` + `aria-label`. Shows title, caption, location, and a CTA. Video items: click-to-play, `preload="none"`, `controls`, `playsInline`.
- **CTA in the lightbox and after every 8th grid item** (12 was too wide to ever fire at this volume): "Have a local show you this →". Destination via `isSingleGuideMode()` — `/guide`, else **bare `/browse`**. **`/browse` has no `city` param**, so `?city=Shenzhen` is silently dropped; omit it. Anonymous visitors now get the read-only `/guide` preview, so this CTA must **not** be wrapped in an auth redirect.
- Metadata + canonical `/gallery`; `?loc=` variants get `alternates.canonical: '/gallery'` to avoid thin duplicates.
- **Add `/gallery` to `app/sitemap.ts` in this sprint.** `seo-foundation.md` deliberately ships the sitemap without it, because a sitemap entry for a route that 404s costs crawl trust. The route and its sitemap line land together.
- `ImageGallery` JSON-LD (schema.org), scrubbed per the Next.js JSON-LD guide.

### R2 — Retire the placeholders (this is the point of the initiative)
Every surface reads its images **from `src/content/gallery.ts`** instead of hardcoded Unsplash URLs. **Ranked by traffic × intent, and `/explore` is not first:**

| Rank | Surface | Unsplash refs | Why this order |
|---|---|---|---|
| **1** | **`/` (landing)** | 6 | Receives the Instagram bio click. The first real impression of the company, and the highest-traffic page on the site. |
| **2** | **`/guide`** | 5 | Where the booking decision is made — and now publicly previewable to anonymous visitors, so it is a **first-touch** page, not just a logged-in one. Stock photos on the page that closes the sale are the costliest of the three. |
| **3** | `/explore` | 15 | The most images, but the least intent — a browsing page reached after `/`. Highest total volume, lowest per-photo value. Finish it as later batches arrive. |

At 12 photos, ranks 1 and 2 are fully coverable and `/explore` is not. That is the intended outcome, not a shortfall.

**Per-tile policy:** delete the `PLACEHOLDER PHOTOS` comment only when it is no longer true. A location without real photos keeps its placeholder and the comment stays scoped to that tile. Partial replacement is expected at this volume.

### R3 — Landing-page strip
On `/`, a 6-item horizontal strip of `featured: true` items linking to `/gallery`. Smallest possible surface; no new layout.

### R4 — Nav (**two edit sites, not one**)
`src/app/layout.tsx` does **not** render the header from a single array. Editing only one of these ships a link that appears on mobile but not desktop, or vice versa:

1. **The `navLinks` array (line ~82)** — consumed by `<MobileMenu links={navLinks} …>` (line ~182). Mobile only.
2. **The desktop `<nav>` JSX (lines ~115–146)** — hand-written `<Link>` elements. Desktop only.

Add `Gallery` in **both**, plus the `Product` footer column.

**Placement:** outside the `user &&` conditionals that currently wrap `browseHref`, `/messages`, and `/admin`. `/gallery` is public content whose entire purpose is to reach logged-out visitors arriving from Instagram — gating it behind a session would hide it from exactly the audience it is built for. It sits alongside `Explore`, which is likewise unconditional.

### R5 — Instrumentation (GA4)
**Dependency:** these fire through the `track()` helper specified in `seo-foundation.md` R8. It does not exist yet — `src/components/Analytics.tsx` emits a single `gtag('config')` call and no events. `track()` must ship before or with this feature, or the KPI in §2 is unmeasurable.

| Event | Params |
|---|---|
| `gallery_view` | `loc` (filter active or `all`), `item_count` |
| `gallery_filter` | `loc` |
| `gallery_item_open` | `item_id`, `location`, `kind` |
| `content_cta_click` | `surface: 'gallery'`, `placement: 'lightbox' \| 'grid' \| 'strip'`, `target` |

Definitions and the funnel are owned by `data-analyst` and must be written **before** the queries.

## 6. Out of scope (v1)

Theme filtering as a second chip row · infinite scroll / pagination · user-uploaded photos (a moderation surface — needs `trust-safety` first) · masonry layout · image CDN transforms · likes/shares.

**Per-location `/gallery/[location]` routes.** The original gate — "revisit if `?loc=` pages show organic impressions" — **can never fire**, because `?loc=` variants canonicalize to `/gallery` and are therefore excluded from Search Console impressions by construction. A gate that cannot open is a decision disguised as a criterion.

Reachable replacement — revisit when **either** holds:
- **any single location reaches ≥ 15 items**, at which point it can carry a standalone page that is not thin; **or**
- a `?loc=` link is shared externally (studio post, blog, partner) and GA4 shows **≥ 100 sessions landing on one `loc` value in a month** — measurable today via the `gallery_view` event's `loc` param, no Search Console needed.

At 12 items neither is close, which is the honest answer for v1.

## 7. Acceptance criteria

1. `npm run lint` + `npm run build` pass.
2. Removing `consentRef` from a `people: 'consented'` item **fails the build** (qa-engineer verifies by deliberately breaking it).
3. `/gallery` renders ≥ 12 items; every visible chip returns ≥ 4, and a location with < 4 items renders **no chip** (qa-engineer verifies with a deliberately under-filled location).
4. `/gallery?loc=huaqiangbei` server-renders only that location and is present in view-source (curl with JS disabled).
5. Lightbox: `Esc` closes, arrows navigate, focus returns to the trigger, screen-reader label present.
6. Lighthouse mobile on `/gallery`: Performance ≥ 85, **CLS ≤ 0.05**, Accessibility ≥ 95. No more than 4 images carry `priority`.
7. **`/` and `/guide` contain zero Unsplash URLs.** `/explore` retains them only for locations with no founder photos yet, and its `PLACEHOLDER PHOTOS` comment is scoped to exactly those tiles.
8. `Gallery` appears in the header on **both** mobile and desktop, and is visible **while logged out**.
9. `/gallery` is present in `/sitemap.xml`.
10. No CTA in this feature links to `/browse?city=…`.
11. All four GA4 events fire with correct params (verified in GA DebugView).
12. `trust-safety` sign-off that every `people: 'consented'` item has a real consent record. **Blocking.**

### `trust-safety` verdict (split, 2026-08-09)

- **PASS — `people: 'none'` items.** The 9 of 12 launch photos with no recognisable face carry no consent, PIPL, or portrait-rights exposure. The founder can shoot and ship these this week; nothing in this section gates them.
- **CONDITIONAL BLOCK — the first `people: 'consented'` item**, pending both:
  1. Three code fixes — **applied**.
  2. A cross-border / PIPL question currently open with `legal-compliance`.

This is the practical reading of §9's "still genuinely blocking" line: the faceless three-quarters of the launch set is unblocked, and only the people photos wait.

## 8. Strongest case against

*"A pre-launch marketplace has no social proof to show; a gallery of pretty city photos is a mood board, not a conversion mechanism — and the traveler-experience photos that would actually convert don't exist yet."*
Accepted in part, and it is why the mix is honest (75% place, 0% experience) rather than aspirational. It is still the right build because the alternative is not "no photos" — it is "stock photos of the wrong city," which is actively negative. The kill criterion in §2 is real: if gallery sessions don't convert better, we stop producing photos.

## 9. Founder / studio dependency

**12 real photos this week**, across 2–3 locations, Huaqiangbei first, into `marketing/assets/<topic>/`, shot to the protocol in **`marketing/assets/CONSENT.md`** — which supersedes the `-consented` filename convention: a filename is not a consent record, and `consentRef` carries an opaque ledger ID (`SBC-2026-08-001`), never a person's name.

This is a **sequencing dependency, not a launch gate.** The prior "nothing ships without them" line is withdrawn — it contradicted R2's per-tile policy, and invariant 5 (a chip under 4 items does not render) already makes a small launch safe by construction. Surfaces fill in R2 order as batches arrive.

Still genuinely blocking, unchanged: **no `people: 'consented'` item ships without a real consent record** (§7.12).

**Photo budget vs. the blog.** Blog Pillar 2's original 6–10 images per post is not available at 12 total photos. Resolved both ways: the blog **shares images with `/explore` and the gallery** (one library, several consumers — the stated design), and Pillar 2 drops to **4–6 images**, amended in `blog.md`. Huaqiangbei leads both because it is shot first.
