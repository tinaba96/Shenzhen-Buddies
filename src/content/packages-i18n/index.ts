// Merges a base TourPackage with its translation for a locale.
//
// The base record in src/content/packages.ts stays the single source of truth
// for STRUCTURE — which packages exist, their slugs, photos, accents, how many
// itinerary beats there are and what time each one falls at. Locale files
// supply prose only. That split is what stops a translation from quietly
// inventing a seventh package or dropping a beat out of the timeline.

import { packages, type TourPackage } from '@/content/packages'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/i18n/config'

import { packagesJa } from './ja'
import { packagesZhHans } from './zh-Hans'
import { packagesZhHant } from './zh-Hant'
import type { PackageTranslations } from './types'

export type { LocalizedPackage, PackageTranslations } from './types'

const TRANSLATIONS: Record<Locale, PackageTranslations | null> = {
  // English is the base record itself, not a translation of it.
  en: null,
  'zh-Hans': packagesZhHans,
  'zh-Hant': packagesZhHant,
  ja: packagesJa,
}

// A package with its prose swapped for the requested locale. Returns the base
// record unchanged for English, and falls back to it for any package a locale
// has not translated yet — English copy is a worse experience than a
// translation, but an infinitely better one than a blank card.
export function localizePackage(
  pkg: TourPackage,
  locale: Locale,
): TourPackage {
  const table = TRANSLATIONS[locale]
  const tr = table?.[pkg.slug]
  if (!tr) return pkg

  return {
    ...pkg,
    title: tr.title,
    kicker: tr.kicker,
    tagline: tr.tagline,
    summary: tr.summary,
    alt: tr.alt,
    district: tr.district,
    bestStart: tr.bestStart,
    meetingPoint: tr.meetingPoint,
    includes: tr.includes,
    notIncluded: tr.notIncluded,
    goodFor: tr.goodFor,
    insiderTip: tr.insiderTip,
    itineraryTitle: tr.itineraryTitle ?? pkg.itineraryTitle,
    // `hours` and `at` stay from the base: the timeline is structure, not
    // prose, and it is validated there.
    itineraries: pkg.itineraries.map((variant, v) => ({
      hours: variant.hours,
      title: tr.itineraries[v]?.title ?? variant.title,
      beats: variant.beats.map((beat, i) => ({
        at: beat.at,
        title: tr.itineraries[v]?.beats[i]?.title ?? beat.title,
        body: tr.itineraries[v]?.beats[i]?.body ?? beat.body,
      })),
    })),
  }
}

export function localizedPackages(locale: Locale): TourPackage[] {
  return packages.map((p) => localizePackage(p, locale))
}

export function localizedFeaturedPackage(locale: Locale): TourPackage {
  // packages.ts guarantees exactly one featured entry at module load.
  return localizePackage(packages.find((p) => p.featured)!, locale)
}

export function localizedOtherPackages(locale: Locale): TourPackage[] {
  return packages.filter((p) => !p.featured).map((p) => localizePackage(p, locale))
}

export function localizedPackage(
  slug: string,
  locale: Locale,
): TourPackage | undefined {
  const base = packages.find((p) => p.slug === slug)
  return base ? localizePackage(base, locale) : undefined
}

// ---------------------------------------------------------------------------
// Invariants
// ---------------------------------------------------------------------------

export function assertPackageTranslationsValid(): void {
  const problems: string[] = []

  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue
    const table = TRANSLATIONS[locale]
    if (!table) {
      problems.push(`${locale} has no translation table`)
      continue
    }

    for (const pkg of packages) {
      const tr = table[pkg.slug]
      if (!tr) {
        problems.push(`${locale} is missing "${pkg.slug}"`)
        continue
      }
      if (tr.itineraries.length !== pkg.itineraries.length) {
        problems.push(
          `${locale}.${pkg.slug} has ${tr.itineraries.length} itineraries but the English original has ${pkg.itineraries.length}`,
        )
      }
      for (const [v, variant] of pkg.itineraries.entries()) {
        const trv = tr.itineraries[v]
        if (!trv) continue
        if (trv.beats.length !== variant.beats.length) {
          problems.push(
            `${locale}.${pkg.slug} itinerary ${v + 1} has ${trv.beats.length} beats but the English original has ${variant.beats.length}`,
          )
        }
        // A named variant that loses its name in translation renders an
        // empty line under the length toggle.
        if (!!variant.title !== !!trv.title?.trim()) {
          problems.push(
            `${locale}.${pkg.slug} itinerary ${v + 1} ${variant.title ? 'is missing its title' : 'has a title the English original does not'}`,
          )
        }
      }
      if (!!pkg.itineraryTitle !== !!tr.itineraryTitle?.trim()) {
        problems.push(
          `${locale}.${pkg.slug} ${pkg.itineraryTitle ? 'is missing itineraryTitle' : 'has an itineraryTitle the English original does not'}`,
        )
      }
      // A short list here is how a translated card silently loses the line
      // that says what you are NOT paying for.
      for (const field of ['includes', 'notIncluded', 'goodFor'] as const) {
        if (tr[field].length !== pkg[field].length) {
          problems.push(
            `${locale}.${pkg.slug}.${field} has ${tr[field].length} entries but the English original has ${pkg[field].length}`,
          )
        }
      }
      for (const [key, value] of Object.entries(tr)) {
        if (typeof value === 'string' && value.trim() === '') {
          problems.push(`${locale}.${pkg.slug}.${key} is empty`)
        }
      }
    }

    // A translation for a package that no longer exists is dead weight that
    // reads as coverage. Flag it so it gets deleted with the package.
    for (const slug of Object.keys(table)) {
      if (!packages.some((p) => p.slug === slug)) {
        problems.push(`${locale} translates "${slug}", which is not a package`)
      }
    }
  }

  if (problems.length > 0) {
    throw new Error(
      `packages-i18n: ${problems.length} problems\n  ${problems.join('\n  ')}`,
    )
  }
}

assertPackageTranslationsValid()
