import Link from 'next/link'
import type { Metadata } from 'next'

import { LOCALE_META, type Locale, type LocaleMeta } from '@/i18n/config'
import { getI18n } from '@/i18n/server'
import { CONTACT_EMAIL, DEFAULT_OG_IMAGE } from '@/lib/config'
import { POLICY_EFFECTIVE, POLICY_VERSION } from '@/lib/policy'

// Shared plumbing for the three legal pages (/terms, /privacy, /cancellation).
//
// The English text is the binding version; the zh-Hans, zh-Hant and ja copies
// are convenience translations. Each translated page says so at the top and
// links to the English via ?lang=en, which forces English for that one page
// without touching the visitor's language cookie.

export const COMPANY = 'Tensai Tech Inc.'

export const linkClass = 'underline underline-offset-2'
export const accentLinkClass =
  'font-medium text-amber-700 underline underline-offset-2 dark:text-amber-400'

export function MailLink() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className={accentLinkClass}>
      {CONTACT_EMAIL}
    </a>
  )
}

export type LegalSearchParams = Promise<{ lang?: string | string[] }>

export type LegalLocale = {
  // The locale the page's copy renders in.
  locale: Locale
  meta: LocaleMeta
  // The visitor's own locale, which differs from `locale` only when ?lang=en
  // forced the English original.
  visitorLocale: Locale
  forcedEnglish: boolean
}

export async function getLegalLocale(
  searchParams: LegalSearchParams,
): Promise<LegalLocale> {
  const { locale, meta } = await getI18n()
  const { lang } = await searchParams
  if (lang === 'en' && locale !== 'en') {
    return {
      locale: 'en',
      meta: LOCALE_META.en,
      visitorLocale: locale,
      forcedEnglish: true,
    }
  }
  return { locale, meta, visitorLocale: locale, forcedEnglish: false }
}

// Every locale declares its own og/twitter blocks so link previews carry the
// page's own title and language. The ?lang=en view of a translated page is a
// duplicate of the English page, so it stays out of search results.
export function legalMetadata(
  { meta, forcedEnglish }: LegalLocale,
  path: string,
  seo: { title: string; description: string },
): Metadata {
  return {
    ...seo,
    ...(forcedEnglish ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      locale: meta.ogLocale,
      title: seo.title,
      description: seo.description,
      url: path,
      // The openGraph object replaces the root layout's wholesale, so the
      // default card has to be restated. See DEFAULT_OG_IMAGE.
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
  }
}

// POLICY_EFFECTIVE is English prose; other locales format the same day from
// POLICY_VERSION so the two can never drift apart.
export function effectiveDate({ locale, meta }: LegalLocale): string {
  if (locale === 'en') return POLICY_EFFECTIVE
  return new Intl.DateTimeFormat(meta.intlLocale, {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${POLICY_VERSION}T00:00:00Z`))
}

const NOTICE: Record<
  Exclude<Locale, 'en'>,
  { translated: string; readEnglish: string; reading: string; back: string }
> = {
  'zh-Hans': {
    translated:
      '本页中文内容为方便阅读而提供的译文。如与英文版有任何不一致，以英文版为准。',
    readEnglish: '查看英文原版',
    reading: '你正在阅读英文原版。',
    back: '返回中文版',
  },
  'zh-Hant': {
    translated:
      '本頁中文內容為方便閱讀而提供的譯本。如與英文版本有任何差異，概以英文版本為準。',
    readEnglish: '閱讀英文原版',
    reading: '你正在閱讀英文原版。',
    back: '返回中文版',
  },
  ja: {
    translated:
      'このページは、参考のために英語の原文を日本語に訳したものです。英語版と内容が異なる場合は、英語版が優先されます。',
    readEnglish: '英語版を読む',
    reading: '英語の原文を表示しています。',
    back: '日本語版に戻る',
  },
}

// The bar at the top of a legal page: "this is a translation, English
// prevails" on translated pages, and a way back on the forced-English view.
// Renders nothing for English visitors, so their page is unchanged.
export function LegalNotice({
  legal,
  path,
}: {
  legal: LegalLocale
  path: string
}) {
  if (legal.visitorLocale === 'en') return null
  const copy = NOTICE[legal.visitorLocale]
  return (
    <div
      // On the forced-English view the surrounding <main> is lang="en", but
      // this bar is still in the visitor's language.
      lang={
        legal.forcedEnglish
          ? LOCALE_META[legal.visitorLocale].htmlLang
          : undefined
      }
      className="border-b border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
    >
      <p className="mx-auto max-w-3xl px-6 py-3 text-center text-xs leading-relaxed">
        {legal.forcedEnglish ? copy.reading : copy.translated}
        <Link
          href={legal.forcedEnglish ? path : `${path}?lang=en`}
          className="font-medium underline underline-offset-2"
        >
          {legal.forcedEnglish ? copy.back : copy.readEnglish}
        </Link>
      </p>
    </div>
  )
}

export function LegalSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h2>
      {children}
    </section>
  )
}
