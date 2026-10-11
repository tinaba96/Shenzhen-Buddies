import Link from 'next/link'
import type { Metadata } from 'next'
import { SupportPanel } from '@/components/SupportPanel'
import { CURRENCY } from '@/lib/booking'
import { getI18n } from '@/i18n/server'
import { DEFAULT_OG_IMAGE } from '@/lib/config'
import { paypalConfigured } from '@/lib/paypal'
import { supportConfigured } from '@/lib/support'
import { startDonationCheckout } from './actions'

// The tours are free during the pilot; this page is how anyone — before,
// after, or without a booking — can chip in to keep it running. Linked from
// the footer and the booking page. Page copy and the <title>/description
// follow the visitor's language (t.donate, t.seo.donate).
// Card (Stripe) and PayPal are both offered when configured; the amount picker
// and buttons live in SupportPanel, the card checkout in ./actions.

export async function generateMetadata(): Promise<Metadata> {
  const seo = (await getI18n()).t.seo.donate
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: '/donate' },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: '/donate',
      // Required alongside any openGraph object — see the note in about/page.tsx.
      images: [DEFAULT_OG_IMAGE],
    },
    // Its own block, or twitter keeps the root layout's site-wide title and
    // description while og: says something else. twitter:image still comes
    // from the og image.
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
  }
}

type Props = {
  searchParams: Promise<{ thanks?: string; error?: string }>
}

export default async function DonatePage({ searchParams }: Props) {
  const [sp, { t }] = await Promise.all([searchParams, getI18n()])
  const d = t.donate
  // ./actions sends a short code; anything else (an old link) is shown as-is.
  // Own properties only — ?error=constructor must not resolve to Object's.
  const errorText =
    typeof sp.error === 'string' && sp.error
      ? Object.hasOwn(d.errors, sp.error)
        ? d.errors[sp.error as keyof typeof d.errors]
        : sp.error
      : null
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const showPaypal = paypalConfigured() && Boolean(paypalClientId)

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
        {d.kicker}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        {d.titleLine1}
        <br />
        {d.titleLine2}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        {d.body}
      </p>

      {sp.thanks && (
        <p className="mt-6 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          {d.thanks}
        </p>
      )}
      {errorText && (
        <p className="mt-6 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          {errorText}
        </p>
      )}

      <div className="mt-8">
        <SupportPanel
          kind="donation"
          presets={[5, 10, 20]}
          defaultPreset={10}
          cardEnabled={supportConfigured()}
          paypalClientId={showPaypal ? paypalClientId! : null}
          currency={CURRENCY}
          cardAction={startDonationCheckout}
          successHref="/donate?thanks=1"
          labels={t.support}
        />
      </div>

      <p className="mt-8 text-sm text-zinc-500">
        {d.bookPrefix}
        <Link
          href="/guide"
          className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-white"
        >
          {d.bookLink}
        </Link>
        {d.bookSuffix}
      </p>
    </main>
  )
}
