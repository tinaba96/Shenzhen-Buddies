import Link from 'next/link'
import type { Metadata } from 'next'
import { Avatar } from '@/components/Avatar'
import { PromoCode } from '@/components/PromoCode'

const PROMO = 'WELCOME10'

export const metadata: Metadata = {
  title: 'Get 10% off your Shenzhen day — Shenzhen Buddies',
  description:
    'Book a local guide in Shenzhen for a full day out. Use code WELCOME10 for 10% off your first booking. CA$10/hour, 5–15 hours, fully refunded if we can’t confirm.',
}

const HERO_PHOTO =
  'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=2400&q=80&auto=format&fit=crop'

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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_PHOTO}
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
          New explorers · limited welcome offer
        </p>

        <h1 className="mt-7 max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight drop-shadow-xl sm:text-7xl">
          Your first day in Shenzhen,{' '}
          <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">
            10% off.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-lg text-white/90 drop-shadow sm:text-xl">
          Skip the tour bus. Spend a whole day with a real local who shows you
          the food, streets, and corners you’d never find alone.
        </p>

        {/* Promo ticket */}
        <div className="mt-10 w-full max-w-md">
          <div className="relative rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 p-[2px] shadow-2xl shadow-rose-500/30">
            <div className="relative flex items-center justify-between gap-4 rounded-[15px] bg-zinc-950/90 px-6 py-5 backdrop-blur">
              {/* Ticket notches */}
              <span className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-black/85" aria-hidden />
              <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-black/85" aria-hidden />
              <div className="text-left">
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/60">
                  Welcome code
                </p>
                <PromoCode
                  code={PROMO}
                  className="mt-1 bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-transparent"
                />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold leading-none">10%</p>
                <p className="text-[11px] uppercase tracking-wider text-white/60">
                  off
                </p>
              </div>
            </div>
          </div>
          <p className="mt-2 text-xs text-white/60">
            Tap the code to copy · paste it at checkout
          </p>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup?as=tourist"
            className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-zinc-900 shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-zinc-100"
          >
            Claim my 10% →
          </Link>
          <Link
            href="/guide"
            className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
          >
            Meet your guide
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-wider text-white/60">
          <TrustItem>CA$10 / hour</TrustItem>
          <TrustItem>5–15 hour days</TrustItem>
          <TrustItem>Fully refunded if not confirmed</TrustItem>
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
              The welcome deal
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              A full day out, for{' '}
              <span className="bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
                less.
              </span>
            </h2>
            <p className="mt-4 max-w-md text-zinc-600 dark:text-zinc-400">
              Every booking is a flat CA$10 an hour — pick anywhere from 5 to 15
              hours. Add <span className="font-semibold text-zinc-900 dark:text-zinc-100">{PROMO}</span> at
              checkout and 10% comes straight off. If we can’t confirm your day,
              you’re refunded in full.
            </p>
            <Link
              href="/signup?as=tourist"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Start booking
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Price example card */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-amber-50 to-rose-50 p-8 shadow-sm dark:border-zinc-800 dark:from-amber-950/30 dark:to-rose-950/30">
            <p className="text-sm font-medium text-zinc-500">
              Example · an 8-hour day
            </p>
            <div className="mt-4 flex items-end gap-3">
              <span className="text-2xl text-zinc-400 line-through">CA$80</span>
              <span className="bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
                CA$72
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              8 hours × CA$10 − 10% with {PROMO}
            </p>
            <dl className="mt-6 space-y-2 border-t border-zinc-200/70 pt-4 text-sm dark:border-zinc-700/70">
              <Row label="Hourly rate" value="CA$10" />
              <Row label="Day length" value="5–15 hours" />
              <Row label="Welcome discount" value="−10%" highlight />
              <Row label="Payment" value="Card · Apple Pay · Link" />
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
      body: 'Choose an open date and how many hours you want — 5 to 15.',
    },
    {
      n: '02',
      title: `Pay with ${PROMO}`,
      body: 'Enter the code at checkout for 10% off. Card, Apple Pay, or Link.',
    },
    {
      n: '03',
      title: 'Get confirmed',
      body: 'We confirm by email within 3 business days. Not confirmed? Full refund.',
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
      title: 'One simple price',
      body: 'CA$10 an hour, no hidden fees. You see the total before you pay.',
      icon: 'tag' as const,
      tone: 'rose' as const,
    },
    {
      title: 'Risk-free',
      body: 'If we can’t confirm your day, you’re refunded in full — automatically.',
      icon: 'shield' as const,
      tone: 'emerald' as const,
    },
  ]
  return (
    <section className="border-b border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-950/40">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Why explorers love it
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

function Testimonials() {
  const reviews = [
    {
      quote:
        'Best CA$72 I spent in Shenzhen. A whole day of food and back streets I’d never have found. Used the welcome code without even thinking.',
      name: 'Sarah K.',
      role: 'Visiting from London',
      photo: 'https://i.pravatar.cc/120?img=47',
    },
    {
      quote:
        'Booking took two minutes, the code knocked off 10%, and confirmation came the next morning. Felt like meeting a friend.',
      name: 'Marco R.',
      role: 'Visiting from Milan',
      photo: 'https://i.pravatar.cc/120?img=33',
    },
    {
      quote:
        'I was nervous about the language. By hour three we were laughing over street noodles. Worth every dollar.',
      name: 'Aisha N.',
      role: 'Visiting from Dubai',
      photo: 'https://i.pravatar.cc/120?img=45',
    },
  ]
  return (
    <section className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            From our explorers
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Days people don’t forget.
          </h2>
        </div>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {reviews.map((r) => (
            <li
              key={r.name}
              className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <Stars />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                <Avatar src={r.photo} name={r.name} size={40} />
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-zinc-500">{r.role}</p>
                </div>
              </figcaption>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Stars() {
  return (
    <span aria-label="5 out of 5 stars" className="inline-flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-amber-400">
          <path d="M12 2.5l2.92 6.01 6.58.95-4.76 4.65 1.12 6.55L12 17.77l-5.86 3.09 1.12-6.55L2.5 9.46l6.58-.95L12 2.5z" />
        </svg>
      ))}
    </span>
  )
}

/* -------------------------------- FAQ ---------------------------------- */

function Faq() {
  const faqs = [
    {
      q: `How do I use ${PROMO}?`,
      a: 'Pick your day and continue to payment. On the secure checkout page, tap “Add promotion code”, paste WELCOME10, and the 10% comes off instantly.',
    },
    {
      q: 'When am I charged?',
      a: 'You pay when you book, which holds the day for you. If we can’t confirm, you’re refunded in full — automatically.',
    },
    {
      q: 'How long is a day?',
      a: 'Anywhere from 5 to 15 hours, your choice. It’s a flat CA$10 per hour before the discount.',
    },
    {
      q: 'When will I know it’s confirmed?',
      a: 'We confirm by email within 3 business days of your booking.',
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
            Questions, answered.
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
          Grab your welcome code and book your first day out — 10% off, fully
          refundable.
        </p>

        <div className="mx-auto mt-8 inline-flex items-center gap-3 rounded-2xl bg-white/15 px-5 py-3 backdrop-blur">
          <span className="text-xs font-medium uppercase tracking-wider text-white/70">
            Code
          </span>
          <PromoCode code={PROMO} className="text-white" />
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup?as=tourist"
            className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-zinc-100"
          >
            Claim my 10% →
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
