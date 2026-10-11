import Link from 'next/link'
import type { Metadata } from 'next'
import { DEFAULT_OG_IMAGE } from '@/lib/config'
import { HeroImage } from '@/components/HeroImage'
import { getI18n } from '@/i18n/server'
import type { Dictionary } from '@/i18n'

export async function generateMetadata(): Promise<Metadata> {
  const { meta, t } = await getI18n()
  const seo = t.seo.about
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: '/about' },
    // Declared explicitly: the root layout sets an openGraph block, and
    // metadata merges per key — so a page that omits this inherits the site's
    // generic title, description and an og:url pointing at the homepage.
    openGraph: {
      locale: meta.ogLocale,
      title: seo.title,
      description: seo.description,
      url: '/about',
      // Not redundant with the root layout: the openGraph object above replaces
      // the inherited one wholesale, and the file-convention card at
      // src/app/opengraph-image.png goes with it, so without this line the page
      // shares as a grey box. See DEFAULT_OG_IMAGE in src/lib/config.ts.
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



// Titles and bodies live in t.about.pillars, keyed by id.
const PILLARS: {
  id: keyof Dictionary['about']['pillars']
  icon: 'spark' | 'people' | 'shield'
  tone: 'amber' | 'rose' | 'emerald'
}[] = [
  { id: 'interests', icon: 'spark', tone: 'amber' },
  { id: 'casual', icon: 'people', tone: 'rose' },
  { id: 'trust', icon: 'shield', tone: 'emerald' },
]

// Roles and bios live in t.about.founders, keyed by id.
const FOUNDERS: {
  id: keyof Dictionary['about']['founders']
  name: string
  photo: string
}[] = [
  { id: 'bryan', name: 'Bryan Wang', photo: '/team/bryan.jpg' },
  { id: 'taka', name: 'Takahiro Inaba', photo: '/team/taka.jpg' },
]

export default async function AboutPage() {
  const { t } = await getI18n()
  const copy = t.about
  const together = [
    {
      src: '/team/together-1.jpg',
      alt: copy.together.sunsetAlt,
      caption: copy.together.sunsetCaption,
    },
    {
      src: '/team/together-2.jpg',
      alt: copy.together.bbqAlt,
      caption: copy.together.bbqCaption,
    },
  ]
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden">
        <HeroImage
          name="crayfish-noodles-lift"
          alt={copy.hero.imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/45 to-black/80" />
        <div
          className="absolute inset-0 mix-blend-soft-light opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(245,158,11,0.55), transparent 50%), radial-gradient(circle at 80% 70%, rgba(244,63,94,0.55), transparent 50%)',
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 py-28 text-center text-white sm:py-40">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            {copy.hero.badge}
          </p>
          <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight drop-shadow-lg sm:text-7xl">
            {copy.hero.titleLead}
            <span className="bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-transparent">
              {copy.hero.titleAccent}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-white/90 drop-shadow sm:text-xl">
            {copy.hero.body}
          </p>
        </div>
      </section>

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
              {copy.why.kicker}
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {copy.why.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-600 dark:text-zinc-400">
              {copy.why.body}
            </p>
          </div>

          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {PILLARS.map((p) => (
              <li key={p.id}>
                <article className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                      p.tone === 'amber'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : p.tone === 'rose'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    <PillarIcon name={p.icon} />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{copy.pillars[p.id].title}</h3>
                  <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {copy.pillars[p.id].body}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/40">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              {copy.team.kicker}
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {copy.team.title}
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {FOUNDERS.map((f) => (
              <article
                key={f.name}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="relative aspect-[5/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.photo}
                    alt={f.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white">
                    <p className="text-lg font-semibold drop-shadow">{f.name}</p>
                    <p className="text-xs uppercase tracking-wide text-white/80">
                      {copy.founders[f.id].role}
                    </p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">
                    {copy.founders[f.id].bio}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Off-the-clock photos of the two of us */}
          <div className="mt-14">
            <p className="text-center text-xs font-medium uppercase tracking-wider text-zinc-500">
              {copy.together.kicker}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {together.map((p) => (
                <figure
                  key={p.src}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl dark:border-zinc-800"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.src}
                      alt={p.alt}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  <figcaption className="absolute bottom-3 left-4 text-sm font-medium text-white drop-shadow">
                    {p.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mx-auto h-8 w-8 text-amber-400"
            aria-hidden
          >
            <path d="M9.5 6a4.5 4.5 0 0 0 0 9V18a8 8 0 0 1-8-8 8 8 0 0 1 8-8v4zm14 0a4.5 4.5 0 0 0 0 9V18a8 8 0 0 1-8-8 8 8 0 0 1 8-8v4z" />
          </svg>
          <blockquote className="mt-6 text-balance text-3xl font-medium leading-snug tracking-tight sm:text-4xl">
            {copy.quote}
          </blockquote>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-rose-50 to-rose-100 dark:from-amber-950/40 dark:via-zinc-900 dark:to-rose-950/40" />
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {copy.cta.title}
          </h2>
          <p className="mt-3 text-zinc-700 dark:text-zinc-300">
            {copy.cta.body}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {copy.cta.join}
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-zinc-300 bg-white/80 px-6 py-3 text-sm font-medium backdrop-blur transition hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/60 dark:hover:bg-zinc-900"
            >
              {copy.cta.talk}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function PillarIcon({ name }: { name: 'spark' | 'people' | 'shield' }) {
  const cls = 'h-5 w-5'
  switch (name) {
    case 'spark':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden>
          <path d="M12 2l1.6 4.4 4.4 1.6-4.4 1.6L12 14l-1.6-4.4L6 8l4.4-1.6zM19.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
        </svg>
      )
    case 'people':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )
  }
}
