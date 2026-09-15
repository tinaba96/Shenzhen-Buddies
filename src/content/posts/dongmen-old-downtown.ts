import type { Post } from './types'

// SOURCING NOTE — the discipline this post is written to.
//
// A 'neighborhoods' post, so the claims are chosen to be the kind that hold:
// what Dongmen is, where it came from, and how it feels to walk — not shop
// names, prices or opening hours, which churn weekly in this district.
//
//   - "A market town centuries before the SEZ" — Dongmen grew out of the old
//     Shenzhen market town (the name is its east gate); stable, documented
//     history and the reason the district exists at all.
//   - The first McDonald's in mainland China opened here in 1990 — a fixed
//     historical fact, widely documented, and the pagoda-roofed branch in the
//     hero frame is the landmark the district still navigates by.
//   - Access is stated as "its own metro stop, one line change from the
//     border" rather than a line number and exit letter — exits get renumbered,
//     the stop does not move.
//   - No individual stall or shop is named. The queue rule is the durable
//     advice; a named stall is a broken link in six months.
//
// Prices are absent. Payment setup is linked, not restated — the
// border-crossing post carries the lastChecked date for that.
//
// Every image is from src/content/gallery.ts: the founder's own frames, no
// stock. The skewer-stall and fruit-jar frames were shot at Shenzhen street
// markets; the captions here describe the stalls, and the prose keeps its
// location claims to the district itself.

export const dongmenOldDowntown: Post = {
  slug: 'dongmen-old-downtown',
  title: 'Dongmen: the Shenzhen that came first',
  excerpt:
    'Before the skyline there was Dongmen — pagoda roofs, snack streets, market floors. A walk through the old downtown, at the hour it wakes up.',
  pillar: 'neighborhoods',
  tags: ['dongmen', 'street-food', 'markets', 'first-visit'],
  publishedAt: '2026-09-14',
  author: 'bryan',
  heroGalleryId: 'dongmen-pagoda-street-night',
  relatedSlugs: ['what-shenzhen-actually-eats', 'shenzhen-after-dark'],
  seo: {
    title: 'Dongmen, Shenzhen: the old downtown, walked properly',
  },
  body: [
    {
      k: 'p',
      text: 'Every story about Shenzhen starts the same way: fishing village, forty years, skyline. It is a good story and it is mostly true, but it skips a place. Dongmen was a market town when the towers were paddy fields — the name is literally the east gate of the old Shenzhen market — and it never stopped being one. While Futian built the CBD, Dongmen just kept selling things.',
    },
    {
      k: 'p',
      text: 'So this is the district to walk when the glass towers start to blur together: the old downtown, pedestrianised, loud, dressed in pagoda roofs and fairy lights, and completely uninterested in impressing you the way the skyline does. It impresses you the other way — by being exactly what it has always been, at volume.',
    },

    { k: 'h2', text: 'What Dongmen actually is' },
    {
      k: 'p',
      text: 'A tangle of pedestrian streets in Luohu, a few minutes from the Hong Kong border, with its own metro stop and no obvious edges. The buildings wear traditional eaves over modern retail — the district decided decades ago that the old-town look was worth keeping, and committed. Even the McDonald’s got a pagoda roof, and that branch is a piece of history in its own right: when McDonald’s came to mainland China in 1990, this is where it opened first. Queues went around the block. Locals still navigate by it.',
    },
    {
      k: 'p',
      text: 'Come for the walk, not for a list of shops — the shops turn over too fast for lists. The permanent inventory is the street itself: clothing markets stacked floors deep, milk-tea counters every fifty metres, calligraphy and phone cases and wedding photography, and the snack streets that are the actual reason to be here.',
    },

    { k: 'h2', text: 'Eat your way down the middle of it' },
    {
      k: 'img',
      galleryId: 'night-market-skewers-stall',
      caption:
        'The dare stalls translate their own price boards, which tells you who they are for. The regulars are two rows over.',
    },
    {
      k: 'p',
      text: 'Dongmen eating is vertical grazing: nothing sit-down, everything in sequence. Skewers off the grill, rice-noodle rolls, curry fish balls, whatever fruit is in season pressed into a cup. The rule we use everywhere in this city works hardest here — eat where the queue is, at the hour the queue forms. A stall with a self-translating menu and scorpions on sticks is a photo stop; the stall beside it with a fifteen-person line of teenagers is dinner.',
    },
    {
      k: 'img',
      galleryId: 'preserved-fruit-jars',
      caption:
        'Preserved fruit, hand-labelled — kumquat, plum, and one nobody could name for us. The old market trades are still here.',
    },
    {
      k: 'p',
      text: 'In between the grills are the older trades: preserved fruit in hand-labelled jars, dried goods, herbal tea counters that have outlived every fashion around them. What any of it is, and which of it you should actually eat, is the subject of [our food guide](/blog/what-shenzhen-actually-eats) — and ordering across the language gap is half of why [our Dongmen street-food walk](/tours/dongmen-street-food) exists. The other half is knowing which queue is worth joining.',
    },
    {
      k: 'cta',
      label: 'Walk Dongmen with someone who grew up eating here',
      sub: 'A local buddy reads the boards, knows the queues, and keeps you moving toward the good stalls instead of the loud ones.',
    },

    { k: 'h2', text: 'Go at the right hour' },
    {
      k: 'p',
      text: 'Dongmen keeps shop hours in the morning and comes into itself in the evening. Late afternoon into night is the district at full signal: the eaves light up, the snack streets hit their stride, and the crowd becomes the attraction — school groups, dating couples, grandmothers doing the actual shopping. If your evening is already spoken for by the skyline, that is a fair trade; we wrote up [that version of the night](/blog/shenzhen-after-dark) too. But Dongmen at nine in the evening is the older city making its counter-argument.',
    },
    {
      k: 'ul',
      items: [
        'It is a pedestrian district with its own metro stop, one easy line change from the border crossings — you do not need a car, and a car could not get in anyway.',
        'Everything is paid by phone, including the smallest skewer stall. Do the payment setup in [our border-crossing guide](/blog/shenzhen-from-hong-kong-day-trip) before you come hungry.',
        'Bargaining exists in the clothing markets, not at the food stalls. Snack prices are posted and honest; pay what the board says and keep the queue moving.',
      ],
    },
    {
      k: 'callout',
      tone: 'tip',
      title: 'Pair it with the border',
      text: 'Dongmen sits minutes from the Hong Kong crossings, which makes it the natural first or last stop of a day trip — arrive hungry, or spend your last two hours here before crossing back.',
    },
    {
      k: 'quote',
      text: 'Futian is the Shenzhen that got built. Dongmen is the Shenzhen that was already here.',
    },
    {
      k: 'p',
      text: 'The skyline will still be there at sunset. Give the old downtown an afternoon first: walk in without a plan, follow the longest queue, and let the district do what it has done for a few hundred years — sell you something worth eating.',
    },
    {
      k: 'cta',
      label: 'Book the Dongmen street-food walk',
      sub: 'Two hours, one snack street at a time, with a buddy who knows which windows are worth the wait.',
    },
  ],
  faq: [
    {
      q: 'What is Dongmen in Shenzhen?',
      a: 'The city’s old downtown — a pedestrianised market district in Luohu that grew out of the original Shenzhen market town, centuries older than the skyline. Today it is clothing markets, snack streets and traditional-roofed shopping streets, a few minutes from the Hong Kong border.',
    },
    {
      q: 'When is the best time to visit Dongmen?',
      a: 'Late afternoon into evening. The district runs ordinary shop hours in the morning and hits full stride after dark, when the eaves light up and the snack streets are busiest.',
    },
    {
      q: 'Is Dongmen worth visiting?',
      a: 'Yes — especially as a counterweight to the CBD. It is the part of Shenzhen that predates the special economic zone, and the best street-snack grazing in the city. Go hungry, follow the queues of locals.',
    },
    {
      q: 'How do I get to Dongmen?',
      a: 'It has its own metro stop, an easy ride from the Hong Kong border crossings, and the district itself is pedestrian-only. Set up mobile payments before you arrive — even the smallest stalls are phone-paid.',
    },
    {
      q: 'Was the first McDonald’s in China really in Dongmen?',
      a: 'The first McDonald’s in mainland China opened in this part of Shenzhen in 1990, and the pagoda-roofed branch on the pedestrian street remains a local landmark people still navigate by.',
    },
  ],
}
