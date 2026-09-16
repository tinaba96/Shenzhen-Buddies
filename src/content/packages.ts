// The one-on-one experiences the site offers. Same typed-module
// pattern as src/content/gallery.ts and src/content/posts: the content ships
// with the code, the type is the schema, and assertPackagesValid() runs at
// module load so a broken entry fails `npm run build` instead of production.
//
// PRICE IS NOT STORED HERE. It is derived from amountCentsForHours(HOURS) in
// lib/booking, which is the same function the booking action charges with. A
// hardcoded "CA$40" in a card would be a promise the checkout can silently
// stop keeping the first time the hourly rate moves.
//
// PHOTO RULE — every `photo` below is one of the founder's own photographs
// from /public/gallery, and each one has to actually show the thing the
// package is about. That constraint is why there is no coast or park package
// yet: we have no coast or park photograph, and illustrating a tour with a
// picture of somewhere else is the stock-photo problem wearing a disguise.
// See the provenance note at the top of src/app/explore/page.tsx.

import { amountCentsForHours, CURRENCY, MIN_BOOKING_HOURS } from '@/lib/booking'

// Re-exported under a clearer name for the schema.org Offer on the detail
// page, which wants an ISO 4217 code in upper case. Same constant the
// checkout charges in, so the structured data cannot claim one currency while
// Stripe bills another.
export const CURRENCY_FOR_PACKAGES = CURRENCY.toUpperCase()

// The tour length shown on cards and detail pages. During the free pilot
// (FREE_TOURS in lib/booking) tourists pick a free 2 or 3 hour tour, so the
// packages advertise the 3-hour default. Packages carry one itinerary per
// length they have been written for (see ItineraryVariant); the ones still
// describing the original four-hour day are deliberately left as-is until
// the pilot's shape settles.
export const PACKAGE_HOURS = 3

export type PackageAccent =
  | 'signal'
  | 'ember'
  | 'coral'
  | 'jade'
  | 'violet'
  | 'sky'

export type ItineraryBeat = {
  // Elapsed time from the meeting point, e.g. '0:00', '1:20'. Relative on
  // purpose — the start hour is whatever the traveller picks at checkout.
  at: string
  title: string
  body: string
}

// One timeline, written for one tour length. A package that has been rewritten
// for the pilot carries a 2-hour and a 3-hour variant and the detail page lets
// the traveller flip between them; the older packages carry the single
// four-hour timeline they were written as.
export type ItineraryVariant = {
  // The length this timeline fills, in hours. Its last beat may land exactly
  // on the hour ("2:00 — Tour ends") but not past it.
  hours: number
  // The name this length of the day goes by, shown under the length toggle.
  // Required once a package has more than one variant — enforced below —
  // because two unnamed timelines are just "the short one and the long one".
  title?: string
  beats: ItineraryBeat[]
}

export type TourPackage = {
  // Stable kebab id. It is the URL (/tours/<slug>), the React key and the
  // value carried into /guide?package=, so renaming one breaks live links.
  slug: string
  title: string
  // The Chinese name of the place, shown as a subtitle. Travellers screenshot
  // this to show a taxi driver, so it earns its place.
  cn: string
  kicker: string
  tagline: string
  summary: string
  photo: string
  alt: string
  district: string
  // Recommended wall-clock start, phrased for humans. The booking form still
  // lets them pick any hour the guide is free.
  bestStart: string
  meetingPoint: string
  // The heading over the itinerary section, when the package has one worth
  // naming. Absent, the detail page uses the dictionary's generic heading.
  itineraryTitle?: string
  // Shortest first. More than one and the detail page shows a length toggle.
  itineraries: ItineraryVariant[]
  includes: string[]
  notIncluded: string[]
  goodFor: string[]
  insiderTip: string
  accent: PackageAccent
  // The one card that gets the full-width treatment on the homepage. Exactly
  // one package may set this — enforced below.
  featured?: boolean
  // Slug of a blog post that goes deeper. Validated against the post registry
  // by the /tours page rather than here, to keep this module dependency-free.
  readMoreSlug?: string
}

export const packages: TourPackage[] = [
  {
    slug: 'huaqiangbei-electronics',
    title: 'Huaqiangbei Deep Dive',
    cn: '华强北',
    kicker: 'Electronics & makers',
    tagline:
      "The world's largest electronics market, walked with someone who knows where to go.",
    summary:
      'Huaqiangbei is Shenzhen’s legendary tech paradise, where thousands of shops sell everything from smart gadgets to robots, drones, and electronic parts. Walk through the crowded markets and discover the future of technology at your fingertips. Whether you love tech or just want a unique Shenzhen experience, this place is worth exploring.',
    photo: '/gallery/huaqiangbei-electronic-world-night.webp',
    alt: 'The lit entrance of Huaqiang Electronic World at night, above the Huaqiangbei metro entrance',
    district: 'Futian',
    bestStart: 'Early afternoon — the market fills by 14:00 and buildings start closing at 18:30',
    meetingPoint:
      'Huaqiangbei metro station (Lines 2 and 7) — your buddy sends the exact exit the night before',
    itineraryTitle:
      "Shenzhen Tech Discovery Walk: Explore the World's Largest Electronics Market with a Local",
    itineraries: [
      {
        hours: 2,
        title: 'Shenzhen Huaqiangbei Tech Discovery Walk',
        beats: [
          {
            at: '0:00',
            title: 'Meet & Shenzhen introduction',
            body: "Meet your local guide and learn how a fishing village became one of the world's leading technology cities in just a few decades.",
          },
          {
            at: '0:20',
            title: 'The future gadget hunt',
            body: "Explore one of Huaqiangbei's most visitor-friendly electronics malls and discover AI gadgets, smart devices, robots, drones, and unusual inventions from Chinese startups.",
          },
          {
            at: '0:50',
            title: "Shenzhen's hidden tech stories",
            body: 'Hear surprising stories about products designed, prototyped, and sourced in Huaqiangbei before appearing around the world.',
          },
          {
            at: '1:15',
            title: 'Hands-on gadget testing',
            body: 'Try interesting gadgets, compare cool tech, and learn which products are genuinely innovative versus marketing hype.',
          },
          {
            at: '1:40',
            title: 'Futuristic street walk',
            body: "Walk through the famous pedestrian street, take photos, and experience the energy that made Shenzhen China's innovation capital.",
          },
          {
            at: '2:00',
            title: 'Tour ends',
            body: 'Get local recommendations for food, nightlife, and other hidden places to explore in Shenzhen.',
          },
        ],
      },
      {
        hours: 3,
        title: 'Shenzhen Huaqiangbei Tech & Culture Experience',
        beats: [
          {
            at: '0:00',
            title: "Welcome to China's Silicon Valley",
            body: 'Introduction to Shenzhen, Huaqiangbei, and why tech enthusiasts from around the world visit this district.',
          },
          {
            at: '0:20',
            title: "Explore the world's largest electronics market",
            body: 'Discover giant electronics malls filled with gadgets, drones, wearables, and technology from every corner of the supply chain.',
          },
          {
            at: '1:00',
            title: 'Gadget safari',
            body: 'A fun challenge: find the most unusual, futuristic, or surprisingly useful gadget in the market. Great for photos and conversations.',
          },
          {
            at: '1:30',
            title: 'Local drink break',
            body: 'Grab a coffee, milk tea, or local drink while discussing Shenzhen life, startups, technology, and travel tips.',
          },
          {
            at: '1:50',
            title: 'Hidden floors & tech culture',
            body: 'Visit areas most tourists never find and learn how products move from idea to factory to global markets.',
          },
          {
            at: '2:30',
            title: 'Future street photography walk',
            body: 'Take photos among giant LED screens, modern architecture, and the lively pedestrian streets of Huaqiangbei.',
          },
          {
            at: '3:00',
            title: 'Tour ends',
            body: 'Receive a personalized list of recommended restaurants, attractions, and Shenzhen neighborhoods to visit next.',
          },
        ],
      },
    ],
    includes: [
      '2–3 hours one-on-one experience with a Shenzhen local',
      'Real-time English–Mandarin translation in the mall and at the counter — prices, specs, bench tests',
      'Negotiating a better price when there is something you want to buy',
      'Digital payment checked before you need to buy anything',
      'Insider knowledge of the culture, business and food',
    ],
    notIncluded: [
      "Anything you buy in the mall — you pay stalls directly, we don't profit from it",
      'Food, drinks and metro fare',
      'Courier and shipping charges, etc.',
    ],
    goodFor: [
      '🏙️ First-time visitors to Shenzhen',
      '🤖 Technology enthusiasts',
      "🔍 Curious explorers who want to see the world's largest electronics market",
      '🚀 Startup founders, makers & hardware engineers',
      '🎥 Anyone who has watched a Huaqiangbei video and thought: "I want to see this place for myself."',
    ],
    insiderTip:
      "Set up Alipay or WeChat Pay before arriving in China. Most vendors in Huaqiangbei prefer QR-code payments, and having your payment app ready will make shopping much easier. If you're planning to buy something, it's best to complete the purchase when you find it, as prices and availability can change quickly.",
    accent: 'signal',
    featured: true,
  },
  {
    slug: 'dongmen-street-food',
    title: 'Dongmen Street-Food Crawl',
    cn: '东门',
    kicker: 'Food & night market',
    tagline:
      'The old downtown after dark, eaten one small plate at a time.',
    summary:
      'Dongmen is where Shenzhen existed before the towers went up, and it still eats like it. This is a walking dinner rather than a restaurant booking: skewers off the grill, tofu skin, sugar-glazed fruit, Hakka snacks, whatever the queue is longest for. Your buddy orders, explains what arrived, and steers you past the stalls that exist for people who will only come once.',
    photo: '/gallery/dongmen-pagoda-street-night.webp',
    alt: 'The Dongmen pedestrian street at night, pagoda-roofed buildings lit above the crowd',
    district: 'Luohu',
    bestStart: 'Early evening — the grills come out around 17:00',
    meetingPoint: 'Laojie station, on the Dongmen pedestrian street side',
    itineraries: [
      {
        hours: 4,
        beats: [
          {
            at: '0:00',
            title: 'The first skewer',
            body: 'We start eating immediately. Grilled squid, chicken hearts, enoki wrapped in pork belly — whatever is coming off fastest, because fastest means freshest.',
          },
          {
            at: '0:45',
            title: 'Into the lanes',
            body: 'Off the main pedestrian street into the side lanes where the prices halve. Tofu skin, rice noodle rolls, stinky tofu if you are brave, sugar-glazed hawthorn if you are not.',
          },
          {
            at: '1:40',
            title: 'A proper sit-down',
            body: 'One plastic-stool table, one real dish, one cold beer or one sugarcane juice. Your buddy orders in Cantonese or Mandarin and tells you what is in front of you.',
          },
          {
            at: '2:40',
            title: 'The dessert and dried-goods streets',
            body: 'Preserved fruit by the jar, herbal tea by the cup, egg waffles, and the shops selling things you will want to take home and will have questions about.',
          },
          {
            at: '3:20',
            title: 'Last stop, your pick',
            body: 'By now you know what you like. We go back for it, or we find one more thing you have not tried yet. Your call.',
          },
        ],
      },
    ],
    includes: [
      '2–3 hours one-on-one with a local who eats here',
      'Ordering, translating and explaining every dish',
      'A route built around what you actually eat — allergies and no-go lists respected',
      'Payment handled by QR so you never hold up a queue',
    ],
    notIncluded: [
      'The food and drinks themselves — usually modest, and you pay stalls directly',
      'Metro fare',
    ],
    goodFor: [
      'First-timers in Shenzhen',
      'Anyone travelling without Mandarin',
      'Adventurous eaters',
      'People who hate booked restaurants',
    ],
    insiderTip:
      'Come hungry but pace yourself — the good stuff is in the last hour, and everyone fills up on skewers in the first twenty minutes.',
    accent: 'ember',
  },
  {
    slug: 'skyline-after-dark',
    title: 'Skyline After Dark',
    cn: '福田',
    kicker: 'Views & city lights',
    tagline:
      'Up the hill for the sunset, down into the CBD for the lights.',
    summary:
      "Shenzhen built itself upward in forty years and the skyline is the argument. This one is timed rather than routed: we start climbing while it is still light, hit the viewpoint as the towers switch on, then drop into the CBD at street level where the buildings themselves are the screen. It is the evening people come back with photographs from.",
    photo: '/gallery/skyline-blue-towers-night.webp',
    alt: 'Shenzhen towers lit blue at night, seen from street level',
    district: 'Futian',
    bestStart: 'Mid-afternoon — we time the climb to the sunset',
    meetingPoint: 'Lianhuashan Park, east gate',
    itineraries: [
      {
        hours: 4,
        beats: [
          {
            at: '0:00',
            title: 'The climb everyone does',
            body: 'Lianhuashan is a twenty-minute walk up through trees, not a hike. The payoff at the top is the whole CBD lined up beneath you, with Ping An at the centre of it.',
          },
          {
            at: '0:50',
            title: 'Golden hour at the top',
            body: 'We wait it out. Kites, retirees dancing, the light going orange and then blue, and the towers coming on one block at a time.',
          },
          {
            at: '1:40',
            title: 'Down into the Civic Center',
            body: 'Street level under the towers, across the civic axis. On show nights the building facades run a synchronised light display across the whole district — your buddy checks the schedule that week and we plan the walk around it.',
          },
          {
            at: '2:30',
            title: 'Up, if you want up',
            body: 'The Ping An Finance Centre observation deck is right there and worth it on a clear night. Tickets are yours to buy and we skip it without argument if the haze has won that day.',
          },
          {
            at: '3:10',
            title: 'A drink at altitude, or a bowl at ground level',
            body: 'Rooftop bar for the view, or a late noodle shop for the city. Both are good answers and your buddy has a specific one of each.',
          },
        ],
      },
    ],
    includes: [
      '2–3 hours one-on-one, timed to that day’s sunset',
      'The light-show schedule checked in advance',
      'Photo spots that are not the one everyone posts',
      'Navigation, translation and tickets bought at the local counter',
    ],
    notIncluded: [
      'Observation-deck tickets',
      'Food and drinks',
      'Metro fare',
    ],
    goodFor: [
      'Photographers',
      'Couples',
      'Anyone with one evening in the city',
      'Skyline collectors',
    ],
    insiderTip:
      'Air clarity decides this one. Your buddy will tell you honestly the morning of if the haze means you should swap to another package — we would rather move you than sell you a grey photograph.',
    accent: 'violet',
  },
  {
    slug: 'first-four-hours',
    title: 'First Hours from Hong Kong',
    cn: '口岸',
    kicker: 'Arrival & logistics',
    tagline:
      'Cross the border and get a working phone, a working wallet and a real lunch.',
    summary:
      'The day trip from Hong Kong falls apart in the same four places every time: the crossing, the SIM, the payment apps and the first meal. This package exists to take those four off the table in one go. You come out the other side of the checkpoint able to pay for things, call a car, read a menu and get yourself back — which is the whole difference between a good Shenzhen day and an expensive walk around a mall.',
    photo: '/gallery/skyline-tower-walkway-night.webp',
    alt: 'A Shenzhen tower lit white against the night sky, seen past a raised pedestrian walkway',
    district: 'Futian / Luohu',
    bestStart: 'Morning — cross early and the queues are half the length',
    meetingPoint:
      'Mainland side of the Futian or Luohu checkpoint, arrivals hall — you pick which crossing',
    itineraries: [
      {
        hours: 4,
        beats: [
          {
            at: '0:00',
            title: 'Met on the mainland side',
            body: 'Your buddy is waiting past immigration with your name on a phone screen. No hunting for a meeting point in a hall with eleven exits.',
          },
          {
            at: '0:20',
            title: 'Phone, data, and the honest version of what works',
            body: 'Data sorted, the apps you will actually need installed, and a straight answer about which of your usual services do and do not work here — rather than finding out at the moment you need one.',
          },
          {
            at: '0:50',
            title: 'A wallet that works',
            body: 'Alipay or WeChat Pay linked to your card and tested on a real purchase, plus a metro QR set up. This is the step that quietly decides whether the rest of the trip is easy.',
          },
          {
            at: '1:30',
            title: 'Lunch, properly ordered',
            body: 'A first meal somewhere locals eat, ordered and explained. Also where we sit down and plan the rest of your day against the hours you actually have.',
          },
          {
            at: '2:30',
            title: 'One neighbourhood, walked',
            body: 'Whichever you came for — the electronics market, the old town, the towers. Enough of it that you could come back tomorrow on your own.',
          },
          {
            at: '3:30',
            title: 'The way back, rehearsed',
            body: 'Which line, which exit, how long the return queue runs at that hour, and a written card with it all on it. You leave knowing how you get home.',
          },
        ],
      },
    ],
    includes: [
      '2–3 hours one-on-one from the moment you clear immigration',
      'Payment apps and metro QR set up and tested',
      'Translation for anything you sign up to on the day',
      'Lunch ordered and explained',
      'A written route home with times',
    ],
    notIncluded: [
      'Visas and entry permits — those are yours, and we cannot advise on them',
      'Data plans, SIMs, food and fares',
      'Your Hong Kong side transport',
    ],
    goodFor: [
      'First visit to mainland China',
      'Hong Kong day-trippers',
      'Business travellers with one free day',
      'Anyone nervous about the crossing',
    ],
    insiderTip:
      'Do the payment apps before you fly if you possibly can. Verification sometimes wants a text to your home number, and home numbers are exactly what stops working at the border.',
    accent: 'jade',
    readMoreSlug: 'shenzhen-from-hong-kong-day-trip',
  },
  {
    slug: 'crayfish-night-table',
    title: 'Crayfish & the Late Table',
    cn: '大排档',
    kicker: 'Late night & drinking food',
    tagline:
      'The meal Shenzhen has at eleven at night, on plastic stools, with your hands.',
    summary:
      'Dàpáidàng is the open-air late-night table: garlic crayfish by the tray, noodles, cold beer, and a table that stays up long after the restaurants have folded their napkins. It is the most social meal in the city and the hardest one to walk into alone, because the ordering is verbal, the menu is a wall, and the good places are unmarked.',
    photo: '/gallery/crayfish-noodles-lift.webp',
    alt: 'Chopsticks lifting noodles beside a bowl of garlic crayfish',
    district: 'Luohu / Futian',
    bestStart: 'Night — the tables fill from 20:00 and get better later',
    meetingPoint: 'Sent the day before, once your buddy knows which tables are running',
    itineraries: [
      {
        hours: 4,
        beats: [
          {
            at: '0:00',
            title: 'A cold one, standing up',
            body: 'We start with a drink and a walk past three or four options so you can see the difference between a table that is busy and a table that is busy with locals.',
          },
          {
            at: '0:40',
            title: 'The crayfish order',
            body: 'Garlic, spicy, or thirteen-spice — the argument that splits every table in the city. We order more than one so you get to have an opinion.',
          },
          {
            at: '1:40',
            title: 'Everything that goes with it',
            body: 'Grilled oysters, clams in black bean, fried rice noodles, greens with garlic. Your buddy orders around what you liked instead of running a fixed list.',
          },
          {
            at: '2:40',
            title: 'The part where you stop being a tourist',
            body: 'Nobody at this table is in a hurry. This is the hour people actually talk — about the city, the work, why anyone moves to Shenzhen at twenty-three.',
          },
          {
            at: '3:30',
            title: 'Home, or one more street',
            body: 'A car called to your hotel, or a last walk if the night is behaving.',
          },
        ],
      },
    ],
    includes: [
      '2–3 hours one-on-one at a table you would not have found',
      'Ordering, translating and the spice level negotiated honestly',
      'A ride home called and explained to the driver',
    ],
    notIncluded: [
      'Food and drinks — you pay the table directly',
      'The ride itself',
    ],
    goodFor: [
      'Solo travellers who do not want to eat alone',
      'Seafood people',
      'Anyone who has done the daytime version of a city',
    ],
    insiderTip:
      'Wear something you do not mind wearing garlic on afterwards. There is no elegant way to eat crayfish and nobody at the table is attempting one.',
    accent: 'coral',
  },
  {
    slug: 'breakfast-shift',
    title: 'The Breakfast Shift',
    cn: '早茶',
    kicker: 'Mornings & markets',
    tagline:
      'What twelve million people actually eat before work, plus the market it comes from.',
    summary:
      'Shenzhen at seven in the morning is a completely different city from the one in the photographs — canteen trays, rice rolls off the steamer, tea drunk standing up, and a wet market doing the day’s serious business before most visitors are awake. This is the quietest and most ordinary tour we offer, and it is the one people say they remember.',
    photo: '/gallery/canteen-tray-lunch.webp',
    alt: 'A canteen tray of rice, greens and braised dishes on a steel counter',
    district: 'Luohu',
    bestStart: 'Early — 07:00 or 08:00, and yes, that is the point',
    meetingPoint: 'Your hotel lobby if you are central, or the nearest metro exit',
    itineraries: [
      {
        hours: 4,
        beats: [
          {
            at: '0:00',
            title: 'Breakfast where the queue is',
            body: 'Rice noodle rolls off the steamer, congee, soy milk, a fried dough stick. Ordered at a counter, eaten fast, standing or sitting depending on the room.',
          },
          {
            at: '0:50',
            title: 'Tea, sat down',
            body: 'The slower half of a Cantonese morning — a pot, a few baskets, and an hour that nobody is trying to turn over. Your buddy explains the etiquette, including the finger tap.',
          },
          {
            at: '1:50',
            title: 'The wet market',
            body: 'Fish still moving, greens you have not seen before, dried goods, the preserved-fruit jars, herbs sold by the handful. This is where the food you have been eating comes from and where prices are set.',
          },
          {
            at: '2:50',
            title: 'A bakery stop',
            body: 'Shenzhen’s bakery habit is real and specific. Pineapple buns, sourdough, egg tarts, coffee that is better than it has any right to be.',
          },
          {
            at: '3:30',
            title: 'Where to go next, decided over coffee',
            body: 'You now have a whole day left and a much better sense of the city. Your buddy maps the rest of it against what you liked this morning.',
          },
        ],
      },
    ],
    includes: [
      '2–3 hours one-on-one starting at a civilised local hour',
      'Ordering and translating at counters that have no English menu',
      'Market prices explained so you know what things cost',
      'A plan for the rest of your day, written down',
    ],
    notIncluded: [
      'Food, tea and anything you buy at the market',
      'Metro fare',
    ],
    goodFor: [
      'Early risers and the jet-lagged',
      'Food writers and cooks',
      'Families',
      'Anyone who wants the unphotogenic, real version',
    ],
    insiderTip:
      'Jet lag from Europe or the Americas puts you awake at five in the morning anyway. This is the package that turns that into an advantage instead of a problem.',
    accent: 'sky',
  },
]

// ---------------------------------------------------------------------------
// Derived values and accessors
// ---------------------------------------------------------------------------

// The price of a package, from the same function the checkout charges with.
export function packagePriceCents(): number {
  return amountCentsForHours(PACKAGE_HOURS)
}

// Formatted with an explicit currency prefix — "CA$40.00", not "$40.00".
//
// lib/booking's formatMoney() uses the en-CA locale, where CAD is the local
// currency and so renders as a bare "$". That is correct inside the booking
// flow, which a signed-in traveller reaches after seeing the rate spelled out.
// It is not correct on a marketing page read by someone in Hong Kong, Tokyo or
// London, where a bare "$" reads as US dollars and understates the price by
// about a third. en-US formats CAD with the country prefix, which is the only
// difference between the two calls.
//
// Same underlying cents either way — packagePriceCents() is the single source,
// and it comes from the function the checkout charges with.
export function packagePrice(): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: CURRENCY.toUpperCase(),
  }).format(packagePriceCents() / 100)
}

export function featuredPackage(): TourPackage {
  // Non-null by assertPackagesValid() below, which runs at module load.
  return packages.find((p) => p.featured)!
}

export function otherPackages(): TourPackage[] {
  return packages.filter((p) => !p.featured)
}

// The timeline shown when nothing has been toggled: the one written for the
// advertised length, else the longest — the card preview, the JSON-LD and the
// detail page's first paint all read this so they cannot disagree.
export function defaultItinerary(pkg: TourPackage): ItineraryVariant {
  return (
    pkg.itineraries.find((v) => v.hours === PACKAGE_HOURS) ??
    pkg.itineraries[pkg.itineraries.length - 1]
  )
}

export function getPackage(slug: string): TourPackage | undefined {
  return packages.find((p) => p.slug === slug)
}

// The href that carries a chosen package into the booking flow. /guide reads
// ?package= and pre-fills the note with it, so the guide sees which experience
// was booked without the bookings table needing a new column.
export function bookHref(pkg: TourPackage): string {
  return `/guide?package=${pkg.slug}`
}

// The line dropped into the booking note. Kept here so the card, the detail
// page and /guide cannot drift apart on the wording. No hour count on
// purpose: the tourist picks the length (2 or 3 hours) on the booking form,
// and a "3 hours" here would contradict a 2-hour booking.
export function bookingNoteFor(pkg: TourPackage): string {
  return `Package: ${pkg.title} (${pkg.cn}).`
}

// ---------------------------------------------------------------------------
// Invariants
// ---------------------------------------------------------------------------

function fail(slug: string, problem: string): never {
  throw new Error(`packages: "${slug}" ${problem}`)
}

export function assertPackagesValid(
  all: readonly TourPackage[] = packages,
): void {
  if (PACKAGE_HOURS < MIN_BOOKING_HOURS) {
    throw new Error(
      `packages: PACKAGE_HOURS is ${PACKAGE_HOURS} but the booking engine will not sell a day shorter than ${MIN_BOOKING_HOURS} hours, so every package on the site would fail at checkout`,
    )
  }

  const seen = new Set<string>()
  let featured = 0

  for (const pkg of all) {
    const { slug } = pkg

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      fail(slug, 'is not a valid kebab-case slug')
    }
    if (seen.has(slug)) fail(slug, 'has a duplicate slug')
    seen.add(slug)

    if (pkg.featured) featured++

    if (pkg.itineraries.length === 0) fail(slug, 'has no itinerary')
    const hoursSeen = new Set<number>()
    for (const variant of pkg.itineraries) {
      const label = `${variant.hours}-hour itinerary`
      if (!Number.isInteger(variant.hours) || variant.hours <= 0) {
        fail(slug, `has an itinerary for ${variant.hours} hours, which is not a length`)
      }
      if (hoursSeen.has(variant.hours)) fail(slug, `has two ${label}s`)
      hoursSeen.add(variant.hours)
      // Two timelines with no names are "the short one and the long one" —
      // the toggle needs something to put under itself.
      if (pkg.itineraries.length > 1 && !variant.title?.trim()) {
        fail(slug, `${label} has no title; every variant of a multi-length package needs one`)
      }

      // A timeline with one beat is a paragraph pretending to be an
      // itinerary, and a traveller deciding where hours of their trip go
      // deserves to see how those hours are actually spent.
      if (variant.beats.length < 4) {
        fail(slug, `${label} has only ${variant.beats.length} beats; an itinerary needs at least 4`)
      }
      for (const beat of variant.beats) {
        if (!/^\d{1,2}:\d{2}$/.test(beat.at)) {
          fail(slug, `${label} has a beat timed "${beat.at}"; use elapsed time like "1:20"`)
        }
      }
      // Beats must run forward, or the timeline reads as nonsense.
      const minutes = variant.beats.map((b) => {
        const [h, m] = b.at.split(':').map(Number)
        return h * 60 + m
      })
      for (let i = 1; i < minutes.length; i++) {
        if (minutes[i] <= minutes[i - 1]) {
          fail(slug, `${label} has beats out of order at "${variant.beats[i].at}"`)
        }
      }
      // The last beat may sit exactly on the hour ("2:00 — Tour ends") but
      // not past the length the timeline claims to fill.
      if (minutes[minutes.length - 1] > variant.hours * 60) {
        fail(
          slug,
          `${label} has a final beat at ${variant.beats[variant.beats.length - 1].at}, which is past its ${variant.hours} hours`,
        )
      }
    }
    // Shortest first is what the toggle renders, left to right.
    for (let i = 1; i < pkg.itineraries.length; i++) {
      if (pkg.itineraries[i].hours < pkg.itineraries[i - 1].hours) {
        fail(slug, 'lists its itineraries longest-first; order them shortest-first')
      }
    }

    // Every photo is served from /public, so the path is checkable by shape
    // even though the file itself is not readable from here.
    if (!pkg.photo.startsWith('/gallery/') || !pkg.photo.endsWith('.webp')) {
      fail(slug, `points at "${pkg.photo}"; package photos come from the /public/gallery library`)
    }
    if (!pkg.alt.trim()) fail(slug, 'has an empty alt text')

    // "What you are not paying for" is the line that stops a few hours' walk
    // being mistaken for an all-inclusive tour, so it is required, not
    // optional. Same for the things that are included.
    if (pkg.includes.length === 0) fail(slug, 'lists nothing under includes')
    if (pkg.notIncluded.length === 0) {
      fail(slug, 'lists nothing under notIncluded — every package has to say what it is not')
    }
    if (pkg.goodFor.length === 0) fail(slug, 'lists nobody under goodFor')
  }

  if (featured !== 1) {
    throw new Error(
      `packages: exactly one package must be featured, found ${featured}`,
    )
  }
}

assertPackagesValid()
