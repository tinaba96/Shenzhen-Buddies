import Link from 'next/link'
import type { Metadata } from 'next'
import { POLICY_EFFECTIVE } from '@/lib/policy'

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy — Shenzhen Buddies',
  description:
    'How cancellations and refunds work for Shenzhen Buddies guide bookings: full refund before confirmation, then a clear 72h / 24h tiered policy.',
}

const EFFECTIVE = POLICY_EFFECTIVE
const CONTACT_EMAIL = 'hello@shenzhen-buddies.com'

export default function CancellationPage() {
  return (
    <main className="flex flex-1 flex-col">
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
            Cancellation &amp; Refund Policy
          </h1>
          <p className="mt-3 text-sm text-zinc-500">Effective {EFFECTIVE}</p>
          <p className="mx-auto mt-4 max-w-xl text-zinc-600 dark:text-zinc-400">
            Plans change — here&apos;s exactly what you get back when you cancel
            a guide booking, in plain language.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-3xl px-6 py-14">
        {/* Summary table */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">When you cancel</th>
                <th className="px-4 py-3 font-medium">Refund</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              <Row when="Before we confirm your booking" refund="100% — full refund" good />
              <Row when="72 hours or more before the tour" refund="100% — full refund" good />
              <Row when="Between 72 and 24 hours before" refund="90% (10% cancellation fee)" />
              <Row when="Less than 24 hours before" refund="20% (80% cancellation fee)" bad />
              <Row when="We can’t confirm / we decline" refund="100% — full refund" good />
            </tbody>
          </table>
        </div>

        <div className="prose-legal mt-12 space-y-10 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <Section title="1. Before your booking is confirmed">
            <p>
              When you book and pay, your day is reserved and your payment is
              held while our team (or your guide) reviews the request. Until the
              booking is <strong>confirmed</strong>, you can cancel at any time
              for a <strong>full refund</strong>.
            </p>
          </Section>

          <Section title="2. After your booking is confirmed">
            <p>
              Once confirmed, the following tiered policy applies, measured from
              the scheduled <strong>start time of your tour</strong> (Shenzhen
              time, UTC+8):
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li>
                <strong>72 hours or more before the start time:</strong> full
                refund (100%).
              </li>
              <li>
                <strong>Between 72 and 24 hours before:</strong> 90% refund — a
                10% cancellation fee applies.
              </li>
              <li>
                <strong>Less than 24 hours before:</strong> 20% refund — an 80%
                cancellation fee applies.
              </li>
            </ul>
            <p>
              The exact refund is shown on the cancel button before you confirm,
              so you always know what you&apos;ll get back.
            </p>
          </Section>

          <Section title="3. If we can’t confirm your booking">
            <p>
              If we or your guide are unable to confirm your requested day, the
              booking is declined and you receive a <strong>full refund</strong>{' '}
              automatically — no action needed.
            </p>
          </Section>

          <Section title="4. No-shows">
            <p>
              If you do not show up at the agreed meeting time and place without
              cancelling in advance, the booking is treated as a cancellation{' '}
              <strong>less than 24 hours before</strong> the tour (
              <strong>20% refund</strong>).
            </p>
          </Section>

          <Section title="5. How refunds are issued">
            <p>
              Refunds are returned to your original payment method through our
              payment processor, Stripe. Depending on your bank or card issuer,
              it typically takes <strong>5–10 business days</strong> for the
              refund to appear on your statement. Refund amounts are calculated
              from the amount you actually paid (after any promo code).
            </p>
          </Section>

          <Section title="6. How to cancel">
            <p>
              Sign in and open{' '}
              <Link
                href="/guide"
                className="font-medium text-amber-700 underline underline-offset-2 dark:text-amber-400"
              >
                your bookings
              </Link>
              , find the booking under &ldquo;Your requests&rdquo;, and select{' '}
              <strong>Cancel</strong>. The button shows the refund that applies
              under this policy before you confirm.
            </p>
          </Section>

          <Section title="7. Rescheduling">
            <p>
              We don&apos;t yet support changing the date or time of a confirmed
              booking in-app. To move a booking, cancel it (subject to this
              policy) and book a new day, or email us at{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-amber-700 underline underline-offset-2 dark:text-amber-400"
              >
                {CONTACT_EMAIL}
              </a>{' '}
              and we&apos;ll do our best to help.
            </p>
          </Section>

          <Section title="8. Currency &amp; pricing">
            <p>
              All bookings and refunds are processed in Canadian dollars (CAD).
              Tours are priced at a flat rate per hour shown at checkout. Your
              card issuer may apply its own currency conversion or fees, which
              are outside our control.
            </p>
          </Section>

          <Section title="9. Questions">
            <p>
              If anything about a cancellation or refund seems wrong, contact us
              at{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-amber-700 underline underline-offset-2 dark:text-amber-400"
              >
                {CONTACT_EMAIL}
              </a>{' '}
              and we&apos;ll look into it.
            </p>
          </Section>

          <p className="border-t border-zinc-200 pt-6 text-xs text-zinc-500 dark:border-zinc-800">
            This Cancellation &amp; Refund Policy forms part of, and should be
            read together with, our{' '}
            <Link href="/terms" className="underline underline-offset-2">
              Terms of Service
            </Link>
            . Operated by Tensai Tech Inc.
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

function Section({
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
