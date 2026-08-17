// Dictionary lookup and interpolation. Deliberately free of request APIs so
// it can be imported from client components too — reading the visitor's locale
// is ./server.ts's job.

import { DEFAULT_LOCALE, LOCALES, type Locale } from './config'
import { en, type Dictionary } from './dictionaries/en'
import { ja } from './dictionaries/ja'
import { zhHans } from './dictionaries/zh-Hans'
import { zhHant } from './dictionaries/zh-Hant'

export type { Dictionary }

const DICTIONARIES: Record<Locale, Dictionary> = {
  en,
  'zh-Hans': zhHans,
  'zh-Hant': zhHant,
  ja,
}

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE]
}

// Fills {placeholders} in a translated string.
//
// Values are stringified and substituted verbatim: everything that goes
// through here is rendered as a React text child, never as HTML, so there is
// nothing to escape. Do not change that without revisiting this line.
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in values ? String(values[key]) : whole,
  )
}

// ---------------------------------------------------------------------------
// Invariants
//
// The type system guarantees every locale has every KEY. It cannot guarantee
// the values are usable, and the two ways a typed dictionary still ships broken
// are both silent in production:
//
//   1. An empty string. Renders as nothing — a heading vanishes and the page
//      still "works", so nobody notices until a visitor does.
//   2. A dropped {placeholder}. '{price} for four hours' translated without
//      the token renders a price line with no price in it.
//
// Both are caught here, at module load, so they fail `npm run build`.
// ---------------------------------------------------------------------------

function placeholders(value: string): string[] {
  return (value.match(/\{(\w+)\}/g) ?? []).sort()
}

type Problem = string

function walk(
  reference: unknown,
  candidate: unknown,
  path: string,
  problems: Problem[],
): void {
  if (typeof reference === 'string') {
    if (typeof candidate !== 'string' || candidate.trim() === '') {
      problems.push(`${path} is empty`)
      return
    }
    const want = placeholders(reference)
    const got = placeholders(candidate)
    if (want.join(',') !== got.join(',')) {
      problems.push(
        `${path} should carry ${want.length ? want.join(' ') : 'no placeholders'} but carries ${
          got.length ? got.join(' ') : 'none'
        }`,
      )
    }
    return
  }

  if (Array.isArray(reference)) {
    if (!Array.isArray(candidate) || candidate.length !== reference.length) {
      // A short array is how a translated feature grid silently loses a tile.
      problems.push(
        `${path} should have ${reference.length} entries but has ${
          Array.isArray(candidate) ? candidate.length : 'none'
        }`,
      )
      return
    }
    reference.forEach((item, i) =>
      walk(item, candidate[i], `${path}[${i}]`, problems),
    )
    return
  }

  if (reference && typeof reference === 'object') {
    for (const key of Object.keys(reference as Record<string, unknown>)) {
      walk(
        (reference as Record<string, unknown>)[key],
        (candidate as Record<string, unknown> | undefined)?.[key],
        path ? `${path}.${key}` : key,
        problems,
      )
    }
  }
}

export function assertDictionariesValid(): void {
  const problems: Problem[] = []
  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue
    walk(en, DICTIONARIES[locale], locale, problems)
  }
  if (problems.length > 0) {
    throw new Error(`i18n: ${problems.length} broken translations\n  ${problems.join('\n  ')}`)
  }
}

assertDictionariesValid()
