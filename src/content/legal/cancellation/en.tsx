import Link from 'next/link'

import { MailLink, accentLinkClass, linkClass } from '../shared'
import type { CancellationCopy } from '.'

export const cancellationEn: CancellationCopy = {
  seo: {
    title: 'Cancellation & Refund Policy — Shenzhen Buddies',
    description:
      'How cancellations and refunds work for Shenzhen Buddies guide bookings: full refund before confirmation, then a clear 72h / 24h tiered policy.',
  },
  title: <>Cancellation &amp; Refund Policy</>,
  effective: (date) => <>Effective {date}</>,
  lead: (
    <>
      Plans change — here&apos;s exactly what you get back when you cancel
      a guide booking, in plain language.
    </>
  ),
  table: { when: <>When you cancel</>, refund: <>Refund</> },
  rows: {
    beforeConfirm: {
      when: 'Before we confirm your booking',
      refund: '100% — full refund',
    },
    over72: {
      when: '72 hours or more before the tour',
      refund: '100% — full refund',
    },
    between: {
      when: 'Between 72 and 24 hours before',
      refund: '90% (10% cancellation fee)',
    },
    under24: {
      when: 'Less than 24 hours before',
      refund: '20% (80% cancellation fee)',
    },
    declined: {
      when: 'We can’t confirm / we decline',
      refund: '100% — full refund',
    },
  },
  sections: [
    {
      title: '1. Before your booking is confirmed',
      body: (
        <p>
          When you book and pay, your day is reserved and your payment is
          held while our team (or your guide) reviews the request. Until the
          booking is <strong>confirmed</strong>, you can cancel at any time
          for a <strong>full refund</strong>.
        </p>
      ),
    },
    {
      title: '2. After your booking is confirmed',
      body: (
        <>
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
        </>
      ),
    },
    {
      title: '3. If we can’t confirm your booking',
      body: (
        <p>
          If we or your guide are unable to confirm your requested day, the
          booking is declined and you receive a <strong>full refund</strong>{' '}
          automatically — no action needed.
        </p>
      ),
    },
    {
      title: '4. No-shows',
      body: (
        <p>
          If you do not show up at the agreed meeting time and place without
          cancelling in advance, the booking is treated as a cancellation{' '}
          <strong>less than 24 hours before</strong> the tour (
          <strong>20% refund</strong>).
        </p>
      ),
    },
    {
      title: '5. How refunds are issued',
      body: (
        <p>
          Refunds are returned to your original payment method through our
          payment processor, Stripe. Depending on your bank or card issuer,
          it typically takes <strong>5–10 business days</strong> for the
          refund to appear on your statement. Refund amounts are calculated
          from the amount you actually paid (after any promo code).
        </p>
      ),
    },
    {
      title: '6. How to cancel',
      body: (
        <p>
          Sign in and open{' '}
          <Link href="/guide" className={accentLinkClass}>
            your bookings
          </Link>
          , find the booking under &ldquo;Your requests&rdquo;, and select{' '}
          <strong>Cancel</strong>. The button shows the refund that applies
          under this policy before you confirm.
        </p>
      ),
    },
    {
      title: '7. Rescheduling',
      body: (
        <p>
          We don&apos;t yet support changing the date or time of a confirmed
          booking in-app. To move a booking, cancel it (subject to this
          policy) and book a new day, or email us at{' '}
          <MailLink />{' '}
          and we&apos;ll do our best to help.
        </p>
      ),
    },
    {
      title: '8. Currency & pricing',
      body: (
        <p>
          During our free pilot, tours are offered at no charge — a
          cancellation simply frees the time slot, and there is nothing to
          refund. When tours are paid: all bookings and refunds are
          processed in Canadian dollars (CAD), tours are priced at a flat
          rate per hour shown at checkout, and your card issuer may apply
          its own currency conversion or fees, which are outside our
          control.
        </p>
      ),
    },
    {
      title: '9. Questions',
      body: (
        <p>
          If anything about a cancellation or refund seems wrong, contact us
          at{' '}
          <MailLink />{' '}
          and we&apos;ll look into it.
        </p>
      ),
    },
  ],
  footer: (
    <>
      This Cancellation &amp; Refund Policy forms part of, and should be
      read together with, our{' '}
      <Link href="/terms" className={linkClass}>
        Terms of Service
      </Link>
      . Operated by Tensai Tech Inc.
    </>
  ),
}
