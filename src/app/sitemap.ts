import type { MetadataRoute } from 'next'

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
  const lastModified = new Date()

  return [
    ...ROUTES.map(({ path, priority, changeFrequency }) => ({
      url: path === '/' ? base : `${base}${path}`,
      lastModified,
      changeFrequency,
      priority,
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
