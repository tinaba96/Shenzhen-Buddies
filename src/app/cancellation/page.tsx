import type { Metadata } from 'next'
import {
  CANCELLATION,
  type RefundRowId,
} from '@/content/legal/cancellation'
import {
  LegalNotice,
  LegalSection as Section,
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
  return legalMetadata(legal, '/cancellation', CANCELLATION[legal.locale].seo)
}

// Row order and colour; the words live in src/content/legal/cancellation.
const ROWS: { id: RefundRowId; good?: boolean; bad?: boolean }[] = [
  { id: 'beforeConfirm', good: true },
  { id: 'over72', good: true },
  { id: 'between' },
  { id: 'under24', bad: true },
  { id: 'declined', good: true },
]

export default async function CancellationPage({ searchParams }: Props) {
  const legal = await getLegalLocale(searchParams)
  const copy = CANCELLATION[legal.locale]
  return (
    <main
      className="flex flex-1 flex-col"
      lang={legal.forcedEnglish ? 'en' : undefined}
    >
      <LegalNotice legal={legal} path="/cancellation" />
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
            {copy.lead}
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-3xl px-6 py-14">
        {/* Summary table */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">{copy.table.when}</th>
                <th className="px-4 py-3 font-medium">{copy.table.refund}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {ROWS.map((r) => (
                <Row
                  key={r.id}
                  when={copy.rows[r.id].when}
                  refund={copy.rows[r.id].refund}
                  good={r.good}
                  bad={r.bad}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="prose-legal mt-12 space-y-10 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {copy.sections.map((s) => (
            <Section key={s.title} title={s.title}>
              {s.body}
            </Section>
          ))}

          <p className="border-t border-zinc-200 pt-6 text-xs text-zinc-500 dark:border-zinc-800">
            {copy.footer}
          </p>
        </div>
      </div>
    </main>
  )
}

function Row({
  when,
  refund,
  good,
  bad,
}: {
  when: string
  refund: string
  good?: boolean
  bad?: boolean
}) {
  return (
    <tr className="bg-white dark:bg-zinc-950">
      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{when}</td>
      <td
        className={`px-4 py-3 font-medium ${
          good
            ? 'text-emerald-700 dark:text-emerald-400'
            : bad
              ? 'text-red-600 dark:text-red-400'
              : 'text-amber-700 dark:text-amber-400'
        }`}
      >
        {refund}
      </td>
    </tr>
  )
}
