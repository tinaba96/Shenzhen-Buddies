// The four-hour, one-on-one experiences the site sells. Same typed-module
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

// Every package is exactly four hours. That is not an arbitrary round number:
// MIN_BOOKING_HOURS is the shortest day the booking engine will sell, so a
// four-hour package is the entry point a visitor can actually check out with.
export const PACKAGE_HOURS = 4

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
  itinerary: ItineraryBeat[]
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
      "The world's densest electronics market, walked with someone who actually buys here.",
    summary:
      "Huaqiangbei is forty city blocks of components, modules, drones, second-hand phones and board-level repair, stacked floor on floor. On your own it is an overwhelming wall of Chinese-language signage and stalls that quote you a tourist number. With a local next to you it is a shopping trip: they read the stall, ask the real price, and tell you when the thing in your hand is a rebrand of something you can get one floor down for a third of the money.",
    photo: '/gallery/maker-desk-dev-boards.webp',
    alt: 'Single-board computers, modules and jumper wires spread across a workbench',
    district: 'Futian',
    bestStart: 'Late morning — most stalls are properly open by 11:00',
    meetingPoint:
      'Huaqiangbei metro station — your buddy sends the exact exit the night before',
    itinerary: [
      {
        at: '0:00',
        title: 'Ground rules on the pedestrian street',
        body: "Ten minutes above ground before we go in: how a stall works, what a realistic price looks like, why the same part has four prices in one building, and getting Alipay or WeChat Pay working on your phone if it isn't already. Almost nothing here takes a foreign card at the counter.",
      },
      {
        at: '0:30',
        title: 'SEG Plaza — the component floors',
        body: 'Passives, connectors, dev boards, sensors, tools. This is the floor where you find out that the part you have been paying eleven dollars for online is sold here by the reel. We talk minimum order quantities and what a stall will and will not break open for one person.',
      },
      {
        at: '1:20',
        title: 'Huaqiang Electronic World — modules & finished gear',
        body: 'Drones, LED, audio boards, batteries, cameras, cables in every flavour. Your buddy asks for a bench test before money moves, which is normal here and almost never offered to a foreigner who cannot ask for it.',
      },
      {
        at: '2:10',
        title: 'Mingtong Digital City — the phone floors',
        body: 'Second-hand and refurbished handsets, screens, batteries and the grading language the trade uses. What an honest refurb looks like, what to check before you pay, and why the cheapest listing in the building is cheap.',
      },
      {
        at: '2:50',
        title: 'Repair alley',
        body: 'Counter after counter of board-level repair under microscopes — chips lifted off logic boards with hot air in ninety seconds. Worth standing and watching even if you came to buy nothing at all.',
      },
      {
        at: '3:20',
        title: 'Ship it, then sit down',
        body: 'A courier counter for anything too heavy or too battery-shaped to fly with, then a cold drink while your buddy writes out the stalls worth going back to — building, floor, and what they are actually good for.',
      },
    ],
    includes: [
      'Four hours one-on-one with a Shenzhen local, no group',
      'Live Mandarin translation while you shop and while you ask for a test',
      'Bargaining done for you, in the room, at local prices',
      'Alipay / WeChat Pay set up on your phone if you need it',
      'A written shortlist of stalls at the end — building, floor, what they are good for',
    ],
    notIncluded: [
      'Anything you buy — you pay stalls directly, we never take a cut',
      'Food, drinks and metro fare',
      'Courier and shipping charges',
    ],
    goodFor: [
      'Hardware engineers',
      'Makers & hobbyists',
      'Product founders sourcing a first run',
      'Repair shops',
      'Anyone who has watched a Huaqiangbei video and wanted to go',
    ],
    insiderTip:
      'Link a card to Alipay or WeChat Pay before you fly. Stall counters take a QR code, not plastic, and "I will come back with cash" is how a good price disappears.',
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
    photo: '/gallery/night-market-skewers-stall.webp',
    alt: 'A Shenzhen night market stall laid with trays of skewers under strip lighting',
    district: 'Luohu',
    bestStart: 'Early evening — the grills come out around 17:00',
    meetingPoint: 'Laojie station, on the Dongmen pedestrian street side',
    itinerary: [
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
    includes: [
      'Four hours one-on-one with a local who eats here',
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
      "Shenzhen built itself upward in forty years and the skyline is the argument. This one is timed rather than routed: we start climbing while it is still light, hit the viewpoint as the towers switch on, then drop into the CBD at street level where the buildings themselves are the screen. It is the four hours people come back with photographs from.",
    photo: '/gallery/skyline-blue-towers-night.webp',
    alt: 'Shenzhen towers lit blue at night, seen from street level',
    district: 'Futian',
    bestStart: 'Mid-afternoon — we time the climb to the sunset',
    meetingPoint: 'Lianhuashan Park, east gate',
    itinerary: [
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
    includes: [
      'Four hours one-on-one, timed to that day’s sunset',
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
    title: 'First Four Hours from Hong Kong',
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
    itinerary: [
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
    includes: [
      'Four hours one-on-one from the moment you clear immigration',
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
    itinerary: [
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
    includes: [
      'Four hours one-on-one at a table you would not have found',
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
      'Shenzhen at seven in the morning is a completely different city from the one in the photographs — canteen trays, rice rolls off the steamer, tea drunk standing up, and a wet market doing the day’s serious business before most visitors are awake. This is the quietest and most ordinary four hours we sell, and it is the one people say they remember.',
    photo: '/gallery/canteen-tray-lunch.webp',
    alt: 'A canteen tray of rice, greens and braised dishes on a steel counter',
    district: 'Luohu',
    bestStart: 'Early — 07:00 or 08:00, and yes, that is the point',
    meetingPoint: 'Your hotel lobby if you are central, or the nearest metro exit',
    itinerary: [
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
    includes: [
      'Four hours one-on-one starting at a civilised local hour',
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
// page and /guide cannot drift apart on the wording.
export function bookingNoteFor(pkg: TourPackage): string {
  return `Package: ${pkg.title} (${pkg.cn}) — ${PACKAGE_HOURS} hours.`
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

    // A package with one beat is a paragraph pretending to be an itinerary,
    // and a traveller deciding where four hours of their trip goes deserves
    // to see how those hours are actually spent.
    if (pkg.itinerary.length < 4) {
      fail(slug, `has only ${pkg.itinerary.length} itinerary beats; four hours needs at least 4`)
    }
    for (const beat of pkg.itinerary) {
      if (!/^\d{1,2}:\d{2}$/.test(beat.at)) {
        fail(slug, `has an itinerary beat timed "${beat.at}"; use elapsed time like "1:20"`)
      }
    }
    // Beats must run forward, or the timeline reads as nonsense.
    const minutes = pkg.itinerary.map((b) => {
      const [h, m] = b.at.split(':').map(Number)
      return h * 60 + m
    })
    for (let i = 1; i < minutes.length; i++) {
      if (minutes[i] <= minutes[i - 1]) {
        fail(slug, `has itinerary beats out of order at "${pkg.itinerary[i].at}"`)
      }
    }
    // The last beat has to leave time to happen inside the four hours sold.
    if (minutes[minutes.length - 1] >= PACKAGE_HOURS * 60) {
      fail(
        slug,
        `has a final beat at ${pkg.itinerary[pkg.itinerary.length - 1].at}, which is outside the ${PACKAGE_HOURS} hours being sold`,
      )
    }

    // Every photo is served from /public, so the path is checkable by shape
    // even though the file itself is not readable from here.
    if (!pkg.photo.startsWith('/gallery/') || !pkg.photo.endsWith('.webp')) {
      fail(slug, `points at "${pkg.photo}"; package photos come from the /public/gallery library`)
    }
    if (!pkg.alt.trim()) fail(slug, 'has an empty alt text')

    // "What you are not paying for" is the line that stops a four-hour walk
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
