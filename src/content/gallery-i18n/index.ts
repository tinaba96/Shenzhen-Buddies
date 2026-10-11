// Swaps a gallery item's prose for the requested locale.
//
// Same split as packages-i18n: src/content/gallery.ts stays the single source
// of truth for which photos exist and everything about them except the words.
// Locale files supply title, caption and alt only, so a translation cannot add
// a photo, drop one, or move one to a different neighbourhood.

import { galleryItems, type GalleryItem } from '@/content/gallery'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/i18n/config'

import { galleryJa } from './ja'
import type { GalleryTranslations } from './types'
import { galleryZhHans } from './zh-Hans'
import { galleryZhHant } from './zh-Hant'

export type { GalleryTranslations, LocalizedGalleryItem } from './types'

const TRANSLATIONS: Record<Locale, GalleryTranslations | null> = {
  // English is the base record itself, not a translation of it.
  en: null,
  'zh-Hans': galleryZhHans,
  'zh-Hant': galleryZhHant,
  ja: galleryJa,
}

// Works on the full item and on the PublicGalleryItem projection alike, and
// returns the same shape it was given — so a projected item stays projected.
// Falls back to the English prose for an item a locale has not translated.
export function localizeGalleryItem<
  T extends Pick<GalleryItem, 'id' | 'title' | 'alt' | 'caption'>,
>(item: T, locale: Locale): T {
  const tr = TRANSLATIONS[locale]?.[item.id]
  if (!tr) return item
  return {
    ...item,
    title: tr.title,
    alt: tr.alt,
    caption: item.caption === undefined ? undefined : (tr.caption ?? item.caption),
  }
}

// ---------------------------------------------------------------------------
// Invariants
// ---------------------------------------------------------------------------

export function assertGalleryTranslationsValid(): void {
  const problems: string[] = []

  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue
    const table = TRANSLATIONS[locale]
    if (!table) {
      problems.push(`${locale} has no translation table`)
      continue
    }

    for (const item of galleryItems) {
      const tr = table[item.id]
      if (!tr) {
        problems.push(`${locale} is missing "${item.id}"`)
        continue
      }
      // Alt text is required on the base record for a11y and image search;
      // the same holds in every language.
      for (const key of ['title', 'alt'] as const) {
        if (!tr[key]?.trim()) problems.push(`${locale}.${item.id}.${key} is empty`)
      }
      // A caption that appears or vanishes in translation changes what the
      // lightbox and the share card show.
      if (!!item.caption !== !!tr.caption?.trim()) {
        problems.push(
          `${locale}.${item.id} ${item.caption ? 'is missing its caption' : 'has a caption the English original does not'}`,
        )
      }
    }

    // A translation for a photo that was removed is dead weight that reads as
    // coverage. Flag it so it gets deleted with the photo.
    for (const id of Object.keys(table)) {
      if (!galleryItems.some((i) => i.id === id)) {
        problems.push(`${locale} translates "${id}", which is not a gallery item`)
      }
    }
  }

  if (problems.length > 0) {
    throw new Error(
      `gallery-i18n: ${problems.length} problems\n  ${problems.join('\n  ')}`,
    )
  }
}

assertGalleryTranslationsValid()
