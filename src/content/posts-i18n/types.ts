import type { Author, AuthorId, Block, Post } from '@/content/posts/types'

// The parts of a blog post that carry prose. Everything omitted here is
// language-independent and stays on the base record in src/content/posts:
//
//   slug, pillar, tags      — URL, taxonomy and analytics keys
//   publishedAt, updatedAt,
//   lastChecked             — dates
//   author                  — a person
//   heroGalleryId, galleryId — photos, resolved against the gallery
//   tone (callout)          — a colour
//   draft, noindex          — editorial flags
//
// A translated body has to mirror the English body block for block: the same
// count, the same kind at every position, the same number of list items and
// table cells, and the same inline links. assertPostTranslationsValid() in
// ./index.ts enforces that, so a translation cannot drop a warning callout,
// add a paragraph, or point a link somewhere the English does not.

export type LocalizedBlock =
  | { k: 'h2'; text: string }
  | { k: 'h3'; text: string }
  | { k: 'p'; text: string }
  | { k: 'ul'; items: string[] }
  | { k: 'ol'; items: string[] }
  | { k: 'table'; head: string[]; rows: string[][] }
  | { k: 'quote'; text: string; attribution?: string }
  // galleryId stays on the base block. A caption is present exactly when the
  // English block has one.
  | { k: 'img'; caption?: string }
  // tone stays on the base block.
  | { k: 'callout'; title: string; text: string }
  | { k: 'cta'; label: string; sub?: string }

export type LocalizedPost = {
  title: string
  excerpt: string
  // Each field present exactly when the English post sets it.
  seo?: { title?: string; description?: string }
  body: LocalizedBlock[]
  // Same count and order as the English FAQ.
  faq?: { q: string; a: string }[]
}

// Names are not translated — bylines are real people and stay as they sign
// themselves — but a role and bio in English inside a Japanese page are not.
export type LocalizedAuthor = Pick<Author, 'role' | 'bio'>

export type PostTranslations = {
  // Keyed by post slug.
  posts: Record<string, LocalizedPost>
  authors: Record<AuthorId, LocalizedAuthor>
}

export type { Block, Post }
