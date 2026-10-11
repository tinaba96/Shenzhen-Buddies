import type { ReactNode } from 'react'

import type { Locale } from '@/i18n/config'

import { cancellationEn } from './en'
import { cancellationJa } from './ja'
import { cancellationZhHans } from './zh-Hans'
import { cancellationZhHant } from './zh-Hant'

export type RefundRowId =
  | 'beforeConfirm'
  | 'over72'
  | 'between'
  | 'under24'
  | 'declined'

// Copy for /cancellation. The layout and the refund table's colours live in
// src/app/cancellation/page.tsx; each locale file holds only words and inline
// links. English is the binding text.
export type CancellationCopy = {
  seo: { title: string; description: string }
  title: ReactNode
  effective: (date: string) => ReactNode
  lead: ReactNode
  table: { when: ReactNode; refund: ReactNode }
  rows: Record<RefundRowId, { when: string; refund: string }>
  sections: { title: string; body: ReactNode }[]
  footer: ReactNode
}

export const CANCELLATION: Record<Locale, CancellationCopy> = {
  en: cancellationEn,
  'zh-Hans': cancellationZhHans,
  'zh-Hant': cancellationZhHant,
  ja: cancellationJa,
}
