# PRD — Blog (`/blog`) (P2)

**Owner:** product-manager · **Build:** `engineer` · **Verify:** `qa-engineer` · **Content:** Claude-generated, reviewed by `brand-guardian` · **Metrics:** `data-analyst`
**Status:** ready to build · **Est:** 4 dev-days (engine + 3 posts) · **Date:** 2026-08-09

---

## 1. Background & the honest framing

SEO is a **6–12 month asset**, not a Q3 acquisition channel. On a domain with effectively zero authority, three posts will not produce bookings in 90 days. Anyone who promises otherwise is selling.

So the blog is justified on two narrower, defensible grounds:

1. **AI answer engines reward answer-first structured content faster than Google rewards backlinks.** A tightly-scoped FAQ-schema page answering "can I visit Shenzhen from Hong Kong without a visa" is citable by an assistant in weeks, not quarters. This is the near-term upside and it is a hypothesis (🌱), not a proven channel.
2. **Anxiety-reduction content converts the traffic we already have.** Every post in Pillar 1 answers a question that currently *blocks* a booking (border crossing, payments, language, getting around). These pages are useful as linked assets from Instagram and from `/guide` regardless of whether anyone ever finds them via search.

Ship 3 posts, instrument, gate the rest.

## 2. Target KPI (one)

**Blog-attributed signups** (session whose landing page is under `/blog/`, that later reaches `/signup` completion). Target: **≥ 5 in the 90 days after ship.**

Leading indicator `data-analyst` reads weekly: organic non-brand sessions landing on `/blog/*`.

**Hypothesis:** Travelers researching Shenzhen logistics are pre-decision and high-intent; a post that resolves their specific anxiety and ends with "a local can just do this with you" converts to signup at ≥ 3%.

**Decision rule at day 90** — the original version specified only "0" and "≥5", leaving 1–4 signups undecided, which is the most likely outcome and therefore the one that must be pre-committed:

| Day-90 result | Decision |
|---|---|
| **≥ 5** blog-attributed signups | **Continue.** Hypothesis supported; commission posts 4–8, starting with the best-performing pillar. |
| **1–4** signups **and** organic `/blog/*` sessions **trending up** month over month | **Extend once, do not expand.** Hold at 3 posts, re-read at day 180. The channel is slow, not dead — the 6–12 month lag in §1 predicts exactly this. Zero new dev time; content budget stays on Instagram. |
| **1–4** signups **and** organic sessions **flat or falling** | **Stop writing.** Keep the 3 live as linked assets from Instagram and `/guide`, where they earn their keep regardless of search. |
| **0** signups **and** < 100 organic sessions/month | **Stop writing**, and reallocate the content budget to Instagram and guide recruitment. |

Decision logged by `chief-of-staff`. Note that "continue" is the only branch that spends new money; every other branch preserves the existing posts, because a written post costs nothing to keep and still serves the anxiety-reduction job in §1.2.

## 3. Content pillars (4, ordered by acquisition value)

### Pillar 1 — `logistics` · **Practical entry & getting around** ← the workhorse, 60% of posts
The only bucket with real, winnable long-tail volume. Head terms ("things to do in Shenzhen") are owned by TripAdvisor / Lonely Planet / China Highlights and are unwinnable this year. These are not:

- Hong Kong → Shenzhen as a day trip: which border crossing, how long, what it costs
- China's visa-free / transit-visa entry as it stands for each passport, and what it does and doesn't allow
- **Paying for things in Shenzhen as a foreigner** — foreign cards on WeChat Pay / Alipay, what still needs cash, what fails at a stall
- Internet, eSIM, VPN reality, and which apps actually work for a visitor
- Metro, taxis, and the exact friction points where a language barrier stops you

**Why this pillar wins:** these queries are high-intent, high-anxiety, *and* they decay constantly — incumbent pages go stale, so a genuinely current 2026 page can outrank an older, stronger domain. They also map 1:1 onto the product's value ("a local removes this problem entirely"), so the CTA is honest rather than bolted on.

**Format:** answer-first. The direct answer in the **first 60 words**, then a comparison table, then numbered steps, then a `faq[]` block. **1,200–1,800 words.**

### Pillar 2 — `neighborhoods` · **Neighborhood deep-dives**
One post per `/explore` tile: Huaqiangbei, OCT-Loft, Dafen, Shekou, Futian, Dongmen. Free internal linking in both directions, and shares its images with the gallery library (one asset, three surfaces).
**Format:** photo-heavy guide, **4–6 gallery images** (amended down from 6–10), a "half-day route" section. **900–1,400 words.**

**Why 4–6:** the photo floor in `gallery.md` is now 12 photos across 2–3 locations, so 6–10 *unique* images per neighborhood post is not physically available. Two things are true and both are intentional: the blog **shares images with `/explore` and the gallery** — one library, several surfaces, which is the stated design — and each post stays within one location's batch. The launch neighborhood post is Huaqiangbei because that is the first location shot.

### Pillar 3 — `interests` · **Do-this-not-that, by interest**
"A maker's day in Shenzhen," "Eat like you live here," "Shenzhen for people who hate cities." Mirrors how the product actually matches — on interest, not itinerary. Lower search volume, highest brand fit.
**Format:** listicle with a contrarian angle. **700–1,000 words.**

### Pillar 4 — `buddies` · **Guide spotlights** ← highest strategic value, lowest SEO value
The only pillar that moves the company's **binding constraint (supply)**. A real buddy interview is recruitment proof for the guide side and trust proof for the traveler side. Cannot be Claude-generated alone — needs a real interview, coordinated by `guide-success`.
**Format:** Q&A, 3–5 consented photos, one CTA to book that specific person. **500–800 words.**

### Explicitly cut
- **"Why book a local guide"** — that is landing-page copy. It ranks for nothing, and as a blog post it reads as an ad in a place readers expect editorial.
- **Generic "travel tips"** — undifferentiated, unwinnable; folded into Pillar 1 where the intent is specific.

### Launch set (exactly 3)
| # | Slug | Pillar | Why this one |
|---|---|---|---|
| 1 | `shenzhen-from-hong-kong-day-trip` | logistics | Highest-volume winnable query; the single biggest source of first-time Shenzhen visitors |
| 2 | `paying-in-shenzhen-as-a-foreigner` | logistics | Sharpest anxiety, fastest-decaying incumbent content, strongest FAQ-schema fit |
| 3 | `huaqiangbei-guide` | neighborhoods | Proves the pillar-2 + gallery pipeline; the studio's best-performing hook lives here |

Posts 4–20 are **gated** on the §2 kill criteria. Pillar 4 starts as soon as `guide-success` has a founding guide willing to be interviewed.

## 4. Data model

`src/content/posts/*.ts` + `src/content/posts/index.ts`. Typed TS modules — **no MDX dependency, no DB table, no markdown parser.** Rationale: `AGENTS.md` warns this Next.js version diverges from training data; adding `@next/mdx` + config is avoidable risk for zero capability at 3 posts. A block union is type-checked, XSS-free by construction (no `dangerouslySetInnerHTML` on body), and trivially Claude-generatable.

```ts
export type Pillar = 'logistics' | 'neighborhoods' | 'interests' | 'buddies'

export type Block =
  | { k: 'h2';      text: string }
  | { k: 'h3';      text: string }
  | { k: 'p';       text: string }                    // inline [label](href) only — see below
  | { k: 'ul';      items: string[] }
  | { k: 'ol';      items: string[] }
  | { k: 'table';   head: string[]; rows: string[][] }
  | { k: 'quote';   text: string; attribution?: string }
  | { k: 'img';     galleryId: string; caption?: string }   // resolves from src/content/gallery.ts
  | { k: 'callout'; tone: 'tip' | 'warn'; title: string; text: string }
  | { k: 'cta';     label: string; href: string; sub?: string }

export type Post = {
  slug: string             // kebab, stable — changing it is a one-way door (breaks links)
  title: string            // ≤ 60 chars (SERP truncation)
  excerpt: string          // ≤ 155 chars — doubles as the meta description
  pillar: Pillar
  tags: string[]
  heroGalleryId: string    // hero comes from the gallery library, not a loose URL
  publishedAt: string      // 'YYYY-MM-DD'
  updatedAt?: string
  author: AuthorId         // key into a small AUTHORS map: name, role, avatar, bio
  body: Block[]
  faq?: { q: string; a: string }[]   // renders as <details> + FAQPage JSON-LD
  relatedSlugs?: string[]  // else auto: same pillar, then shared tags
  draft?: boolean          // draft posts: excluded from /blog, sitemap, and generateStaticParams
  seo?: { title?: string; description?: string; noindex?: boolean }
}
```

**Inline formatting:** `p.text` supports `[label](href)` and nothing else, parsed by a ~20-line function that emits React elements. No raw HTML anywhere in content. Reading time is **computed** (word count / 220), not stored.

**Build-time invariants** (fail `npm run build`): unique slugs · `title.length ≤ 60` · `excerpt.length ≤ 155` · `heroGalleryId` and every `img.galleryId` resolve against `gallery.ts` · non-empty `body` · `relatedSlugs` all exist.

## 5. Page structure

### `/blog` — listing
- Server component, sorted by `publishedAt` desc. Featured card for the newest post, then a 2-col grid.
- **Pillar filter via URL param** `?pillar=logistics` — server-filtered, shareable, zero client JS.
- **Accept that this makes `/blog` dynamic, not static.** Reading `searchParams` opts the route out of static rendering: it renders per request rather than at build time. The earlier "static by default" claim was wrong. This is an acceptable trade at 3 posts — the page is a cheap in-memory sort over a typed array with no database call — but it should be a decision, not a surprise found in the build output. If a static `/blog` is later wanted, the fix is a `/blog/pillar/[pillar]` segment with `generateStaticParams`; not worth it below ~15 posts.
- **No pagination.** With < 15 posts it is dead code; add it at 20.
- **No search.** Search over 3 posts is theatre and adds a client bundle. Revisit at 20 posts.
- `Blog` JSON-LD; canonical `/blog`; `?pillar=` variants canonical back to `/blog`.

### `/blog/[slug]` — post
- `generateStaticParams` over non-draft posts; `generateMetadata` per post (title, description, canonical, `openGraph.type: 'article'`, `publishedTime`, `authors`, hero as `og:image`).
- Layout: hero image → title → author + date + reading time → body → FAQ `<details>` → author box → **2 related posts** (same pillar first, then shared tags) → end CTA.
- **CTA placement (two, no more):** one inline `cta` block placed by the author at roughly 40% depth, and one full-width block at the end. Destination follows `isSingleGuideMode()` from `src/lib/config.ts` — `/guide` in beta, else **`/browse`** with no query string. **There is no `city` param on `/browse`** (it accepts `q`, `lang`, `hobby`, `trait`, `great`, `min_stars`, `min_reviews`, `with_photo`, `active`, `sort`), so `?city=Shenzhen` is silently dropped. Anonymous readers now get the read-only `/guide` preview, so **the CTA sends them to real content, not a login wall** — a blog reader is by definition logged out, which makes this the single most important detail on the page.
- JSON-LD: `Article` (+ `FAQPage` when `faq` is present), scrubbed with `.replace(/</g, '\\u003c')` per `node_modules/next/dist/docs/01-app/02-guides/json-ld.md`.
- `notFound()` for unknown or draft slugs.
- Prose styling: a local `Prose` wrapper using existing Tailwind v4 tokens. **Do not add `@tailwindcss/typography`** — one more dep for three posts.

### Nav (**two edit sites, not one**)
`src/app/layout.tsx` does not render the header from a single source. Editing one and not the other ships a link that exists on mobile but not desktop:

1. **The `navLinks` array (line ~82)** — passed to `<MobileMenu links={navLinks} …>` (line ~182). Mobile only.
2. **The desktop `<nav>` JSX (lines ~115–146)** — hand-written `<Link>` elements. Desktop only.

Add `Blog` in **both**, plus the `Product` footer column, and place it **outside the `user &&` conditionals** that wrap `browseHref`, `/messages`, and `/admin` — the blog exists for logged-out readers, so gating it behind a session hides it from its entire audience.

`/blog` and every non-draft post are added to `app/sitemap.ts` **in this sprint**, not earlier: `seo-foundation.md` deliberately omits them so the sitemap never lists a route that 404s.

## 6. Instrumentation (GA4)

**Dependency:** these fire through the `track()` helper in `seo-foundation.md` R8, which does not exist yet — `src/components/Analytics.tsx` emits one `gtag('config')` call and no events today. Without it the §2 KPI cannot be read at day 90, which makes the kill gate unenforceable.

| Event | Params |
|---|---|
| `content_view` | `content_type: 'post'`, `slug`, `pillar` |
| `content_scroll_75` | `slug` — fires once per session at 75% depth |
| `content_cta_click` | `surface: 'blog'`, `placement: 'inline' \| 'end'`, `slug`, `target` |
| `blog_filter` | `pillar` |
| `related_post_click` | `from_slug`, `to_slug` |

Metric definitions written by `data-analyst` **before** any query is run (`playbook.md` §3).

## 7. Out of scope (v1)

Comments (a moderation surface — `trust-safety` gate) · author pages · RSS · newsletter capture · tag archive pages · MDX · i18n/translations · per-post OG image generation · pagination · search · view counters.

## 8. Acceptance criteria

1. `npm run lint` + `npm run build` pass.
2. 3 posts render; every `body` block type has a renderer and is exercised by at least one post.
3. Unknown slug → 404; a `draft: true` post is absent from `/blog`, from `/sitemap.xml`, and 404s directly.
4. A post referencing a nonexistent `galleryId` **fails the build** (qa-engineer verifies by deliberately breaking it).
5. `Article` and `FAQPage` JSON-LD pass the Rich Results Test with 0 errors.
6. `/blog?pillar=logistics` is server-rendered (visible in `curl` output, JS disabled).
7. Lighthouse mobile on a post: Performance ≥ 90, Accessibility ≥ 95, CLS ≤ 0.05.
8. `Blog` appears in the header on **both** mobile and desktop, and is visible **while logged out**.
9. Every CTA resolves to `/guide` or bare `/browse` — **no `?city=` anywhere** — and following one while logged out reaches readable content, not a login redirect.
10. `/blog` and all non-draft post URLs are present in `/sitemap.xml`.
11. Every post's outbound claims are factual and current — `brand-guardian` review is **blocking**. Visa, border, and payment rules change; each logistics post carries a visible "Last checked: YYYY-MM" line and a `updatedAt` field. Stale facts here are a trust liability, not a typo.
12. Copy passes `marketing/brand-brief.md` voice: friend-not-guide, no "we/us" as narrator, no hype punctuation.

## 9. Strongest case against

*"Three posts on a zero-authority domain will get zero organic traffic in 90 days, and 4 dev-days spent on a blog engine are 4 days not spent on self-serve guide onboarding — which is the actual binding constraint."*

**This is largely correct and I am not refuting it.** It is why the blog is P2 behind the gallery, capped at 3 posts, given an explicit day-90 kill gate, and justified on AI-citation + anxiety-reduction rather than on classic SEO. If the founder wants only one of the three initiatives this cycle, the answer is the **gallery**, not the blog. The blog is **step 6 — last** — in the sequence in `seo-foundation.md` §3b, behind the CTA/OG fix, the `/` and `/guide` photo replacement, the Instagram loop, the 12-photo gallery, and the sitemap. Reassess against guide-supply work before starting it; that reassessment is a real decision point, not a formality.

## 10. Opportunity cost (stated explicitly)

Yes to all three PRDs = **~8 dev-days**. That is a no to, this cycle: self-serve guide signup + vetting flow, booking-funnel instrumentation beyond content events, and multi-guide availability. Given the binding constraint is *first believers*, the blog is the piece most likely to be the wrong trade — hence the gate.
