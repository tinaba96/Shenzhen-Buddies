import type { Post } from './types'

// SOURCING NOTE — the discipline this post is written to.
//
// An 'interests' post, so the facts are chosen to be the kind that do not
// decay: what the city looks and feels like at night, not schedules or prices.
// Where a claim touches something that changes, the phrasing is conditional
// on purpose:
//
//   - The Futian CBD facade light show runs "on show nights" with no schedule
//     stated — the schedule genuinely varies week to week, and the
//     skyline-after-dark package copy makes the same commitment ("your buddy
//     checks the schedule that week"). This post mirrors it rather than
//     inventing a timetable.
//   - Ping An Finance Centre "roughly 600 metres" — completed 2017 at 599m,
//     stable and widely documented.
//   - Metro hours appear only as "last trains leave before midnight" — true
//     for years across the network and phrased so a per-line change does not
//     falsify the page. Anything sharper belongs in a logistics post with a
//     lastChecked date.
//   - Crayfish seasonality is not restated; the food post owns that claim and
//     is linked instead.
//
// Prices are absent from the body. Payment setup is linked, not restated —
// the border-crossing post carries the lastChecked date for that.
//
// Safety is described as first-person founder experience ("we have walked
// guests home...") rather than as a statistic or a comparison to other
// cities — a crime-rate claim would need a source and a date; an experience
// only needs to be true.
//
// Every image is from src/content/gallery.ts: the founder's own frames, no
// stock. Captions are rewritten here only to fit the surrounding prose.

export const shenzhenAfterDark: Post = {
  slug: 'shenzhen-after-dark',
  title: 'Shenzhen after dark',
  excerpt:
    'Daylight is when Shenzhen works. At night the towers run light shows, the late tables fill up, and the markets keep going. An evening, done properly.',
  pillar: 'interests',
  tags: ['nightlife', 'skyline', 'food', 'first-visit'],
  publishedAt: '2026-09-03',
  author: 'bryan',
  // The one night frame not yet carried by a post: a single lit tower past a
  // walkway, legible as "city at night" even at share-card size, where the
  // three-tower shot reads busier and already fronts the day-trip post.
  heroGalleryId: 'skyline-tower-walkway-night',
  relatedSlugs: ['what-shenzhen-actually-eats', 'shenzhen-from-hong-kong-day-trip'],
  seo: {
    title: 'Shenzhen at night: skyline lights, late tables, markets',
  },
  body: [
    {
      k: 'p',
      text: 'Most cities show you their best side over lunch. Shenzhen holds its argument back until sunset. Through the day it is a working city — errands, deliveries, forty storeys of people at desks — and it looks like one. Then the light drops, the towers switch on one block at a time, and the same streets you walked at noon start making a completely different case for themselves.',
    },
    {
      k: 'p',
      text: 'This is a guide to that second city: where the light is, where the tables are, and what stays open after the daytime version clocks off. It is shaped the way people who live here actually run an evening — up high first, then down to street level, then late. Every photo is a night we were out in.',
    },

    { k: 'h2', text: 'The skyline switches itself on' },
    {
      k: 'p',
      text: 'Shenzhen built its skyline inside forty years, and it is not modest about the achievement. The Ping An Finance Centre — roughly six hundred metres of it — anchors a CBD where the buildings do not merely light up at night; on show nights, whole facades across the district run a synchronised display, tower to tower, like a screensaver the size of downtown. The schedule shifts week to week, so nobody prints it. You ask someone local, that week.',
    },
    {
      k: 'img',
      galleryId: 'skyline-blue-towers-night',
      caption:
        'The towers run their lighting most nights. People who live here have stopped looking up. You will not manage that.',
    },
    {
      k: 'p',
      text: 'The best free seat in the house is Lianhuashan Park, a twenty-minute walk up through trees — a path, not a hike — that puts the whole CBD in one line beneath you. Go up while it is still light. The show is not the view itself; it is the transition: kites coming down, retirees dancing in the square, the sky going orange and then blue, and the towers coming on one block at a time. Timing that transition is the entire craft, which is why [our skyline evening](/tours/skyline-after-dark) is timed to the sunset rather than routed on a map.',
    },
    {
      k: 'p',
      text: 'If the night is clear, the Ping An observation deck is right there and worth the lift ride. If it is hazy, skip it without regret — a grey photograph from six hundred metres is still a grey photograph. Street level under the lit towers costs nothing and delivers most nights of the year.',
    },

    { k: 'h2', text: 'Eleven at night is a mealtime' },
    {
      k: 'p',
      text: 'The meal this city is proudest of does not happen in a restaurant. Dàpáidàng is the open-air late table: plastic stools, trays of garlic crayfish, grilled oysters, fried noodles, cold beer, and a crowd that sits down around ten and is still talking at one. Restaurants fold their napkins and close; the late table is just warming up.',
    },
    {
      k: 'img',
      galleryId: 'crayfish-garlic-bowl',
      caption:
        'Garlic crayfish at the hour they are meant for. The gloves go on and the dignity is surrendered at the door.',
    },
    {
      k: 'p',
      text: 'It is also the hardest meal in Shenzhen to walk into alone. The menu is a wall, the ordering is verbal, the good places are unmarked, and every table is mid-argument about garlic versus thirteen-spice. That is not a flaw — it is what makes it the most social table in the city, and it is why [one of our four-hour evenings](/tours/crayfish-night-table) simply is this meal. What crayfish are and when they run is covered in [our food guide](/blog/what-shenzhen-actually-eats); the short version is that summer nights are what the dish was invented for.',
    },
    {
      k: 'cta',
      label: 'Get a seat at the late table',
      sub: 'A local buddy reads the wall menu, negotiates the spice level honestly, and knows which busy table is busy with locals.',
    },

    { k: 'h2', text: 'The markets do not really close' },
    {
      k: 'img',
      galleryId: 'huaqiangbei-electronic-world-night',
      caption:
        'Huaqiang Electronic World after the offices empty. The night-market signs over the metro entrance are the tell: the buying does not stop, it moves outdoors.',
    },
    {
      k: 'p',
      text: 'Huaqiangbei by day is the biggest electronics market on earth — floors of components, phones and drones stacked forty blocks deep. What surprises people is the evening shift. The tower floors wind down, and the street around the metro entrance picks up: stalls, snacks, phone cases by the crate, neon doing the advertising. The district never quite finishes its sentence.',
    },
    {
      k: 'p',
      text: 'The food night markets run on the same clock, and the same rule we use in daylight holds after dark: eat where the queue is, at the hour the queue forms. The stalls with self-translating price boards and scorpions on sticks are a photo stop for visitors; the regulars are two rows over at something less photogenic and better. A queue of locals at eleven at night is the most honest restaurant review in the city.',
    },

    { k: 'h2', text: 'The small print of a late night' },
    {
      k: 'ul',
      items: [
        'The metro is superb and not nocturnal: last trains leave before midnight, and a platform you confidently rode at 22:00 is locked at 01:00. Check the last-train time at the station you plan to come home through before the evening runs away from you.',
        'After the metro, the city runs on ride-hailing, and ride-hailing runs on your phone — which means on the payment setup you did before you got hungry. The steps live in [our border-crossing guide](/blog/shenzhen-from-hong-kong-day-trip); do them on wifi, in daylight.',
        'Safety is the thing first-time visitors ask about and then feel silly for asking. We have walked guests back to their hotels at one in the morning more times than we can count, and it has never once felt tense. Keep the ordinary big-city sense about your phone and your drink, and the night is yours.',
      ],
    },
    {
      k: 'callout',
      tone: 'tip',
      title: 'Haze can veto the whole plan',
      text: 'Air clarity decides a skyline night as much as the show schedule does, and both change by the week. Ask at your hotel close to the date — or let your buddy check and build the walk around the answer, which is what we do on the skyline evening.',
    },
    {
      k: 'quote',
      text: 'Daylight is when Shenzhen works. Dusk is when it makes its argument.',
    },
    {
      k: 'p',
      text: 'A first visit usually spends its energy on the daytime city — the markets, the borders, the lunch. Fair enough; we wrote guides for those too. But if you get one evening, spend it the way this city does: up a hill while the light goes, under the towers when they switch on, and on a plastic stool long after you meant to go home.',
    },
    {
      k: 'cta',
      label: 'Spend the evening with someone who lives here',
      sub: 'Four hours, timed to that day’s sunset — or to the hour the crayfish tables fill. Your call.',
    },
  ],
  faq: [
    {
      q: 'Is Shenzhen safe at night?',
      a: 'In our experience, yes — well-lit areas stay busy late, and of all the evenings we have walked guests home after midnight, not one has turned tense. Apply the ordinary big-city sense about your phone and your drink, and getting home is a ride-hailing app away.',
    },
    {
      q: 'Where is the best view of the Shenzhen skyline?',
      a: 'Lianhuashan Park, reached by an easy twenty-minute walk up, lines the whole Futian CBD beneath you with the Ping An Finance Centre at the centre. Go up before sunset and watch the towers come on. On clear nights the Ping An observation deck is the paid upgrade.',
    },
    {
      q: 'Does Shenzhen have a light show?',
      a: 'Yes — on show nights the tower facades across the Futian CBD run a synchronised lighting display. The schedule changes week to week and is not reliably published in English, so ask locally (a hotel desk or a local buddy) close to the date.',
    },
    {
      q: 'What is dàpáidàng?',
      a: 'The open-air late-night table: crayfish, grilled oysters, noodles and cold beer, eaten on plastic stools from around ten in the evening onwards. It is the most social meal in the city, and the hardest to order at without help — menus are on the wall and the ordering is verbal.',
    },
    {
      q: 'Does the Shenzhen metro run all night?',
      a: 'No. Last trains leave before midnight — check the time at the station you plan to use on the way home. After that the city runs on ride-hailing, which needs a working local payment setup on your phone.',
    },
  ],
}
