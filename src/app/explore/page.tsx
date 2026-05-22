import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explore Shenzhen — Shenzhen Buddies',
  description:
    'Six sides of Shenzhen, from skyline-and-finance Futian to the oil-painting alleys of Dafen — and a local who can show you each one.',
}

type Tile = {
  title: string
  blurb: string
  gradient: string
  icon: 'building' | 'palette' | 'brush' | 'cpu' | 'waves' | 'utensils'
}

const tiles: Tile[] = [
  {
    title: 'Futian — the modern downtown',
    blurb:
      "Glass towers, the city's tallest skyline, Lianhuashan park views, and the metro hub that ties it all together. Best at golden hour.",
    gradient: 'from-amber-400 to-rose-500',
    icon: 'building',
  },
  {
    title: 'OCT-Loft — art and design',
    blurb:
      'A converted industrial estate full of galleries, indie cafés, design studios, and weekend pop-ups. Quietly Shenzhen-cool.',
    gradient: 'from-rose-400 to-fuchsia-500',
    icon: 'palette',
  },
  {
    title: 'Dafen Village — oil-painting alleys',
    blurb:
      "An entire village of painters reproducing every famous canvas you've ever seen, plus original work tucked into back streets.",
    gradient: 'from-fuchsia-400 to-violet-500',
    icon: 'brush',
  },
  {
    title: 'Huaqiangbei — electronics megamarket',
    blurb:
      'A multi-block maze of chip vendors, drone shops, repair counters, and one-off components. Bring a list; leave with more.',
    gradient: 'from-sky-400 to-indigo-500',
    icon: 'cpu',
  },
  {
    title: 'Shekou & the coast',
    blurb:
      'Sea World plaza, ferry docks, expat-leaning bars, and a sunset walk along the harbor. Easy half-day if downtown burns you out.',
    gradient: 'from-cyan-400 to-emerald-500',
    icon: 'waves',
  },
  {
    title: 'Street food, dim sum, and night markets',
    blurb:
      'Cantonese dim sum, Hunanese chilies, Dongbei skewers, durian stalls. Bring an empty stomach and a guide who knows where to point.',
    gradient: 'from-emerald-400 to-amber-400',
    icon: 'utensils',
  },
]

export default function ExplorePage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-rose-50 dark:from-zinc-900 dark:via-black dark:to-zinc-900" />
        <div className="relative mx-auto max-w-5xl px-6 py-16 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Explore
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            Six sides of Shenzhen.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
            Pick what you came for — skyline, art, gadgets, food, or salt
            air. Each one has a local who knows it well.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t) => (
            <li key={t.title}>
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                <div
                  className={`relative flex h-32 items-center justify-center bg-gradient-to-br text-white ${t.gradient}`}
                >
                  <TileIcon icon={t.icon} />
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

      <section className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Don&apos;t see what you&apos;re after?
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Tell a local what you like — hiking, electronics, late-night
            jazz, tea ceremonies — and we&apos;ll match you with someone who
            actually does it.
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

function TileIcon({ icon }: { icon: Tile['icon'] }) {
  const cls = 'h-10 w-10'
  switch (icon) {
    case 'building':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M3 21h18" />
          <path d="M6 21V8l5-3 5 3v13" />
          <path d="M16 21V11l4-2v12" />
          <path d="M9 9v.01M9 13v.01M9 17v.01M12 9v.01M12 13v.01M12 17v.01" />
        </svg>
      )
    case 'palette':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 10 10 4 4 0 0 1-4 4h-2a2 2 0 0 0-1.5 3.3A2 2 0 0 1 12 22z" />
          <circle cx="7.5" cy="10.5" r="1" />
          <circle cx="12" cy="7" r="1" />
          <circle cx="16.5" cy="10.5" r="1" />
        </svg>
      )
    case 'brush':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M9 11l-4 4a3 3 0 1 0 4 4l4-4" />
          <path d="M14 14l7-7a2 2 0 0 0-2.8-2.8L11 11" />
          <path d="M9 11l4 4" />
        </svg>
      )
    case 'cpu':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <rect x="6" y="6" width="12" height="12" rx="1.5" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
          <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
        </svg>
      )
    case 'waves':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M2 8c2 0 2-1.5 4-1.5S8 8 10 8s2-1.5 4-1.5S16 8 18 8s2-1.5 4-1.5" />
          <path d="M2 14c2 0 2-1.5 4-1.5S8 14 10 14s2-1.5 4-1.5S16 14 18 14s2-1.5 4-1.5" />
          <path d="M2 20c2 0 2-1.5 4-1.5S8 20 10 20s2-1.5 4-1.5S16 20 18 20s2-1.5 4-1.5" />
        </svg>
      )
    case 'utensils':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M3 3v8a3 3 0 0 0 3 3v8" />
          <path d="M9 3v8a3 3 0 0 1-3 3" />
          <path d="M14 3c-1.5 2-1.5 5 0 7l1 1v10" />
          <path d="M15 3l3 5-3 1" />
        </svg>
      )
  }
}
