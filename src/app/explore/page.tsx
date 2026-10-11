import Link from 'next/link'
import type { Metadata } from 'next'
import { DEFAULT_OG_IMAGE, isSingleGuideMode } from '@/lib/config'
import { HeroImage } from '@/components/HeroImage'
import { getI18n } from '@/i18n/server'
import type { Dictionary } from '@/i18n'

export async function generateMetadata(): Promise<Metadata> {
  const { meta, t } = await getI18n()
  const seo = t.seo.explore
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: '/explore' },
    // Declared explicitly: the root layout sets an openGraph block, and metadata
    // merges per key — so a page that omits this inherits the site's generic
    // title, description and an og:url pointing at the homepage.
    // `images` is not redundant: the object above replaces the inherited one, and
    // the file-convention card goes with it. See DEFAULT_OG_IMAGE in lib/config.
    openGraph: {
      locale: meta.ogLocale,
      title: seo.title,
      description: seo.description,
      url: '/explore',
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

// PHOTO PROVENANCE — read before changing any `photo` below.
//
// The district tiles are freely-licensed photographs from Wikimedia Commons,
// each showing a landmark whose district is a matter of public record: the
// district is verifiable from the BUILDING, not from trusting a caption. That
// distinction is the whole point — captions on the open web are wrong
// constantly, and "a photo someone labelled Longgang" is not evidence.
//
// Two candidates were rejected on inspection rather than on metadata: a file
// named for the Universiade Center turned out to be the inside of a shop, and
// a "Dongmen, Luohu" street scene had two passers-by with clearly recognisable
// faces. Publishing those would have broken the consent rule in
// marketing/assets/CONSENT.md that this company applies to its own photography.
// Every tile below is cropped to the landmark so no identifiable face is
// published.
//
// CC BY and CC BY-SA REQUIRE attribution, and these crops are adaptations, so
// the credit block at the foot of this page is a licence condition, not a
// courtesy. Do not delete it. Anything added here needs the same treatment.
//
// The hero and the "moments" strip are the founder's own photographs.

// Name, second line, blurb and alt text live in t.explore.districts, keyed by
// slug. The credit stays here: it must match the source exactly.
type District = {
  slug: keyof Dictionary['explore']['districts']
  photo: string
  credit: {
    what: string
    author: string
    licence: string
    licenceUrl: string
    source: string
  }
}


const districts: District[] = [
  {
    slug: 'nanshan',
    photo: '/explore/nanshan.webp',
    credit: {
      what: 'Shenzhen Bay Sports Center',
      author: 'Dinkun Chen',
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      source:
        'https://commons.wikimedia.org/wiki/File:SHENZHEN_BAY_SPORTS_CENTER_(4).jpg',
    },
  },
  {
    slug: 'futian',
    photo: '/explore/futian.webp',
    credit: {
      what: 'Ping An Finance Centre',
      author: 'Chris from Shenzhen, China',
      licence: 'CC BY-SA 2.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
      source:
        'https://commons.wikimedia.org/wiki/File:Ping_An_Finance_Centre_Shenzhen_city_China_(36461945211).jpg',
    },
  },
  {
    slug: 'luohu',
    photo: '/explore/luohu.webp',
    credit: {
      what: 'Luohu Port railway station facade',
      author: 'Wikimedia Commons contributor',
      licence: 'CC0',
      licenceUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
      source:
        'https://commons.wikimedia.org/wiki/File:SZ_%E6%B7%B1%E5%9C%B3_Shenzhen_%E7%BE%85%E6%B9%96%E5%8F%A3%E5%B2%B8_Luohu_Port_%E7%BE%85%E6%B9%96%E7%81%AB%E8%BB%8A%E7%AB%99_Railway_Station_building_facade_November_2025_N13P_02.jpg',
    },
  },
  {
    slug: 'baoan',
    photo: '/explore/baoan.webp',
    credit: {
      what: "Shenzhen Bao'an International Airport",
      author: '準建築人手札網站 Forgemind ArchiMedia',
      licence: 'CC BY 2.0',
      licenceUrl: 'https://creativecommons.org/licenses/by/2.0/',
      source:
        "https://commons.wikimedia.org/wiki/File:Shenzhen_Bao'an_Airport.jpg",
    },
  },
  {
    slug: 'longhua',
    photo: '/explore/longhua.webp',
    credit: {
      what: 'Shenzhen North Railway Station',
      author: 'Dinkun Chen',
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      source:
        'https://commons.wikimedia.org/wiki/File:SHENZHEN_NORTH_RAILWAY_STATION.jpg',
    },
  },
  {
    slug: 'longgang',
    photo: '/explore/longgang.webp',
    credit: {
      what: 'Shenzhen Universiade Sports Centre',
      author: 'Stephen Woolverton',
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      source:
        'https://commons.wikimedia.org/wiki/File:ShenZhen_Universiade_Sports_Centre.jpg',
    },
  },
]

// The founder's own photographs — see src/content/gallery.ts for the library.
// Alt text lives in t.explore.moments.alts, in this order.
const moments: string[] = [
  '/gallery/night-market-skewers-stall.webp',
  '/gallery/crayfish-noodles-lift.webp',
  '/gallery/maker-desk-dev-boards.webp',
  '/gallery/skyline-tower-walkway-night.webp',
  '/gallery/chicken-rice-closeup.webp',
  '/gallery/preserved-fruit-jars.webp',
  '/gallery/bakery-bread-counter.webp',
  '/gallery/maker-desk-headset-teardown.webp',
]

export default async function ExplorePage() {
  const { t } = await getI18n()
  const copy = t.explore
  // /browse forwards to /guide while the beta runs one guide, and takes no
  // `city` param — appending one would be silently dropped.
  const ctaHref = isSingleGuideMode() ? '/guide' : '/browse'

  return (
    <main className="flex flex-1 flex-col">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <HeroImage
          name="skyline-blue-towers-night"
          alt={copy.hero.imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/45 to-black/70" />
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center text-white sm:py-32">
          <p className="text-xs font-medium uppercase tracking-wide text-white/80">
            {copy.hero.kicker}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight drop-shadow sm:text-5xl">
            {copy.hero.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/90 drop-shadow">
            {copy.hero.body}
          </p>
          <Link
            href={ctaHref}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-100"
          >
            {copy.hero.cta}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* SIX DISTRICTS */}
      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {districts.map((d) => {
            const text = copy.districts[d.slug]
            return (
              <li key={d.slug}>
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="relative h-44 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={d.photo}
                      alt={text.alt}
                      width={1600}
                      height={640}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-4 text-white drop-shadow">
                      <h2 className="text-lg font-semibold leading-tight">
                        {text.name}
                      </h2>
                      <p className="text-xs text-white/85">{text.sub}</p>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {text.blurb}
                    </p>
                    <Link
                      href={ctaHref}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-zinc-900 hover:underline dark:text-white"
                    >
                      {copy.findGuide}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </section>

      {/* MOMENTS — the founder's own photographs */}
      <section className="border-t border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950/30">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {copy.moments.kicker}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              {copy.moments.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
              {copy.moments.bodyLead}
              <Link href="/gallery" className="underline underline-offset-2">
                {copy.moments.galleryLink}
              </Link>
              {copy.moments.bodyTail}
            </p>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {moments.map((src, i) => (
              <li
                key={src}
                className={`overflow-hidden rounded-xl ${
                  i % 5 === 0 ? 'sm:row-span-2 sm:h-full' : ''
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={copy.moments.alts[i]}
                  loading="lazy"
                  className="h-48 w-full object-cover transition duration-300 hover:scale-105 sm:h-full"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            {copy.closing.title}
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            {copy.closing.body}
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {copy.closing.cta}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* PHOTO CREDITS — a licence condition for the CC BY / CC BY-SA tiles
          above, not a courtesy. The crops are adaptations, so they carry the
          same licence as the originals. */}
      <section className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <h2 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {copy.credits.title}
          </h2>
          <p className="mt-3 max-w-2xl text-xs text-zinc-500 dark:text-zinc-500">
            {copy.credits.body}
          </p>
          <ul className="mt-4 grid gap-2 text-xs text-zinc-500 sm:grid-cols-2 dark:text-zinc-500">
            {districts.map((d) => (
              <li key={d.slug}>
                <span className="text-zinc-600 dark:text-zinc-400">
                  {copy.districts[d.slug].name}
                </span>{' '}
                — {d.credit.what},{' '}
                <a
                  href={d.credit.source}
                  className="underline underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {d.credit.author}
                </a>
                ,{' '}
                <a
                  href={d.credit.licenceUrl}
                  className="underline underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {d.credit.licence}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
