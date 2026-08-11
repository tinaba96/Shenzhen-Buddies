import type { Metadata } from 'next'
import Link from 'next/link'

import { TrackOnMount } from '@/components/blog/BlogTracking'
import { requireGalleryItem } from '@/content/gallery'
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
import { DEFAULT_OG_IMAGE, siteUrl } from '@/lib/config'

const TITLE = 'Field notes on Shenzhen'
const DESCRIPTION =
  'Border crossings, payments, neighbourhoods and the people who live here. The things worth knowing before you arrive.'

export const metadata: Metadata = {
  title: `${TITLE} — Shenzhen Buddies`,
  description: DESCRIPTION,
  // Every ?pillar= view canonicalises here. They exist to be shared and to
  // survive a reload, not to be indexed as separate thin pages.
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    title: TITLE,
    description: DESCRIPTION,
    url: '/blog',
    // Restates the site default: declaring openGraph here drops the image the
    // root layout's file convention would otherwise supply. See DEFAULT_OG_IMAGE.
    // No `twitter` block is needed alongside it — replacement is per-key, so
    // twitter still inherits from the root layout and Next fills twitter:image
    // from the resolved OG image. Verified in view-source.
    images: [DEFAULT_OG_IMAGE],
  },
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
          Field notes
        </p>
        <h1 className="mt-2 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {TITLE}
        </h1>
        <p className="mt-4 text-pretty text-lg text-zinc-600 dark:text-zinc-400">
          {DESCRIPTION}
        </p>
      </header>

      {showFilters && (
        <nav aria-label="Filter posts by topic" className="mt-10 flex flex-wrap gap-2">
          <FilterChip href="/blog" label="Everything" active={!activePillar} />
          {pillarsWithPosts.map((p) => (
            <FilterChip
              key={p.id}
              href={`/blog?pillar=${p.id}`}
              label={p.label}
              active={activePillar === p.id}
            />
          ))}
        </nav>
      )}

      {activePillar && (
        <p className="mt-6 text-sm text-zinc-500">
          {PILLARS.find((p) => p.id === activePillar)?.blurb}
        </p>
      )}

      {shown.length === 0 ? (
        <p className="mt-16 text-zinc-600 dark:text-zinc-400">
          Nothing here yet.{' '}
          <Link href="/blog" className="underline underline-offset-2">
            See everything instead
          </Link>
          .
        </p>
      ) : (
        <>
          <FeaturedCard post={featured} />
          {rest.length > 0 && (
            <ul className="mt-8 grid gap-6 sm:grid-cols-2">
              {rest.map((post) => (
                <li key={post.slug}>
                  <PostCard post={post} />
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

function pillarLabel(pillar: Pillar): string {
  return PILLARS.find((p) => p.id === pillar)?.label ?? pillar
}

// 'YYYY-MM-DD' → '9 August 2026'. Fixed locale so the server and the client
// never disagree about the string and trigger a hydration warning.
function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function CardMeta({ post }: { post: Post }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500">
      <span className="font-medium text-zinc-700 dark:text-zinc-300">
        {pillarLabel(post.pillar)}
      </span>
      <span aria-hidden>·</span>
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      <span aria-hidden>·</span>
      <span>{readingTimeMinutes(post)} min read</span>
    </p>
  )
}

// A post without a hero gets a typographic tile rather than a borrowed photo.
// The gallery library is small and location-specific, so forcing every post to
// carry an image would mean illustrating a border-crossing guide with a picture
// of somewhere else — which is the exact credibility problem the gallery exists
// to fix.
function CardImage({ post, tall }: { post: Post; tall?: boolean }) {
  const ratio = tall ? 'aspect-[16/9]' : 'aspect-[3/2]'

  if (!post.heroGalleryId) {
    return (
      <div
        className={`${ratio} flex items-end bg-gradient-to-br from-amber-100 via-rose-50 to-rose-100 p-5 dark:from-amber-950/40 dark:via-zinc-900 dark:to-rose-950/40`}
      >
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
          {pillarLabel(post.pillar)}
        </span>
      </div>
    )
  }

  const hero = requireGalleryItem(post.heroGalleryId, `posts/${post.slug} hero`)
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

function FeaturedCard({ post }: { post: Post }) {
  return (
    <article className="group mt-10 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <Link href={`/blog/${post.slug}`} className="block">
        <CardImage post={post} tall />
        <div className="p-6 sm:p-8">
          <CardMeta post={post} />
          <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            {post.title}
          </h2>
          <p className="mt-3 max-w-2xl text-pretty text-zinc-600 dark:text-zinc-400">
            {post.excerpt}
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
            Read it
            <span aria-hidden className="transition group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  )
}

function PostCard({ post }: { post: Post }) {
  return (
    <article className="group h-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        <CardImage post={post} />
        <div className="flex flex-1 flex-col p-5">
          <CardMeta post={post} />
          <h3 className="mt-2 text-lg font-semibold tracking-tight">
            {post.title}
          </h3>
          <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
            {post.excerpt}
          </p>
        </div>
      </Link>
    </article>
  )
}
