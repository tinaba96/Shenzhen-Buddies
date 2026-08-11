// The post registry, plus the invariants that make a broken post a build
// failure instead of a published mistake. assertPostsValid() runs at module
// load (bottom of this file), so `npm run build` is the gate.

import { requireGalleryItem } from '@/content/gallery'

import { AUTHORS, PILLARS, type Pillar, type Post } from './types'
import { shenzhenFromHongKongDayTrip } from './shenzhen-from-hong-kong-day-trip'

export * from './types'

// Registration order does not matter — everything reads through the sorted
// accessors below.
export const posts: Post[] = [shenzhenFromHongKongDayTrip]

// Average adult reading speed for web prose. Reading time is computed rather
// than stored so it cannot drift out of sync with an edited body.
const WORDS_PER_MINUTE = 220

const TITLE_MAX = 60
const EXCERPT_MAX = 155

function fail(slug: string, problem: string): never {
  throw new Error(`posts: "${slug}" ${problem}`)
}

// Every string an author can type, flattened, so the word count and the link
// check see the same text the reader does.
function blockText(post: Post): string[] {
  const out: string[] = []
  for (const b of post.body) {
    switch (b.k) {
      case 'h2':
      case 'h3':
      case 'p':
        out.push(b.text)
        break
      case 'ul':
      case 'ol':
        out.push(...b.items)
        break
      case 'table':
        out.push(...b.head, ...b.rows.flat())
        break
      case 'quote':
        out.push(b.text, b.attribution ?? '')
        break
      case 'callout':
        out.push(b.title, b.text)
        break
      case 'cta':
        out.push(b.label, b.sub ?? '')
        break
      case 'img':
        out.push(b.caption ?? '')
        break
    }
  }
  return out
}

export function readingTimeMinutes(post: Post): number {
  const words = blockText(post)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

export function assertPostsValid(all: readonly Post[] = posts): void {
  const seen = new Set<string>()
  const slugs = new Set(all.map((p) => p.slug))

  for (const post of all) {
    const { slug } = post

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      fail(slug, 'is not a valid kebab-case slug')
    }
    if (seen.has(slug)) fail(slug, 'has a duplicate slug')
    seen.add(slug)

    if (post.title.length > TITLE_MAX) {
      fail(
        slug,
        `has a ${post.title.length}-character title; keep it to ${TITLE_MAX} or Google truncates it`,
      )
    }
    if (post.excerpt.length > EXCERPT_MAX) {
      fail(
        slug,
        `has a ${post.excerpt.length}-character excerpt; it doubles as the meta description, so keep it to ${EXCERPT_MAX}`,
      )
    }
    if (post.body.length === 0) fail(slug, 'has an empty body')
    if (!AUTHORS[post.author]) fail(slug, `names an unknown author "${post.author}"`)

    for (const field of ['publishedAt', 'updatedAt'] as const) {
      const value = post[field]
      if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        fail(slug, `has a ${field} of "${value}"; it must be YYYY-MM-DD`)
      }
    }
    if (post.lastChecked && !/^\d{4}-\d{2}$/.test(post.lastChecked)) {
      fail(slug, `has a lastChecked of "${post.lastChecked}"; it must be YYYY-MM`)
    }
    // Border, visa and payment rules change without notice, and a reader has no
    // way to tell a current page from a stale one. A logistics post that will
    // not say when it was last checked is not publishable.
    if (post.pillar === 'logistics' && !post.lastChecked) {
      fail(
        slug,
        'is a logistics post with no lastChecked date — these facts decay, and the reader has to be told how old they are',
      )
    }

    // Resolving here rather than at render time means a dangling gallery id
    // fails the build, which is the whole reason ids are used instead of URLs.
    if (post.heroGalleryId) {
      requireGalleryItem(post.heroGalleryId, `posts/${slug} hero`)
    }
    for (const block of post.body) {
      if (block.k === 'img') {
        requireGalleryItem(block.galleryId, `posts/${slug} body`)
      }
      if (block.k === 'table') {
        for (const row of block.rows) {
          if (row.length !== block.head.length) {
            fail(
              slug,
              `has a table row of ${row.length} cells under a ${block.head.length}-column head`,
            )
          }
        }
      }
    }

    for (const related of post.relatedSlugs ?? []) {
      if (related === slug) fail(slug, 'lists itself as a related post')
      if (!slugs.has(related)) {
        fail(slug, `points at a related post "${related}" that does not exist`)
      }
    }
  }
}

// Draft posts exist for review only: absent from the listing, absent from the
// sitemap, and a 404 when requested directly.
export function publishedPosts(all: readonly Post[] = posts): Post[] {
  return all
    .filter((p) => !p.draft)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export function getPublishedPost(slug: string): Post | undefined {
  return publishedPosts().find((p) => p.slug === slug)
}

// An unknown or empty ?pillar= falls back to the full listing rather than an
// empty one, so a stale shared link degrades to something readable.
export function resolvePillarFilter(
  raw: string | string[] | undefined,
): Pillar | null {
  if (typeof raw !== 'string') return null
  return PILLARS.find((p) => p.id === raw)?.id ?? null
}

export function postsForPillar(pillar: Pillar | null): Post[] {
  const all = publishedPosts()
  return pillar ? all.filter((p) => p.pillar === pillar) : all
}

// Author's picks first, then same pillar, then shared tags. Newest wins inside
// each tier, and the list is padded from whatever is left so the section is
// never half-empty on a small blog.
export function relatedPosts(post: Post, limit = 2): Post[] {
  const candidates = publishedPosts().filter((p) => p.slug !== post.slug)
  const picked: Post[] = []

  const add = (p: Post) => {
    if (picked.length < limit && !picked.some((x) => x.slug === p.slug)) {
      picked.push(p)
    }
  }

  for (const slug of post.relatedSlugs ?? []) {
    const match = candidates.find((p) => p.slug === slug)
    if (match) add(match)
  }
  for (const p of candidates.filter((p) => p.pillar === post.pillar)) add(p)
  for (const p of candidates.filter((p) =>
    p.tags.some((t) => post.tags.includes(t)),
  )) {
    add(p)
  }
  for (const p of candidates) add(p)

  return picked
}

assertPostsValid()
