import Link from 'next/link'
import type { Metadata } from 'next'
import { SubmitButton } from '@/components/SubmitButton'
import { DEFAULT_OG_IMAGE } from '@/lib/config'
import { startDonationCheckout } from './actions'

// The tours are free during the pilot; this page is how anyone — before,
// after, or without a booking — can chip in to keep it running. Linked from
// the footer and the booking page. English-only for now, like /welcome.

const TITLE = 'Support the pilot — Shenzhen Buddies'
const DESCRIPTION =
  'Tours are free while we get Shenzhen Buddies off the ground. If it made your trip better, a small donation keeps it running.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/donate' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/donate',
    // Required alongside any openGraph object — see the note in about/page.tsx.
    images: [DEFAULT_OG_IMAGE],
  },
}

const AMOUNTS = [5, 10, 20]

type Props = {
  searchParams: Promise<{ thanks?: string; error?: string }>
}

export default async function DonatePage({ searchParams }: Props) {
  const sp = await searchParams

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Support the pilot
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        The tours are free.
        <br />
        Running them isn&apos;t.
      </h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        While we get Shenzhen Buddies off the ground, every tour is free — no
        booking fee, no hourly rate. If a day out with a buddy made your trip
        better, or you just like what we&apos;re building, a small donation
        helps cover the guides&apos; time and keeps the pilot going. Any
        amount, any time — booking or no booking.
      </p>

      {sp.thanks && (
        <p className="mt-6 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          Thank you! Your donation came through — it genuinely keeps this
          running.
        </p>
      )}
      {sp.error && (
        <p className="mt-6 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          {sp.error}
        </p>
      )}

      <form
        action={startDonationCheckout}
        className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <p className="text-sm font-semibold">Choose an amount</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {AMOUNTS.map((d) => (
            <SubmitButton
              key={d}
              name="amount"
              value={String(d)}
              pendingLabel="…"
              className="rounded-xl border border-zinc-300 bg-white px-2 py-3.5 text-base font-semibold transition hover:border-amber-400 hover:bg-amber-50 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-amber-600 dark:hover:bg-amber-950/40"
            >
              CA${d}
            </SubmitButton>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            type="number"
            name="custom_amount"
            min={1}
            max={500}
            step={1}
            placeholder="Custom amount (CA$)"
            className="block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          />
          <SubmitButton
            pendingLabel="Opening…"
            className="shrink-0 rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Donate
          </SubmitButton>
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          Paid securely by card via Stripe. One-off, no account needed, and no
          perks attached — this is a thank-you, not a purchase.
        </p>
      </form>

      <p className="mt-8 text-sm text-zinc-500">
        Haven&apos;t booked yet?{' '}
        <Link
          href="/guide"
          className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-white"
        >
          Book a free tour first
        </Link>{' '}
        — that helps us even more.
      </p>
    </main>
  )
}
