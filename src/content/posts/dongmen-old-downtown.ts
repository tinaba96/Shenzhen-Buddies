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
//   - "The grills come out around five", the street performers, and the
//     arcade (claw machines, rhythm games) are all lifted from the
//     owner-written Dongmen Laojie package (bestStart and the 3-hour
//     itinerary), so the post and the tour card describe the same evening.
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
  updatedAt: '2026-09-25',
  author: 'bryan',
  heroGalleryId: 'dongmen-pagoda-street-night',
  relatedSlugs: ['what-shenzhen-actually-eats', 'shenzhen-after-dark'],
  seo: {
    title: 'Dongmen, Shenzhen: the old downtown, walked properly',
  },
  body: [
    {
      k: 'p',
      text: 'Every story about Shenzhen starts the same way — fishing village, forty years, skyline. Which is mostly true, and skips a place. Dongmen was a market town back when the towers were paddy fields; the name is just the east gate of the old Shenzhen market. The towers went up around it, and the market stayed put.',
    },
    {
      k: 'p',
      text: 'So when the glass towers start to blur together — and on a first visit they do — go here instead. The old downtown is loud, crowded, strung with fairy lights along pagoda eaves, and not remotely trying to look like the future. After a couple of days of towers, it is honestly a relief.',
    },

    { k: 'h2', text: 'What Dongmen actually is' },
    {
      k: 'p',
      text: 'A tangle of pedestrian streets in Luohu, a few minutes from the Hong Kong border, with no obvious edges — people disagree about where Dongmen ends, and the shops spilling into every side lane do not help. Locals mostly say Laojie, “the old street”, which is also the name of the metro station underneath it. The buildings wear traditional eaves over perfectly ordinary retail; the old-town look is deliberate and decades old. Even the McDonald’s has a pagoda roof. That branch has a real claim to history, by the way: when McDonald’s first came to mainland China, in 1990, this is where it opened, and people queued around the block for a hamburger. Locals still give directions by it.',
    },
    {
      k: 'p',
      text: 'Do not come with a shopping list; the shops turn over too fast to keep one — half of them will have changed by the time you read this, which is sort of the point of the place. What stays put is the street itself: clothing markets stacked floors deep, a milk-tea counter every fifty metres, phone cases, wedding photographers, the odd shop you cannot believe is still open. The food streets are what the rest of it is built around, and they run right through the middle.',
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
      text: 'Eating in Dongmen is done standing up, in stages. A skewer here, a rice-noodle roll there, curry fish balls out of a paper cup, whatever fruit is in season pressed into a juice while you wait. You will smell the stinky tofu long before you find it. Our rule for the whole city works hardest here: eat where the queue is, at the hour the queue forms. The stall with scorpions on sticks and a self-translating price board is a photo stop. The one next to it with fifteen teenagers waiting is dinner.',
    },
    {
      k: 'img',
      galleryId: 'preserved-fruit-jars',
      caption:
        'Preserved fruit, hand-labelled — kumquat, plum, and one nobody could name for us. The old market trades are still here.',
    },
    {
      k: 'p',
      text: 'Between the grills you keep running into the older trades — preserved fruit in hand-labelled jars, dried mushrooms and roots we could not always put a name to, herbal-tea counters that have outlasted every trend around them. What all of it is, and which of it to actually eat, is a longer conversation; we had most of it in [our food guide](/blog/what-shenzhen-actually-eats). Ordering across the language gap is half the reason [our Dongmen Laojie walk](/tours/dongmen-street-food) exists. The other half is knowing which queue is worth your twenty minutes.',
    },
    {
      k: 'cta',
      label: 'Walk Dongmen with someone who grew up eating here',
      sub: 'A local buddy reads the boards, knows the queues, and keeps you moving toward the good stalls instead of the loud ones.',
    },

    { k: 'h2', text: 'Go at the right hour' },
    {
      k: 'p',
      text: 'Dongmen keeps ordinary shop hours in the morning and gets interesting from late afternoon — the grills come out around five. Once it is dark the eaves come on, there is usually a street performer holding up foot traffic somewhere, and the crowd itself becomes the thing to watch: school kids sharing one enormous cup of something, couples on dates, grandmothers doing the actual week’s shopping. There are arcades tucked into the upper floors for when your feet give out — claw machines, rhythm games, the usual. If your evening already belongs to the skyline, fair enough — [we wrote that night up too](/blog/shenzhen-after-dark). If you have two evenings, Dongmen works just as well as the second.',
    },
    {
      k: 'ul',
      items: [
        'The whole district is pedestrian — take the metro to Laojie station, an easy change from the border crossings. A car could not get in anyway.',
        'Every stall takes phone payment and very little else, down to the smallest skewer window. Do the setup in [our border-crossing guide](/blog/shenzhen-from-hong-kong-day-trip) before you show up hungry.',
        'Haggle in the clothing markets if you enjoy that sort of thing. Do not haggle over food — snack prices are posted and fair. Pay the board and keep the line moving.',
      ],
    },
    {
      k: 'callout',
      tone: 'tip',
      title: 'Pair it with the border',
      text: 'Dongmen sits minutes from the Hong Kong crossings, which makes it a natural first or last stop on a day trip. Arrive hungry, or save it for your final two hours before crossing back — it works either way round.',
    },
    {
      k: 'quote',
      text: 'Dongmen is best enjoyed slowly.',
      attribution: 'the one-line briefing we give every guest',
    },
    {
      k: 'p',
      text: 'The skyline can wait a day. Give the old downtown one evening: walk in without much of a plan, follow the longest queue you can find, and let Dongmen do what it has done for a few hundred years — sell you something worth eating.',
    },
    {
      k: 'cta',
      label: 'Book the Dongmen Laojie walk',
      sub: 'Two to three hours, one snack street at a time, with a buddy who knows which windows are worth the wait.',
    },
  ],
  faq: [
    {
      q: 'What is Dongmen in Shenzhen?',
      a: 'The city’s old downtown — a pedestrianised market district in Luohu that grew out of the original Shenzhen market town, centuries older than the skyline. Today it is clothing markets, snack streets and traditional-roofed shopping streets, a few minutes from the Hong Kong border.',
    },
    {
      q: 'When is the best time to visit Dongmen?',
      a: 'Late afternoon into evening. The grills come out around five, and the district hits full stride after dark, when the eaves light up and the snack streets are at their busiest. Mornings are ordinary shop hours and much quieter.',
    },
    {
      q: 'Is Dongmen worth visiting?',
      a: 'Yes — go hungry. It is the part of Shenzhen that predates the special economic zone, the street-snack grazing is the best in the city, and after a day or two of glass towers it is a welcome change of pace. Follow the queues of locals.',
    },
    {
      q: 'How do I get to Dongmen?',
      a: 'Ride the metro to Laojie station — named after the district itself — an easy trip from the Hong Kong border crossings. The streets are pedestrian-only. Set up mobile payments before you arrive — even the smallest stalls are phone-paid.',
    },
    {
      q: 'Was the first McDonald’s in China really in Dongmen?',
      a: 'The first McDonald’s in mainland China opened in this part of Shenzhen in 1990, and the pagoda-roofed branch on the pedestrian street remains a local landmark people still navigate by.',
    },
  ],
}
