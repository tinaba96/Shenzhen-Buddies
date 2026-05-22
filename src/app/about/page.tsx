import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — Shenzhen Buddies',
  description:
    'Why we built Shenzhen Buddies — and what we think makes it different from the tour-bus and travel-agency world.',
}

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-rose-50 dark:from-zinc-900 dark:via-black dark:to-zinc-900" />
        <div
          className="absolute inset-0 opacity-50 dark:opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(245,158,11,0.2), transparent 50%), radial-gradient(circle at 80% 80%, rgba(244,63,94,0.2), transparent 50%)',
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            About
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            Built for explorers and the locals who love their city.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-zinc-600 dark:text-zinc-400">
            Shenzhen Buddies matches travelers with locals who share their
            interests. Casual, affordable, personal — the opposite of a tour
            bus.
          </p>
        </div>
      </section>

      <article className="mx-auto w-full max-w-2xl space-y-10 px-6 py-16 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
        <Section title="Why we built this">
          <p>
            Shenzhen is one of the most dynamic cities in the world — futuristic,
            chaotic, generous, easy to get wrong if you don&apos;t know where to
            look. We kept hearing the same story from friends who visited: the
            food was incredible, the city was friendly, but they spent most of
            their trip translating menus and arguing with map apps.
          </p>
          <p>
            We figured the missing piece wasn&apos;t a slicker booking site or
            another &ldquo;top-ten&rdquo; list. It was a person. Someone who lives there,
            shares your interests, and is happy to show you around for an
            afternoon.
          </p>
        </Section>

        <Section title="How it&rsquo;s different">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Dot tone="amber" />
              <span>
                <strong className="font-semibold">Matching by interests, not just availability.</strong>{' '}
                Find someone who actually cares about the same things you do —
                food, art, electronics, hiking, jazz, late-night noodles.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Dot tone="rose" />
              <span>
                <strong className="font-semibold">Casual, not commercial.</strong>{' '}
                Locals here aren&apos;t licensed tour operators — they&apos;re
                neighbors who&apos;d show a visiting friend around the same
                way.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Dot tone="emerald" />
              <span>
                <strong className="font-semibold">Reviewed by the community.</strong>{' '}
                Trust is earned. Reviews are visible once a profile has enough
                interactions, so first impressions are honest.
              </span>
            </li>
          </ul>
        </Section>

        <Section title="The people behind it">
          <p>
            Shenzhen Buddies is built by{' '}
            <span className="font-medium">Tensai Tech Inc.</span> — a two-person
            team split between Shenzhen and Toronto. Brian (CEO, Shenzhen)
            handles community, partnerships, and on-the-ground knowledge.
            Taka (CTO, Toronto) handles tech.
          </p>
          <p>
            We&apos;re in pilot. That means lower prices, real human attention
            to every new sign-up, and a roadmap that&apos;s still being shaped
            by what early users tell us they want.
          </p>
        </Section>

        <Section title="Where we go next">
          <p>
            Shenzhen first. Once the matching works well here, we&apos;ll
            extend to other cities where the same problem exists: places
            you&apos;d love to visit if only you knew someone there.
          </p>
        </Section>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Got feedback, or want to be a guide?
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Join the pilot
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Get in touch
            </Link>
          </div>
        </div>
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
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}

function Dot({ tone }: { tone: 'amber' | 'rose' | 'emerald' }) {
  const cls = {
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
    emerald: 'bg-emerald-400',
  }[tone]
  return (
    <span
      aria-hidden
      className={`mt-2 inline-block h-2 w-2 flex-shrink-0 rounded-full ${cls}`}
    />
  )
}
