import Link from 'next/link'

import type { PackageAccent, TourPackage } from '@/content/packages'
import type { Dictionary } from '@/i18n'

// Per-package accent colours.
//
// Every class here is written out in full on purpose. Tailwind resolves
// utilities by scanning source text, so a computed string like
// `bg-${tone}-100` produces no CSS at all and the card renders unstyled. If
// you add an accent, add its literal classes here.
const ACCENT: Record<
  PackageAccent,
  { chip: string; wash: string; rule: string; hover: string }
> = {
  signal: {
    chip: 'bg-cyan-100 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-300',
    wash: 'from-cyan-500/45',
    rule: 'from-cyan-400 to-sky-500',
    hover: 'hover:border-cyan-300 dark:hover:border-cyan-800',
  },
  ember: {
    chip: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300',
    wash: 'from-amber-500/45',
    rule: 'from-amber-400 to-orange-500',
    hover: 'hover:border-amber-300 dark:hover:border-amber-800',
  },
  coral: {
    chip: 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300',
    wash: 'from-rose-500/45',
    rule: 'from-rose-400 to-pink-500',
    hover: 'hover:border-rose-300 dark:hover:border-rose-800',
  },
  jade: {
    chip: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
    wash: 'from-emerald-500/45',
    rule: 'from-emerald-400 to-teal-500',
    hover: 'hover:border-emerald-300 dark:hover:border-emerald-800',
  },
  violet: {
    chip: 'bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-300',
    wash: 'from-violet-500/45',
    rule: 'from-violet-400 to-fuchsia-500',
    hover: 'hover:border-violet-300 dark:hover:border-violet-800',
  },
  sky: {
    chip: 'bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-300',
    wash: 'from-sky-500/45',
    rule: 'from-sky-400 to-blue-500',
    hover: 'hover:border-sky-300 dark:hover:border-sky-800',
  },
}

type Props = {
  pkg: TourPackage
  t: Dictionary
  price: string
  // 'featured' is the wide two-column treatment used once per page. 'standard'
  // is the grid tile.
  variant?: 'featured' | 'standard'
  featuredLabel?: string
  // Loading priority for the image. The first card above the fold should not
  // be lazy; everything below it should.
  eager?: boolean
}

export function PackageCard({
  pkg,
  t,
  price,
  variant = 'standard',
  featuredLabel,
  eager = false,
}: Props) {
  const accent = ACCENT[pkg.accent]
  const href = `/tours/${pkg.slug}`

  if (variant === 'featured') {
    return (
      <article
        className={`sb-lift group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 ${accent.hover}`}
      >
        <div className="grid md:grid-cols-2">
          <div className="relative min-h-[16rem] overflow-hidden md:min-h-[26rem]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pkg.photo}
              alt={pkg.alt}
              loading={eager ? 'eager' : 'lazy'}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-tr ${accent.wash} via-transparent to-transparent`}
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
            {featuredLabel && (
              <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-900 shadow-lg backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
                {featuredLabel}
              </span>
            )}
            <span className="absolute bottom-5 left-5 text-3xl font-semibold text-white drop-shadow-lg md:text-4xl">
              {pkg.cn}
            </span>
          </div>

          <div className="flex flex-col p-7 sm:p-9">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${accent.chip}`}
              >
                {pkg.kicker}
              </span>
              <span className="rounded-full border border-zinc-200 px-2.5 py-1 text-[11px] font-medium text-zinc-500 dark:border-zinc-700">
                {t.common.fourHours}
              </span>
              <span className="rounded-full border border-zinc-200 px-2.5 py-1 text-[11px] font-medium text-zinc-500 dark:border-zinc-700">
                {t.common.oneOnOne}
              </span>
            </div>

            <h3 className="sb-display mt-5 text-3xl leading-tight tracking-tight sm:text-4xl">
              {pkg.title}
            </h3>
            <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
              {pkg.tagline}
            </p>

            <ul className="mt-6 space-y-2.5 border-t border-zinc-100 pt-5 dark:border-zinc-800">
              {pkg.itinerary.slice(0, 3).map((beat) => (
                <li key={beat.at} className="flex gap-3 text-sm">
                  <span className="w-10 shrink-0 pt-px font-mono text-xs tabular-nums text-zinc-400">
                    {beat.at}
                  </span>
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {beat.title}
                  </span>
                </li>
              ))}
              <li className="flex gap-3 text-sm text-zinc-400">
                <span className="w-10 shrink-0 font-mono text-xs">…</span>
                <span>
                  +{pkg.itinerary.length - 3} {t.tours.detail.itinerary.toLowerCase()}
                </span>
              </li>
            </ul>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-7">
              <div>
                <p className="text-2xl font-semibold tracking-tight">{price}</p>
                <p className="text-xs text-zinc-500">{t.common.perPerson}</p>
              </div>
              <Link
                href={href}
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {t.common.seeDetails}
                <Arrow />
              </Link>
            </div>
          </div>
        </div>
        <span
          aria-hidden
          className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${accent.rule} opacity-0 transition duration-500 group-hover:opacity-100`}
        />
      </article>
    )
  }

  return (
    <article
      className={`sb-lift group relative flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900 ${accent.hover}`}
    >
      <Link href={href} className="relative block h-52 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pkg.photo}
          alt={pkg.alt}
          loading={eager ? 'eager' : 'lazy'}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${accent.wash} via-black/10 to-transparent`}
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/65 to-transparent" />
        <span className="absolute bottom-3 left-4 text-2xl font-semibold text-white drop-shadow-lg">
          {pkg.cn}
        </span>
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider shadow-sm ${accent.chip}`}
        >
          {pkg.kicker}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="sb-display text-2xl leading-snug tracking-tight">
          <Link href={href} className="transition hover:opacity-70">
            {pkg.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
          {pkg.tagline}
        </p>

        <div className="mt-5 flex items-center gap-2 text-[11px] text-zinc-500">
          <ClockIcon />
          <span>{t.common.fourHours}</span>
          <span aria-hidden>·</span>
          <span>{t.common.oneOnOne}</span>
          <span aria-hidden>·</span>
          <span>{pkg.district}</span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <span className="text-lg font-semibold tracking-tight">{price}</span>
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 transition group-hover:gap-2.5 dark:text-white"
          >
            {t.common.seeDetails}
            <Arrow />
          </Link>
        </div>
      </div>
      <span
        aria-hidden
        className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${accent.rule} opacity-0 transition duration-500 group-hover:opacity-100`}
      />
    </article>
  )
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-4 w-4"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-3.5 w-3.5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}
