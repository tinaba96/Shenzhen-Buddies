import 'server-only'

import { cookies, headers } from 'next/headers'

import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_COOKIE,
  LOCALE_META,
  matchLocale,
  type Locale,
  type LocaleMeta,
} from './config'
import { getDictionary, type Dictionary } from './index'

// The visitor's locale for this request.
//
// Order is explicit choice, then browser preference, then English:
//   1. The sb_locale cookie, set by the language switcher. A choice someone
//      made by hand outranks anything inferred.
//   2. Accept-Language. Getting a Hong Kong visitor Traditional Chinese on
//      their first paint, before they have found the switcher, is the entire
//      value of this step.
//   3. DEFAULT_LOCALE.
//
// Both cookies() and headers() are dynamic APIs, so calling this opts a route
// out of static generation. That costs nothing here: the root layout already
// calls supabase.auth.getUser(), which makes every route on this site
// server-rendered per request regardless.
export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  const chosen = store.get(LOCALE_COOKIE)?.value
  if (isLocale(chosen)) return chosen

  const h = await headers()
  return matchLocale(h.get('accept-language'))
}

export type I18n = {
  locale: Locale
  meta: LocaleMeta
  t: Dictionary
}

// One call per server component that needs copy. Cheap to repeat — cookies()
// and headers() are request-scoped and the dictionaries are module constants,
// so this is a couple of map lookups, not a fetch.
export async function getI18n(): Promise<I18n> {
  const locale = await getLocale()
  return {
    locale,
    meta: LOCALE_META[locale] ?? LOCALE_META[DEFAULT_LOCALE],
    t: getDictionary(locale),
  }
}
