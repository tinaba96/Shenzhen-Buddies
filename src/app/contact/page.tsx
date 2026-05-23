import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Shenzhen Buddies',
  description:
    'Get in touch with the Shenzhen Buddies team — feedback, partnerships, press, or guide applications.',
}

const HERO_PHOTO =
  'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=2400&q=80&auto=format&fit=crop'

const CONTACT_EMAIL = 'hello@shenzhen-buddies.com'
const PRESS_EMAIL = 'press@shenzhen-buddies.com'

const CHANNELS: {
  title: string
  description: string
  ctaLabel: string
  href: string
  icon: 'envelope' | 'guide' | 'megaphone' | 'shield'
  tone: 'amber' | 'rose' | 'emerald' | 'sky'
}[] = [
  {
    title: 'Say hello',
    description:
      'Questions, feedback, partnership ideas, or just a friendly hi. We read every message.',
    ctaLabel: 'Email us',
    href: `mailto:${CONTACT_EMAIL}`,
    icon: 'envelope',
    tone: 'amber',
  },
  {
    title: 'Become a guide',
    description:
      'Living in Shenzhen and want to host visitors? Apply and we’ll fast-track your profile review.',
    ctaLabel: 'Apply',
    href: '/signup?as=guide',
    icon: 'guide',
    tone: 'rose',
  },
  {
    title: 'Press',
    description:
      'Working on a story? We have founder bios, screenshots, and stats ready to share.',
    ctaLabel: 'Press kit',
    href: `mailto:${PRESS_EMAIL}`,
    icon: 'megaphone',
    tone: 'sky',
  },
  {
    title: 'Safety',
    description:
      'Concerned about another user? Report it from their profile, or email our trust & safety team.',
    ctaLabel: 'Safety contact',
    href: `mailto:${CONTACT_EMAIL}`,
    icon: 'shield',
    tone: 'emerald',
  },
]

const FACTS = [
  { label: 'Company', value: 'Tensai Tech Inc.' },
  { label: 'Founded', value: '2026 · Toronto + Shenzhen' },
  { label: 'Team', value: 'Brian (CEO) · Taka (CTO)' },
  { label: 'Stage', value: 'Pilot — Shenzhen first' },
]

export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_PHOTO}
          alt="Shenzhen at night"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/45 to-black/75" />
        <div
          className="absolute inset-0 mix-blend-soft-light opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 30%, rgba(244,63,94,0.5), transparent 50%), radial-gradient(circle at 20% 80%, rgba(245,158,11,0.5), transparent 50%)',
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 py-28 text-center text-white sm:py-36">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white backdrop-blur">
            Get in touch
          </p>
          <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight drop-shadow-lg sm:text-7xl">
            We&apos;d{' '}
            <span className="bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-transparent">
              love
            </span>{' '}
            to hear from you.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-white/90 drop-shadow sm:text-xl">
            Two humans on the other end. We try to reply within two business
            days.
          </p>
        </div>
      </section>

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto grid max-w-5xl gap-5 px-6 py-20 sm:grid-cols-2">
          {CHANNELS.map((c) => (
            <article
              key={c.title}
              className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${
                  c.tone === 'amber'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    : c.tone === 'rose'
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    : c.tone === 'sky'
                    ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                <ChannelIcon name={c.icon} />
              </span>
              <h2 className="mt-5 text-xl font-semibold">{c.title}</h2>
              <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                {c.description}
              </p>
              <Link
                href={c.href}
                className="mt-5 inline-flex w-fit items-center gap-1 rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {c.ctaLabel}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/40">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              The facts
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              In case you wondered.
            </h2>
          </div>
          <dl className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FACTS.map((f) => (
              <div
                key={f.label}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  {f.label}
                </dt>
                <dd className="mt-2 text-sm font-semibold leading-snug">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-rose-50 to-rose-100 dark:from-amber-950/40 dark:via-zinc-900 dark:to-rose-950/40" />
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Or just sign up and explore.
          </h2>
          <p className="mt-3 text-zinc-700 dark:text-zinc-300">
            The fastest way to understand the product is to use it.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Join the pilot
            </Link>
            <Link
              href="/explore"
              className="rounded-full border border-zinc-300 bg-white/80 px-6 py-3 text-sm font-medium backdrop-blur transition hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/60 dark:hover:bg-zinc-900"
            >
              Explore Shenzhen
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function ChannelIcon({ name }: { name: 'envelope' | 'guide' | 'megaphone' | 'shield' }) {
  const cls = 'h-5 w-5'
  switch (name) {
    case 'envelope':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <path d="m22 6-10 7L2 6" />
        </svg>
      )
    case 'guide':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden>
          <path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      )
    case 'megaphone':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden>
          <path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1z" />
          <path d="M16 8a5 5 0 0 1 0 8" />
          <path d="M19 5a9 9 0 0 1 0 14" />
        </svg>
      )
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )
  }
}
