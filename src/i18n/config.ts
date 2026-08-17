// Locale registry. Importable from both server and client code — it holds no
// secrets and touches no request APIs, which is why the cookie NAME lives here
// but the cookie READING lives in ./server.ts.

export const LOCALES = ['en', 'zh-Hans', 'zh-Hant', 'ja'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

// Read by the server on every render, written by the language switcher's
// server action. Not httpOnly on purpose: it carries no authority, and a
// non-httpOnly cookie lets a future client-side enhancement read it without a
// round trip.
export const LOCALE_COOKIE = 'sb_locale'

// A year. The choice is a preference, not a session — asking someone to pick
// their language on every visit is the thing that makes language switchers
// feel broken.
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export type LocaleMeta = {
  id: Locale
  // The language's name IN that language. Never "Chinese (Simplified)" in an
  // English list — someone who cannot read the current UI has to be able to
  // find their own language in the menu.
  endonym: string
  // A short script/region tag for the collapsed switcher button.
  short: string
  // What goes in <html lang>. Distinct from `id` because BCP 47 wants the
  // script subtag spelled with a region for Traditional Chinese to be useful
  // to screen readers and translation tooling.
  htmlLang: string
  // Passed to Intl for dates and currency in that locale.
  intlLocale: string
  // Right-to-left is not in play yet, but the flag being present means adding
  // Arabic later is a data change rather than a layout audit.
  dir: 'ltr' | 'rtl'
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: {
    id: 'en',
    endonym: 'English',
    short: 'EN',
    htmlLang: 'en',
    intlLocale: 'en-CA',
    dir: 'ltr',
  },
  'zh-Hans': {
    id: 'zh-Hans',
    endonym: '简体中文',
    short: '简',
    htmlLang: 'zh-Hans',
    intlLocale: 'zh-Hans-CN',
    dir: 'ltr',
  },
  'zh-Hant': {
    id: 'zh-Hant',
    endonym: '繁體中文',
    short: '繁',
    htmlLang: 'zh-Hant',
    intlLocale: 'zh-Hant-HK',
    dir: 'ltr',
  },
  ja: {
    id: 'ja',
    endonym: '日本語',
    short: 'JA',
    htmlLang: 'ja',
    intlLocale: 'ja-JP',
    dir: 'ltr',
  },
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

// Picks the best supported locale from an Accept-Language header.
//
// Deliberately hand-rolled rather than pulled from a matching library: the
// candidate set is four entries, and the interesting cases are all Chinese —
// `zh-TW`, `zh-HK` and `zh-MO` are Traditional; bare `zh` and `zh-CN` are
// Simplified. A generic prefix match gets that wrong and serves Simplified to
// Hong Kong, which is the single most likely visitor after English.
export function matchLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE

  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';')
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith('q='))
        ?.slice(2)
      const quality = q === undefined ? 1 : Number.parseFloat(q)
      return {
        tag: tag.trim().toLowerCase(),
        // A malformed q= is treated as "no preference expressed", not as 0,
        // so one bad entry cannot silently drop a language the visitor asked
        // for by name.
        quality: Number.isFinite(quality) ? quality : 1,
      }
    })
    .filter((entry) => entry.tag && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality)

  for (const { tag } of ranked) {
    const matched = resolveTag(tag)
    if (matched) return matched
  }
  return DEFAULT_LOCALE
}

function resolveTag(tag: string): Locale | null {
  if (tag === '*') return null
  if (tag === 'ja' || tag.startsWith('ja-')) return 'ja'
  if (tag === 'en' || tag.startsWith('en-')) return 'en'

  if (tag === 'zh' || tag.startsWith('zh-')) {
    // Script subtag wins when it is stated outright.
    if (tag.includes('hant')) return 'zh-Hant'
    if (tag.includes('hans')) return 'zh-Hans'
    // Otherwise the region decides. Taiwan, Hong Kong and Macau are
    // Traditional; everything else defaults to Simplified.
    if (/-(tw|hk|mo)\b/.test(tag)) return 'zh-Hant'
    return 'zh-Hans'
  }
  return null
}
