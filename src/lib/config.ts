// Beta-mode configuration, driven entirely by environment variables so the
// original matching experience can be brought back without a deploy diff.

// The operator-managed guide that tourists book during the beta.
export function officialGuideId(): string | null {
  return process.env.OFFICIAL_GUIDE_ID?.trim() || null
}

// While OFFICIAL_GUIDE_ID is set the app runs in "single guide" beta mode:
// /browse redirects to /guide and tourists can only book the official guide.
// Unset the variable to restore the original matching/browse experience.
export function isSingleGuideMode(): boolean {
  return officialGuideId() !== null
}

export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return adminEmails().includes(email.toLowerCase())
}

// Instagram is the only live traffic source this cycle, so the footer links
// back to it and campaign links carry UTMs (see README, "Campaign links").
// The footer link, the README UTM examples and the JSON-LD `sameAs` array
// (PRD R5) all read from here. Note the trailing underscore.
export const INSTAGRAM_HANDLE = 'shenzhen_buddies_'

export function instagramUrl(): string {
  return `https://www.instagram.com/${INSTAGRAM_HANDLE}/`
}

// Canonical production URL — used as the fallback so emails and redirect
// links never point at localhost, even if NEXT_PUBLIC_SITE_URL is unset.
//
// This is the domain Google indexes and the one every canonical tag, OG URL
// and sitemap entry resolves against, so it must stay in sync with the domain
// actually attached to the Vercel project. Changing it after launch splits
// indexing across two hostnames.
export const DEFAULT_SITE_URL = 'https://shenzhen-buddies.com'

export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (!configured) return DEFAULT_SITE_URL

  // The root layout does `new URL(siteUrl())` for metadataBase, which THROWS on
  // a value with no scheme ('shenzhen-buddies.com'). That throw happens while
  // evaluating the root layout module, so it 500s every route on the site — a
  // typo in one env var takes the whole thing down, with no local signal
  // because .env.local leaves this unset. Anything unparseable is treated as
  // not configured.
  try {
    const parsed = new URL(configured)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return DEFAULT_SITE_URL
    }
  } catch {
    return DEFAULT_SITE_URL
  }

  return configured
}

// The site-wide share card, served by the `opengraph-image` file convention at
// src/app/opengraph-image.png.
//
// Pages that declare their own `openGraph` in metadata need this explicitly.
// Declaring an `openGraph` object on a page *replaces* the one inherited from
// the root layout, and the file-convention image goes with it — so a page that
// sets, say, `openGraph.type: 'article'` and nothing else silently loses
// og:image and shares as a grey box. Verified by comparing view-source on
// /about (no openGraph, image present) against a route that declares one.
// metadataBase resolves this to an absolute URL.
//
// Only `openGraph.images` needs it. Replacement is per-key, so a page that
// declares openGraph still inherits `twitter` from the root layout, and Next
// fills twitter:image from the resolved OG image — a `twitter` block alongside
// this is a no-op.
//
// Known trade-off: a page resolving the image through the file convention gets
// a content-hashed URL ('/opengraph-image.png?<hash>'); this plain path does
// not. Nothing is broken — both serve the same bytes — but if the image is ever
// replaced, Facebook and X keep serving the stale card for pages using this
// constant. Re-scrape them in the sharing debuggers after any swap.
export const DEFAULT_OG_IMAGE = '/opengraph-image.png'
