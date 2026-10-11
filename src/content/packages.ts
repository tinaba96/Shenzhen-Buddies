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
// package is about, because illustrating a tour with a picture of somewhere
// else is the stock-photo problem wearing a disguise.
// See the provenance note at the top of src/app/explore/page.tsx.

import {
  amountCentsForHours,
  CURRENCY,
  GUEST_REQUESTS,
  MAX_BOOKING_HOURS,
  MIN_BOOKING_HOURS,
} from '@/lib/booking'

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

// The tour length a card or detail page advertises for a package: its
// `hoursRange` as "{a}–{b} hours" when it has one, else its fixed `hours`
// or PACKAGE_HOURS as
// "{n} hours". `common` is the dictionary's common block for the locale.
export function packageHoursLabel(
  pkg: Pick<TourPackage, 'hoursRange' | 'hours'>,
  common: { hours: string; hoursRange: string },
): string {
  if (pkg.hoursRange) {
    const [min, max] = pkg.hoursRange
    return common.hoursRange
      .replace('{a}', String(min))
      .replace('{b}', String(max))
  }
  return common.hours.replace('{n}', String(pkg.hours ?? PACKAGE_HOURS))
}

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
  // Empty for a closing "Tour ends" beat that needs no description.
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
  // One line under that heading, when the package has one.
  itinerarySubtitle?: string
  // Replaces the dictionary's generic note under the itinerary heading
  // ("Times are elapsed from your meeting point…"), when the package has its
  // own wording for it.
  itineraryNote?: string
  // The lengths advertised on cards and the detail page ("2–3 hours"), for a
  // package sold at more than one length. Absent, they advertise
  // PACKAGE_HOURS. Both ends must be lengths the booking engine sells.
  hoursRange?: readonly [min: number, max: number]
  // A package sold at one length only ("2 hours"), for a tour that is only
  // ever run at that length. Advertised instead of PACKAGE_HOURS, and the
  // booking form offers just this length when the tourist arrives from the
  // package. Must be a length the booking engine sells, and must have an
  // itinerary written for it.
  hours?: number
  // Shortest first. More than one and the detail page shows a length toggle.
  itineraries: ItineraryVariant[]
  includes: string[]
  notIncluded: string[]
  goodFor: string[]
  // Optional bold opener for the tip ("Dongmen is best enjoyed slowly."),
  // rendered inline before insiderTip.
  insiderTipLead?: string
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
      'Huaqiangbei is thousands of shops selling everything from smart gadgets to robots, drones and electronic parts, packed into building after building. It is crowded, loud and a lot to take in on your own. You don’t need to be into tech to enjoy it. Most people just want to see it once, and it helps to have someone who knows which floors to bother with.',
    hoursRange: [2, 3],
    photo: '/gallery/huaqiangbei-electronic-world-night.webp',
    alt: 'The lit entrance of Huaqiang Electronic World at night, above the Huaqiangbei metro entrance',
    district: 'Futian',
    bestStart: 'Early afternoon — the market fills by 14:00 and buildings start closing at 18:30',
    meetingPoint:
      'Huaqiangbei metro station (Lines 2 and 7) — your buddy sends the exact exit the night before',
    itineraryTitle:
      "A walk through the world's largest electronics market",
    itineraries: [
      {
        hours: 2,
        title: 'The highlights',
        beats: [
          {
            at: '0:00',
            title: 'Meet your buddy',
            body: "Meet your buddy and get the short version of how a fishing village became one of the world's big technology cities in a few decades.",
          },
          {
            at: '0:20',
            title: 'Gadget hunting',
            body: "Start in one of the easier Huaqiangbei malls for visitors: AI gadgets, smart devices, robots, drones and odd inventions from Chinese startups.",
          },
          {
            at: '0:50',
            title: "Where things get made",
            body: 'Hear how products get designed, prototyped and sourced here before they turn up in shops around the world.',
          },
          {
            at: '1:15',
            title: 'Try things out',
            body: 'Pick things up, compare them, and find out which ones are actually new and which are just good marketing.',
          },
          {
            at: '1:40',
            title: 'The pedestrian street',
            body: "Walk the main pedestrian street and take photos of the screens and the crowds.",
          },
          {
            at: '2:00',
            title: 'Tour ends',
            body: "Get your buddy's picks for food, nightlife and where to go next in Shenzhen.",
          },
        ],
      },
      {
        hours: 3,
        title: 'The highlights, plus the hidden floors',
        beats: [
          {
            at: '0:00',
            title: "Meet your buddy",
            body: 'A quick introduction to Shenzhen and Huaqiangbei, and why people who love tech come here from all over the world.',
          },
          {
            at: '0:20',
            title: "Into the malls",
            body: 'Work through the giant electronics malls: gadgets, drones, wearables and parts from every step of the supply chain.',
          },
          {
            at: '1:00',
            title: 'The gadget challenge',
            body: 'A small game: find the strangest, most futuristic or most surprisingly useful gadget in the market. Good for photos, and for conversation.',
          },
          {
            at: '1:30',
            title: 'Drink break',
            body: 'Sit down with a coffee, a milk tea or something local, and talk about Shenzhen life, startups, tech and travel tips.',
          },
          {
            at: '1:50',
            title: 'The floors most people miss',
            body: 'Go to the parts most tourists never find, and see how a product gets from idea to factory to shops around the world.',
          },
          {
            at: '2:30',
            title: 'Photos on the street',
            body: 'Take photos under the giant LED screens and along the busy pedestrian streets of Huaqiangbei.',
          },
          {
            at: '3:00',
            title: 'Tour ends',
            body: 'You leave with a list of restaurants, sights and neighborhoods to try next, picked for you.',
          },
        ],
      },
    ],
    includes: [
      '2–3 hours with a Shenzhen local, no group',
      'Real-time English–Mandarin translation in the mall and at the counter — prices, specs, bench tests',
      'Negotiating a better price when there is something you want to buy',
      'Digital payment checked before you need to buy anything',
      "Your buddy's take on the culture, the business and the food",
    ],
    notIncluded: [
      "Anything you buy in the mall — you pay stalls directly, we don't profit from it",
      'Food, drinks and metro fare',
      'Courier and shipping charges',
    ],
    goodFor: [
      '🏙️ First-time visitors to Shenzhen',
      '🤖 Technology enthusiasts',
      "🔍 Anyone who wants to see the world's largest electronics market",
      '🚀 Startup founders, makers & hardware engineers',
      '🎥 Anyone who has watched a Huaqiangbei video and thought: "I want to see this place for myself."',
    ],
    insiderTip:
      "Set up Alipay or WeChat Pay before you arrive in China. Most sellers in Huaqiangbei would rather you scan a QR code than anything else. And if you see something you want, buy it then. Prices and stock change quickly, and it may not be there when you come back.",
    accent: 'signal',
    featured: true,
  },
  {
    slug: 'dongmen-street-food',
    title: 'Dongmen Laojie',
    cn: '东门老街',
    kicker: 'Food & night market',
    tagline: "The old downtown, after the grills come out.",
    summary:
      "Dongmen Laojie is the old downtown, one of the oldest and best-known neighborhoods in Shenzhen. It's a tangle of busy pedestrian streets full of snack stalls, small shops and noise. Come hungry, eat what looks good, and walk it with someone who knows their way around.",
    hoursRange: [2, 3],
    photo: '/gallery/dongmen-pagoda-street-night.webp',
    alt: 'The Dongmen pedestrian street at night, pagoda-roofed buildings lit above the crowd',
    district: 'Luohu',
    bestStart: 'Early evening — the grills come out around 17:00',
    meetingPoint: 'Laojie station, on the Dongmen pedestrian street side',
    itineraryTitle: 'Dongmen Street Food & Night Market Walk',
    itinerarySubtitle:
      'Old Shenzhen after dark: street food, side lanes, and Dongmen Laojie at its busiest',
    itineraries: [
      {
        hours: 2,
        title: "The Night Market Essentials",
        beats: [
          {
            at: '0:00',
            title: "Welcome to Old Shenzhen",
            body: "Meet your buddy and hear about the part of town that was here long before Shenzhen's skyscrapers. A quick introduction, then into the pedestrian streets.",
          },
          {
            at: '0:20',
            title: "The Main Street",
            body: "Walk the middle of Dongmen: shops, traditional-style buildings, neon, and a lot of people. This is the part everyone in Shenzhen knows.",
          },
          {
            at: '0:50',
            title: "Street Food",
            body: "Work through the food streets and hear what locals actually eat. Stop and buy whatever catches your eye: grilled skewers, sweets, local specialties.",
          },
          {
            at: '1:20',
            title: "Side Lanes & Local Life",
            body: "Step off the busy streets into the smaller alleys: local shops, the old market trades, and things you didn't expect.",
          },
          {
            at: '1:45',
            title: "Lights & Photos",
            body: "An easy last loop through the brightest part of Dongmen, stopping for photos on the way.",
          },
          {
            at: '2:00',
            title: "Tour Ends",
            body: "",
          },
        ],
      },
      {
        hours: 3,
        title: "The Full Evening, with an Optional Arcade Stop",
        beats: [
          {
            at: '0:00',
            title: "Welcome to Dongmen",
            body: "Meet your buddy and hear how Shenzhen's oldest commercial district got started, then set off.",
          },
          {
            at: '0:20',
            title: "The Main Pedestrian Street",
            body: "The busiest part of Dongmen: shops, street performers and crowds.",
          },
          {
            at: '0:50',
            title: "Street Food",
            body: "The food streets, full of local snacks and desserts. Buy and try whatever looks good, at your own pace.",
          },
          {
            at: '1:30',
            title: "Side Streets & Markets",
            body: "Wander the side streets and local markets that a lot of visitors miss. Good for people-watching and photos.",
          },
          {
            at: '2:00',
            title: "Optional Arcade Stop",
            body: "If you're up for it, we stop at a local arcade for claw machines, rhythm games or racing games. Game credits are optional, and you pay for them yourself.",
          },
          {
            at: '2:30',
            title: "Night Lights & Photo Walk",
            body: "Neon signs, lit-up traditional rooflines, and some of the best photo spots in Dongmen.",
          },
          {
            at: '3:00',
            title: "Tour Ends",
            body: "",
          },
        ],
      },
    ],
    includes: [
      "2–3 hours exploring Dongmen with a local guide",
      "Local recommendations on what to try, see, and photograph",
      "Help ordering food and translating when needed",
      "A flexible route based on your interests, pace, and appetite",
      "Stories about Dongmen, old Shenzhen, and local life",
    ],
    notIncluded: [
      "Food and drinks (you buy only what you'd like to try)",
      "Metro, taxi, or transportation costs",
      "Arcade games or other optional activities",
    ],
    goodFor: [
      "🏙️ First-time visitors to Shenzhen",
      "🍢 Street food lovers",
      "🌏 Travelers who don't speak Mandarin",
      "🚶 People who enjoy walking and exploring local neighborhoods",
      "📸 Anyone who wants to see Shenzhen after dark",
    ],
    insiderTipLead: "Dongmen is best enjoyed slowly.",
    insiderTip:
      "Save room. Some of the most popular snack and dessert stalls are further in, away from the main street. Half the fun is just wandering and seeing where you end up.",
    accent: 'ember',
  },
  {
    slug: 'skyline-after-dark',
    title: 'Futian Skyline After Dark',
    cn: '福田CBD',
    kicker: 'Views & city lights',
    tagline:
      'The business district after dark, when the towers light up.',
    hoursRange: [2, 3],
    summary:
      "Futian is Shenzhen's business district, and it looks best at night. Once the sun goes down the towers light up, the giant LED screens come on, and the streets and plazas fill with people.\n\nThis walk takes you through it after dark: the lit-up skyscrapers, the public art, and the skyline views the city is known for.",
    photo: '/gallery/futian-cbd-street-night.webp',
    alt: 'A Futian CBD street at night, towers and a mall facade lit red and blue above a glass skybridge',
    district: 'Futian',
    bestStart: 'Night time after dark, around 7 p.m.',
    meetingPoint:
      'Civic Center station or Shenzhen Library — your guide will let you know the exact meeting point',
    itineraries: [
      {
        hours: 2,
        title: '2-Hour Futian CBD Walk',
        beats: [
          {
            at: '0:00',
            title: "Meet in Futian CBD",
            body: "Meet near Civic Center or Shenzhen Library. A quick introduction and a look at the route, then out into the lights.",
          },
          {
            at: '0:20',
            title: "The skyline walk begins",
            body: "Walk through the new downtown, past some of the best-known towers, plazas and public spaces in the city.",
          },
          {
            at: '0:50',
            title: "Best photo spots",
            body: "Stop at the best places in Futian for skyline views, architecture shots and night photos.",
          },
          {
            at: '1:20',
            title: "The heart of Shenzhen",
            body: "Walk the city's central axis and hear how Shenzhen went from a small fishing village to one of the fastest-growing cities in the world.",
          },
          {
            at: '1:40',
            title: "City lights and local stories",
            body: "Back into the streets for the giant LED screens and the lit-up buildings, and stories about what life in Shenzhen is like now.",
          },
          {
            at: '2:00',
            title: "Tour ends",
            body: "You finish in the middle of Futian CBD, with ideas for dinner, shopping, bars, or where to go next on your own.",
          },
        ],
      },
      {
        hours: 3,
        title: '3-Hour Futian CBD + Coco Park Walk',
        beats: [
          {
            at: '0:00',
            title: "Meet in Futian CBD",
            body: "Meet near Civic Center or Shenzhen Library. A quick introduction and a look at the route, then out into the lights.",
          },
          {
            at: '0:20',
            title: "The skyline walk begins",
            body: "Walk through the new downtown, past some of the best-known towers, plazas and public spaces in the city.",
          },
          {
            at: '0:50',
            title: "Best photo spots",
            body: "Stop at the best places in Futian for skyline views, architecture shots and night photos.",
          },
          {
            at: '1:20',
            title: "The heart of Shenzhen",
            body: "Walk the city's central axis and hear how Shenzhen went from a small fishing village to one of the fastest-growing cities in the world.",
          },
          {
            at: '1:50',
            title: "Toward Coco Park",
            body: "Leave the business district and walk over to Coco Park, where a lot of Shenzhen goes in the evening.",
          },
          {
            at: '2:10',
            title: "Coco Park at night",
            body: "Outdoor streets, cafés, restaurants and bars. Plenty to photograph, and good people-watching.",
          },
          {
            at: '2:40',
            title: "A relaxed finish",
            body: "Stop for a coffee, a dessert, a drink or a snack if you want one. If not, just hang around and get some recommendations before the tour ends.",
          },
          {
            at: '3:00',
            title: "Tour ends",
            body: "You finish at Coco Park, with plenty of places to carry on the evening.",
          },
        ],
      },
    ],
    includes: [
      "2–3 hours with a local guide, no group",
      "Walking route through Futian CBD's best night views",
      "Local stories about how Shenzhen grew",
      "Photo stops at major landmarks",
      "Help with directions, transportation, and local recommendations",
    ],
    notIncluded: [
      "Food and drinks",
      "Personal shopping expenses",
      "Metro fare",
      "Any optional attractions you choose to enter",
    ],
    goodFor: [
      "🏙️ First-time visitors to Shenzhen",
      "📸 Travelers looking for great night photos",
      "🌃 People who love city skylines and architecture",
      "🚶 Visitors who enjoy easy urban walks",
      "✨ Anyone curious about modern Shenzhen",
    ],
    insiderTip:
      'Futian is at its best after sunset. The buildings, plazas and public spaces light up, and it looks far better than it does in the daytime.',
    accent: 'violet',
  },
  {
    slug: 'talent-park-night',
    title: 'Shenzhen Talent Park',
    cn: '人才公园',
    kicker: 'Night walk & skyline',
    tagline:
      'A lakeside walk with the Nanshan skyline lighting up across the water.',
    summary:
      "Talent Park is one of the calmer places in Shenzhen: lakes, waterfront paths, skyline views and some of the city's best sunset spots, all on one easy walk. There's no rushing between sights. It's mostly walking, looking and taking photos, with the park on one side of the water and the towers on the other.",
    photo: '/gallery/talent-park-skyline-night.webp',
    alt: 'The Nanshan skyline at night across the lake in Shenzhen Talent Park, with a footbridge lit bright blue along the water',
    district: 'Nanshan',
    bestStart:
      'Late afternoon — about an hour and a half before sunset, so the walk ends with the sunset and the lights coming on',
    meetingPoint: 'Talent Park — the exact entrance is sent the day before',
    itineraryTitle: 'Shenzhen Night Skyline Walk at Talent Park',
    itinerarySubtitle:
      "A waterfront park the city built to celebrate its entrepreneurs and talent, with easy walking paths and big views of the skyline.",
    itineraryNote:
      'Times are measured from our meeting point. The route may vary slightly depending on weather, crowds, and sunset time.',
    hours: 2,
    itineraries: [
      {
        hours: 2,
        beats: [
          {
            at: '0:00',
            title: 'Meet at Talent Park',
            body: "Meet your buddy and get a quick introduction to Shenzhen, Nanshan, and the skyline you'll be looking at for the rest of the walk.",
          },
          {
            at: '0:20',
            title: 'The Lake & Skyline Walk',
            body: 'An easy walk on the lakeside paths, looking out at the Houhai skyline, Shenzhen Bay and the Spring Bamboo tower.',
          },
          {
            at: '0:50',
            title: 'Starlight Bridge',
            body: "The park's best-known landmark. Take photos over the lake and the skyline; it looks best just as the lights start coming on.",
          },
          {
            at: '1:15',
            title: 'Quieter Corners & Local Stories',
            body: "Walk the quieter parts of the park and hear how Shenzhen grew from a small fishing town into one of the world's big technology hubs.",
          },
          {
            at: '1:40',
            title: 'Sunset & Photo Stop',
            body: "Sit by the water for one of the best sunset views in Shenzhen. Plenty of time for photos, or for just watching.",
          },
          {
            at: '2:00',
            title: 'Tour Ends',
            body: '',
          },
        ],
      },
    ],
    includes: [
      '2 hours exploring Talent Park with a local',
      'Easy-paced lakeside and waterfront walk',
      "Local stories about how Shenzhen grew",
      'Recommendations for nearby food, cafés, and places to visit after the tour',
      "Help taking photos if you'd like some skyline shots",
    ],
    notIncluded: [
      'Food and drinks',
      'Metro, taxi, or transportation costs',
      'Any optional purchases you choose to make',
    ],
    goodFor: [
      '🏙️ First-time visitors to Shenzhen',
      '📸 Photography lovers',
      '🌅 People who enjoy sunsets and skyline views',
      '🚶 Travelers looking for a relaxed walk',
      '🌏 Visitors who want to see more of Shenzhen than its shopping malls',
      '❤️ Couples, friends, solo travelers, and families',
    ],
    insiderTip:
      'Come around sunset if you can. Talent Park is nice in the daytime, but it is better when the skyline lights up, the towers reflect in the lake, and day turns into night.',
    accent: 'jade',
  },
  {
    slug: 'shekou-sea-world',
    title: 'Shekou Sea World',
    cn: '海上世界',
    kicker: 'Waterfront & evening walk',
    tagline:
      "An easy evening walk along the Shekou waterfront.",
    summary:
      "Sea World is Shekou's waterfront, and one of the places Shenzhen goes in the evening. Walk past the Minghua ship, through the plazas and along the sea, with the lights and fountains on. It's an easy walk, with good views, local stories and plenty to photograph.",
    photo: '/gallery/sea-world-minghua-ship-night.webp',
    alt: 'The white Minghua ship lit up at night above the Sea World plaza in Shekou, with palm trees and people strolling in front',
    district: 'Nanshan / Shekou',
    hours: 2,
    bestStart: 'Afternoon or evening',
    meetingPoint: 'Sea World station, Exit A',
    itineraryTitle: 'Sea World After Dark',
    itinerarySubtitle:
      "Lights on the water and a sea breeze.",
    itineraries: [
      {
        hours: 2,
        beats: [
          {
            at: '0:00',
            title: "Meet at Sea World",
            body: "Meet outside Sea World Station and get a quick introduction to Shekou and the evening ahead.",
          },
          {
            at: '0:20',
            title: "The Minghua Ship",
            body: "See the Minghua ship and the middle of Sea World Plaza, and hear how this spot became one of Shenzhen's best-known landmarks.",
          },
          {
            at: '0:50',
            title: "Waterfront Walk",
            body: "Walk the promenade by the water: sea views, public art, and some of the best photo spots in Shekou.",
          },
          {
            at: '1:20',
            title: "Lights & Fountains",
            body: "After dark the buildings light up, the fountains come on, and the plaza gets busy.",
          },
          {
            at: '1:50',
            title: "Last Look",
            body: "Last photos, a few corners of the plaza people miss, and ideas for where to eat, drink or carry on the evening.",
          },
          {
            at: '2:00',
            title: "Tour Ends",
            body: "Finish at Sea World Plaza.",
          },
        ],
      },
    ],
    includes: [
      "2 hours with a local, no group",
      "Stories about Sea World, Shekou, and Shenzhen",
      "Guided waterfront walk",
      "Best photo spots and viewpoints",
      "Local recommendations for food and nightlife",
    ],
    notIncluded: [
      "Food and drinks",
      "Metro or transportation costs",
      "Personal purchases",
    ],
    goodFor: [
      "🌊 First-time visitors to Shenzhen",
      "📸 Photography lovers",
      "🌃 Travelers who enjoy night views",
      "🚶 Anyone who likes an easy walk",
      "💑 Couples, friends, and solo travelers",
    ],
    insiderTip:
      'Go after sunset. Sea World is a different place once the lights come on along the water.',
    accent: 'coral',
  },
  {
    slug: 'shenzhen-bay-cycling',
    title: 'Shenzhen Bay Coastal Ride',
    cn: '深圳湾公园',
    kicker: '🚴 Cycling & waterfront',
    tagline:
      "A flat ride along the bay, with Hong Kong across the water.",
    summary:
      'Shenzhen Bay is where the city meets the sea. You ride the coastal bike paths with the Shenzhen skyline on one side and Hong Kong across the water, past waterfront parks and mangroves. It is one of the most popular things to do outdoors in Shenzhen. The route is flat, easy for beginners, and good for photos.',
    hoursRange: [2, 3],
    photo: '/gallery/shenzhen-bay-railing-day.webp',
    alt: 'The Shenzhen Bay waterfront promenade on a clear day, a wooden railing running along green water with hills across the bay',
    district: 'Nanshan',
    bestStart: 'Early afternoon',
    meetingPoint: 'Your guide will let you know after booking',
    itineraries: [
      {
        hours: 2,
        title: '2-Hour Itinerary',
        beats: [
          {
            at: '0:00',
            title: "Meet at Shenzhen Bay Park",
            body: "Meet near Shenzhen Bay Park Station, sort out your bike, and get a quick rundown of the route.",
          },
          {
            at: '0:15',
            title: "Coastal Ride Begins",
            body: "Ride the waterfront greenway: sea views, palm trees and proper bike lanes.",
          },
          {
            at: '0:45',
            title: "Skyline Photo Stop",
            body: "Stop at one of the best viewpoints overlooking Shenzhen Bay, the skyline, and Hong Kong across the water.",
          },
          {
            at: '1:10',
            title: "Waterfront Parks & Mangroves",
            body: "Keep riding along the coast and hear about Shenzhen Bay and the area around it.",
          },
          {
            at: '1:40',
            title: "The Best Bay Views",
            body: "Take a break, take photos, and enjoy the sea breeze on one of the best stretches of the route.",
          },
          {
            at: '2:00',
            title: "Tour Ends",
            body: "Finish near Shenzhen Bay Park.",
          },
        ],
      },
      {
        hours: 3,
        title: '3-Hour Itinerary',
        beats: [
          {
            at: '0:00',
            title: "Meet at Shenzhen Bay Park",
            body: "Meet near Shenzhen Bay Park Station and get set up for a longer ride.",
          },
          {
            at: '0:15',
            title: "The Bay Route",
            body: "Ride Shenzhen's best-known waterfront bike path, with open sea views.",
          },
          {
            at: '0:50',
            title: "Skyline & Photo Stops",
            body: "Stop at several scenic viewpoints for photos of the bay, skyline, and Shenzhen Bay Bridge.",
          },
          {
            at: '1:20',
            title: "Talent Park Area",
            body: "Ride through the waterfront around Talent Park, with parkland on one side and towers on the other.",
          },
          {
            at: '1:50',
            title: "Coastal Highlights",
            body: "Carry on along the coast, past public art, promenades, and the spots where locals come to exercise and unwind.",
          },
          {
            at: '2:30',
            title: "Sunset & Sea Views",
            body: "The prettiest stretch of the ride, and a last chance for photos before heading back.",
          },
          {
            at: '3:00',
            title: "Tour Ends",
            body: "Finish near Shenzhen Bay Park.",
          },
        ],
      },
    ],
    includes: [
      "2–3 hours with a local, no group",
      "Guided cycling route",
      "Local stories and recommendations",
      "Best viewpoints and photo spots",
      "Help with bike rental if needed",
    ],
    notIncluded: [
      "Bike rental fee",
      "Food and drinks",
      "Metro fare",
      "Personal purchases",
    ],
    goodFor: [
      "🌊 First-time visitors to Shenzhen",
      "🚴 Casual cyclists",
      "📸 Photography lovers",
      "🌇 Sunset seekers",
      "🌍 Travelers who want an outdoor afternoon in Shenzhen",
    ],
    insiderTip:
      "Shenzhen Bay is a lot longer than most visitors expect, so don't try to cover all of it. Ride slowly, stop for photos, and enjoy the breeze and the changing views. It's mostly flat and easy for beginners, so it's fine even if you don't cycle much.",
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
    pkg.itineraries.find((v) => v.hours === (pkg.hours ?? PACKAGE_HOURS)) ??
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
  // While guest requests are on, the no-account form comes first.
  return GUEST_REQUESTS
    ? `/book?package=${pkg.slug}`
    : `/guide?package=${pkg.slug}`
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

    if (pkg.hoursRange) {
      const [min, max] = pkg.hoursRange
      if (!Number.isInteger(min) || !Number.isInteger(max) || min >= max) {
        fail(slug, `advertises ${min}–${max} hours, which is not a range`)
      }
      if (min < MIN_BOOKING_HOURS) {
        fail(slug, `advertises ${min}-hour tours but the booking engine will not sell one shorter than ${MIN_BOOKING_HOURS} hours`)
      }
    }

    if (pkg.hours !== undefined) {
      if (pkg.hoursRange) {
        fail(slug, 'sets both a fixed length and a range; pick one')
      }
      if (
        !Number.isInteger(pkg.hours) ||
        pkg.hours < MIN_BOOKING_HOURS ||
        pkg.hours > MAX_BOOKING_HOURS
      ) {
        fail(slug, `is sold at ${pkg.hours} hours, which the booking engine does not sell`)
      }
      if (!pkg.itineraries.some((v) => v.hours === pkg.hours)) {
        fail(slug, `is sold at ${pkg.hours} hours but has no itinerary for that length`)
      }
    }

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
