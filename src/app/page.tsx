import Link from 'next/link'
import { Avatar } from '@/components/Avatar'
import { PackageCard } from '@/components/PackageCard'
import { galleryItems, requireGalleryItem } from '@/content/gallery'
import { packagePrice } from '@/content/packages'
import {
  localizedFeaturedPackage,
  localizedOtherPackages,
} from '@/content/packages-i18n'
import { publishedPosts } from '@/content/posts'
import type { Dictionary } from '@/i18n'
import { getI18n } from '@/i18n/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Locale } from '@/i18n/config'

export default async function Home() {
  const [{ locale, t }, supabase] = await Promise.all([
    getI18n(),
    createSupabaseServerClient(),
  ])
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="flex flex-1 flex-col">
      <Hero loggedIn={!!user} t={t} />
      <Ticker />
      <Packages locale={locale} t={t} />
      <Promise_ t={t} />
      <Districts t={t} />
      <HowItWorks t={t} />
      <Audiences t={t} />
      <Testimonials t={t} />
      <Journal t={t} />
      <Moments t={t} />
      <PartnerBanner t={t} />
      <FinalCTA loggedIn={!!user} t={t} />
    </main>
  )
}

// ---------------------------------------------------------------------------

function Hero({ loggedIn, t }: { loggedIn: boolean; t: Dictionary }) {
  return (
    <section className="sb-grain relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/skyline-tower-walkway-night.webp"
          alt="A Shenzhen tower lit white against the night sky, seen past a raised pedestrian walkway"
          className="sb-drift h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/50 to-black/85" />
      <div
        className="absolute inset-0 opacity-60 mix-blend-soft-light"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(245, 158, 11, 0.5), transparent 45%), radial-gradient(circle at 80% 60%, rgba(244, 63, 94, 0.5), transparent 50%)',
        }}
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-28 text-center text-white sm:py-40">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-white backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          {t.home.hero.badge}
        </p>

        <h1 className="sb-display mt-7 max-w-4xl text-balance text-5xl leading-[1.05] tracking-tight drop-shadow-xl sm:text-7xl lg:text-8xl">
          {t.home.hero.titleLead}{' '}
          <span className="sb-shine italic">{t.home.hero.titleAccent}</span>
        </h1>

        <p className="mt-7 max-w-xl text-pretty text-lg text-white/90 drop-shadow sm:text-xl">
          {t.home.hero.body}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {loggedIn ? (
            <>
              <Link
                href="/tours"
                className="rounded-full bg-white px-7 py-3.5 text-sm font-medium text-zinc-900 shadow-lg shadow-black/20 transition hover:bg-zinc-100"
              >
                {t.home.hero.primaryCta}
              </Link>
              <Link
                href="/profile"
                className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
              >
                {t.common.yourProfile}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/tours"
                className="rounded-full bg-white px-7 py-3.5 text-sm font-medium text-zinc-900 shadow-lg shadow-black/20 transition hover:bg-zinc-100"
              >
                {t.home.hero.primaryCta}
              </Link>
              <Link
                href="/signup?as=guide"
                className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
              >
                {t.home.hero.secondaryCta}
              </Link>
            </>
          )}
        </div>

        {/* The old entry points are still here — signup-as-tourist, /explore
            and /login — demoted to the fine print rather than removed, because
            the primary path is now the experience catalogue. */}
        {!loggedIn && (
          <p className="mt-6 text-xs text-white/70">
            {t.common.freeDuringPilot} ·{' '}
            <Link href="/signup?as=tourist" className="underline hover:text-white">
              {t.common.findALocal}
            </Link>{' '}
            ·{' '}
            <Link href="/explore" className="underline hover:text-white">
              {t.common.exploreFirst}
            </Link>{' '}
            ·{' '}
            <Link href="/login" className="underline hover:text-white">
              {t.common.alreadyHaveAccount}
            </Link>
          </p>
        )}

        {/* Trust strip */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-wider text-white/60">
          <TrustItem label={t.home.trust.verified}>
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </TrustItem>
          <TrustItem label={t.home.trust.refund}>
            <path d="m9 11 3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </TrustItem>
          <TrustItem label={t.home.trust.noGroups}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
          </TrustItem>
          <TrustItem label={t.home.trust.reviewed}>
            <path d="M12 2 4 7v6c0 5 4 8 8 9 4-1 8-4 8-9V7z" />
          </TrustItem>
        </div>
      </div>
    </section>
  )
}

function TrustItem({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <span className="flex items-center gap-1.5">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="h-3.5 w-3.5"
      >
        {children}
      </svg>
      {label}
    </span>
  )
}

// The place-name ticker. Names are shown in Chinese and romanised together and
// are not translated — they are the actual names of the actual places, and a
// traveller pointing at 华强北 on a phone screen is the point.
const TICKER = [
  '华强北 Huaqiangbei',
  '东门 Dongmen',
  '蛇口 Shekou',
  '福田 Futian',
  '南山 Nanshan',
  '罗湖 Luohu',
  '莲花山 Lianhuashan',
  '大排档 Dàpáidàng',
  '深圳湾 Shenzhen Bay',
  '龙岗 Longgang',
  '宝安 Baoan',
  '龙华 Longhua',
]

function Ticker() {
  return (
    <div className="sb-marquee-host relative overflow-hidden border-y border-zinc-200 bg-zinc-950 py-3 dark:border-zinc-800">
      <div className="sb-marquee">
        {/* Rendered twice so the -50% loop lands on an identical frame. The
            duplicate is aria-hidden so a screen reader reads the list once. */}
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 items-center gap-8 pr-8 text-xs uppercase tracking-[0.25em] text-zinc-500"
          >
            {TICKER.map((name) => (
              <li key={name} className="flex items-center gap-8 whitespace-nowrap">
                {name}
                <span aria-hidden className="text-amber-500/60">
                  ✦
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

// The tour package boxes.
async function Packages({ locale, t }: { locale: Locale; t: Dictionary }) {
  const featured = localizedFeaturedPackage(locale)
  const rest = localizedOtherPackages(locale)
  const price = packagePrice()

  return (
    <section className="relative border-b border-zinc-200 dark:border-zinc-800">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80 opacity-60 dark:opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 50% 0%, rgba(244,63,94,0.16), transparent 65%)',
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="sb-rise max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            {t.home.packages.kicker}
          </p>
          <h2 className="sb-display mt-3 text-4xl leading-tight tracking-tight sm:text-5xl">
            {t.home.packages.title}
          </h2>
          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
            {t.home.packages.body}
          </p>
          <p className="mt-3 text-sm text-zinc-500">
            {t.home.packages.priceNote.replace('{price}', price)}
          </p>
        </div>

        <div className="sb-rise mt-12">
          <PackageCard
            pkg={featured}
            t={t}
            price={price}
            variant="featured"
            featuredLabel={t.home.packages.featuredLabel}
            eager
          />
        </div>

        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((pkg) => (
            <li key={pkg.slug} className="sb-rise">
              <PackageCard pkg={pkg} t={t} price={price} />
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium transition hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
          >
            {t.home.packages.allLink}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

// `Promise` is a global. Named with a trailing underscore rather than shadowing it.
function Promise_({ t }: { t: Dictionary }) {
  const icons = [
    <>
      <path d="M5 8h14" />
      <path d="M7 4h10" />
      <path d="m9 20 3-8 3 8" />
      <path d="M10 17h4" />
    </>,
    <>
      <rect x="2" y="5" width="20" height="14" rx="3" />
      <path d="M2 10h20" />
      <path d="M7 15h3" />
    </>,
    <>
      <circle cx="12" cy="10" r="3" />
      <path d="M12 21s-7-7-7-11a7 7 0 1 1 14 0c0 4-7 11-7 11z" />
    </>,
    <>
      <path d="M12 2v20" />
      <path d="M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </>,
    <>
      <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 9 9" />
      <path d="m3 12 3-3 3 3" />
      <path d="M21 12a9 9 0 0 1-9 9" />
    </>,
    <>
      <path d="M3 6v6a9 9 0 0 0 9 9 9 9 0 0 0 9-9V6l-9-4z" />
      <path d="m9 12 2 2 4-4" />
    </>,
  ]

  return (
    <section className="border-b border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-950/40">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="sb-rise max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            {t.home.promise.kicker}
          </p>
          <h2 className="sb-display mt-3 text-4xl leading-tight tracking-tight sm:text-5xl">
            {t.home.promise.title}
          </h2>
          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
            {t.home.promise.body}
          </p>
        </div>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3 dark:border-zinc-800 dark:bg-zinc-800">
          {t.home.promise.items.map((item, i) => (
            <li
              key={item.title}
              className="group bg-white p-7 transition hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-rose-100 text-zinc-800 transition duration-500 group-hover:scale-110 group-hover:from-amber-200 group-hover:to-rose-200 dark:from-amber-500/15 dark:to-rose-500/15 dark:text-zinc-100">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className="h-5 w-5"
                >
                  {icons[i]}
                </svg>
              </span>
              <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// A typographic index rather than six photo tiles. The district photographs
// live on /explore and are Wikimedia CC BY-SA files whose licence requires the
// attribution block that sits under them there; reproducing the images here
// would mean reproducing that block here too. Type carries the section fine.
const DISTRICTS = [
  { name: 'Nanshan', cn: '南山' },
  { name: 'Futian', cn: '福田' },
  { name: 'Luohu', cn: '罗湖' },
  { name: "Bao'an", cn: '宝安' },
  { name: 'Longhua', cn: '龙华' },
  { name: 'Longgang', cn: '龙岗' },
]

function Districts({ t }: { t: Dictionary }) {
  return (
    <section className="border-b border-zinc-200 bg-zinc-950 text-white dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="sb-rise flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              {t.home.districts.kicker}
            </p>
            <h2 className="sb-display mt-3 text-4xl leading-tight tracking-tight sm:text-5xl">
              {t.home.districts.title}
            </h2>
            <p className="mt-4 text-base text-zinc-400">{t.home.districts.body}</p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            {t.home.districts.cta}
            <span aria-hidden>→</span>
          </Link>
        </div>

        <ol className="mt-12 border-t border-white/10">
          {DISTRICTS.map((d, i) => (
            <li key={d.name}>
              <Link
                href="/explore"
                className="group flex items-baseline gap-5 border-b border-white/10 py-5 transition hover:bg-white/5 sm:gap-8 sm:py-6"
              >
                <span className="w-8 shrink-0 font-mono text-xs tabular-nums text-zinc-600">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="sb-display flex-1 text-3xl tracking-tight transition group-hover:translate-x-2 sm:text-4xl">
                  {d.name}
                </span>
                <span className="text-lg text-zinc-500 transition group-hover:text-amber-400 sm:text-2xl">
                  {d.cn}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function HowItWorks({ t }: { t: Dictionary }) {
  const photos = [
    {
      src: '/gallery/bakery-bread-counter.webp',
      alt: 'Sourdough rounds and baguettes on a Shenzhen bakery counter',
    },
    {
      src: '/gallery/preserved-fruit-jars.webp',
      alt: 'Clip-top jars of kumquats and plums preserved in syrup',
    },
    {
      src: '/gallery/skyline-blue-towers-night.webp',
      alt: 'Shenzhen towers lit blue at night, seen from street level',
    },
  ]

  return (
    <section className="relative border-b border-zinc-200 dark:border-zinc-800">
      <div
        className="pointer-events-none absolute inset-0 opacity-50 dark:opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 10% 10%, rgba(245,158,11,0.15), transparent 50%), radial-gradient(circle at 90% 90%, rgba(244,63,94,0.15), transparent 50%)',
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="sb-rise text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            {t.home.howItWorks.kicker}
          </p>
          <h2 className="sb-display mt-3 text-4xl leading-tight tracking-tight sm:text-5xl">
            {t.home.howItWorks.title}
          </h2>
        </div>

        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {t.home.howItWorks.steps.map((step, i) => (
            // sb-rise and sb-lift must not sit on the same element: a
            // scroll-driven animation owns `transform` for as long as it is
            // attached, so the hover lift silently stops working. Reveal on
            // the wrapper, lift on the card.
            <li key={step.title} className="sb-rise">
            <div className="sb-lift group relative h-full overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
              <div className="relative h-44 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photos[i].src}
                  alt={photos[i].alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="sb-display absolute left-5 top-3 text-6xl text-white/90 drop-shadow-lg">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {step.body}
                </p>
              </div>
            </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Audiences({ t }: { t: Dictionary }) {
  return (
    <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-20 sm:px-6 md:grid-cols-2">
        <AudienceCard
          tone="amber"
          photo="/gallery/night-market-skewers-stall.webp"
          alt="A Shenzhen night market stall laid with trays of skewered insects"
          icon={
            <>
              <path d="M3 7l9-4 9 4" />
              <path d="M3 7l9 4 9-4" />
              <path d="M3 7v6c0 4 4 7 9 7s9-3 9-7V7" />
            </>
          }
          title={t.home.audiences.travelerTitle}
          subtitle={t.home.audiences.travelerSubtitle}
          points={t.home.audiences.travelerPoints}
        />
        <AudienceCard
          tone="rose"
          photo="/gallery/chicken-rice-table.webp"
          alt="A shared table of chicken rice, noodles and fried tofu skin in Shenzhen"
          icon={
            <>
              <path d="M12 21s-7-7-7-12a7 7 0 1 1 14 0c0 5-7 12-7 12z" />
              <circle cx="12" cy="9" r="2.5" />
            </>
          }
          title={t.home.audiences.localTitle}
          subtitle={t.home.audiences.localSubtitle}
          points={t.home.audiences.localPoints}
        />
      </div>
    </section>
  )
}

function AudienceCard({
  tone,
  photo,
  alt,
  icon,
  title,
  subtitle,
  points,
}: {
  tone: 'amber' | 'rose'
  photo: string
  alt: string
  icon: React.ReactNode
  title: string
  subtitle: string
  points: string[]
}) {
  const accent =
    tone === 'amber'
      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
      : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
  const gradient =
    tone === 'amber'
      ? 'from-amber-500/40 via-amber-400/10'
      : 'from-rose-500/40 via-rose-400/10'

  return (
    // Reveal on the wrapper, lift on the card — see the note in HowItWorks.
    <div className="sb-rise">
    <article className="sb-lift group h-full overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
      <div className="relative h-52 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${gradient} to-transparent`} />
        <div
          className={`absolute left-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-xl shadow-lg backdrop-blur ${accent}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="h-6 w-6"
          >
            {icon}
          </svg>
        </div>
      </div>
      <div className="p-7">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          {subtitle}
        </p>
        <h3 className="sb-display mt-1 text-3xl tracking-tight">{title}</h3>
        <ul className="mt-5 space-y-2.5 text-sm text-zinc-700 dark:text-zinc-300">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-2.5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
    </div>
  )
}

function Testimonials({ t }: { t: Dictionary }) {
  // Left in the language they were given in. A quote translated by the company
  // that is quoting it stops being a quote.
  const reviews = [
    {
      stars: 5,
      quote:
        'Lin took me to a tea house in Futian I never would have found. We ended up talking for three hours. Felt like meeting a friend, not booking a tour.',
      name: 'Sarah K.',
      role: 'Tourist, visiting from London',
      photo: 'https://i.pravatar.cc/120?img=47',
    },
    {
      stars: 5,
      quote:
        'I joined as a guide because I love showing people my city. Met a photographer from Mexico who taught me about light. We are still chatting.',
      name: 'Wei H.',
      role: 'Guide, Shenzhen local',
      photo: 'https://i.pravatar.cc/120?img=12',
    },
    {
      stars: 5,
      quote:
        'My Mandarin is awful and I was nervous about the trip. Daniel speaks Italian and took me to the best street food. Game-changer.',
      name: 'Marco R.',
      role: 'Tourist, visiting from Milan',
      photo: 'https://i.pravatar.cc/120?img=33',
    },
  ]

  return (
    <section className="border-b border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950/30">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="sb-rise text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            {t.home.testimonials.kicker}
          </p>
          <h2 className="sb-display mt-3 text-4xl leading-tight tracking-tight sm:text-5xl">
            {t.home.testimonials.title}
          </h2>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {reviews.map((r) => (
            <li
              key={r.name}
              className="sb-rise flex flex-col rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <StaticStars value={r.stars} />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
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

function StaticStars({ value }: { value: number }) {
  return (
    <span aria-label={`${value} out of 5 stars`} className="inline-flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          aria-hidden
          className={
            i < value
              ? 'h-4 w-4 fill-amber-400'
              : 'h-4 w-4 fill-zinc-200 dark:fill-zinc-700'
          }
        >
          <path d="M12 2.5l2.92 6.01 6.58.95-4.76 4.65 1.12 6.55L12 17.77l-5.86 3.09 1.12-6.55L2.5 9.46l6.58-.95L12 2.5z" />
        </svg>
      ))}
    </span>
  )
}

function Journal({ t }: { t: Dictionary }) {
  const posts = publishedPosts().slice(0, 3)
  if (posts.length === 0) return null

  return (
    <section className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="sb-rise flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              {t.home.journal.kicker}
            </p>
            <h2 className="sb-display mt-3 text-4xl leading-tight tracking-tight sm:text-5xl">
              {t.home.journal.title}
            </h2>
            <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
              {t.home.journal.body}
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium transition hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            {t.home.journal.cta}
            <span aria-hidden>→</span>
          </Link>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const hero = post.heroGalleryId
              ? requireGalleryItem(post.heroGalleryId, 'home/journal')
              : null
            return (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="sb-lift group flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
                >
                  {hero && (
                    <div className="relative h-44 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={hero.src}
                        alt={hero.alt}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                      {post.publishedAt}
                    </p>
                    <h3 className="sb-display mt-2 text-2xl leading-snug tracking-tight">
                      {post.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {post.excerpt}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium transition group-hover:gap-2.5">
                      {t.common.readMore}
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function Moments({ t }: { t: Dictionary }) {
  const shots = galleryItems.filter((i) => i.kind === 'image').slice(0, 8)

  return (
    <section className="border-b border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-950/40">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="sb-rise text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            {t.home.moments.kicker}
          </p>
          <h2 className="sb-display mt-3 text-4xl leading-tight tracking-tight sm:text-5xl">
            {t.home.moments.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-zinc-600 dark:text-zinc-400">
            {t.home.moments.body}
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {shots.map((shot) => (
            <li key={shot.id} className="overflow-hidden rounded-2xl">
              <Link href="/gallery" className="block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shot.src}
                  alt={shot.alt}
                  width={shot.width}
                  height={shot.height}
                  loading="lazy"
                  className="h-40 w-full object-cover transition duration-500 hover:scale-110 sm:h-48"
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4"
          >
            {t.home.moments.cta}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

const SPLITWHOM_URL =
  'https://splitwhom.com/?utm_source=shenzhen-buddies&utm_medium=referral&utm_campaign=og_banner'

// Kept, but demoted. It used to sit mid-page at full width between the
// testimonials and the closing CTA; it is now a narrow strip below the fold,
// so the partner is still credited and still clickable without competing with
// the experiences for attention.
function PartnerBanner({ t }: { t: Dictionary }) {
  return (
    <section className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-400">
          {t.partner.kicker}
        </p>
        <a
          href={SPLITWHOM_URL}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group block overflow-hidden rounded-2xl border border-zinc-200 opacity-80 shadow-sm transition hover:opacity-100 hover:shadow-lg dark:border-zinc-800"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/splitwhom-banner.png"
            alt="SplitWhom — split shared expenses with friends"
            loading="lazy"
            className="w-full transition duration-500 group-hover:scale-[1.02]"
          />
        </a>
      </div>
    </section>
  )
}

function FinalCTA({ loggedIn, t }: { loggedIn: boolean; t: Dictionary }) {
  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(245,158,11,0.25), transparent 45%), radial-gradient(circle at 80% 70%, rgba(244,63,94,0.25), transparent 50%)',
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
        <h2 className="sb-display text-4xl leading-tight tracking-tight sm:text-6xl">
          {loggedIn ? t.home.finalCta.titleLoggedIn : t.home.finalCta.titleAnon}
        </h2>
        <p className="mt-4 text-zinc-400">
          {loggedIn ? t.home.finalCta.bodyLoggedIn : t.home.finalCta.bodyAnon}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={loggedIn ? '/browse' : '/signup'}
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-zinc-900 shadow-lg transition hover:bg-zinc-100"
          >
            {loggedIn ? t.common.browseBuddies : t.common.getStarted}
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            {t.home.packages.allLink}
          </Link>
        </div>
      </div>
    </section>
  )
}
