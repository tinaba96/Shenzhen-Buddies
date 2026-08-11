import type { Metadata } from 'next'
import Link from 'next/link'
import {
  galleryChipLocations,
  galleryItemsFor,
  galleryPhotoIndex,
  locationLabel,
  resolveLocationFilter,
  ogImageSrc,
  thumbnailSrc,
  toPublicItem,
} from '@/content/gallery'
import { isAdminViewer } from '@/lib/admin'
import { DEFAULT_OG_IMAGE, isSingleGuideMode, siteUrl } from '@/lib/config'
import { GalleryFilters } from './GalleryFilters'
import { GalleryGrid } from './GalleryGrid'

const TITLE = 'Shenzhen, as we actually found it — Shenzhen Buddies'
// Names what is actually in the library, not the neighbourhoods we hope to
// shoot. This string is the search snippet and the share card, so a district
// listed here that has no photos behind it is a promise the page breaks on
// arrival. Update it when the mix changes, not when the plan does.
const DESCRIPTION =
  'Real photos of Shenzhen from the people who live here — night skylines, street-food stalls, workbenches mid-project. No stock imagery.'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

// Resolves the two params this page understands. Both the page and
// generateMetadata need the same answer, and they must not be able to disagree
// — a card that previews a different photo than the one that opens is worse
// than no card.
//
// Everything leaves here already projected through toPublicItem(), so no full
// GalleryItem escapes this function. That matters because this page has THREE
// publication surfaces, not one: the RSC payload handed to GalleryGrid, the
// JSON-LD written into the body, and the og: tags written into <head>. The
// PublicGalleryItem allowlist was only ever guarding the first of those.
//
// The two unguarded ones are the easy mistakes to make later: schema.org
// ImageObject has `creditText` and `copyrightHolder` fields, and an og card is
// an obvious place to attribute a photographer. Either edit would publish a
// real person's name with no type error, no lint failure and nothing to
// review against. Projecting once, here, makes both a compile error instead.
async function readParams(searchParams: SearchParams) {
  const { loc, photo } = await searchParams
  const active = resolveLocationFilter(loc)
  // Index resolved against the unprojected list, then carried across: .map()
  // preserves order, so the same index addresses both.
  const found = galleryItemsFor(active)
  const photoIndex = galleryPhotoIndex(photo, found)
  const items = found.map(toPublicItem)

  return { active, items, photoIndex, photoItem: items[photoIndex ?? -1] ?? null }
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams
}): Promise<Metadata> {
  const { photoItem } = await readParams(searchParams)

  // CANONICAL — every variant of this page, ?loc= and ?photo= alike,
  // canonicalises to bare /gallery.
  //
  // The alternative was a self-canonical per ?photo=, which is the only way the
  // photo URLs themselves get indexed. Rejected: each one would be the same
  // gallery page with the same header, the same chips and the same grid, and a
  // 12-photo library would ship 13 near-identical URLs. That is the textbook
  // shape of thin content, and the cost is not confined to the new URLs — it is
  // paid by /gallery, on a domain with no authority to spend.
  //
  // What that gives up is narrower than it looks. Google indexes the *photos*
  // from this page already, through the ImageGallery JSON-LD and the alt text
  // on every item; that is the surface a photo actually ranks in, and a
  // canonical tag does not touch it. And og: tags are read by social crawlers
  // regardless of canonical, so the founder's real workflow — paste a photo
  // link into a story sticker, get that photo's card — works either way.
  // So the founder's stated goal (individual photos findable in Google) is
  // largely served without spending crawl budget on 13 copies of one page.
  //
  // If per-photo *pages* become the goal, the right answer is a real
  // /gallery/[id] route with its own content — see the report, not this file.
  const base: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: '/gallery' },
    // `images` is not redundant: declaring an openGraph object here replaces
    // the one inherited from the root layout, and the opengraph-image file
    // convention goes with it — so omitting this shares the gallery as a grey
    // box. See the note on DEFAULT_OG_IMAGE in src/lib/config.ts.
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: '/gallery',
      images: DEFAULT_OG_IMAGE,
    },
  }

  if (!photoItem) return base

  // photoItem arrives already projected through the allowlist — readParams()
  // does it once for all three publication surfaces. That is what makes <head>
  // safe, and <head> is the easier one to forget: adding `credit` here as
  // photographer attribution would publish a real name with no type error and
  // no lint failure, while everyone points at the allowlist and believes it
  // covers this. Now it does.
  const description = photoItem.caption ?? photoItem.alt

  return {
    ...base,
    title: `${photoItem.title} — Shenzhen Buddies`,
    description,
    openGraph: {
      title: photoItem.title,
      description,
      // Deliberately not the canonical. og:url is the identity of the thing
      // being shared, and what is being shared here is one photo; the canonical
      // above is a separate answer to a separate question (which URL should
      // rank). Keeping them apart is what lets a photo card exist at all.
      url: `/gallery?photo=${photoItem.id}`,
      // Absolute rather than relative: metadataBase would resolve it, but a
      // share card is the one place a wrong base URL is invisible until a
      // scraper has already cached the miss.
      images: [`${siteUrl()}${ogImageSrc(photoItem)}`],
    },
  }
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { active, items, photoIndex } = await readParams(searchParams)
  const chipLocations = galleryChipLocations()
  // Only gates the admin-only share button. Anonymous visitors get the whole
  // page as before — nothing here is behind a session.
  const isAdmin = await isAdminViewer()

  // Anonymous visitors get the read-only /guide preview, so this is not
  // wrapped in an auth redirect. /browse takes no `city` param, so none is
  // appended — it would be silently dropped.
  const ctaHref = isSingleGuideMode() ? '/guide' : '/browse'

  const base = siteUrl()
  const jsonLd =
    items.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ImageGallery',
          name: 'Shenzhen Buddies — photo gallery',
          description: DESCRIPTION,
          url: `${base}/gallery`,
          image: items.map((item) => ({
            '@type': 'ImageObject',
            contentUrl: `${base}${thumbnailSrc(item)}`,
            name: item.title,
            description: item.caption ?? item.alt,
            contentLocation: locationLabel(item.location),
          })),
        }
      : null

  return (
    <main className="flex flex-1 flex-col">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
      )}

      <section className="mx-auto w-full max-w-5xl px-6 pb-10 pt-16 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Gallery
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Shenzhen, as we actually found it.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Every frame here was shot by us or by a buddy, in a place we would
          actually take you. If a photo isn&apos;t of this city, it isn&apos;t
          on this page.
        </p>
        {chipLocations.length > 0 && (
          <div className="mt-8">
            <GalleryFilters locations={chipLocations} active={active} />
          </div>
        )}
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pb-16">
        {items.length > 0 ? (
          <GalleryGrid
            items={items}
            activeLocation={active ?? 'all'}
            ctaHref={ctaHref}
            initialIndex={photoIndex}
            isAdmin={isAdmin}
            shareBaseUrl={base}
          />
        ) : (
          <EmptyState ctaHref={ctaHref} />
        )}
      </section>
    </main>
  )
}

// The gallery ships before the photos do. Saying so plainly is cheaper than
// the alternative — filling the grid with stock imagery of somewhere else is
// the exact defect this page exists to remove.
function EmptyState({ ctaHref }: { ctaHref: string }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-zinc-300 px-8 py-14 text-center dark:border-zinc-700">
      <p className="text-base font-medium">The first batch is being shot.</p>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        We would rather show you nothing than show you stock photos of a
        different city — so this page fills up as the real ones come back.
      </p>
      <Link
        href={ctaHref}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Meet a local instead
        <span aria-hidden>→</span>
      </Link>
    </div>
  )
}
