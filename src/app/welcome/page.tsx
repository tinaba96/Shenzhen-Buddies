import Link from 'next/link'
import type { Metadata } from 'next'
import { DEFAULT_OG_IMAGE } from '@/lib/config'
import { HeroImage } from '@/components/HeroImage'
import type { Dictionary } from '@/i18n'
import { getI18n } from '@/i18n/server'

// This URL is pasted into Instagram/X/Threads bios, so it stays put — but the
// offer on it moved with the free pilot: no promo code, the whole tour is
// free. The VIP50 flow it replaced is in git history if paid tours return.

export async function generateMetadata(): Promise<Metadata> {
  const { meta, t } = await getI18n()
  const seo = t.seo.welcome
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: '/welcome' },
    // Declared explicitly: the root layout sets an openGraph block, and
    // metadata merges per key — so a page that omits this inherits the site's
    // generic title, description and an og:url pointing at the homepage.
    openGraph: {
      locale: meta.ogLocale,
      title: seo.title,
      description: seo.description,
      url: '/welcome',
      // Required alongside any openGraph object — see the note in about/page.tsx.
      // This page is the landing page pasted into Instagram, so a missing card
      // here costs more than on any other route.
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

type Copy = { t: Dictionary['welcome'] }

export default async function WelcomePage() {
  const { t } = await getI18n()
  const copy = t.welcome
  return (
    <main className="flex flex-1 flex-col">
      <Hero t={copy} />
      <DealStrip t={copy} />
      <HowItWorks t={copy} />
      <Why t={copy} />
      <Testimonials t={copy} />
      <Faq t={copy} />
      <FinalCta t={copy} />
    </main>
  )
}

/* ------------------------------- Hero ---------------------------------- */

function Hero({ t }: Copy) {
  return (
    <section className="relative overflow-hidden">
      <HeroImage
        name="skyline-bay-dusk-reflections"
        alt={t.heroAlt}
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
          {t.badge}
        </p>

        <h1 className="mt-7 max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight drop-shadow-xl sm:text-7xl">
          {t.titleLead}
          <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">
            {t.titleAccent}
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-lg text-white/90 drop-shadow sm:text-xl">
          {t.body}
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
                  {t.ticketLabel}
                </p>
                <p className="mt-1 bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-2xl font-bold tracking-wide text-transparent">
                  {t.ticketFree}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold leading-none">CA$0</p>
                <p className="text-[11px] uppercase tracking-wider text-white/60">
                  {t.ticketNoCode}
                </p>
              </div>
            </div>
          </div>
          <p className="mt-2 text-xs text-white/60">
            {t.ticketNote}
          </p>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/guide"
            className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-zinc-900 shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-zinc-100"
          >
            {t.primaryCta}
          </Link>
          <Link
            href="/tours"
            className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
          >
            {t.secondaryCta}
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-wider text-white/60">
          {t.trust.map((item) => (
            <TrustItem key={item}>{item}</TrustItem>
          ))}
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

function DealStrip({ t }: Copy) {
  return (
    <section className="border-y border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              {t.deal.kicker}
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {t.deal.titleLead}
              <span className="bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
                {t.deal.titleAccent}
              </span>
            </h2>
            <p className="mt-4 max-w-md text-zinc-600 dark:text-zinc-400">
              {t.deal.body}
            </p>
            <Link
              href="/guide"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {t.deal.cta}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Price example card */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-amber-50 to-rose-50 p-8 shadow-sm dark:border-zinc-800 dark:from-amber-950/30 dark:to-rose-950/30">
            <p className="text-sm font-medium text-zinc-500">
              {t.deal.exampleLabel}
            </p>
            <div className="mt-4 flex items-end gap-3">
              <span className="text-2xl text-zinc-400 line-through">CA$30</span>
              <span className="bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
                CA$0
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {t.deal.rateNote}
            </p>
            <dl className="mt-6 space-y-2 border-t border-zinc-200/70 pt-4 text-sm dark:border-zinc-700/70">
              <Row label={t.deal.rows.length} value={t.deal.rows.lengthValue} />
              <Row label={t.deal.rows.time} value={t.deal.rows.timeValue} highlight />
              <Row label={t.deal.rows.extras} value={t.deal.rows.extrasValue} />
              <Row label={t.deal.rows.payment} value={t.deal.rows.paymentValue} />
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

function HowItWorks({ t }: Copy) {
  const steps = t.how.steps.map((step, i) => ({
    n: String(i + 1).padStart(2, '0'),
    ...step,
  }))
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
            {t.how.kicker}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t.how.title}
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

function Why({ t }: Copy) {
  // Icons and tones pair with t.why.items by position.
  const looks = [
    { icon: 'people' as const, tone: 'amber' as const },
    { icon: 'tag' as const, tone: 'rose' as const },
    { icon: 'shield' as const, tone: 'emerald' as const },
  ]
  const items = t.why.items.map((item, i) => ({ ...item, ...looks[i] }))
  return (
    <section className="border-b border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-950/40">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            {t.why.kicker}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t.why.title}
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
function Testimonials({ t }: Copy) {
  return (
    <section className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          {t.honest.kicker}
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {t.honest.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-zinc-600 dark:text-zinc-400">
          {t.honest.body}
        </p>
      </div>
    </section>
  )
}

/* -------------------------------- FAQ ---------------------------------- */

function Faq({ t }: Copy) {
  const faqs = t.faq.items
  return (
    <section className="border-b border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-950/40">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            {t.faq.kicker}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t.faq.title}
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

function FinalCta({ t }: Copy) {
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
          {t.final.title}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-white/90 drop-shadow">
          {t.final.body}
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/guide"
            className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-zinc-100"
          >
            {t.final.primaryCta}
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
          >
            {t.final.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  )
}
