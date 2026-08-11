import Link from 'next/link'
import type { ReactNode } from 'react'

import { requireGalleryItem } from '@/content/gallery'
import type { Block } from '@/content/posts/types'

import { BlogCta } from './BlogTracking'

// The block renderer. Note what is missing: dangerouslySetInnerHTML. Nothing an
// author writes reaches the DOM as markup, so a post cannot inject script even
// if someone pastes a tag into a paragraph — React escapes it and the reader
// sees the literal characters.
//
// Styling is plain Tailwind rather than @tailwindcss/typography. One more
// dependency to style a handful of elements is not worth it, and the tokens
// here already match the rest of the site.

const INLINE_LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g

// The entire inline formatting language: [label](href). Anything else is text.
// Internal hrefs go through next/link for client-side navigation; external ones
// get noopener, which matters because most links in a logistics post point at
// government sites we do not control.
export function parseInline(text: string): ReactNode {
  const parts: ReactNode[] = []
  let cursor = 0

  for (const match of text.matchAll(INLINE_LINK)) {
    const [full, label, href] = match
    const start = match.index
    if (start > cursor) parts.push(text.slice(cursor, start))

    parts.push(
      href.startsWith('/') ? (
        <Link
          key={`${start}-${href}`}
          href={href}
          className="underline decoration-zinc-300 underline-offset-2 transition hover:decoration-zinc-900 dark:decoration-zinc-600 dark:hover:decoration-white"
        >
          {label}
        </Link>
      ) : (
        <a
          key={`${start}-${href}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-zinc-300 underline-offset-2 transition hover:decoration-zinc-900 dark:decoration-zinc-600 dark:hover:decoration-white"
        >
          {label}
        </a>
      ),
    )
    cursor = start + full.length
  }

  if (cursor < text.length) parts.push(text.slice(cursor))
  return parts
}

// Heading ids are what the table of contents and any "#section" link would hang
// off, and they cost nothing to emit now.
function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// `ctaHref` is resolved once by the page, on the server, because the config it
// comes from reads a non-public env var. Threading it down is what lets the cta
// block carry no href of its own.
export function Prose({
  blocks,
  slug,
  ctaHref,
}: {
  blocks: Block[]
  slug: string
  ctaHref: string
}) {
  return (
    <div className="mt-10 space-y-6">
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} slug={slug} ctaHref={ctaHref} />
      ))}
    </div>
  )
}

function BlockView({
  block,
  slug,
  ctaHref,
}: {
  block: Block
  slug: string
  ctaHref: string
}) {
  switch (block.k) {
    case 'h2':
      return (
        <h2
          id={headingId(block.text)}
          className="scroll-mt-20 pt-6 text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          {block.text}
        </h2>
      )

    case 'h3':
      return (
        <h3
          id={headingId(block.text)}
          className="scroll-mt-20 pt-2 text-lg font-semibold tracking-tight sm:text-xl"
        >
          {block.text}
        </h3>
      )

    case 'p':
      return (
        <p className="text-[17px] leading-relaxed text-zinc-700 dark:text-zinc-300">
          {parseInline(block.text)}
        </p>
      )

    case 'ul':
      return (
        <ul className="space-y-2 pl-1">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 text-[17px] leading-relaxed text-zinc-700 dark:text-zinc-300"
            >
              <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
              <span>{parseInline(item)}</span>
            </li>
          ))}
        </ul>
      )

    case 'ol':
      return (
        <ol className="space-y-3">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 text-[17px] leading-relaxed text-zinc-700 dark:text-zinc-300"
            >
              <span
                aria-hidden
                className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white dark:bg-white dark:text-zinc-900"
              >
                {i + 1}
              </span>
              <span>{parseInline(item)}</span>
            </li>
          ))}
        </ol>
      )

    case 'table':
      // Scrollable on mobile rather than squeezed: a six-column comparison
      // table is the point of a logistics post, and shrinking it to fit a phone
      // makes it unreadable at exactly the moment someone is standing in a
      // station reading it on a phone.
      return (
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-300 dark:border-zinc-700">
                {block.head.map((cell) => (
                  <th key={cell} scope="col" className="py-3 pr-4 font-semibold">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-zinc-200 align-top dark:border-zinc-800"
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`py-3 pr-4 ${
                        j === 0
                          ? 'font-medium text-zinc-900 dark:text-zinc-100'
                          : 'text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {parseInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'quote':
      return (
        <blockquote className="border-l-2 border-zinc-900 pl-5 dark:border-white">
          <p className="text-lg italic leading-relaxed text-zinc-800 dark:text-zinc-200">
            {parseInline(block.text)}
          </p>
          {block.attribution && (
            <footer className="mt-2 text-sm text-zinc-500">
              — {block.attribution}
            </footer>
          )}
        </blockquote>
      )

    case 'img': {
      // Throws at render if the id is unknown, but assertPostsValid() has
      // already resolved every id at module load, so in practice this never
      // fires in production — the build fails first.
      const item = requireGalleryItem(block.galleryId, `posts/${slug} body`)
      return (
        <figure className="-mx-4 sm:mx-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.src}
            alt={item.alt}
            width={item.width}
            height={item.height}
            loading="lazy"
            className="w-full rounded-none sm:rounded-2xl"
          />
          {(block.caption ?? item.caption) && (
            <figcaption className="mt-2 px-4 text-sm text-zinc-500 sm:px-0">
              {block.caption ?? item.caption}
            </figcaption>
          )}
        </figure>
      )
    }

    case 'callout':
      return (
        <aside
          className={`rounded-2xl border p-5 ${
            block.tone === 'warn'
              ? 'border-amber-200 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/30'
              : 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/30'
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              block.tone === 'warn'
                ? 'text-amber-900 dark:text-amber-200'
                : 'text-emerald-900 dark:text-emerald-200'
            }`}
          >
            {block.title}
          </p>
          <p
            className={`mt-1.5 text-[15px] leading-relaxed ${
              block.tone === 'warn'
                ? 'text-amber-900/90 dark:text-amber-100/90'
                : 'text-emerald-900/90 dark:text-emerald-100/90'
            }`}
          >
            {parseInline(block.text)}
          </p>
        </aside>
      )

    case 'cta':
      return (
        <BlogCta
          slug={slug}
          placement="inline"
          href={ctaHref}
          label={block.label}
          sub={block.sub}
        />
      )
  }
}
