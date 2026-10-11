import type { Metadata } from 'next'
import { TERMS } from '@/content/legal/terms'
import {
  LegalNotice,
  LegalSection,
  effectiveDate,
  getLegalLocale,
  legalMetadata,
  type LegalSearchParams,
} from '@/content/legal/shared'

type Props = { searchParams: LegalSearchParams }

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const legal = await getLegalLocale(searchParams)
  return legalMetadata(legal, '/terms', TERMS[legal.locale].seo)
}

export default async function TermsPage({ searchParams }: Props) {
  const legal = await getLegalLocale(searchParams)
  const copy = TERMS[legal.locale]
  return (
    <main
      className="flex flex-1 flex-col"
      lang={legal.forcedEnglish ? 'en' : undefined}
    >
      <LegalNotice legal={legal} path="/terms" />
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-rose-50 dark:from-zinc-900 dark:via-black dark:to-zinc-900" />
        <div
          className="absolute inset-0 opacity-50 dark:opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 25%, rgba(245,158,11,0.25), transparent 50%), radial-gradient(circle at 85% 75%, rgba(244,63,94,0.25), transparent 50%)',
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            {copy.effective(effectiveDate(legal))}
          </p>
          <p className="mx-auto mt-4 max-w-xl text-zinc-600 dark:text-zinc-400">
            {copy.intro}
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-3xl px-6 py-14 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        <p className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          {copy.agreement}
        </p>

        <div className="mt-10 space-y-9">
          {copy.sections.map((s) => (
            <LegalSection key={s.title} title={s.title}>
              {s.body}
            </LegalSection>
          ))}
        </div>

        <p className="mt-12 border-t border-zinc-200 pt-6 text-xs text-zinc-500 dark:border-zinc-800">
          {copy.copyright}
        </p>
      </div>
    </main>
  )
}
