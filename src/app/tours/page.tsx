import type { Metadata } from 'next'
import Link from 'next/link'

import { PackageCard } from '@/components/PackageCard'
import { packagePrice, PACKAGE_HOURS } from '@/content/packages'
import {
  localizedFeaturedPackage,
  localizedOtherPackages,
  localizedPackages,
} from '@/content/packages-i18n'
import { getI18n } from '@/i18n/server'
import { DEFAULT_OG_IMAGE, siteUrl } from '@/lib/config'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return {
    title: t.seo.toursTitle,
    description: t.seo.toursDescription,
    alternates: { canonical: '/tours' },
    // Declared explicitly: the root layout sets an openGraph block, and
    // metadata merges per key — so a page that omits this inherits the site's
    // generic title, description and an og:url pointing at the homepage.
    // `images` is not redundant here; see DEFAULT_OG_IMAGE in lib/config.
    openGraph: {
      title: t.seo.toursTitle,
      description: t.seo.toursDescription,
      url: '/tours',
      images: [DEFAULT_OG_IMAGE],
    },
  }
}

export default async function ToursPage() {
  const { locale, t } = await getI18n()
  const featured = localizedFeaturedPackage(locale)
  const rest = localizedOtherPackages(locale)
  const all = localizedPackages(locale)
  const price = packagePrice()
  const base = siteUrl()

  // An ItemList of the experiences, so a search engine can see this page is a
  // catalogue of six things rather than one page of prose. Each entry points
  // at its own detail URL, which is where the TouristTrip markup lives.
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t.seo.toursTitle,
    numberOfItems: all.length,
    itemListElement: all.map((pkg, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: pkg.title,
      url: `${base}/tours/${pkg.slug}`,
    })),
  }

  return (
    <main className="flex flex-1 flex-col">
      {/* JSON.stringify does not escape HTML, so `<` is scrubbed to its
          unicode form to close the XSS vector. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd).replace(/</g, '\\u003c'),
        }}
      />

      {/* HERO */}
      <section className="sb-grain relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/night-market-skewers-stall.webp"
            alt="A Shenzhen night market stall laid with trays of skewers under strip lighting"
            className="sb-drift h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/60 to-black/85" />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center text-white sm:py-32">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            {t.tours.index.kicker}
          </p>
          <h1 className="sb-display mt-4 text-5xl leading-[1.05] tracking-tight drop-shadow-xl sm:text-7xl">
            {t.tours.index.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/85 sm:text-lg">
            {t.tours.index.body}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 backdrop-blur">
              {t.tours.index.priceLine.replace('{price}', price)}
            </span>
            <span className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 backdrop-blur">
              {t.tours.index.countLine.replace('{n}', String(all.length))}
            </span>
          </div>
        </div>
      </section>

      {/* THE HONEST DISCLAIMER — deliberately above the cards, not buried
          under them. It is also the strongest thing we have to say. */}
      <section className="border-b border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-950/40">
        <div className="mx-auto max-w-3xl px-6 py-12 text-center">
          <h2 className="sb-display text-2xl tracking-tight sm:text-3xl">
            {t.tours.index.notATour.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t.tours.index.notATour.body}
          </p>
        </div>
      </section>

      {/* THE CARDS */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <PackageCard
          pkg={featured}
          t={t}
          price={price}
          variant="featured"
          eager
        />
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((pkg) => (
            <li key={pkg.slug} className="sb-rise">
              <PackageCard pkg={pkg} t={t} price={price} />
            </li>
          ))}
        </ul>
      </section>

      {/* CLOSING */}
      <section className="border-t border-zinc-200 bg-zinc-950 text-white dark:border-zinc-800">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="sb-display text-3xl leading-tight tracking-tight sm:text-4xl">
            {t.home.finalCta.titleAnon}
          </h2>
          <p className="mt-4 text-sm text-zinc-400">
            {t.home.packages.priceNote.replace('{price}', price)} ·{' '}
            {t.common.hours.replace('{n}', String(PACKAGE_HOURS))}
          </p>
          <Link
            href="/guide"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-zinc-900 shadow-lg transition hover:bg-zinc-100"
          >
            {t.common.planYourDay}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
