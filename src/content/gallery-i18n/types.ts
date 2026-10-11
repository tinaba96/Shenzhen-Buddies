import type { GalleryItem } from '@/content/gallery'

// The fields of a GalleryItem that carry prose. Everything else — id, src,
// size, location, consent, focus — is language-independent and stays on the
// base record in src/content/gallery.ts.
//
// `alt` is here for the same reason it is in packages-i18n: it is read aloud
// by screen readers in the page's language.
export type LocalizedGalleryItem = Pick<GalleryItem, 'title' | 'alt'> & {
  // Present exactly when the English item has one.
  caption?: string
}

// Keyed by gallery item id.
export type GalleryTranslations = Record<string, LocalizedGalleryItem>
