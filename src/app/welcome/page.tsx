import Link from 'next/link'
import type { Metadata } from 'next'
import { DEFAULT_OG_IMAGE } from '@/lib/config'
import { HeroImage } from '@/components/HeroImage'

// This URL is pasted into Instagram/X/Threads bios, so it stays put — but the
// offer on it moved with the free pilot: no promo code, the whole tour is
// free. The VIP50 flow it replaced is in git history if paid tours return.

const TITLE = 'Your first day in Shenzhen, free — Shenzhen Buddies'
const DESCRIPTION =
  'Book a local buddy in Shenzhen for a free 2 or 3 hour day out while we pilot. No card, no deposit — request a day and we confirm by email.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/welcome' },
  // Declared explicitly: the root layout sets an openGraph block, and
  // metadata merges per key — so a page that omits this inherits the site's
  // generic title, description and an og:url pointing at the homepage.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/welcome',
    // Required alongside any openGraph object — see the note in about/page.tsx.
    // This page is the landing page pasted into Instagram, so a missing card
    // here costs more than on any other route.
    images: [DEFAULT_OG_IMAGE],
  },
}


export default function WelcomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <DealStrip />
      <HowItWorks />
      <Why />
      <Testimonials />
      <Faq />
      <FinalCta />
    </main>
  )
}

/* ------------------------------- Hero ---------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <HeroImage
        name="skyline-bay-dusk-reflections"
        alt="Shenzhen skyline at dusk"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/55 to-black/85" />
      {/* Animated colour blobs */}
      <div
        className="pointer-events-none absolute -left-24 top-10 h-96 w-96 animate-pulse rounded-full bg-amber-500/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 animate-pulse rounded-full bg-rose-500/30 blur-3xl [animation-delay:1s]"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-28 text-center text-white sm:py-36">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Pilot season · every tour is free
        </p>

        <h1 className="mt-7 max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight drop-shadow-xl sm:text-7xl">
          Your first day in Shenzhen,{' '}
          <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">
            free.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-lg text-white/90 drop-shadow sm:text-xl">
          Skip the tour bus. Spend 2 or 3 hours with a real local who shows you
          the food, streets, and corners you’d never find alone — and while
          we’re piloting, it costs you nothing.
        </p>

        {/* The free "ticket" — same shape the promo code used to sit in */}
        <div className="mt-10 w-full max-w-md">
          <div className="relative rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 p-[2px] shadow-2xl shadow-rose-500/30">
            <div className="relative flex items-center justify-between gap-4 rounded-[15px] bg-zinc-950/90 px-6 py-5 backdrop-blur">
              {/* Ticket notches */}
              <span className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-black/85" aria-hidden />
              <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-black/85" aria-hidden />
              <div className="text-left">
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/60">
                  Pilot price
                </p>
                <p className="mt-1 bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-2xl font-bold tracking-wide text-transparent">
                  FREE
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold leading-none">CA$0</p>
                <p className="text-[11px] uppercase tracking-wider text-white/60">
                  no code needed
                </p>
              </div>
            </div>
          </div>
          <p className="mt-2 text-xs text-white/60">
            No card, no deposit, no checkout — just pick a day
          </p>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/guide"
            className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-zinc-900 shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-zinc-100"
          >
            Book my free day →
          </Link>
          <Link
            href="/tours"
            className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
          >
            See the experiences
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-wider text-white/60">
          <TrustItem>Free 2 or 3 hour tours</TrustItem>
          <TrustItem>No card, no deposit</TrustItem>
          <TrustItem>Confirmed by email</TrustItem>
        </div>
      </div>
    </section>
  )
}

function TrustItem({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-emerald-400">
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="10" />
      </svg>
      {children}
    </span>
  )
}

/* ----------------------------- Deal strip ------------------------------ */

function DealStrip() {
  return (
    <section className="border-y border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              The pilot deal
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              A day out, for{' '}
              <span className="bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
                nothing.
              </span>
            </h2>
            <p className="mt-4 max-w-md text-zinc-600 dark:text-zinc-400">
              While we get Shenzhen Buddies off the ground, every tour is
              free — pick a 2 or 3 hour day with a local buddy. There is no
              payment step at all: request a day, and we confirm by email
              within three business days.
            </p>
            <Link
              href="/guide"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Pick a day
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Price example card */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-amber-50 to-rose-50 p-8 shadow-sm dark:border-zinc-800 dark:from-amber-950/30 dark:to-rose-950/30">
            <p className="text-sm font-medium text-zinc-500">
              Example · a 3-hour tour
            </p>
            <div className="mt-4 flex items-end gap-3">
              <span className="text-2xl text-zinc-400 line-through">CA$30</span>
              <span className="bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
                CA$0
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              The usual CA$10/hour rate is off during the pilot
            </p>
            <dl className="mt-6 space-y-2 border-t border-zinc-200/70 pt-4 text-sm dark:border-zinc-700/70">
              <Row label="Tour length" value="2 or 3 hours" />
              <Row label="Your buddy’s time" value="Free" highlight />
              <Row label="What you eat & ride" value="Local prices, paid direct" />
              <Row label="Payment step" value="None" />
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-zinc-500">{label}</dt>
      <dd
        className={
          highlight
            ? 'font-semibold text-rose-600 dark:text-rose-400'
            : 'font-medium text-zinc-800 dark:text-zinc-200'
        }
      >
        {value}
      </dd>
    </div>
  )
}

/* ---------------------------- How it works ----------------------------- */

function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: 'Pick your day',
      body: 'Choose an open date, then a 2 or 3 hour tour — your pick.',
    },
    {
      n: '02',
      title: 'Request it, free',
      body: 'No card, no checkout. Your request goes straight to your buddy.',
    },
    {
      n: '03',
      title: 'Get confirmed',
      body: 'We confirm by email within 3 business days. Then just show up.',
    },
  ]
  return (
    <section className="relative border-b border-zinc-200 dark:border-zinc-800">
      <div
        className="pointer-events-none absolute inset-0 opacity-50 dark:opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 10% 0%, rgba(245,158,11,0.15), transparent 50%), radial-gradient(circle at 100% 100%, rgba(244,63,94,0.15), transparent 50%)',
        }}
      />
      <div className="relative mx-auto max-w-5xl px-6 py-24">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Booked in three taps.
          </h2>
        </div>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <li
              key={s.n}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-sm font-bold text-white shadow-lg shadow-rose-500/20">
                {s.n}
              </span>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* -------------------------------- Why ---------------------------------- */

function Why() {
  const items = [
    {
      title: 'A local, not a script',
      body: 'Spend the day with someone who actually lives here and loves showing it off.',
      icon: 'people' as const,
      tone: 'amber' as const,
    },
    {
      title: 'Completely free',
      body: 'The pilot costs you nothing. If the day deserved it, you can tip your buddy afterwards — that part is up to you.',
      icon: 'tag' as const,
      tone: 'rose' as const,
    },
    {
      title: 'Nothing at stake',
      body: 'No payment means nothing to refund. If we can’t confirm your day, we tell you straight away and you’ve lost nothing.',
      icon: 'shield' as const,
      tone: 'emerald' as const,
    },
  ]
  return (
    <section className="border-b border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-950/40">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Why book a buddy
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            The opposite of a tour bus.
          </h2>
        </div>
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((it) => (
            <li key={it.title}>
              <article className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                    it.tone === 'amber'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      : it.tone === 'rose'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  <WhyIcon name={it.icon} />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{it.title}</h3>
                <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {it.body}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function WhyIcon({ name }: { name: 'people' | 'tag' | 'shield' }) {
  const cls = 'h-5 w-5'
  if (name === 'people')
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  if (name === 'tag')
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden>
        <path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

/* ---------------------------- Testimonials ----------------------------- */

// No fabricated reviews. The quote cards that used to sit here were invented
// for the mockup with pravatar.cc placeholder faces; on a promo page pasted
// into Instagram bios, fake social proof is the fastest way to look like a
// scam. Saying "no reviews yet" out loud is the more convincing pitch, and
// real quotes replace this block once real bookings produce them.
function Testimonials() {
  return (
    <section className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          The honest part
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          No reviews yet.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-zinc-600 dark:text-zinc-400">
          We only just opened, and reviews here will only ever come from real,
          completed bookings — we don&apos;t write our own. Book a day and be
          the first to say how it actually went.
        </p>
      </div>
    </section>
  )
}

/* -------------------------------- FAQ ---------------------------------- */

function Faq() {
  const faqs = [
    {
      q: 'Is it really free?',
      a: 'Yes. While we pilot the service, your buddy’s time costs nothing — no card, no deposit, no checkout page. Anything you eat, ride or buy on the day you pay for directly, at local prices.',
    },
    {
      q: 'What’s the catch?',
      a: 'There isn’t one. We’re new and we’d rather earn reviews than revenue right now. If you loved your day, you can leave a tip or a donation — both optional.',
    },
    {
      q: 'How long is a tour?',
      a: '2 or 3 hours, your choice, one-on-one with your buddy.',
    },
    {
      q: 'When will I know it’s confirmed?',
      a: 'We confirm by email within 3 business days of your request.',
    },
  ]
  return (
    <section className="border-b border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-950/40">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Good to know
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Before you book
          </h2>
        </div>
        <dl className="mt-12 space-y-4">
          {faqs.map((f) => (
            <div
              key={f.q}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <dt className="font-semibold">{f.q}</dt>
              <dd className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {f.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* ----------------------------- Final CTA ------------------------------- */

function FinalCta() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-400 to-rose-500" />
      <div
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.6), transparent 40%), radial-gradient(circle at 85% 80%, rgba(255,255,255,0.4), transparent 45%)',
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl px-6 py-24 text-center text-white">
        <h2 className="text-balance text-4xl font-semibold tracking-tight drop-shadow sm:text-5xl">
          Shenzhen is better with a friend.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-white/90 drop-shadow">
          Pick a date and book your first day out — completely free while we
          pilot.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/guide"
            className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-zinc-100"
          >
            Book my free day →
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
          >
            I already have an account
          </Link>
        </div>
      </div>
    </section>
  )
}
