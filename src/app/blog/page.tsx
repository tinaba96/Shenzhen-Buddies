import type { Metadata } from 'next'
import Link from 'next/link'

import { TrackOnMount } from '@/components/blog/BlogTracking'
import { requireGalleryItem } from '@/content/gallery'
import { localizeGalleryItem } from '@/content/gallery-i18n'
import {
  AUTHORS,
  PILLARS,
  type Pillar,
  type Post,
  postsForPillar,
  publishedPosts,
  readingTimeMinutes,
  resolvePillarFilter,
} from '@/content/posts'
import { fill, type Dictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { getI18n } from '@/i18n/server'
import { DEFAULT_OG_IMAGE, siteUrl } from '@/lib/config'

// JSON-LD stays English. Metadata follows the reader's locale like every
// other page; a crawler sends no locale cookie, so it still indexes the
// English pair (t.seo.blog in en.ts).
const TITLE = 'Field notes on Shenzhen'
const DESCRIPTION =
  'Border crossings, payments, neighbourhoods and the people who live here. The things worth knowing before you arrive.'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  const seo = t.seo.blog
  return {
    title: seo.title,
    description: seo.description,
    // Every ?pillar= view canonicalises here. They exist to be shared and to
    // survive a reload, not to be indexed as separate thin pages.
    alternates: { canonical: '/blog' },
    openGraph: {
      type: 'website',
      title: seo.ogTitle,
      description: seo.description,
      url: '/blog',
      // Restates the site default: declaring openGraph here drops the image the
      // root layout's file convention would otherwise supply. See
      // DEFAULT_OG_IMAGE.
      images: [DEFAULT_OG_IMAGE],
    },
    // Its own block, or twitter keeps the root layout's site-wide title and
    // description. twitter:image still comes from the og image above.
    twitter: {
      card: 'summary_large_image',
      title: seo.ogTitle,
      description: seo.description,
    },
  }
}

// Reading searchParams opts this route out of static rendering — it renders per
// request. That is a deliberate trade, not an oversight: the filter is a
// shareable URL with zero client JS, and the "query" it costs is an in-memory
// sort over a typed array. If a static /blog is ever wanted, the fix is a
// /blog/pillar/[pillar] segment with generateStaticParams, which is not worth
// the extra route below roughly 15 posts.
export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const activePillar = resolvePillarFilter((await searchParams).pillar)
  const { locale, meta, t } = await getI18n()
  // English keeps its long-standing 'en-GB' day-month-year format; other
  // locales use their own Intl locale. Server-only, so no hydration mismatch.
  const dateLocale = locale === 'en' ? 'en-GB' : meta.intlLocale
  const card = { t: t.blog, dateLocale, locale }
  const all = publishedPosts()
  const shown = postsForPillar(activePillar)
  const [featured, ...rest] = shown

  // A chip row is only worth its space once there is more than one thing to
  // filter between. Below that it is a control that cannot change the page.
  const pillarsWithPosts = PILLARS.filter((p) =>
    all.some((post) => post.pillar === p.id),
  )
  const showFilters = pillarsWithPosts.length > 1

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: TITLE,
    description: DESCRIPTION,
    url: `${siteUrl()}/blog`,
    blogPost: all.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      author: { '@type': 'Person', name: AUTHORS[post.author].name },
      url: `${siteUrl()}/blog/${post.slug}`,
    })),
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-14 sm:px-6 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {activePillar && (
        <TrackOnMount event="blog_filter" params={{ pillar: activePillar }} />
      )}

      <header className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          {t.blog.kicker}
        </p>
        <h1 className="mt-2 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {t.blog.title}
        </h1>
        <p className="mt-4 text-pretty text-lg text-zinc-600 dark:text-zinc-400">
          {t.blog.description}
        </p>
      </header>

      {showFilters && (
        <nav aria-label={t.blog.filterLabel} className="mt-10 flex flex-wrap gap-2">
          <FilterChip href="/blog" label={t.blog.everything} active={!activePillar} />
          {pillarsWithPosts.map((p) => (
            <FilterChip
              key={p.id}
              href={`/blog?pillar=${p.id}`}
              label={t.blog.pillars[p.id].label}
              active={activePillar === p.id}
            />
          ))}
        </nav>
      )}

      {activePillar && (
        <p className="mt-6 text-sm text-zinc-500">
          {t.blog.pillars[activePillar].blurb}
        </p>
      )}

      {shown.length === 0 ? (
        <p className="mt-16 text-zinc-600 dark:text-zinc-400">
          {t.blog.emptyLead}
          <Link href="/blog" className="underline underline-offset-2">
            {t.blog.emptyLink}
          </Link>
          {t.blog.emptySuffix}
        </p>
      ) : (
        <>
          <FeaturedCard post={featured} {...card} />
          {rest.length > 0 && (
            <ul className="mt-8 grid gap-6 sm:grid-cols-2">
              {rest.map((post) => (
                <li key={post.slug}>
                  <PostCard post={post} {...card} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  )
}

function FilterChip({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
        active
          ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900'
          : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-white'
      }`}
    >
      {label}
    </Link>
  )
}

type CardCopy = { t: Dictionary['blog']; dateLocale: string; locale: Locale }

// Post titles and excerpts are English-only; say so to screen readers and
// translation tools when the page around them is not.
function postLang(locale: Locale): string | undefined {
  return locale === 'en' ? undefined : 'en'
}

function pillarLabel(pillar: Pillar, t: Dictionary['blog']): string {
  return t.pillars[pillar]?.label ?? pillar
}

// 'YYYY-MM-DD' → '9 August 2026' in English. The locale is passed in from the
// server render, so the server and the client never disagree about the string.
function formatDate(iso: string, dateLocale: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(dateLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function CardMeta({ post, t, dateLocale }: { post: Post } & CardCopy) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500">
      <span className="font-medium text-zinc-700 dark:text-zinc-300">
        {pillarLabel(post.pillar, t)}
      </span>
      <span aria-hidden>·</span>
      <time dateTime={post.publishedAt}>
        {formatDate(post.publishedAt, dateLocale)}
      </time>
      <span aria-hidden>·</span>
      <span>{fill(t.minRead, { n: readingTimeMinutes(post) })}</span>
    </p>
  )
}

// A post without a hero gets a typographic tile rather than a borrowed photo.
// The gallery library is small and location-specific, so forcing every post to
// carry an image would mean illustrating a border-crossing guide with a picture
// of somewhere else — which is the exact credibility problem the gallery exists
// to fix.
function CardImage({
  post,
  tall,
  t,
  locale,
}: {
  post: Post
  tall?: boolean
  t: Dictionary['blog']
  locale: Locale
}) {
  const ratio = tall ? 'aspect-[16/9]' : 'aspect-[3/2]'

  if (!post.heroGalleryId) {
    return (
      <div
        className={`${ratio} flex items-end bg-gradient-to-br from-amber-100 via-rose-50 to-rose-100 p-5 dark:from-amber-950/40 dark:via-zinc-900 dark:to-rose-950/40`}
      >
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
          {pillarLabel(post.pillar, t)}
        </span>
      </div>
    )
  }

  const hero = localizeGalleryItem(
    requireGalleryItem(post.heroGalleryId, `posts/${post.slug} hero`),
    locale,
  )
  return (
    <div className={`${ratio} overflow-hidden`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={hero.src}
        alt={hero.alt}
        width={hero.width}
        height={hero.height}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
    </div>
  )
}

function FeaturedCard({ post, t, dateLocale, locale }: { post: Post } & CardCopy) {
  return (
    <article className="group mt-10 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <Link href={`/blog/${post.slug}`} className="block">
        <CardImage post={post} tall t={t} locale={locale} />
        <div className="p-6 sm:p-8">
          <CardMeta post={post} t={t} dateLocale={dateLocale} locale={locale} />
          <h2
            lang={postLang(locale)}
            className="mt-3 text-balance text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            {post.title}
          </h2>
          <p
            lang={postLang(locale)}
            className="mt-3 max-w-2xl text-pretty text-zinc-600 dark:text-zinc-400"
          >
            {post.excerpt}
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
            {t.readIt}
            <span aria-hidden className="transition group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  )
}

function PostCard({ post, t, dateLocale, locale }: { post: Post } & CardCopy) {
  return (
    <article className="group h-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        <CardImage post={post} t={t} locale={locale} />
        <div className="flex flex-1 flex-col p-5">
          <CardMeta post={post} t={t} dateLocale={dateLocale} locale={locale} />
          <h3 lang={postLang(locale)} className="mt-2 text-lg font-semibold tracking-tight">
            {post.title}
          </h3>
          <p
            lang={postLang(locale)}
            className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400"
          >
            {post.excerpt}
          </p>
        </div>
      </Link>
    </article>
  )
}
