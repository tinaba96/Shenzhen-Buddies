'use server'

import { cookies } from 'next/headers'

import {
  isLocale,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  type Locale,
} from '@/i18n/config'

// Persists the visitor's language choice.
//
// Called from the language switcher. Returning normally re-renders the current
// route with the new cookie already in the store, so the page comes back
// translated without a navigation — which is the whole reason this is a server
// action rather than a link to a route handler that has to redirect back.
export async function setLocale(locale: Locale): Promise<void> {
  // The argument crosses the network. Anything that is not one of the four
  // supported locales is dropped rather than written, so a hand-crafted
  // request cannot put arbitrary text in a cookie this app then trusts.
  if (!isLocale(locale)) return

  const store = await cookies()
  store.set(LOCALE_COOKIE, locale, {
    maxAge: LOCALE_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    // Not httpOnly: the value is a display preference with no authority, and
    // leaving it readable lets client code pick it up without a round trip.
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
  })
}
