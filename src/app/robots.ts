import type { MetadataRoute } from 'next'

import { siteUrl } from '@/lib/config'

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Signed-in surfaces, machine endpoints, and the auth flow. `/u` is
      // disallowed because public profiles are personal data — see the same
      // note in sitemap.ts.
      disallow: [
        '/admin',
        '/api',
        '/messages',
        '/profile',
        '/auth',
        '/reset-password',
        '/forgot-password',
        '/u',
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
