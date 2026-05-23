import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy — Shenzhen Buddies',
  description:
    'How Shenzhen Buddies handles your data — plain English, no dark patterns.',
}

const LAST_UPDATED = 'May 2026'

const SECTIONS: {
  id: string
  title: string
  icon: 'shield' | 'collect' | 'use' | 'eye' | 'globe' | 'lock' | 'cookie' | 'send'
}[] = [
  { id: 'who', title: 'Who we are', icon: 'shield' },
  { id: 'collect', title: 'What we collect', icon: 'collect' },
  { id: 'use', title: 'How we use it', icon: 'use' },
  { id: 'visibility', title: 'Who can see your profile', icon: 'eye' },
  { id: 'third-parties', title: 'Third parties', icon: 'globe' },
  { id: 'rights', title: 'Your rights', icon: 'lock' },
  { id: 'cookies', title: 'Cookies', icon: 'cookie' },
  { id: 'contact', title: 'Contact', icon: 'send' },
]

export default function PrivacyPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-rose-50 dark:from-zinc-900 dark:via-black dark:to-zinc-900" />
        <div
          className="absolute inset-0 opacity-50 dark:opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 25%, rgba(245,158,11,0.25), transparent 50%), radial-gradient(circle at 85% 75%, rgba(244,63,94,0.25), transparent 50%)',
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
              <path d="M9 12l2 2 4-4" />
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            We don&apos;t sell your data.
          </span>
          <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
            Privacy, in{' '}
            <span className="bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
              plain English.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-zinc-600 dark:text-zinc-400">
            What we collect, why, who sees it, and what you can do about it.
            No dark patterns, no lawyer-speak.
          </p>
          <p className="mt-4 text-xs text-zinc-500">Last updated · {LAST_UPDATED}</p>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-5xl gap-10 px-6 py-16 lg:grid-cols-[200px_1fr]">
        <aside className="hidden lg:block">
          <nav className="sticky top-20 space-y-1 text-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              On this page
            </p>
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block rounded-md px-3 py-1.5 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                {s.title}
              </a>
            ))}
          </nav>
        </aside>

        <article className="space-y-12 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
            <strong>Pilot phase notice.</strong> Shenzhen Buddies is in pilot.
            This page describes our intended practices and will evolve as the
            product matures. Plain language; not a substitute for legal advice.
          </p>

          <Section id="who" icon="shield" title="Who we are">
            <p>
              Shenzhen Buddies is operated by <strong>Tensai Tech Inc.</strong>,
              a company based in Toronto, Canada with a partner team in
              Shenzhen, China. We are the data controller for the personal
              information you give us.
            </p>
          </Section>

          <Section id="collect" icon="collect" title="What we collect">
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
                <strong>Subscription</strong> — Stripe customer ID, status,
                renewal/trial dates. Card numbers stay with Stripe.
              </li>
              <li>
                <strong>Basic technical data</strong> — browser type,
                approximate region from IP, standard server logs.
              </li>
            </ul>
          </Section>

          <Section id="use" icon="use" title="How we use it">
            <ul className="ml-5 list-disc space-y-2">
              <li>To match you with potential buddies who share your interests.</li>
              <li>To let you message, review, and be reviewed by other users.</li>
              <li>To process subscription payments via Stripe.</li>
              <li>To investigate safety reports and protect users from abuse or fraud.</li>
            </ul>
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
              We <strong>do not</strong> sell your personal information, run
              third-party ads against your profile, or share with data brokers.
            </p>
          </Section>

          <Section id="visibility" icon="eye" title="Who can see your profile">
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
          </Section>

          <Section id="third-parties" icon="globe" title="Third parties">
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
                <strong>Stripe</strong> — subscription billing. Stripe handles
                all payment-card data.
              </li>
            </ul>
          </Section>

          <Section id="rights" icon="lock" title="Your rights">
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
                <strong>Deletion</strong> — email us to delete your account; all
                your data goes with it.
              </li>
              <li>
                <strong>Cancel subscription</strong> — use the billing portal
                from <Link href="/pricing" className="underline">/pricing</Link>.
              </li>
            </ul>
          </Section>

          <Section id="cookies" icon="cookie" title="Cookies">
            <p>
              One cookie group: your auth session, set by Supabase Auth so you
              stay signed in. No analytics or advertising cookies during the
              pilot.
            </p>
          </Section>

          <Section id="contact" icon="send" title="Contact">
            <p>
              For privacy questions or to exercise any rights above, email us at{' '}
              <strong>privacy@shenzhen-buddies.com</strong>. We aim to respond
              within seven days.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/contact"
                className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Reach out
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                About us
              </Link>
            </div>
          </Section>
        </article>
      </div>
    </main>
  )
}

function Section({
  id,
  icon,
  title,
  children,
}: {
  id: string
  icon:
    | 'shield'
    | 'collect'
    | 'use'
    | 'eye'
    | 'globe'
    | 'lock'
    | 'cookie'
    | 'send'
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 to-rose-200 text-zinc-800 dark:from-amber-900/40 dark:to-rose-900/40 dark:text-zinc-100">
          <SectionIcon name={icon} />
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  )
}

function SectionIcon({ name }: { name: 'shield' | 'collect' | 'use' | 'eye' | 'globe' | 'lock' | 'cookie' | 'send' }) {
  const cls = 'h-4 w-4'
  switch (name) {
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    case 'collect':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M3 7h18" />
          <path d="M3 12h18" />
          <path d="M3 17h12" />
        </svg>
      )
    case 'use':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M12 2v6" />
          <path d="M12 22v-6" />
          <path d="m4.93 4.93 4.24 4.24" />
          <path d="m14.83 14.83 4.24 4.24" />
          <path d="M2 12h6" />
          <path d="M22 12h-6" />
          <path d="m4.93 19.07 4.24-4.24" />
          <path d="m14.83 9.17 4.24-4.24" />
        </svg>
      )
    case 'eye':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    case 'globe':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15 15 0 0 1 0 20" />
          <path d="M12 2a15 15 0 0 0 0 20" />
        </svg>
      )
    case 'lock':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 1 1 8 0v4" />
        </svg>
      )
    case 'cookie':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-4-4 4 4 0 0 1-4-4 4 4 0 0 1-2-2z" />
          <path d="M8.5 8.5h.01" />
          <path d="M16 15h.01" />
          <path d="M11 17h.01" />
        </svg>
      )
    case 'send':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="m22 2-7 20-4-9-9-4z" />
          <path d="M22 2 11 13" />
        </svg>
      )
  }
}
