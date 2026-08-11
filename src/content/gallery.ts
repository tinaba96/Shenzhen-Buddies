// The photo library every real-image surface reads from: /gallery today, and
// the landing strip, /guide and /explore as batches arrive.
//
// This is a typed module rather than a table on purpose. The content is
// admin-only and ships with the code, so a table would cost a migration (a
// one-way door), RLS policies and an admin UI, and buy no capability we don't
// already get from TypeScript. The type is the schema; assertGalleryValid()
// below is the constraint checker, and it runs at module load so a bad entry
// fails `npm run build` instead of production.

export type LocationId =
  | 'futian'
  | 'oct-loft'
  | 'dafen'
  | 'huaqiangbei'
  | 'shekou'
  | 'dongmen'
  | 'other'

export type Theme =
  | 'food'
  | 'tech'
  | 'art'
  | 'nightlife'
  | 'nature'
  | 'street'
  | 'people'

export type GalleryItem = {
  // Stable kebab id, e.g. 'huaqiangbei-aisle-night-01'. It is the filename
  // stem, the React key and the GA4 event param, so renaming one costs an
  // analytics discontinuity — pick it once.
  id: string
  kind: 'image' | 'video'
  // '/gallery/<id>.webp' for images; the Supabase Storage public URL for
  // video, which is too big to commit.
  src: string
  // Required for video: the frame shown before playback, exported as WebP
  // into /public/gallery/ so the grid never has to load the MP4.
  poster?: string
  // Intrinsic pixel size. Required on every item because these two numbers
  // are what reserve layout space; without them the grid reflows as photos
  // arrive and CLS — a ranking factor — stops being zero. `scripts/img.mjs`
  // prints both for you.
  width: number
  height: number
  // Describes the photo for screen readers and image search. Never empty.
  alt: string
  title: string
  // One sentence, brand voice, naming the specific thing in the frame.
  caption?: string
  location: LocationId
  themes: Theme[]
  // Whether the frame has an identifiable person as its subject. There is no
  // 'unconsented' value, so a subject cannot be published without naming a
  // consent record.
  //
  // Read the limit honestly: this is ONE scalar for the whole frame, and the
  // legal unit is per person. A consented guide photographed in a crowded
  // aisle with recognisable bystanders behind them is a valid 'consented'
  // item that still contains unconsented faces. The type cannot see them.
  // That case is handled by composition at the shutter — "shoot places, not
  // faces", marketing/assets/CONSENT.md — not here.
  people: 'none' | 'consented'
  // Required when people === 'consented'. An OPAQUE consent ID
  // ('SBC-2026-08-001') that resolves in the private ledger described in
  // marketing/assets/CONSENT.md. Never a filename, never a name: this field
  // is a public string, and the ledger is the record.
  consentRef?: string
  // 'YYYY-MM'
  capturedAt?: string
  credit?: string
  relatedPostSlug?: string
  // Eligible for the landing-page strip.
  featured?: boolean
}

// `short` is the chip text — the full label is too long to sit in a row of
// them, and too long to read at a glance on mobile.
export type LocationMeta = { id: LocationId; label: string; short: string }

// Order here is the order chips render in, and it mirrors the six /explore
// tiles so internal linking stays one-to-one. `other` is last and never
// becomes a chip — it is the bucket for shots that belong to no neighbourhood.
export const LOCATIONS: readonly LocationMeta[] = [
  {
    id: 'huaqiangbei',
    label: 'Huaqiangbei — electronics megamarket',
    short: 'Huaqiangbei',
  },
  { id: 'futian', label: 'Futian — the modern downtown', short: 'Futian' },
  { id: 'oct-loft', label: 'OCT-Loft — art & design', short: 'OCT-Loft' },
  {
    id: 'dafen',
    label: 'Dafen Village — oil-painting alleys',
    short: 'Dafen Village',
  },
  { id: 'shekou', label: 'Shekou & the coast', short: 'Shekou' },
  {
    id: 'dongmen',
    label: 'Dongmen — old-town street food',
    short: 'Dongmen',
  },
  { id: 'other', label: 'Elsewhere in Shenzhen', short: 'Elsewhere' },
]

// A chip that returns two photos looks broken, so a location has to be able to
// fill a row before it earns one. This is what makes a small launch safe: the
// page works at 0 items, at 12, and at 200, with no code change in between.
export const CHIP_MIN_ITEMS = 4

// Consent IDs look like SBC-2026-08-001 and resolve in the private ledger
// (marketing/assets/CONSENT.md). Enforcing the shape here is what stops a
// source filename being pasted into consentRef — which is how a real person's
// name would otherwise reach a public string. It cannot verify the ledger row
// exists; nothing in a type system can. That half is process.
const CONSENT_ID = /^SBC-\d{4}-\d{2}-\d{3}$/

// The library. See the "Gallery photos" section of README.md for the
// conversion command and the fields to paste in.
//
// A finished entry looks like this:
//
//   {
//     id: 'huaqiangbei-aisle-night-01',
//     kind: 'image',
//     src: '/gallery/huaqiangbei-aisle-night-01.webp',
//     width: 1600,
//     height: 1067,
//     alt: 'Narrow aisle of component stalls lit by strip lights after dark',
//     title: 'The 3am component aisle',
//     caption: 'Floor 3 of SEG Plaza, where a resistor costs less than a coffee.',
//     location: 'huaqiangbei',
//     themes: ['tech', 'street'],
//     people: 'none',
//     capturedAt: '2026-08',
//     featured: true,
//   },
// Every item below is a real photo shot by the founder, converted by
// scripts/img.mjs. `location` is 'other' throughout on purpose: the founder
// could not confirm which district each frame was shot in, and a guessed
// neighbourhood would be a fabricated caption on a page whose whole promise is
// that these are real places. Reassigning a location later is a one-line edit,
// and location chips appear on their own once four items share one.
export const galleryItems: GalleryItem[] = [
  {
    id: 'skyline-tower-walkway-night',
    kind: 'image',
    src: '/gallery/skyline-tower-walkway-night.webp',
    width: 1200,
    height: 1600,
    alt: 'A tapered skyscraper lit white from base to spire at night, seen past a raised pedestrian walkway and a grass bank.',
    title: 'The tower you navigate by',
    caption: 'Every district here has one building everyone gives directions from. This is one of them.',
    location: 'other',
    themes: ['nightlife', 'street'],
    people: 'none',
    capturedAt: '2026-08',
    featured: true,
  },
  {
    id: 'skyline-blue-towers-night',
    kind: 'image',
    src: '/gallery/skyline-blue-towers-night.webp',
    width: 1200,
    height: 1600,
    alt: 'Three high-rise towers at night, two of them ribbed with blue vertical lighting, framed by dark tree branches from street level.',
    title: 'Blue hour, literally',
    caption: 'The towers run lighting shows most nights. Nobody who lives here looks up any more.',
    location: 'other',
    themes: ['nightlife'],
    people: 'none',
    capturedAt: '2026-02',
    featured: true,
  },
  {
    id: 'night-market-skewers-stall',
    kind: 'image',
    src: '/gallery/night-market-skewers-stall.webp',
    width: 1200,
    height: 1600,
    alt: 'A night market stall laid with trays of skewered insects — scorpions, silkworm pupae and grasshoppers — beside a bilingual price board.',
    title: 'The dare stall',
    caption: 'Scorpions, silkworm pupae, grasshoppers. The board translates itself, which tells you who it is for.',
    location: 'other',
    themes: ['food', 'street'],
    people: 'none',
    capturedAt: '2026-07',
    featured: true,
  },
  {
    id: 'crayfish-noodles-lift',
    kind: 'image',
    src: '/gallery/crayfish-noodles-lift.webp',
    width: 1600,
    height: 1255,
    alt: 'Chopsticks lifting a tangle of dark noodles from a pink plate, next to a bowl of garlic crayfish with green chilli and wood-ear mushroom.',
    title: 'Crayfish season',
    caption: 'Garlic crayfish and a plate of noodles to mop up what is left in the bowl.',
    location: 'other',
    themes: ['food'],
    people: 'none',
    capturedAt: '2026-08',
    featured: true,
  },
  {
    id: 'maker-desk-dev-boards',
    kind: 'image',
    src: '/gallery/maker-desk-dev-boards.webp',
    width: 1600,
    height: 1200,
    alt: 'Two stacked single-board computers on a light wood desk, with USB ports, a pin header, jumper wires and a GPS module beside them.',
    title: 'A normal weekday desk',
    caption: 'Boards, jumper wires, a GPS module. This city builds the things other cities unbox.',
    location: 'other',
    themes: ['tech'],
    people: 'none',
    capturedAt: '2026-07',
    featured: true,
  },
  {
    id: 'preserved-fruit-jars',
    kind: 'image',
    src: '/gallery/preserved-fruit-jars.webp',
    width: 1600,
    height: 1200,
    alt: 'A wooden crate of clip-top glass jars holding kumquats, plums and other fruit preserved in amber and red syrup, labelled by hand.',
    title: 'Jars, hand-labelled',
    caption: 'Kumquat, plum, something red nobody could name for us. Labelled by hand in marker.',
    location: 'other',
    themes: ['food'],
    people: 'none',
    capturedAt: '2026-08',
    featured: true,
  },
  {
    id: 'maker-desk-headset-teardown',
    kind: 'image',
    src: '/gallery/maker-desk-headset-teardown.webp',
    width: 1200,
    height: 1600,
    alt: 'An opened AR headset on a workbench with its curved headband unscrewed, internal ribbon cables exposed, next to a foam-lined tool case.',
    title: 'Opened, not broken',
    caption: 'A headset with its back off. Nothing here is precious enough not to take apart.',
    location: 'other',
    themes: ['tech'],
    people: 'none',
    capturedAt: '2026-07',
  },
  {
    id: 'crayfish-garlic-bowl',
    kind: 'image',
    src: '/gallery/crayfish-garlic-bowl.webp',
    width: 1200,
    height: 1600,
    alt: 'A white bowl of crayfish in garlic broth with green chilli and wood-ear mushroom, beside two plates of dark stir-fried noodles.',
    title: 'Order the noodles too',
    caption: 'The broth is the point. Order noodles you had not planned on, for the broth.',
    location: 'other',
    themes: ['food'],
    people: 'none',
    capturedAt: '2026-08',
  },
  {
    id: 'chicken-rice-closeup',
    kind: 'image',
    src: '/gallery/chicken-rice-closeup.webp',
    width: 1200,
    height: 1600,
    alt: 'A ceramic plate of poached chicken over rice with ginger-scallion oil and blanched greens, shot from above.',
    title: 'Chicken and rice, done properly',
    caption: 'Poached chicken, ginger-scallion oil, rice cooked in the stock. Fifteen kuai, most places.',
    location: 'other',
    themes: ['food'],
    people: 'none',
    capturedAt: '2026-07',
  },
  {
    id: 'chicken-rice-table',
    kind: 'image',
    src: '/gallery/chicken-rice-table.webp',
    width: 1200,
    height: 1600,
    alt: 'A burnt-wood table with a bowl of poached chicken and rice, a bowl of noodles, and a side plate of fried tofu skin and meatballs.',
    title: 'Lunch for two, roughly',
    caption: 'Two dishes, one side, no ceremony. Lunch is a twenty-minute affair here.',
    location: 'other',
    themes: ['food'],
    people: 'none',
    capturedAt: '2026-07',
  },
  {
    id: 'noodle-shop-table',
    kind: 'image',
    src: '/gallery/noodle-shop-table.webp',
    width: 1200,
    height: 1600,
    alt: 'A busy noodle shop table with a bowl of noodles in chilli oil, a plate of chicken and rice with greens, and fried tofu skin.',
    title: 'The lunchtime queue pays off',
    caption: 'Chilli oil noodles and a rice plate, at the kind of place with a queue at noon and nothing at three.',
    location: 'other',
    themes: ['food'],
    people: 'none',
    capturedAt: '2026-07',
  },
  {
    id: 'bakery-bread-counter',
    kind: 'image',
    src: '/gallery/bakery-bread-counter.webp',
    width: 1200,
    height: 1600,
    alt: 'A bakery display of scored sourdough rounds and baguettes on wooden crates, with syrup jugs, honey jars and soft pretzels behind.',
    title: 'Sourdough, in Shenzhen',
    caption: 'Scored rounds, baguettes, pretzels. The bakery scene arrived quietly and then was everywhere.',
    location: 'other',
    themes: ['food'],
    people: 'none',
    capturedAt: '2026-08',
  },
  {
    id: 'tteokbokki-black-rice',
    kind: 'image',
    src: '/gallery/tteokbokki-black-rice.webp',
    width: 1200,
    height: 1600,
    alt: 'Two bowls of purple-black rice beside tteokbokki rice cakes in red sauce and a bowl of stir-fried pork with peppers.',
    title: 'Not everything is Cantonese',
    caption: 'Tteokbokki and black rice. Twelve million people arrived from somewhere else and brought dinner.',
    location: 'other',
    themes: ['food'],
    people: 'none',
    capturedAt: '2026-07',
  },
  {
    id: 'canteen-tray-lunch',
    kind: 'image',
    src: '/gallery/canteen-tray-lunch.webp',
    width: 1200,
    height: 1600,
    alt: 'A canteen tray holding braised chicken with aubergine, broccoli and carrot over rice, with clear soup and a bowl of egg-drop congee.',
    title: 'The canteen lunch',
    caption: 'Pick four things, get soup free. How most of the city actually eats at midday.',
    location: 'other',
    themes: ['food'],
    people: 'none',
    capturedAt: '2026-07',
  },
]

function fail(id: string, problem: string): never {
  throw new Error(`gallery.ts: item "${id}" ${problem}`)
}

// Runs at module load (bottom of this file), which is why a violation stops
// the build. Exported so qa-engineer can assert on it directly.
export function assertGalleryValid(
  items: readonly GalleryItem[] = galleryItems,
): void {
  const seen = new Set<string>()

  for (const item of items) {
    if (!item.id.trim()) {
      throw new Error('gallery.ts: every item needs a non-empty id')
    }
    if (seen.has(item.id)) fail(item.id, 'has a duplicate id')
    seen.add(item.id)

    if (!item.alt.trim()) {
      fail(item.id, 'has an empty alt — it is required for a11y and image SEO')
    }
    if (item.themes.length === 0) {
      fail(item.id, 'needs at least one theme')
    }
    if (item.width <= 0 || item.height <= 0) {
      fail(item.id, 'needs width and height above 0 — they are what keeps CLS at 0')
    }
    if (item.people === 'consented' && !CONSENT_ID.test(item.consentRef ?? '')) {
      fail(
        item.id,
        `is people: 'consented' but its consentRef is not a consent ID (expected SBC-YYYY-MM-NNN, got ${
          item.consentRef ? `"${item.consentRef}"` : 'nothing'
        }) — see marketing/assets/CONSENT.md`,
      )
    }
    if (item.kind === 'video') {
      if (!item.poster?.trim()) {
        fail(item.id, 'is a video and needs a poster frame')
      }
      if (!item.src.endsWith('.mp4')) {
        fail(item.id, 'is a video, so its src must be an .mp4')
      }
    }
  }
}

export function locationLabel(id: LocationId): string {
  return LOCATIONS.find((l) => l.id === id)?.label ?? id
}

// The locations that have earned a filter chip.
export function galleryChipLocations(
  items: readonly GalleryItem[] = galleryItems,
): LocationMeta[] {
  return LOCATIONS.filter(
    (l) =>
      l.id !== 'other' &&
      items.filter((i) => i.location === l.id).length >= CHIP_MIN_ITEMS,
  )
}

// Only a location that has a chip can be filtered to. An unknown or
// under-filled `?loc=` falls back to the full grid rather than rendering the
// thin page CHIP_MIN_ITEMS exists to prevent — which also means a shared link
// to a location we later thinned out degrades to the whole gallery, not to an
// empty one.
export function resolveLocationFilter(
  raw: string | string[] | undefined,
  items: readonly GalleryItem[] = galleryItems,
): LocationId | null {
  if (typeof raw !== 'string') return null
  return galleryChipLocations(items).find((l) => l.id === raw)?.id ?? null
}

export function galleryItemsFor(
  location: LocationId | null,
  items: readonly GalleryItem[] = galleryItems,
): GalleryItem[] {
  return location ? items.filter((i) => i.location === location) : [...items]
}

// Which item `?photo=` names, as a position in the list actually on screen —
// the lightbox navigates by index, so an id resolved against the full library
// would point at the wrong photo under an active `?loc=`.
//
// Same posture as resolveLocationFilter(): an unknown id, a repeated param
// (Next hands those over as string[]) or an id filtered out by `?loc=` all
// resolve to null and the page renders as if `?photo=` were absent. A link the
// founder already posted degrades to the plain gallery; it never errors.
export function galleryPhotoIndex(
  raw: string | string[] | undefined,
  items: readonly GalleryItem[] = galleryItems,
): number | null {
  if (typeof raw !== 'string') return null
  const index = items.findIndex((item) => item.id === raw)
  return index === -1 ? null : index
}

// Only these fields cross into a client component. Anything handed to a
// 'use client' boundary is serialised into the RSC payload and readable in
// page source, so the projection is an allowlist, not a denylist: a field
// added to GalleryItem later is private by default and has to be named here
// to be published. consentRef and credit are the two that must never leak.
export type PublicGalleryItem = Pick<
  GalleryItem,
  | 'id'
  | 'kind'
  | 'src'
  | 'poster'
  | 'width'
  | 'height'
  | 'alt'
  | 'title'
  | 'caption'
  | 'location'
>

export function toPublicItem(item: GalleryItem): PublicGalleryItem {
  return {
    id: item.id,
    kind: item.kind,
    src: item.src,
    poster: item.poster,
    width: item.width,
    height: item.height,
    alt: item.alt,
    title: item.title,
    caption: item.caption,
    location: item.location,
  }
}

// The share-card image for an item — NOT the one the page renders.
// `scripts/img.mjs` emits a 1200x630 JPEG alongside every WebP because the
// on-page format is the wrong one for a scraper: X and LinkedIn do not reliably
// render WebP, and a 3:4 portrait is outside the aspect a large-summary card
// accepts, so a shared link previews cropped or blank. Path is derived, so any
// item is shareable the moment the script has run over it.
export function ogImageSrc(item: Pick<GalleryItem, 'id'>): string {
  return `/gallery/og/${item.id}.jpg`
}

// What the grid renders: for video that is the poster frame, since the MP4
// lives in Supabase Storage and must not be pulled just to fill a tile.
export function thumbnailSrc(
  item: Pick<GalleryItem, 'kind' | 'src' | 'poster'>,
): string {
  return item.kind === 'video' ? (item.poster ?? item.src) : item.src
}

// For other content modules that reference photos by id (/blog hero images and
// inline figures). It throws rather than returning undefined on purpose: called
// at module load like assertGalleryValid() below, a dangling id then fails
// `npm run build` instead of rendering a hole in a published post. `context`
// names the referrer, because "unknown id" is useless without knowing which
// post carries it.
export function requireGalleryItem(id: string, context?: string): GalleryItem {
  const item = galleryItems.find((i) => i.id === id)
  if (!item) {
    throw new Error(
      `gallery.ts: no item with id "${id}"${context ? ` (referenced by ${context})` : ''}. ` +
        `Known ids: ${galleryItems.map((i) => i.id).join(', ') || '(none — the library is still empty)'}`,
    )
  }
  return item
}

assertGalleryValid()
