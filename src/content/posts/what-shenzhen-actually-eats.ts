import type { Post } from './types'

// SOURCING NOTE — the discipline this post is written to.
//
// This is an 'interests' post, so its facts are chosen to be the kind that do
// not decay: dishes, seasons and eating customs that are stable, widely
// documented Guangdong culture. Two claims rest on checkable numbers, both
// checked 2026-08:
//
//   - "about two in three people who live here are registered somewhere else"
//     — 2024 municipal figures (11.68M residents without a local hukou, ~65%),
//     as reported by Caixin, 2026-05.
//   - crayfish season (roughly May–October, best in high summer) — consistent
//     across mainland food press; the founder's own crayfish photos are dated
//     2026-07/08, in season.
//
// Prices are deliberately absent from the body: they decay fast, and a wrong
// number ages the whole page. Payment logistics live in the border-crossing
// post, which carries a lastChecked date for exactly that reason — this post
// links there instead of restating.
//
// Every image is from src/content/gallery.ts: the founder's own meals, no
// stock imagery, captions rewritten here only to fit the surrounding prose.

export const whatShenzhenActuallyEats: Post = {
  slug: 'what-shenzhen-actually-eats',
  title: 'What Shenzhen actually eats',
  excerpt:
    'Nobody\'s grandmother is from Shenzhen. That is the best thing about eating here — the whole country cooks in one city. Where to start, dish by dish.',
  pillar: 'interests',
  tags: ['food', 'street-food', 'first-visit', 'dongmen'],
  publishedAt: '2026-08-18',
  author: 'bryan',
  // Landscape, appetising, and legible at share-card size: chopsticks mid-lift
  // reads as "food" in a thumbnail where a market wide shot would read as
  // "street". Also the one frame that pairs the two package dishes.
  heroGalleryId: 'crayfish-noodles-lift',
  relatedSlugs: ['shenzhen-from-hong-kong-day-trip'],
  seo: {
    title: 'Shenzhen food guide: what a city of migrants eats',
  },
  body: [
    {
      k: 'p',
      text: 'Shenzhen is younger than many of the people eating dinner in it. There was no century of grandmothers here refining a local dish; the city assembled itself inside one generation, out of arrivals from every province in China. About two in three people who live here are still registered somewhere else. That is a dry statistic right up until you are hungry, when it becomes the most useful fact in the city: everybody brought their food with them.',
    },
    {
      k: 'p',
      text: 'So the honest answer to "what is Shenzhen\'s local dish" is a counter-question — which China do you want? You can cross most of the country\'s food map without leaving one metro line: Cantonese at this exit, Hunan at the next, Chaoshan around the corner, Korean upstairs, sourdough across the road. What follows is that map, in the order a first visit usually meets it. Every photo is a meal we actually ate.',
    },

    { k: 'h2', text: 'The base layer is Cantonese' },
    {
      k: 'p',
      text: 'Underneath everything imported, Shenzhen sits in Guangdong, and the default register of its cooking is Cantonese: restraint, freshness, dishes built to taste of their main ingredient rather than their sauce. The version you will meet first is white-cut chicken — a whole bird poached gently, rested, chopped, and served barely warm with ginger-scallion oil and rice cooked in the poaching stock.',
    },
    {
      k: 'img',
      galleryId: 'chicken-rice-closeup',
      caption:
        'White-cut chicken over stock rice. The plainest-looking plate in Guangdong, and the hardest one to cook well.',
    },
    {
      k: 'p',
      text: 'It looks like the simplest thing on the menu, and it is the dish cooks get judged on. If the chicken is right, everything else at that shop will be right too — locals use it the way you might use an espresso to judge a café.',
    },
    {
      k: 'p',
      text: 'The other Cantonese institution is breakfast, taken seriously: congee cooked long enough to lose the shape of the rice, and chángfěn — rice noodle rolls steamed to order and folded around egg or beef under sweet soy. Morning food here is its own culture with its own pace, which is exactly why we built [a four-hour morning](/tours/breakfast-shift) around nothing else.',
    },

    { k: 'h2', text: 'Then the whole country moved in' },
    {
      k: 'p',
      text: 'Walk out of the Cantonese place and the next three doors will disagree with it. Hunan kitchens sling chilli oil over noodles. Chaoshan shops braise pork trotters over rice for the working lunch. Sichuan places number their spice levels with what can only be called optimism. None of it is fusion — each shop cooks its own province straight, for homesick regulars who would notice if it didn\'t.',
    },
    {
      k: 'img',
      galleryId: 'noodle-shop-table',
      caption:
        'Chilli-oil noodles beside a Cantonese rice plate. One table, no contradiction.',
    },
    {
      k: 'p',
      text: 'The map does not stop at China\'s borders, either. Shenzhen\'s Korean and Japanese communities are large enough to support the real thing rather than the themed version — you can follow tteokbokki with Cantonese congee inside one block and nobody finds it strange.',
    },
    {
      k: 'img',
      galleryId: 'tteokbokki-black-rice',
      caption:
        'Tteokbokki and purple-black rice — dinner in a city where "local food" is a moving target.',
    },
    {
      k: 'quote',
      text: 'Twelve million people arrived from somewhere else and brought dinner.',
    },
    {
      k: 'cta',
      label: 'Eat with someone who knows where to point',
      sub: 'A local buddy orders in their own accent, and you eat what the regulars eat.',
    },

    { k: 'h2', text: 'Summer is crayfish season' },
    {
      k: 'p',
      text: 'From late spring into autumn — roughly May to October, at their fattest in high summer — Shenzhen\'s night tables fill with xiǎolóngxiā: freshwater crayfish by the kilo, in garlic broth or chilli butter, eaten with plastic gloves, cold beer and no dignity whatsoever. The broth is the point. Order a plate of plain noodles you had not planned on, for the broth.',
    },
    {
      k: 'img',
      galleryId: 'crayfish-garlic-bowl',
      caption:
        'Garlic crayfish, wood-ear mushroom, green chilli. The gloves are not optional.',
    },
    {
      k: 'p',
      text: 'A crayfish table is a social format as much as a meal — slow, messy, and impossible to do while looking at your phone, which is why groups of friends default to it. It is also the single best table in the city to be a guest at, which is why [one of our four-hour evenings](/tours/crayfish-night-table) ends at one.',
    },

    { k: 'h2', text: 'How to read a night market' },
    {
      k: 'img',
      galleryId: 'night-market-skewers-stall',
      caption:
        'Scorpions and silkworm pupae behind a bilingual price board. The translation is the tell.',
    },
    {
      k: 'p',
      text: 'You will find the scorpion skewers, or they will find you. Here is the honest reading: a stall whose price board translates itself into English is a stall aimed at visitors. Locals are two rows over, queueing at something less photogenic — grilled oysters, a griddle of noodles, fruit under syrup. The rule that never misses: eat where the queue is, at the hour the queue forms. A crowd of regulars at noon is a better hygiene certificate than any sticker on the glass.',
    },
    {
      k: 'img',
      galleryId: 'preserved-fruit-jars',
      caption:
        'Preserved fruit, hand-labelled in marker — the quiet real thing, a few steps from the loud tourist thing.',
    },
    {
      k: 'p',
      text: 'Dongmen, the old market district, is where the two layers stack on top of each other — the dare stalls and the real ones, a street apart. Telling them apart is half the fun and the whole reason [the street-food walk](/tours/dongmen-street-food) exists.',
    },

    { k: 'h2', text: 'How the city eats on a Tuesday' },
    {
      k: 'p',
      text: 'Not every meal is an event. At midday, most of Shenzhen eats in twenty minutes flat: a canteen tray, point at four things, soup thrown in free, back to the office. It is fast food with vegetables and no branding, and it is very good.',
    },
    {
      k: 'img',
      galleryId: 'canteen-tray-lunch',
      caption: 'The pick-four canteen tray. How the city actually eats at noon.',
    },
    {
      k: 'p',
      text: 'And the newest layer keeps arriving. The bakery scene — proper sourdough, laminated pastry, weekend-morning queues — turned up quietly a few years ago and is now everywhere. Which is what food in this city does: it shows up with a suitcase and stays.',
    },
    {
      k: 'img',
      galleryId: 'bakery-bread-counter',
      caption:
        'Scored sourdough rounds in a Shenzhen bakery. The suitcase food of a newer migration.',
    },

    { k: 'h2', text: 'Five plates to anchor a first visit' },
    {
      k: 'table',
      head: ['Dish', 'What it is', 'When'],
      rows: [
        [
          '白切鸡 · white-cut chicken',
          'Gently poached whole chicken, ginger-scallion oil, rice cooked in the stock',
          'Lunch',
        ],
        [
          '肠粉 · rice noodle rolls',
          'Silky steamed rice sheets folded around egg, beef or shrimp, under sweet soy',
          'Breakfast',
        ],
        [
          '隆江猪脚饭 · pork trotter rice',
          'Chaoshan-style soy-braised pork knuckle over rice — the migrant working lunch',
          'Lunch',
        ],
        [
          '小龙虾 · crayfish',
          'A kilo of them in garlic broth or chilli butter, gloves on, beer open',
          'Summer nights',
        ],
        [
          '煲仔饭 · claypot rice',
          'Rice crisped against a hot clay pot under cured sausage and greens',
          'Cooler evenings',
        ],
      ],
    },

    { k: 'h2', text: 'Three practical notes' },
    {
      k: 'ul',
      items: [
        'Spice: the Cantonese base of the city is barely spicy at all; Hunan and Sichuan places are genuinely hot. 微辣 (wēi là) technically means "mildly spicy" and is the one piece of menu vocabulary that cannot be trusted — order one dish and calibrate before committing to a table of them.',
        'Ordering: picture menus are everywhere and pointing is a fully accepted ordering method. Nobody is offended. A camera-translate app covers the rest.',
        'Timing: eat when the city eats. Kitchens surge at noon and again around 18:30, and the good stalls sell out rather than hold stock — a famous breakfast shop at 10:30 is a counter of crumbs.',
      ],
    },
    {
      k: 'callout',
      tone: 'tip',
      title: 'Sort out payment before you are hungry',
      text: 'Street stalls run on Alipay and WeChat Pay to a degree that surprises people, and verifying a foreign card can need a working phone number. Ten minutes on wifi the night before beats standing in front of a griddle you cannot pay. The setup steps are in our [Hong Kong to Shenzhen guide](/blog/shenzhen-from-hong-kong-day-trip).',
    },

    {
      k: 'p',
      text: 'The best meals we have eaten in Shenzhen were never found. They were pointed at — by someone who had been eating at that table for years. That is more or less the entire premise of this site.',
    },
    {
      k: 'cta',
      label: 'Bring an appetite, borrow a local',
      sub: 'Four hours with a Shenzhen buddy covers more tables than four days of guessing.',
    },
  ],
  faq: [
    {
      q: 'What food is Shenzhen famous for?',
      a: 'Shenzhen has no single native dish — the city is too young and too migrant for one. Its base register is Cantonese (white-cut chicken, congee, rice noodle rolls), layered with every regional Chinese cuisine its arrivals brought with them, plus substantial Korean and Japanese food, and a citywide crayfish habit in summer.',
    },
    {
      q: 'Is street food in Shenzhen safe to eat?',
      a: 'Use the rule locals use: eat where the queue is, at the hour the queue forms. High turnover means nothing sits around. Stalls aimed squarely at tourists — English price boards, scorpion skewers — are more of a photo stop than a meal.',
    },
    {
      q: 'When is crayfish season in Shenzhen?',
      a: 'Crayfish (xiaolongxia) run from roughly May to October across China and are at their best in high summer. In season, night tables all over Shenzhen serve them by the kilo in garlic broth or chilli butter.',
    },
    {
      q: 'Is food in Shenzhen very spicy?',
      a: 'Only where it says it is. The Cantonese base of the city is barely spicy at all, while Hunan and Sichuan restaurants are genuinely hot — and menu labels like wei la ("mildly spicy") undersell it. Order one dish first and calibrate.',
    },
    {
      q: 'Can I pay for street food with a foreign card?',
      a: 'Not directly — most stalls take Alipay or WeChat Pay and often nothing else. Both apps accept foreign cards now, but set one up and test a payment before you arrive, because verification can require a working phone number.',
    },
  ],
}
