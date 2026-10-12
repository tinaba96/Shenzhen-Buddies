// Merges a base Post with its translation for a locale.
//
// Same split as packages-i18n and gallery-i18n: src/content/posts stays the
// single source of truth for STRUCTURE — which posts exist, their slugs, dates,
// photos, which blocks the body has and in what order. Locale files supply
// prose only, so a translation cannot quietly add a paragraph, drop a warning
// callout, or move a link.

import {
  AUTHORS,
  type Author,
  type AuthorId,
  type Post,
  posts,
} from '@/content/posts'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/i18n/config'

import { postsJa } from './ja'
import type { LocalizedBlock, PostTranslations } from './types'
import { postsZhHans } from './zh-Hans'
import { postsZhHant } from './zh-Hant'

export type { LocalizedAuthor, LocalizedBlock, LocalizedPost, PostTranslations } from './types'

const TRANSLATIONS: Record<Locale, PostTranslations | null> = {
  // English is the base record itself, not a translation of it.
  en: null,
  'zh-Hans': postsZhHans,
  'zh-Hant': postsZhHant,
  ja: postsJa,
}

// Whether the locale has its own copy of this post. The pages use it to decide
// whether to mark the article lang="en" for screen readers.
export function hasPostTranslation(post: Pick<Post, 'slug'>, locale: Locale): boolean {
  return locale === DEFAULT_LOCALE || !!TRANSLATIONS[locale]?.posts[post.slug]
}

// A post with its prose swapped for the requested locale. Returns the base
// record unchanged for English, and falls back to it for any post a locale has
// not translated yet.
export function localizePost(post: Post, locale: Locale): Post {
  const tr = TRANSLATIONS[locale]?.posts[post.slug]
  if (!tr) return post

  return {
    ...post,
    title: tr.title,
    excerpt: tr.excerpt,
    seo: post.seo
      ? {
          ...post.seo,
          ...(post.seo.title !== undefined ? { title: tr.seo?.title ?? post.seo.title } : {}),
          ...(post.seo.description !== undefined
            ? { description: tr.seo?.description ?? post.seo.description }
            : {}),
        }
      : undefined,
    body: post.body.map((block, i) => mergeBlock(block, tr.body[i])),
    faq: post.faq?.map((item, i) => tr.faq?.[i] ?? item),
  }
}

function mergeBlock(base: Post['body'][number], tr: LocalizedBlock | undefined): Post['body'][number] {
  // The validator has already checked the kinds line up; this is the
  // type-level restatement so a mismatch degrades to English instead of a
  // crash at render.
  if (!tr || tr.k !== base.k) return base
  switch (base.k) {
    case 'h2':
    case 'h3':
    case 'p':
      return { ...base, text: (tr as { text: string }).text }
    case 'ul':
    case 'ol':
      return { ...base, items: (tr as { items: string[] }).items }
    case 'table': {
      const t = tr as { head: string[]; rows: string[][] }
      return { ...base, head: t.head, rows: t.rows }
    }
    case 'quote': {
      const t = tr as { text: string; attribution?: string }
      return {
        ...base,
        text: t.text,
        ...(base.attribution !== undefined
          ? { attribution: t.attribution ?? base.attribution }
          : {}),
      }
    }
    case 'img': {
      const t = tr as { caption?: string }
      return base.caption === undefined ? base : { ...base, caption: t.caption ?? base.caption }
    }
    case 'callout': {
      const t = tr as { title: string; text: string }
      return { ...base, title: t.title, text: t.text }
    }
    case 'cta': {
      const t = tr as { label: string; sub?: string }
      return {
        ...base,
        label: t.label,
        ...(base.sub !== undefined ? { sub: t.sub ?? base.sub } : {}),
      }
    }
  }
}

export function localizePosts(list: readonly Post[], locale: Locale): Post[] {
  return list.map((p) => localizePost(p, locale))
}

export function localizeAuthor(id: AuthorId, locale: Locale): Author {
  const base = AUTHORS[id]
  const tr = TRANSLATIONS[locale]?.authors[id]
  return tr ? { ...base, role: tr.role, bio: tr.bio } : base
}

// ---------------------------------------------------------------------------
// Invariants
// ---------------------------------------------------------------------------

const INLINE_LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g

function hrefs(text: string): string[] {
  return Array.from(text.matchAll(INLINE_LINK), (m) => m[2]).sort()
}

function sameHrefs(a: string, b: string): boolean {
  const x = hrefs(a)
  const y = hrefs(b)
  return x.length === y.length && x.every((h, i) => h === y[i])
}

// Every string in a block, so the empty-string and link checks see the same
// text the reader does.
function strings(block: { [key: string]: unknown }): string[] {
  const out: string[] = []
  for (const value of Object.values(block)) {
    if (typeof value === 'string') out.push(value)
    else if (Array.isArray(value)) {
      for (const v of value) {
        if (typeof v === 'string') out.push(v)
        else if (Array.isArray(v)) out.push(...v.filter((c): c is string => typeof c === 'string'))
      }
    }
  }
  return out
}

export function assertPostTranslationsValid(): void {
  const problems: string[] = []

  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue
    const table = TRANSLATIONS[locale]
    if (!table) {
      problems.push(`${locale} has no translation table`)
      continue
    }

    for (const id of Object.keys(AUTHORS) as AuthorId[]) {
      const author = table.authors[id]
      if (!author) problems.push(`${locale} is missing author "${id}"`)
      else {
        for (const key of ['role', 'bio'] as const) {
          if (!author[key]?.trim()) problems.push(`${locale}.authors.${id}.${key} is empty`)
        }
      }
    }

    for (const post of posts) {
      const tr = table.posts[post.slug]
      if (!tr) {
        problems.push(`${locale} is missing "${post.slug}"`)
        continue
      }
      const where = `${locale}.${post.slug}`

      for (const key of ['title', 'excerpt'] as const) {
        if (!tr[key]?.trim()) problems.push(`${where}.${key} is empty`)
      }
      for (const key of ['title', 'description'] as const) {
        const want = post.seo?.[key] !== undefined
        const have = !!tr.seo?.[key]?.trim()
        if (want !== have) {
          problems.push(
            `${where}.seo.${key} ${want ? 'is missing' : 'is set but the English original has none'}`,
          )
        }
      }

      if (tr.body.length !== post.body.length) {
        problems.push(
          `${where} has ${tr.body.length} blocks but the English original has ${post.body.length}`,
        )
      }
      for (const [i, base] of post.body.entries()) {
        const block = tr.body[i]
        if (!block) break
        const at = `${where}.body[${i}]`
        if (block.k !== base.k) {
          problems.push(`${at} is a "${block.k}" but the English original is a "${base.k}"`)
          continue
        }
        if ((base.k === 'ul' || base.k === 'ol') && block.k === base.k) {
          if (block.items.length !== base.items.length) {
            problems.push(
              `${at} has ${block.items.length} items but the English original has ${base.items.length}`,
            )
          }
        }
        if (base.k === 'table' && block.k === 'table') {
          if (block.head.length !== base.head.length) {
            problems.push(`${at} has ${block.head.length} columns but the English original has ${base.head.length}`)
          }
          if (block.rows.length !== base.rows.length) {
            problems.push(`${at} has ${block.rows.length} rows but the English original has ${base.rows.length}`)
          }
          for (const [r, row] of block.rows.entries()) {
            if (row.length !== block.head.length) {
              problems.push(`${at} row ${r + 1} has ${row.length} cells under a ${block.head.length}-column head`)
            }
          }
        }
        // Optional sub-fields appear exactly when the English has them.
        const optional: Record<string, string> = {
          quote: 'attribution',
          img: 'caption',
          cta: 'sub',
        }
        const field = optional[base.k]
        if (field) {
          const want = (base as Record<string, unknown>)[field] !== undefined
          const have = !!((block as Record<string, unknown>)[field] as string | undefined)?.trim()
          if (want !== have) {
            problems.push(
              `${at}.${field} ${want ? 'is missing' : 'is set but the English original has none'}`,
            )
          }
        }
        for (const s of strings(block)) {
          if (s.trim() === '') problems.push(`${at} contains an empty string`)
        }
        // Links are structure: a translation may reword the label but not
        // change where it goes, or lose it.
        const baseText = strings(base as Record<string, unknown>).join('\n')
        const trText = strings(block).join('\n')
        if (!sameHrefs(baseText, trText)) {
          problems.push(
            `${at} links to [${hrefs(trText).join(', ')}] but the English original links to [${hrefs(baseText).join(', ')}]`,
          )
        }
      }

      const baseFaq = post.faq?.length ?? 0
      const trFaq = tr.faq?.length ?? 0
      if (baseFaq !== trFaq) {
        problems.push(`${where} has ${trFaq} FAQ entries but the English original has ${baseFaq}`)
      }
      for (const [i, item] of (tr.faq ?? []).entries()) {
        if (!item.q.trim() || !item.a.trim()) problems.push(`${where}.faq[${i}] has an empty field`)
      }
    }

    // A translation for a post that no longer exists is dead weight that reads
    // as coverage. Flag it so it gets deleted with the post.
    for (const slug of Object.keys(table.posts)) {
      if (!posts.some((p) => p.slug === slug)) {
        problems.push(`${locale} translates "${slug}", which is not a post`)
      }
    }
  }

  if (problems.length > 0) {
    throw new Error(`posts-i18n: ${problems.length} problems\n  ${problems.join('\n  ')}`)
  }
}

assertPostTranslationsValid()
