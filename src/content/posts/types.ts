// The shape of a blog post. Posts are typed TS modules, not MDX and not a
// table: the content ships with the code, so TypeScript is the schema and
// assertPostsValid() in ./index.ts is the constraint checker. It runs at module
// load, which is why a malformed post fails `npm run build` rather than
// rendering a hole on a published page.
//
// The body is a block union rather than a string of HTML or markdown. That
// costs a little authoring convenience and buys two things worth more: no
// parser dependency, and no dangerouslySetInnerHTML on anything an author
// wrote, so a post cannot inject script by construction.

export type Pillar = 'logistics' | 'neighborhoods' | 'interests' | 'buddies'

export type PillarMeta = {
  id: Pillar
  label: string
  // Shown under the filter chips on /blog so the taxonomy explains itself
  // rather than being four unlabelled nouns.
  blurb: string
}

// Order here is the order chips render in, cheapest-to-explain first.
export const PILLARS: readonly PillarMeta[] = [
  {
    id: 'logistics',
    label: 'Getting around',
    blurb: 'Borders, payments, phones — the friction between you and the city.',
  },
  {
    id: 'neighborhoods',
    label: 'Neighbourhoods',
    blurb: 'One area at a time, walked properly.',
  },
  {
    id: 'interests',
    label: 'By interest',
    blurb: 'A day built around the thing you actually came for.',
  },
  {
    id: 'buddies',
    label: 'Buddies',
    blurb: 'The locals showing people around, in their own words.',
  },
]

// `p` and the string fields inside `ul`/`ol`/`table`/`callout` support inline
// links as [label](href) and nothing else — see parseInline() in
// components/blog/Prose.tsx. No raw HTML anywhere in content.
export type Block =
  | { k: 'h2'; text: string }
  | { k: 'h3'; text: string }
  | { k: 'p'; text: string }
  | { k: 'ul'; items: string[] }
  | { k: 'ol'; items: string[] }
  | { k: 'table'; head: string[]; rows: string[][] }
  | { k: 'quote'; text: string; attribution?: string }
  | { k: 'img'; galleryId: string; caption?: string }
  | { k: 'callout'; tone: 'tip' | 'warn'; title: string; text: string }
  // Deliberately carries no href. The destination is resolved at render time
  // from isSingleGuideMode() — /guide in beta, bare /browse otherwise — so an
  // author cannot ship a CTA pointing at a login wall or at /browse?city=…,
  // which /browse does not accept and silently drops. Making the destination
  // uneditable is what keeps that guarantee true without a review step.
  | { k: 'cta'; label: string; sub?: string }

export type AuthorId = 'bryan' | 'taka'

export type Author = {
  name: string
  role: string
  avatar: string
  bio: string
}

// Bylines are real people, so this map is deliberately small and closed: a post
// cannot be attributed to someone who does not exist, and adding a name is a
// conscious edit rather than a typo in a string.
export const AUTHORS: Record<AuthorId, Author> = {
  bryan: {
    name: 'Bryan Wang',
    role: 'Co-founder · lives in Shenzhen',
    avatar: '/team/bryan.jpg',
    bio: 'Grew up in China, spent eight years in Canada, back in Shenzhen now. Writes the posts about getting into the city because he does the trip both ways more often than he would like.',
  },
  taka: {
    name: 'Takahiro Inaba',
    role: 'Co-founder · Toronto',
    avatar: '/team/taka.jpg',
    bio: 'Japanese engineer, ten years in tech across North America and Asia. Builds the product, and travels enough to know which parts of a trip are worth worrying about.',
  },
}

export type Post = {
  // Kebab-case and permanent. Changing it after publish breaks every inbound
  // link and every analytics series keyed on it — a one-way door.
  slug: string
  // Kept under 60 characters so Google renders it whole rather than truncating
  // it mid-word. Enforced in assertPostsValid().
  title: string
  // Doubles as the meta description, hence the 155-character ceiling.
  excerpt: string
  pillar: Pillar
  tags: string[]
  // Resolved against src/content/gallery.ts, not a loose URL, so every image on
  // the blog carries the alt text and intrinsic dimensions the gallery type
  // already requires. Optional: a post that is all text should not have to
  // borrow an unrelated photo to satisfy the type.
  heroGalleryId?: string
  // 'YYYY-MM-DD'
  publishedAt: string
  updatedAt?: string
  // 'YYYY-MM'. Required on logistics posts and rendered on the page. Visa,
  // border and payment rules change without notice, so a reader needs to know
  // how old the advice is before deciding whether to trust it. This is the one
  // field on a logistics post that protects the reader rather than the ranking.
  lastChecked?: string
  author: AuthorId
  body: Block[]
  // Rendered as <details> and as FAQPage JSON-LD.
  faq?: { q: string; a: string }[]
  // Overrides the automatic pick (same pillar first, then shared tags).
  relatedSlugs?: string[]
  // Excluded from /blog, from the sitemap, and 404s when requested directly.
  draft?: boolean
  seo?: { title?: string; description?: string; noindex?: boolean }
}
