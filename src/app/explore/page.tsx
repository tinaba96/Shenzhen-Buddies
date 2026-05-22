import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explore Shenzhen — Shenzhen Buddies',
  description:
    'Six sides of Shenzhen, from skyline-and-finance Futian to the oil-painting alleys of Dafen — and a local who can show you each one.',
}

// PLACEHOLDER PHOTOS — generic Unsplash imagery, not Shenzhen-specific.
// Swap each `photo` URL with a curated Shenzhen photo before any paid
// acquisition. Keep dimensions ≥ 1200×800 for crisp display on retina.

type Tile = {
  title: string
  blurb: string
  photo: string
  alt: string
}

const HERO_PHOTO =
  'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1600&q=80&auto=format&fit=crop'

const tiles: Tile[] = [
  {
    title: 'Futian — the modern downtown',
    blurb:
      "Glass towers, the city's tallest skyline, Lianhuashan park views, and the metro hub that ties it all together. Best at golden hour.",
    photo:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80&auto=format&fit=crop',
    alt: 'Modern city skyline at dusk',
  },
  {
    title: 'OCT-Loft — art and design',
    blurb:
      'A converted industrial estate full of galleries, indie cafés, design studios, and weekend pop-ups. Quietly Shenzhen-cool.',
    photo:
      'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=1200&q=80&auto=format&fit=crop',
    alt: 'Art gallery interior with framed works',
  },
  {
    title: 'Dafen Village — oil-painting alleys',
    blurb:
      "An entire village of painters reproducing every famous canvas you've ever seen, plus original work tucked into back streets.",
    photo:
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&q=80&auto=format&fit=crop',
    alt: 'Oil paint on a palette',
  },
  {
    title: 'Huaqiangbei — electronics megamarket',
    blurb:
      'A multi-block maze of chip vendors, drone shops, repair counters, and one-off components. Bring a list; leave with more.',
    photo:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop',
    alt: 'Circuit board with electronic components',
  },
  {
    title: 'Shekou & the coast',
    blurb:
      'Sea World plaza, ferry docks, expat-leaning bars, and a sunset walk along the harbor. Easy half-day if downtown burns you out.',
    photo:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop',
    alt: 'Coastline at sunset',
  },
  {
    title: 'Street food, dim sum, and night markets',
    blurb:
      'Cantonese dim sum, Hunanese chilies, Dongbei skewers, durian stalls. Bring an empty stomach and a guide who knows where to point.',
    photo:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80&auto=format&fit=crop',
    alt: 'Spread of Asian dishes on a table',
  },
]

const moments = [
  {
    src: 'https://images.unsplash.com/photo-1523920290228-4f321a939b4c?w=600&q=80&auto=format&fit=crop',
    alt: 'Neon-lit alley at night',
  },
  {
    src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80&auto=format&fit=crop',
    alt: 'Steaming bowl of noodles',
  },
  {
    src: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&q=80&auto=format&fit=crop',
    alt: 'Subway platform with people',
  },
  {
    src: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80&auto=format&fit=crop',
    alt: 'Cherry blossoms in a city park',
  },
  {
    src: 'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?w=600&q=80&auto=format&fit=crop',
    alt: 'Bridge over water at twilight',
  },
  {
    src: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&q=80&auto=format&fit=crop',
    alt: 'Hands sharing a hot pot',
  },
  {
    src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80&auto=format&fit=crop',
    alt: 'Crowd at an outdoor festival',
  },
  {
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80&auto=format&fit=crop',
    alt: 'Mountains and mist at sunrise',
  },
]

export default function ExplorePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* HERO with photo + gradient wash */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_PHOTO}
          alt="Shenzhen at dusk"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center text-white sm:py-32">
          <p className="text-xs font-medium uppercase tracking-wide text-white/80">
            Explore
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight drop-shadow sm:text-5xl">
            Six sides of Shenzhen.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/90 drop-shadow">
            Pick what you came for — skyline, art, gadgets, food, or salt air.
            Each one has a local who knows it well.
          </p>
          <Link
            href="/browse?city=Shenzhen"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-100"
          >
            Browse buddies in Shenzhen
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* SIX TILES, each with a photo header */}
      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t) => (
            <li key={t.title}>
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                <div className="relative h-44 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.photo}
                    alt={t.alt}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-base font-semibold">{t.title}</h2>
                  <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {t.blurb}
                  </p>
                  <Link
                    href="/browse?city=Shenzhen"
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

      {/* MOMENTS — masonry-feel photo grid */}
      <section className="border-t border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950/30">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Moments
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              A day in Shenzhen, give or take.
            </h2>
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
    </main>
  )
}
