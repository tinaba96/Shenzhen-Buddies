import type { MetadataRoute } from 'next'

import { packages } from '@/content/packages'
import { publishedPosts } from '@/content/posts'
import { siteUrl } from '@/lib/config'

// Only routes that actually exist belong here. A sitemap entry pointing at a
// 404 costs crawl trust on a brand-new property and buys nothing, so each new
// route is added in the sprint that ships it.
//
// `/u/[id]` is deliberately absent: public profiles are personal data, and
// indexing them is a PIPL/GDPR decision for legal-compliance, not a default.
const ROUTES: Array<{
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
}> = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  // The experience catalogue is now the primary path from the homepage to
  // checkout, so it ranks alongside /guide rather than below it. Individual
  // experiences are appended below.
  { path: '/tours', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/guide', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/explore', priority: 0.8, changeFrequency: 'weekly' },
  // Only the bare path. `?loc=` variants canonicalise back to /gallery, so
  // listing them would submit duplicates of a page we already point at.
  { path: '/gallery', priority: 0.6, changeFrequency: 'weekly' },
  // Only the bare path, for the same reason as /gallery: ?pillar= views
  // canonicalise back to /blog. Individual posts are appended below.
  { path: '/blog', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/pricing', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/welcome', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/cancellation', priority: 0.3, changeFrequency: 'yearly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl()

  return [
    // No `lastModified` on these. It was `new Date()`, i.e. build time, which
    // told Google that /privacy and /terms changed on every deploy — including
    // deploys that touched neither. Google's stated behaviour is to stop
    // trusting a sitemap's lastmod once it finds it inconsistent with the page,
    // and it applies that judgement to the whole file, so a fake date on twelve
    // static routes would also discredit the real dates on the posts below.
    // Omitting it is a supported case: the field is optional, and a missing
    // lastmod is simply not a signal, where a wrong one is a negative one.
    ...ROUTES.map(({ path, priority, changeFrequency }) => ({
      url: path === '/' ? base : `${base}${path}`,
      changeFrequency,
      priority,
    })),
    // One entry per experience. No lastModified for the same reason as the
    // static routes above: the copy changes when someone edits it, not when
    // the site is deployed, and there is no edit date on the record to use.
    ...packages.map((pkg) => ({
      url: `${base}/tours/${pkg.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    // publishedPosts() already drops drafts, so a post under review never
    // reaches the sitemap. lastModified is the post's own date rather than the
    // build time — telling a crawler that unchanged content changed on every
    // deploy is how a sitemap stops being believed.
    ...publishedPosts().map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(`${post.updatedAt ?? post.publishedAt}T00:00:00Z`),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
