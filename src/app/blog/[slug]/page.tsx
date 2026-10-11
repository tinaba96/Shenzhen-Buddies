import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  BlogCta,
  RelatedPostLink,
  ScrollDepth,
  TrackOnMount,
} from '@/components/blog/BlogTracking'
import { Prose } from '@/components/blog/Prose'
import { ShareLinks } from '@/components/ShareLinks'
import { ogImageSrc, requireGalleryItem } from '@/content/gallery'
import {
  AUTHORS,
  PILLARS,
  type Post,
  getPublishedPost,
  publishedPosts,
  readingTimeMinutes,
  relatedPosts,
} from '@/content/posts'
import { fill, type Dictionary } from '@/i18n'
import { getI18n } from '@/i18n/server'
import { isAdminViewer } from '@/lib/admin'
import { DEFAULT_OG_IMAGE, isSingleGuideMode, siteUrl } from '@/lib/config'

// Draft posts are excluded here as well as from the listing, so a draft is not
// quietly reachable by typing its URL.
export function generateStaticParams() {
  return publishedPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const post = getPublishedPost((await params).slug)
  if (!post) return {}
  // The article is English, but og:locale describes the page it is shared
  // from, which follows the reader's language like every other page.
  const { meta } = await getI18n()

  const title = post.seo?.title ?? post.title
  const description = post.seo?.description ?? post.excerpt
  const url = `/blog/${post.slug}`
  // The post's own hero when it has one, otherwise the site-wide card. Not
  // optional: declaring openGraph at all drops the inherited file-convention
  // image, so omitting this ships posts that share as a grey box — see
  // DEFAULT_OG_IMAGE. Per-post generated OG images are a v1.1 item.
  //
  // twitter needs its own title and description — inherited from the root
  // layout it would carry the site-wide pair while og: names the post — but
  // not its own image: Next fills twitter:image from og:image.
  const image = post.heroGalleryId
    ? ogImageSrc(requireGalleryItem(post.heroGalleryId, `posts/${post.slug} hero`))
    : DEFAULT_OG_IMAGE

  return {
    // The article is English in every locale, so its <title> is too.
    title: `${title} — Shenzhen Buddies`,
    description,
    alternates: { canonical: url },
    robots: post.seo?.noindex ? { index: false, follow: true } : undefined,
    authors: [{ name: AUTHORS[post.author].name }],
    openGraph: {
      type: 'article',
      locale: meta.ogLocale,
      title,
      description,
      url,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [AUTHORS[post.author].name],
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const post = getPublishedPost((await params).slug)
  if (!post) notFound()

  const author = AUTHORS[post.author]
  const related = relatedPosts(post)
  // Gates the admin-only share button and nothing else. This route is already
  // server-rendered on demand — the root layout reads the session to draw the
  // header — so the check costs no static generation that was not already gone.
  const isAdmin = await isAdminViewer()
  // The page chrome follows the reader's locale; the article itself — title,
  // body, FAQ, author box — is English-only content, and is marked lang="en"
  // when the page around it is not, so screen readers and translation tools
  // switch language with it.
  const { locale, meta, t } = await getI18n()
  const articleLang = locale === 'en' ? undefined : 'en'
  // English keeps its long-standing en-GB day-month-year format, as on /blog.
  const dateLocale = locale === 'en' ? 'en-GB' : meta.intlLocale
  // /guide during the single-guide beta, otherwise bare /browse. Never a login
  // route: a blog reader is by definition logged out, and both destinations are
  // public previews.
  const ctaHref = isSingleGuideMode() ? '/guide' : '/browse'

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { '@type': 'Person', name: author.name },
    publisher: {
      '@type': 'Organization',
      name: 'Shenzhen Buddies',
      url: siteUrl(),
    },
    mainEntityOfPage: `${siteUrl()}/blog/${post.slug}`,
    ...(post.heroGalleryId
      ? {
          image: `${siteUrl()}${ogImageSrc(requireGalleryItem(post.heroGalleryId, `posts/${post.slug} hero`))}`,
        }
      : {}),
  }

  const faqJsonLd = post.faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faq.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      }
    : null

  return (
    <main className="flex-1">
      <JsonLd data={articleJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <TrackOnMount
        event="content_view"
        params={{ content_type: 'post', slug: post.slug, pillar: post.pillar }}
      />
      <ScrollDepth slug={post.slug} />

      <article className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href={`/blog?pillar=${post.pillar}`}
          className="text-xs font-medium uppercase tracking-wider text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white"
        >
          {pillarLabel(post.pillar, t.blog)}
        </Link>

        <h1
          lang={articleLang}
          className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          {post.title}
        </h1>
        {articleLang && (
          <p className="mt-3 text-sm text-zinc-500">{t.blog.englishOnly}</p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3 border-b border-zinc-200 pb-6 dark:border-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={author.avatar}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="text-sm">
            <p className="font-medium">{author.name}</p>
            <p className="text-zinc-500">
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt, dateLocale)}
              </time>
              {meta.sep}
              {fill(t.blog.minRead, { n: readingTimeMinutes(post) })}
            </p>
          </div>

          {/* siteUrl(), not the request's own host: the founder pastes this
              into an Instagram bio, and a preview-deploy hostname there is a
              dead link the moment the preview expires. */}
          <ShareLinks
            url={`${siteUrl()}/blog/${post.slug}`}
            title={post.title}
            campaign={post.slug}
            surface="blog"
            isAdmin={isAdmin}
            className="ml-auto"
            labels={t.share}
          />
        </div>

        {/* Rules at a border change without notice and a reader cannot tell a
            current page from an abandoned one. Stating the check date up top is
            what makes the rest of the page trustworthy. */}
        {post.lastChecked && (
          <LastChecked
            value={post.lastChecked}
            template={t.blog.lastChecked}
            dateLocale={dateLocale}
          />
        )}

        <div lang={articleLang}>
          <Prose
            blocks={post.body}
            slug={post.slug}
            ctaHref={ctaHref}
          />
        </div>

        {post.faq && post.faq.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-semibold tracking-tight">
              {t.blog.commonQuestions}
            </h2>
            <div
              lang={articleLang}
              className="mt-6 divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800"
            >
              {post.faq.map((item) => (
                <details key={item.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                    {item.q}
                    <span
                      aria-hidden
                      className="shrink-0 text-zinc-400 transition group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        <section className="mt-14 flex gap-4 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={author.avatar}
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-full object-cover"
          />
          <div lang={articleLang}>
            <p className="font-semibold">{author.name}</p>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              {author.role}
            </p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {author.bio}
            </p>
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
              {t.blog.readNext}
            </h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {related.map((next) => (
                <li key={next.slug}>
                  <RelatedPostLink
                    fromSlug={post.slug}
                    toSlug={next.slug}
                    className="block h-full rounded-2xl border border-zinc-200 p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800"
                  >
                    <RelatedCard post={next} t={t.blog} lang={articleLang} />
                  </RelatedPostLink>
                </li>
              ))}
            </ul>
          </section>
        )}

        <BlogCta
          slug={post.slug}
          placement="end"
          href={ctaHref}
          label={t.blog.ctaLabel}
          sub={t.blog.ctaBody}
          button={{ label: t.blog.ctaButton }}
        />
      </article>
    </main>
  )
}

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}

// Pillar labels come from the /blog dictionary, the same ones as its chips.
function pillarLabel(pillar: Post['pillar'], t: Dictionary['blog']): string {
  return Object.hasOwn(t.pillars, pillar)
    ? t.pillars[pillar].label
    : (PILLARS.find((p) => p.id === pillar)?.label ?? pillar)
}

function RelatedCard({
  post,
  t,
  lang,
}: {
  post: Post
  t: Dictionary['blog']
  lang: string | undefined
}) {
  return (
    <>
      <p className="text-xs uppercase tracking-wide text-zinc-500">
        {pillarLabel(post.pillar, t)}
      </p>
      <p lang={lang} className="mt-1.5 font-medium">
        {post.title}
      </p>
      <p lang={lang} className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
        {post.excerpt}
      </p>
    </>
  )
}

// 'YYYY-MM' → 'August 2026' in English.
function LastChecked({
  value,
  template,
  dateLocale,
}: {
  value: string
  template: string
  dateLocale: string
}) {
  const label = new Date(`${value}-01T00:00:00Z`).toLocaleDateString(dateLocale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
  return (
    <p className="mt-6 flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 shrink-0"
        aria-hidden
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
      {fill(template, { date: label })}
    </p>
  )
}

// Locale passed in from the server render, and UTC, so server and client
// render the same string.
function formatDate(iso: string, dateLocale: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(dateLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
