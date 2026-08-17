import type { TourPackage } from '@/content/packages'

// The fields of a TourPackage that carry prose. Everything omitted here is
// language-independent and stays on the base record in src/content/packages.ts:
//
//   slug     — the URL and the analytics key
//   cn       — already Chinese, and shown in every language on purpose. It is
//              the string a traveller screenshots to show a taxi driver.
//   photo    — a file path
//   accent   — a colour token
//   featured — an editorial flag
//   readMoreSlug — a blog slug; the post itself is English-only for now
//
// `alt` IS here. Alt text is read aloud by screen readers in the page's
// language, so leaving it English inside a Japanese page is a real
// accessibility defect, not a cosmetic one.
export type LocalizedPackage = Pick<
  TourPackage,
  | 'title'
  | 'kicker'
  | 'tagline'
  | 'summary'
  | 'alt'
  | 'district'
  | 'bestStart'
  | 'meetingPoint'
  | 'includes'
  | 'notIncluded'
  | 'goodFor'
  | 'insiderTip'
> & {
  // Same length and order as the English itinerary. `at` is not translated —
  // "1:20" is "1:20" in every locale this site ships.
  itinerary: { title: string; body: string }[]
}

// Keyed by package slug. Typed as a full record so a package added to
// packages.ts without a translation is a build error in every locale file,
// rather than a card that silently reverts to English.
export type PackageTranslations = Record<string, LocalizedPackage>
