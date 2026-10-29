import Link from 'next/link'
import type { Metadata } from 'next'
import { HeroImage } from '@/components/HeroImage'
import { publishedPosts } from '@/content/posts'
import { hasPostTranslation, localizePosts } from '@/content/posts-i18n'
import { en } from '@/i18n/dictionaries/en'
import type { Dictionary } from '@/i18n'
import { getI18n } from '@/i18n/server'
import { DEFAULT_OG_IMAGE, siteUrl } from '@/lib/config'

// The page written for "get local help in Shenzhen" / "help in Shenzhen"
// searches. Google ranks on what the page says, not on meta tags, so the query
// phrasing lives in the <h1>, the body copy and the FAQ, and the FAQ is mirrored
// into FAQPage structured data.

// Journal posts that answer the questions people searching for help actually
// have. Missing or unpublished slugs drop out rather than linking to a 404.
const READING_SLUGS = ['shenzhen-from-hong-kong-day-trip', 'what-shenzhen-actually-eats']

export async function generateMetadata(): Promise<Metadata> {
  const { meta, t } = await getI18n()
  const seo = t.seo.localHelp
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: '/local-help' },
    // Declared explicitly for the same reason as welcome/page.tsx: openGraph
    // merges per key, so omitting it inherits the homepage's og:url.
    openGraph: {
      locale: meta.ogLocale,
      title: seo.title,
      description: seo.description,
      url: '/local-help',
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
  }
}

type Copy = { t: Dictionary['localHelp'] }

export default async function LocalHelpPage() {
  const { locale, t } = await getI18n()
  const copy = t.localHelp
  const posts = localizePosts(
    publishedPosts().filter((p) => READING_SLUGS.includes(p.slug)),
    locale,
  )

  return (
    <main className="flex flex-1 flex-col">
      <FaqJsonLd />
      <Hero t={copy} />
      <HelpWith t={copy} />
      <HowItWorks t={copy} />
      <Limits t={copy} />
      {posts.length > 0 && (
        <section className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto max-w-3xl px-6 py-20">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              {copy.reading.kicker}
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">{copy.reading.title}</h2>
            <ul className="mt-8 space-y-3">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    // An untranslated post keeps its English title; mark it so a
                    // screen reader switches voice, as on the homepage journal.
                    lang={hasPostTranslation(post, locale) ? undefined : 'en'}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white px-6 py-5 font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    {post.title}
                    <span aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <Faq t={copy} />
      <FinalCta t={copy} />
    </main>
  )
}

// English regardless of the reader's locale, like the Organization data in the
// root layout: a crawler sends no cookie and indexes the English page, so the
// structured data has to match that text.
function FaqJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url: `${siteUrl()}/local-help`,
    mainEntity: en.localHelp.faq.items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}

/* ------------------------------- Hero ---------------------------------- */

function Hero({ t }: Copy) {
  return (
    <section className="relative overflow-hidden">
      <HeroImage
        name="crayfish-noodles-lift"
        alt={t.heroAlt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/60 to-black/85" />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-28 text-center text-white sm:py-36">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {t.kicker}
        </p>

        <h1 className="mt-7 max-w-4xl text-balance text-4xl font-semibold leading-[1.1] tracking-tight drop-shadow-xl sm:text-6xl">
          {t.title}
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-lg text-white/90 drop-shadow">
          {t.body}
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/guide"
            className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-zinc-900 shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-zinc-100"
          >
            {t.primaryCta}
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
          >
            {t.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------- Help with -------------------------------- */

function HelpWith({ t }: Copy) {
  return (
    <section className="border-b border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-950/40">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            {t.helpWith.kicker}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t.helpWith.title}
          </h2>
        </div>
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.helpWith.items.map((it) => (
            <li
              key={it.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h3 className="text-lg font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{it.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------------------- How it works ----------------------------- */

function HowItWorks({ t }: Copy) {
  return (
    <section className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            {t.how.kicker}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t.how.title}
          </h2>
        </div>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {t.how.steps.map((s, i) => (
            <li
              key={s.title}
              className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-sm font-bold text-white shadow-lg shadow-rose-500/20">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------- Limits -------------------------------- */

function Limits({ t }: Copy) {
  return (
    <section className="border-b border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-950/40">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          {t.limits.kicker}
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">{t.limits.title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-zinc-600 dark:text-zinc-400">{t.limits.body}</p>
      </div>
    </section>
  )
}

/* -------------------------------- FAQ ---------------------------------- */

function Faq({ t }: Copy) {
  return (
    <section className="border-b border-zinc-200 dark:border-zinc-800">
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
          {t.faq.items.map((f) => (
            <div
              key={f.q}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <dt className="font-semibold">{f.q}</dt>
              <dd className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{f.a}</dd>
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
      <div className="relative mx-auto max-w-3xl px-6 py-24 text-center text-white">
        <h2 className="text-balance text-4xl font-semibold tracking-tight drop-shadow sm:text-5xl">
          {t.final.title}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-white/90 drop-shadow">{t.final.body}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/guide"
            className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-zinc-100"
          >
            {t.final.primaryCta}
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
          >
            {t.final.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  )
}
