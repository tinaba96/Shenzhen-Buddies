import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy — Shenzhen Buddies',
  description:
    'How Shenzhen Buddies handles your data — what we collect, why, who sees it, and what you can do about it.',
}

const LAST_UPDATED = 'May 2026'

export default function PrivacyPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-rose-50 dark:from-zinc-900 dark:via-black dark:to-zinc-900" />
        <div className="relative mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Privacy
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            What we collect, why, and what you can do about it.
          </h1>
          <p className="mt-3 text-xs text-zinc-500">Last updated · {LAST_UPDATED}</p>
        </div>
      </section>

      <article className="mx-auto w-full max-w-2xl space-y-10 px-6 py-16 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          Shenzhen Buddies is currently in a pilot phase. This page describes
          our intended practices; we will update it as the product matures.
          It is written in plain language and is not a substitute for legal
          advice.
        </p>

        <Section title="Who we are">
          <p>
            Shenzhen Buddies is operated by <strong>Tensai Tech Inc.</strong>,
            a company based in Toronto, Canada with a partner in Shenzhen,
            China. We are the data controller for the personal information you
            give us through the service.
          </p>
        </Section>

        <Section title="What we collect">
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong>Account info</strong> — email address and a salted/hashed
              password (managed by Supabase Auth on our behalf).
            </li>
            <li>
              <strong>Profile info you fill in</strong> — display name, role
              (tourist or guide), city, bio, hobbies, languages, personality
              traits, and an optional profile photo.
            </li>
            <li>
              <strong>Messages</strong> — the contents of conversations you
              start with other users. Stored so both participants can see them.
            </li>
            <li>
              <strong>Reviews</strong> — stars and written feedback you leave
              for another user after exchanging at least one message.
            </li>
            <li>
              <strong>Subscription</strong> — if you start a Premium trial, we
              record the Stripe customer ID, subscription status, and
              renewal/trial dates. We do not store full card numbers; that data
              stays with Stripe.
            </li>
            <li>
              <strong>Basic technical data</strong> — your browser type,
              approximate region (from IP), and standard server logs needed to
              keep the service running.
            </li>
          </ul>
        </Section>

        <Section title="How we use it">
          <ul className="ml-5 list-disc space-y-2">
            <li>To match you with potential buddies who share your interests.</li>
            <li>To let you message, review, and be reviewed by other users.</li>
            <li>
              To process subscription payments (via Stripe) and to manage your
              membership.
            </li>
            <li>
              To investigate safety reports and protect users from abuse or
              fraud.
            </li>
          </ul>
          <p>
            We <strong>do not</strong> sell your personal information, run
            third-party ads against your profile, or share your data with data
            brokers.
          </p>
        </Section>

        <Section title="Who can see your profile">
          <p>
            By default, the role/name/photo/bio/hobbies/languages/traits on
            your profile are visible to other signed-in users on the platform.
            You can set your profile to <strong>Private</strong> from the
            profile editor at any time; only you will see it after that. Your
            email address is never shown to other users.
          </p>
          <p>
            Reviews you receive appear on your public profile once it has at
            least three reviews. Until then, only you can see them.
          </p>
        </Section>

        <Section title="Third parties">
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong>Supabase</strong> — Postgres hosting, authentication, file
              storage. They process data on our behalf under their{' '}
              <a
                href="https://supabase.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                privacy policy
              </a>
              .
            </li>
            <li>
              <strong>Vercel</strong> — application hosting and edge delivery.
            </li>
            <li>
              <strong>Stripe</strong> — subscription billing if you opt into
              Premium. Stripe handles all payment-card data.
            </li>
          </ul>
        </Section>

        <Section title="Your rights">
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong>Access</strong> — your profile, messages, and reviews
              are visible in-app. Email us if you want a full export.
            </li>
            <li>
              <strong>Correction</strong> — update your profile any time from{' '}
              <Link href="/profile" className="underline">/profile</Link>.
            </li>
            <li>
              <strong>Deletion</strong> — email us to delete your account. All
              your profile data, messages, and reviews are removed permanently.
            </li>
            <li>
              <strong>Cancel subscription</strong> — use the billing portal
              linked from <Link href="/pricing" className="underline">/pricing</Link>.
            </li>
          </ul>
        </Section>

        <Section title="Cookies">
          <p>
            We use one cookie group: your authentication session, set by
            Supabase Auth so you stay signed in. We do not use analytics or
            advertising cookies during the pilot.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            For privacy questions or to exercise any of the rights above, email
            us at <strong>privacy@shenzhen-buddies.com</strong>. We aim to
            respond within seven days.
          </p>
        </Section>
      </article>
    </main>
  )
}

function Section({
  title,
  children,
}: {
  title: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  )
}
