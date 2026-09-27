import Link from 'next/link'
import type { Metadata } from 'next'
import { DonatePanel } from '@/components/DonatePanel'
import { CURRENCY } from '@/lib/booking'
import { DEFAULT_OG_IMAGE } from '@/lib/config'
import { paypalConfigured } from '@/lib/paypal'
import { supportConfigured } from '@/lib/support'

// The tours are free during the pilot; this page is how anyone — before,
// after, or without a booking — can chip in to keep it running. Linked from
// the footer and the booking page. English-only for now, like /welcome.
// Card (Stripe) and PayPal are both offered when configured; the amount picker
// and buttons live in DonatePanel, the card checkout in ./actions.

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

type Props = {
  searchParams: Promise<{ thanks?: string; error?: string }>
}

export default async function DonatePage({ searchParams }: Props) {
  const sp = await searchParams
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const showPaypal = paypalConfigured() && Boolean(paypalClientId)

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

      <div className="mt-8">
        <DonatePanel
          cardEnabled={supportConfigured()}
          paypalClientId={showPaypal ? paypalClientId! : null}
          currency={CURRENCY}
        />
      </div>

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
