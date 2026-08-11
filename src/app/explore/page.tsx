import Link from 'next/link'
import type { Metadata } from 'next'
import { DEFAULT_OG_IMAGE, isSingleGuideMode } from '@/lib/config'

const TITLE = 'Explore Shenzhen by district — Shenzhen Buddies'
const DESCRIPTION =
  "Shenzhen's six main districts — Nanshan, Futian, Luohu, Bao'an, Longhua and Longgang — what each one is actually for, and a local who knows it."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/explore' },
  // Declared explicitly: the root layout sets an openGraph block, and metadata
  // merges per key — so a page that omits this inherits the site's generic
  // title, description and an og:url pointing at the homepage.
  // `images` is not redundant: the object above replaces the inherited one, and
  // the file-convention card goes with it. See DEFAULT_OG_IMAGE in lib/config.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/explore',
    images: [DEFAULT_OG_IMAGE],
  },
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

type District = {
  slug: string
  name: string
  cn: string
  blurb: string
  photo: string
  alt: string
  credit: {
    what: string
    author: string
    licence: string
    licenceUrl: string
    source: string
  }
}

const HERO_PHOTO = '/hero/skyline-blue-towers-night.webp'

const districts: District[] = [
  {
    slug: 'nanshan',
    name: 'Nanshan',
    cn: '南山',
    blurb:
      "The tech end of the city, and the green one. Company headquarters and universities inland, Shenzhen Bay and the coastal park on the water side, Shekou's expat bars and ferry pier further west.",
    photo: '/explore/nanshan.webp',
    alt: 'The shell-like perforated roof of Shenzhen Bay Sports Center in Nanshan, against a clear sky',
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
    name: 'Futian',
    cn: '福田',
    blurb:
      'The central business district — the tallest towers, the civic centre, and the checkpoint most people cross from Hong Kong. Lianhuashan park is the climb everyone does for the skyline view back over it.',
    photo: '/explore/futian.webp',
    alt: 'Ping An Finance Centre, the tapered supertall tower in Futian, rising into a blue sky',
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
    name: 'Luohu',
    cn: '罗湖',
    blurb:
      'Where the city started, and where most first-timers arrive — the Luohu crossing puts you a short walk from the old downtown. Dongmen’s market streets are here, and the food is older and cheaper than the towers to the west.',
    photo: '/explore/luohu.webp',
    alt: 'The Guangzhou–Shenzhen intercity railway entrance at Luohu station, with its blue signage',
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
    name: "Bao'an",
    cn: '宝安',
    blurb:
      'The airport district, and the one that actually makes things — workshops and factories that supply the markets downtown. The coastal strip has been rebuilt with parks and a promenade worth the trip out.',
    photo: '/explore/baoan.webp',
    alt: "Shenzhen Bao'an International Airport Terminal 3 from above, its white perforated roof spread across the apron",
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
    name: 'Longhua',
    cn: '龙华',
    blurb:
      'The high-speed rail gateway — trains to Guangzhou in half an hour and most of the country from the same hall. Around the station it is manufacturing and dense new housing, with prices that pull younger residents north.',
    photo: '/explore/longhua.webp',
    alt: 'The roofline of Shenzhen North Railway Station in Longhua, with 深圳北站 in red characters',
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
    name: 'Longgang',
    cn: '龙岗',
    blurb:
      'The outer east — the Universiade complex built for the 2011 games, big tech campuses, and the point where the city thins out into hills and reservoirs. Furthest from the border, and the least touristed of the six.',
    photo: '/explore/longgang.webp',
    alt: 'The faceted green crystal roofs of the Universiade Sports Centre in Longgang',
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
const moments: { src: string; alt: string }[] = [
  { src: '/gallery/night-market-skewers-stall.webp', alt: 'A night market stall of skewered insects in Shenzhen' },
  { src: '/gallery/crayfish-noodles-lift.webp', alt: 'Chopsticks lifting noodles beside a bowl of garlic crayfish' },
  { src: '/gallery/maker-desk-dev-boards.webp', alt: 'Single-board computers and jumper wires on a workbench' },
  { src: '/gallery/skyline-tower-walkway-night.webp', alt: 'A Shenzhen tower lit white at night above a pedestrian walkway' },
  { src: '/gallery/chicken-rice-closeup.webp', alt: 'Poached chicken over rice with ginger-scallion oil and greens' },
  { src: '/gallery/preserved-fruit-jars.webp', alt: 'Clip-top jars of kumquats and plums preserved in syrup' },
  { src: '/gallery/bakery-bread-counter.webp', alt: 'Sourdough rounds and baguettes on a Shenzhen bakery counter' },
  { src: '/gallery/maker-desk-headset-teardown.webp', alt: 'An AR headset opened on a bench with its ribbon cables exposed' },
]

export default function ExplorePage() {
  // /browse forwards to /guide while the beta runs one guide, and takes no
  // `city` param — appending one would be silently dropped.
  const ctaHref = isSingleGuideMode() ? '/guide' : '/browse'

  return (
    <main className="flex flex-1 flex-col">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_PHOTO}
          alt="Shenzhen towers lit blue at night, seen from street level"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/45 to-black/70" />
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center text-white sm:py-32">
          <p className="text-xs font-medium uppercase tracking-wide text-white/80">
            Explore
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight drop-shadow sm:text-5xl">
            Six districts, six different cities.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/90 drop-shadow">
            Shenzhen is too big to &ldquo;see&rdquo; in a day. Pick the part
            that matches what you came for — and meet someone who lives there.
          </p>
          <Link
            href={ctaHref}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-100"
          >
            Meet a local
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
          {districts.map((d) => (
            <li key={d.slug}>
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                <div className="relative h-44 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={d.photo}
                    alt={d.alt}
                    width={1600}
                    height={640}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white drop-shadow">
                    <h2 className="text-lg font-semibold leading-tight">
                      {d.name}
                    </h2>
                    <p className="text-xs text-white/85">{d.cn}</p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {d.blurb}
                  </p>
                  <Link
                    href={ctaHref}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-zinc-900 hover:underline dark:text-white"
                  >
                    Find a guide
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* MOMENTS — the founder's own photographs */}
      <section className="border-t border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950/30">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Moments
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              A day in Shenzhen, give or take.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
              Our own photos, not stock.{' '}
              <Link href="/gallery" className="underline underline-offset-2">
                See the whole gallery
              </Link>
              .
            </p>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {moments.map((m, i) => (
              <li
                key={m.src}
                className={`overflow-hidden rounded-xl ${
                  i % 5 === 0 ? 'sm:row-span-2 sm:h-full' : ''
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.src}
                  alt={m.alt}
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
            Don&apos;t see what you&apos;re after?
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Tell a local what you like — hiking, electronics, late-night jazz,
            tea ceremonies — and we&apos;ll match you with someone who actually
            does it.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Get matched
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
            District photo credits
          </h2>
          <p className="mt-3 max-w-2xl text-xs text-zinc-500 dark:text-zinc-500">
            District photographs are from Wikimedia Commons, cropped to the
            building. Adaptations of share-alike originals are offered under the
            same licence. The hero and the Moments strip above are our own.
          </p>
          <ul className="mt-4 grid gap-2 text-xs text-zinc-500 sm:grid-cols-2 dark:text-zinc-500">
            {districts.map((d) => (
              <li key={d.slug}>
                <span className="text-zinc-600 dark:text-zinc-400">
                  {d.name}
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
