import type { ReactNode } from 'react'

import type { Locale } from '@/i18n/config'

import { privacyEn } from './en'
import { privacyJa } from './ja'
import { privacyZhHans } from './zh-Hans'
import { privacyZhHant } from './zh-Hant'

export type PrivacySectionId =
  | 'who'
  | 'collect'
  | 'use'
  | 'visibility'
  | 'third-parties'
  | 'rights'
  | 'cookies'
  | 'contact'

// Copy for /privacy. The layout, section order and icons live in
// src/app/privacy/page.tsx; each locale file holds only words and inline
// links. English is the binding text.
export type PrivacyCopy = {
  seo: { title: string; description: string }
  badge: ReactNode
  title: ReactNode
  lead: ReactNode
  lastUpdated: ReactNode
  onThisPage: ReactNode
  pilotNotice: ReactNode
  sections: Record<PrivacySectionId, { title: string; body: ReactNode }>
  reachOut: ReactNode
  aboutUs: ReactNode
}

export const PRIVACY: Record<Locale, PrivacyCopy> = {
  en: privacyEn,
  'zh-Hans': privacyZhHans,
  'zh-Hant': privacyZhHant,
  ja: privacyJa,
}
