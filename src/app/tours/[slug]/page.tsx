import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PackageCard } from '@/components/PackageCard'
import {
  bookHref,
  CURRENCY_FOR_PACKAGES,
  packagePrice,
  packagePriceCents,
  PACKAGE_HOURS,
  packages,
} from '@/content/packages'
import { localizedPackage, localizedPackages } from '@/content/packages-i18n'
import { getPublishedPost } from '@/content/posts'
import { getI18n } from '@/i18n/server'
import { DEFAULT_OG_IMAGE, siteUrl } from '@/lib/config'

type Props = { params: Promise<{ slug: string }> }

// The six slugs are known at build time and never change per request, so the
// router can be told about them up front. The pages still render dynamically —
// the root layout reads auth and the locale cookie — but this keeps the route
// from being treated as fully open-ended.
export function generateStaticParams() {
  return packages.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { locale } = await getI18n()
  const pkg = localizedPackage(slug, locale)
  if (!pkg) return {}

  const title = `${pkg.title} (${pkg.cn}) — Shenzhen Buddies`
  return {
    title,
    description: pkg.tagline,
    alternates: { canonical: `/tours/${pkg.slug}` },
    openGraph: {
      title,
      description: pkg.tagline,
      url: `/tours/${pkg.slug}`,
      // The package photograph would be the better card, but the OG-safe JPEG
      // exports live under /gallery/og and are keyed by gallery id, not by
      // package. Until a per-package export exists, the site card is correct
      // and, unlike a WebP, actually renders in every scraper.
      images: [DEFAULT_OG_IMAGE],
    },
  }
}

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params
  const { locale, t } = await getI18n()
  const pkg = localizedPackage(slug, locale)
  if (!pkg) notFound()

  const price = packagePrice()
  const others = localizedPackages(locale).filter((p) => p.slug !== pkg.slug)
  const related = others.slice(0, 3)
  const post = pkg.readMoreSlug ? getPublishedPost(pkg.readMoreSlug) : undefined
  const base = siteUrl()

  const tripJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: pkg.title,
    description: pkg.summary,
    url: `${base}/tours/${pkg.slug}`,
    image: `${base}${pkg.photo}`,
    touristType: pkg.goodFor,
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: pkg.itinerary.length,
      itemListElement: pkg.itinerary.map((beat, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: beat.title,
      })),
    },
    offers: {
      '@type': 'Offer',
      price: (packagePriceCents() / 100).toFixed(2),
      priceCurrency: CURRENCY_FOR_PACKAGES,
      url: `${base}${bookHref(pkg)}`,
      availability: 'https://schema.org/LimitedAvailability',
    },
  }

  return (
    <main className="flex flex-1 flex-col">
      {/* JSON.stringify does not escape HTML, so `<` is scrubbed to its
          unicode form to close the XSS vector. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(tripJsonLd).replace(/</g, '\\u003c'),
        }}
      />

      {/* HERO */}
      <section className="sb-grain relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pkg.photo}
            alt={pkg.alt}
            className="sb-drift h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/90" />
        <div className="relative mx-auto w-full max-w-4xl px-6 py-20 text-white sm:py-28">
          <Link
            href="/tours"
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-white/70 transition hover:text-white"
          >
            <span aria-hidden>←</span>
            {t.tours.detail.backToAll}
          </Link>

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            {pkg.kicker}
          </p>
          <h1 className="sb-display mt-3 text-5xl leading-[1.05] tracking-tight drop-shadow-xl sm:text-7xl">
            {pkg.title}
          </h1>
          <p className="mt-2 text-2xl text-white/60 sm:text-3xl">{pkg.cn}</p>
          <p className="mt-6 max-w-2xl text-lg text-white/90">{pkg.tagline}</p>

          <div className="mt-8 flex flex-wrap gap-2 text-sm">
            <Pill>{t.common.fourHours}</Pill>
            <Pill>{t.common.oneOnOne}</Pill>
            <Pill>{pkg.district}</Pill>
            <Pill>{price}</Pill>
          </div>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
        {/* MAIN COLUMN */}
        <div className="min-w-0">
          <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
            {pkg.summary}
          </p>

          {/* ITINERARY */}
          <section className="mt-14">
            <h2 className="sb-display text-3xl tracking-tight">
              {t.tours.detail.itinerary}
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              {t.tours.detail.itineraryNote}
            </p>

            <ol className="mt-8">
              {pkg.itinerary.map((beat, i) => (
                <li key={beat.at} className="relative flex gap-5 pb-8 last:pb-0">
                  {/* The connector. Absolute so it runs behind the dot and
                      stops at the last beat rather than trailing into space. */}
                  {i < pkg.itinerary.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute bottom-0 left-[0.4375rem] top-6 w-px bg-gradient-to-b from-amber-400/60 to-rose-400/20"
                    />
                  )}
                  <span
                    aria-hidden
                    className="relative mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 ring-4 ring-white dark:ring-black"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs tabular-nums text-zinc-400">
                      {beat.at}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">{beat.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {beat.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* INCLUDES / EXCLUDES */}
          <section className="mt-14 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 dark:border-emerald-900/50 dark:bg-emerald-950/20">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                {t.tours.detail.includes}
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                {pkg.includes.map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-zinc-50/60 p-6 dark:border-zinc-800 dark:bg-zinc-950/40">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                {t.tours.detail.notIncluded}
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-600 dark:text-zinc-400">
                {pkg.notIncluded.map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      aria-hidden
                      className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* GOOD FOR */}
          <section className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              {t.tours.detail.goodFor}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {pkg.goodFor.map((who) => (
                <li
                  key={who}
                  className="rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  {who}
                </li>
              ))}
            </ul>
          </section>

          {/* INSIDER TIP */}
          <section className="mt-12 overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-rose-50 p-7 dark:border-amber-900/40 dark:from-amber-950/20 dark:to-rose-950/20">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-800 dark:text-amber-300">
              {t.tours.detail.insiderTip}
            </p>
            <p className="mt-3 text-base leading-relaxed text-zinc-800 dark:text-zinc-200">
              {pkg.insiderTip}
            </p>
          </section>

          {post && (
            <p className="mt-8">
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4"
              >
                {t.tours.detail.readMore}: {post.title}
                <span aria-hidden>→</span>
              </Link>
            </p>
          )}
        </div>

        {/* BOOKING RAIL */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl shadow-black/5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {t.tours.detail.price}
            </p>
            <p className="mt-1 text-4xl font-semibold tracking-tight">{price}</p>
            <p className="mt-1 text-xs text-zinc-500">{t.common.perPerson}</p>

            <dl className="mt-6 space-y-3 border-t border-zinc-100 pt-5 text-sm dark:border-zinc-800">
              <Row label={t.tours.detail.duration}>
                {t.common.hours.replace('{n}', String(PACKAGE_HOURS))}
              </Row>
              <Row label={t.tours.detail.groupSize}>
                {t.tours.detail.groupSizeValue}
              </Row>
              <Row label={t.tours.detail.district}>{pkg.district}</Row>
              <Row label={t.tours.detail.bestStart}>{pkg.bestStart}</Row>
              <Row label={t.tours.detail.meetingPoint}>{pkg.meetingPoint}</Row>
            </dl>

            <Link
              href={bookHref(pkg)}
              className="mt-6 block w-full rounded-full bg-zinc-900 px-6 py-3.5 text-center text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {t.tours.detail.bookCta}
            </Link>
            <p className="mt-3 text-center text-xs leading-relaxed text-zinc-500">
              {t.tours.detail.bookNote}
            </p>
            <p className="mt-2 text-center text-xs leading-relaxed text-zinc-500">
              {t.tours.detail.priceNote}
            </p>
          </div>
        </aside>
      </div>

      {/* RELATED */}
      <section className="border-t border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-950/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="sb-display text-3xl tracking-tight">
            {t.tours.detail.otherExperiences}
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((other) => (
              <li key={other.slug}>
                <PackageCard pkg={other} t={t} price={price} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 backdrop-blur">
      {children}
    </span>
  )
}

function Row({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-3">
      <dt className="w-24 shrink-0 text-zinc-500">{label}</dt>
      <dd className="min-w-0 flex-1 text-zinc-800 dark:text-zinc-200">
        {children}
      </dd>
    </div>
  )
}
