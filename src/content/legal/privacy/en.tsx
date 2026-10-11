import Link from 'next/link'

import { CONTACT_EMAIL } from '@/lib/config'

import type { PrivacyCopy } from '.'

const LAST_UPDATED = 'October 2026'

export const privacyEn: PrivacyCopy = {
  seo: {
    title: 'Privacy — Shenzhen Buddies',
    description: 'How Shenzhen Buddies handles your data.',
  },
  badge: <>We don&apos;t sell your data.</>,
  title: <>Privacy</>,
  lead: (
    <>
      What we collect, why, who sees it, and what you can do about it.
      No dark patterns, no lawyer-speak.
    </>
  ),
  lastUpdated: <>Last updated · {LAST_UPDATED}</>,
  onThisPage: <>On this page</>,
  pilotNotice: (
    <>
      <strong>Pilot phase notice.</strong> Shenzhen Buddies is in pilot.
      This page describes our intended practices and will evolve as the
      product matures. Plain language; not a substitute for legal advice.
    </>
  ),
  sections: {
    who: {
      title: 'Who we are',
      body: (
        <p>
          Shenzhen Buddies is operated by <strong>Tensai Tech Inc.</strong>,
          a company based in Toronto, Canada with a partner team in
          Shenzhen, China. We are the data controller for the personal
          information you give us.
        </p>
      ),
    },
    collect: {
      title: 'What we collect',
      body: (
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Account info</strong> — email and a salted/hashed
            password (managed by Supabase Auth on our behalf).
          </li>
          <li>
            <strong>Profile info you fill in</strong> — display name, role
            (tourist or guide), city, bio, hobbies, languages, personality
            traits, optional photo.
          </li>
          <li>
            <strong>Messages</strong> — contents of conversations you start
            with other users.
          </li>
          <li>
            <strong>Reviews</strong> — stars and written feedback after
            exchanging a message.
          </li>
          <li>
            <strong>Bookings</strong> — the day and time you book, any note
            you add, the amount paid, currency, and the Stripe checkout /
            payment identifiers and status. Card numbers stay with Stripe.
          </li>
          <li>
            <strong>Consent &amp; audit records</strong> — when you book, we
            record that you agreed to our{' '}
            <Link href="/terms" className="underline">Terms</Link> and{' '}
            <Link href="/cancellation" className="underline">
              Cancellation Policy
            </Link>
            , the policy version, and your <strong>IP address</strong> and{' '}
            <strong>browser (user-agent)</strong>, as proof of agreement.
          </li>
          <li>
            <strong>Basic technical data</strong> — browser type,
            approximate region from IP, standard server logs.
          </li>
        </ul>
      ),
    },
    use: {
      title: 'How we use it',
      body: (
        <>
          <ul className="ml-5 list-disc space-y-2">
            <li>To match you with potential buddies who share your interests.</li>
            <li>To let you message, review, and be reviewed by other users.</li>
            <li>
              To take bookings and process payments and refunds via Stripe.
            </li>
            <li>
              To keep an audit record that you agreed to our Terms and
              Cancellation Policy (a legal basis for the booking contract).
            </li>
            <li>To investigate safety reports and protect users from abuse or fraud.</li>
          </ul>
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
            We <strong>do not</strong> sell your personal information, run
            third-party ads against your profile, or share with data brokers.
          </p>
        </>
      ),
    },
    visibility: {
      title: 'Who can see your profile',
      body: (
        <>
          <p>
            By default your role/name/photo/bio/hobbies/languages/traits are
            visible to signed-in users. Switch your profile to{' '}
            <strong>Private</strong> from{' '}
            <Link href="/profile" className="underline">/profile</Link> and
            only you will see it. Your email address is never shown to other
            users.
          </p>
          <p>
            Reviews you receive appear on your public profile once you have at
            least three. Until then, only you can see them.
          </p>
        </>
      ),
    },
    'third-parties': {
      title: 'Third parties',
      body: (
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Supabase</strong> — Postgres, authentication, file
            storage. (
            <a
              href="https://supabase.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              policy
            </a>
            )
          </li>
          <li>
            <strong>Vercel</strong> — application hosting and edge delivery.
          </li>
          <li>
            <strong>Stripe</strong> — payments for bookings, and refunds.
            Stripe handles all payment-card data. (
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              policy
            </a>
            )
          </li>
        </ul>
      ),
    },
    rights: {
      title: 'Your rights',
      body: (
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Access</strong> — visible in-app, or email us for a full
            export.
          </li>
          <li>
            <strong>Correction</strong> — update anytime from{' '}
            <Link href="/profile" className="underline">/profile</Link>.
          </li>
          <li>
            <strong>Deletion</strong>{' '}
            — email us to delete your account and
            your profile, messages, and reviews. We may retain limited
            booking, payment, and consent/audit records where we&apos;re
            required to keep them (for example, tax, accounting, and
            fraud-prevention obligations), then delete them when no longer
            needed.
          </li>
        </ul>
      ),
    },
    cookies: {
      title: 'Cookies',
      body: (
        <p>
          Two kinds of cookie: your auth session, set by Supabase Auth so you
          stay signed in, and a language preference that remembers your
          chosen language for a year. The language cookie holds only that
          choice and no personal data. No analytics or advertising cookies
          during the pilot.
        </p>
      ),
    },
    contact: {
      title: 'Contact',
      body: (
        <p>
          For privacy questions or to exercise any rights above, email us at{' '}
          <strong>{CONTACT_EMAIL}</strong>. We aim to respond
          within seven days.
        </p>
      ),
    },
  },
  reachOut: <>Reach out</>,
  aboutUs: <>About us</>,
}
