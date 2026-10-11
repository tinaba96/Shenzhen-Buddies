import type { ReactNode } from 'react'

import type { Locale } from '@/i18n/config'

import { termsEn } from './en'
import { termsJa } from './ja'
import { termsZhHans } from './zh-Hans'
import { termsZhHant } from './zh-Hant'

// Copy for /terms. The layout lives in src/app/terms/page.tsx; each locale
// file holds only words and inline links. English is the binding text.
export type TermsCopy = {
  seo: { title: string; description: string }
  title: ReactNode
  effective: (date: string) => ReactNode
  intro: ReactNode
  agreement: ReactNode
  sections: { title: string; body: ReactNode }[]
  copyright: ReactNode
}

export const TERMS: Record<Locale, TermsCopy> = {
  en: termsEn,
  'zh-Hans': termsZhHans,
  'zh-Hant': termsZhHant,
  ja: termsJa,
}
