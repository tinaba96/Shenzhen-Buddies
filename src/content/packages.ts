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
    title: 'Dongmen Laojie',
    cn: '东门老街',
    kicker: 'Food & night market',
    tagline: "Where Shenzhen's past meets its vibrant nightlife.",
    summary:
      "Dongmen Laojie is where old Shenzhen meets modern city life. Wander through lively streets filled with local snacks, hidden shops, and nonstop energy while discovering one of Shenzhen's oldest and most famous neighborhoods. Join to experience the authentic side of the city, taste local favorites, and explore Dongmen like a local.",
    hoursRange: [2, 3],
    photo: '/gallery/dongmen-pagoda-street-night.webp',
    alt: 'The Dongmen pedestrian street at night, pagoda-roofed buildings lit above the crowd',
    district: 'Luohu',
    bestStart: 'Early evening — the grills come out around 17:00',
    meetingPoint: 'Laojie station, on the Dongmen pedestrian street side',
    itineraryTitle: 'Dongmen Street Food & Night Market Walk',
    itinerarySubtitle:
      'Experience old Shenzhen after dark — street food, hidden lanes, local culture, and the energy of Dongmen Laojie',
    itineraries: [
      {
        hours: 2,
        title: "The Night Market Essentials",
        beats: [
          {
            at: '0:00',
            title: "Welcome to Old Shenzhen",
            body: "Meet your local guide and discover the district that existed long before Shenzhen's skyscrapers. Get a quick introduction before heading into the pedestrian streets.",
          },
          {
            at: '0:20',
            title: "Explore the Main Street",
            body: "Walk through the lively heart of Dongmen, surrounded by shops, traditional-style buildings, neon lights, and the energy that makes this one of Shenzhen's most famous districts.",
          },
          {
            at: '0:50',
            title: "Street Food Discovery",
            body: "Browse the food streets and learn about local favorites. Feel free to stop and buy snacks that catch your eye, from grilled skewers to sweet treats and local specialties.",
          },
          {
            at: '1:20',
            title: "Hidden Lanes & Local Life",
            body: "Step away from the busiest streets and explore smaller alleys filled with local shops, old market culture, and unexpected finds.",
          },
          {
            at: '1:45',
            title: "Night Views & Photos",
            body: "Finish with a relaxed walk through the brightest parts of Dongmen, taking photos and enjoying the atmosphere before the tour ends.",
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
            body: "Meet your local guide and hear the story of Shenzhen's oldest commercial district before beginning the walk.",
          },
          {
            at: '0:20',
            title: "The Main Pedestrian Street",
            body: "Explore the busiest part of Dongmen, packed with shops, street performers, local life, and classic Shenzhen energy.",
          },
          {
            at: '0:50',
            title: "Street Food Adventure",
            body: "Discover food streets filled with local snacks and desserts. Buy and try anything that looks interesting at your own pace.",
          },
          {
            at: '1:30',
            title: "Hidden Corners & Shopping Streets",
            body: "Wander through side streets, local markets, and lesser-known areas that many visitors miss. Great for people-watching and photos.",
          },
          {
            at: '2:00',
            title: "Optional Arcade Stop",
            body: "If you'd like, we can visit a local arcade to try claw machines, rhythm games, racing games, or other popular favorites. Game credits are optional and paid directly by you.",
          },
          {
            at: '2:30',
            title: "Night Lights & Photo Walk",
            body: "Enjoy the evening atmosphere, neon signs, traditional-style architecture, and some of the best photo spots in Dongmen.",
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
      "📸 Anyone looking to experience Shenzhen after dark",
    ],
    insiderTipLead: "Dongmen is best enjoyed slowly.",
    insiderTip:
      "Save room for later stops, because some of the most popular snacks and dessert stalls are hidden deeper inside the neighborhood. The fun isn't just eating—it's wandering, discovering, and seeing where the night takes you.",
    accent: 'ember',
  },
  {
    slug: 'skyline-after-dark',
    title: 'Futian Skyline After Dark',
    cn: '福田CBD',
    kicker: 'Views & city lights',
    tagline:
      'Futuristic skylines, glowing landmarks, and night shows light up the city after dark.',
    hoursRange: [2, 3],
    summary:
      "Futian is the modern heart of Shenzhen. As the sun goes down, the business district transforms into a landscape of glowing towers, giant LED displays, public art, and busy city streets.\n\nSee Shenzhen after dark through illuminated skyscrapers, futuristic architecture, lively plazas, and the city's most famous skyline views.",
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
            body: "Meet near Civic Center or Shenzhen Library. Quick introduction and overview of the route before heading into the city lights.",
          },
          {
            at: '0:20',
            title: "The skyline walk begins",
            body: "Walk through Shenzhen's modern downtown, passing some of the city's most recognizable skyscrapers, plazas, and public spaces.",
          },
          {
            at: '0:50',
            title: "Best photo spots",
            body: "Stop at some of Futian's most photogenic locations for skyline views, architecture shots, and evening city-light photos.",
          },
          {
            at: '1:20',
            title: "The heart of Shenzhen",
            body: "Walk along the city's central axis while learning how Shenzhen grew from a small fishing village into one of the world's fastest-growing cities.",
          },
          {
            at: '1:40',
            title: "City lights and local stories",
            body: "Explore the streets after dark, see giant LED displays and modern architecture, and hear stories about life in Shenzhen today.",
          },
          {
            at: '2:00',
            title: "Tour ends",
            body: "Finish in the heart of Futian CBD with recommendations for dinner, shopping, nightlife, or places to continue exploring on your own.",
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
            body: "Meet near Civic Center or Shenzhen Library. Quick introduction and overview of the route before heading into the city lights.",
          },
          {
            at: '0:20',
            title: "The skyline walk begins",
            body: "Walk through Shenzhen's modern downtown, passing some of the city's most recognizable skyscrapers, plazas, and public spaces.",
          },
          {
            at: '0:50',
            title: "Best photo spots",
            body: "Stop at some of Futian's most photogenic locations for skyline views, architecture shots, and evening city-light photos.",
          },
          {
            at: '1:20',
            title: "The heart of Shenzhen",
            body: "Walk along the city's central axis while learning how Shenzhen grew from a small fishing village into one of the world's fastest-growing cities.",
          },
          {
            at: '1:50',
            title: "Toward Coco Park",
            body: "Leave the business district behind and walk toward Coco Park, one of Shenzhen's most popular evening destinations.",
          },
          {
            at: '2:10',
            title: "Coco Park at night",
            body: "Explore the outdoor streets, cafés, restaurants, bars, and lively atmosphere. Plenty of opportunities for photos and people-watching.",
          },
          {
            at: '2:40',
            title: "A relaxed finish",
            body: "Optional stop for a coffee, dessert, drink, or snack if you'd like to buy something. Otherwise, enjoy the atmosphere and local recommendations before the tour ends.",
          },
          {
            at: '3:00',
            title: "Tour ends",
            body: "Finish at Coco Park, with plenty of options to continue your evening in Shenzhen.",
          },
        ],
      },
    ],
    includes: [
      "2–3 hours one-on-one with a local guide",
      "Walking route through Futian CBD's best night views",
      "Local insights about Shenzhen and its development",
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
      'The best part of Futian happens after sunset. Buildings, plazas, and public spaces come alive with lights, making the evening far more impressive than the daytime view.',
    accent: 'violet',
  },
  {
    slug: 'talent-park-night',
    title: 'Shenzhen Talent Park',
    cn: '人才公园',
    kicker: 'Night walk & skyline',
    tagline:
      'A stroll into the future, with stunning night views of Shenzhen’s entrepreneurial skyline.',
    summary:
      "Talent Park is where Shenzhen slows down for a moment. Lakes, waterfront paths, skyline views, and some of the city's best sunset spots come together in one easy walk. This experience is less about rushing between attractions and more about enjoying the views, taking photos, and seeing how nature and one of China's most futuristic skylines share the same space.",
    photo: '/gallery/talent-park-skyline-night.webp',
    alt: 'The Nanshan skyline at night across the lake in Shenzhen Talent Park, with a footbridge lit bright blue along the water',
    district: 'Nanshan',
    bestStart:
      'Late afternoon — about an hour and a half before sunset, so the walk ends with the sunset and the lights coming on',
    meetingPoint: 'Talent Park — the exact entrance is sent the day before',
    itineraryTitle: 'Shenzhen Night Skyline Walk at Talent Park',
    itinerarySubtitle:
      "Explore one of Shenzhen's most vibrant waterfront destinations, where nature, innovation, and culture come together. Enjoy scenic walking trails, stunning city views, and inspiring spaces that celebrate the city's entrepreneurial spirit and talent.",
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
            body: "Meet your local guide and get a quick introduction to Shenzhen, Nanshan, and the skyline you'll be seeing throughout the walk.",
          },
          {
            at: '0:20',
            title: 'The Lake & Skyline Walk',
            body: 'Take an easy stroll around the lakeside paths while enjoying views of the Houhai skyline, Shenzhen Bay, and the famous Spring Bamboo tower.',
          },
          {
            at: '0:50',
            title: 'Starlight Bridge',
            body: "Visit one of the park's most iconic landmarks and take photos overlooking the lake and city skyline. The bridge becomes especially beautiful as the lights begin to appear.",
          },
          {
            at: '1:15',
            title: 'Hidden Corners & Local Stories',
            body: "Explore quieter parts of the park while learning how Shenzhen grew from a small fishing town into one of the world's leading technology hubs.",
          },
          {
            at: '1:40',
            title: 'Sunset & Photo Stop',
            body: "Relax by the waterfront and enjoy one of Shenzhen's best sunset views. Plenty of time for photos, skyline shots, and simply taking in the atmosphere.",
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
      "Local stories about Shenzhen's growth and innovation",
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
      '🌏 Visitors who want to understand Shenzhen beyond shopping malls',
      '❤️ Couples, friends, solo travelers, and families',
    ],
    insiderTip:
      'Come around sunset if possible. Talent Park is beautiful during the day, but the real magic happens when the skyline lights up, reflections appear on the lake, and the city transitions from daylight to night.',
    accent: 'jade',
  },
  {
    slug: 'shekou-sea-world',
    title: 'Shekou Sea World',
    cn: '海上世界',
    kicker: 'Waterfront & evening walk',
    tagline:
      "A relaxed evening walk through Shekou's waterfront, city lights, and local landmarks.",
    summary:
      "Sea World is where Shenzhen slows down and enjoys the waterfront. Walk past the iconic Minghua ship, explore lively plazas, enjoy sea views, and experience the lights, fountains, and atmosphere that make Shekou one of the city's favorite evening destinations. A relaxed walk filled with great views, local stories, and photo opportunities.",
    photo: '/gallery/sea-world-minghua-ship-night.webp',
    alt: 'The white Minghua ship lit up at night above the Sea World plaza in Shekou, with palm trees and people strolling in front',
    district: 'Nanshan / Shekou',
    hours: 2,
    bestStart: 'Afternoon or evening',
    meetingPoint: 'Sea World station, Exit A',
    itineraryTitle: 'Sea World After Dark',
    itinerarySubtitle:
      "Waterfront lights, sea breezes, and one of Shenzhen's most beautiful nights.",
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
            body: "Explore the famous Minghua ship and the heart of Sea World Plaza while learning how this area became one of Shenzhen's most unique landmarks.",
          },
          {
            at: '0:50',
            title: "Waterfront Walk",
            body: "Stroll along the waterfront promenade, enjoy sea views, public art, and some of the best photo spots in Shekou.",
          },
          {
            at: '1:20',
            title: "Lights & Fountains",
            body: "Watch the plaza come alive after dark with illuminated buildings, fountain displays, and a lively atmosphere.",
          },
          {
            at: '1:50',
            title: "The Best of Sea World",
            body: "Take final photos, explore hidden corners of the plaza, and get recommendations for food, drinks, and places to continue your evening.",
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
      "2 hours one-on-one with a local",
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
      "🚶 Easy-going explorers",
      "💑 Couples, friends, and solo travelers",
    ],
    insiderTip:
      'The magic starts after sunset. Sea World feels completely different once the lights come on and the waterfront begins to glow.',
    accent: 'coral',
  },
  {
    slug: 'shenzhen-bay-cycling',
    title: 'Shenzhen Bay Coastal Ride',
    cn: '深圳湾公园',
    kicker: '🚴 Cycling & waterfront',
    tagline:
      "Sea breeze, skyline views, and the city's favorite waterfront cycling route.",
    summary:
      'Shenzhen Bay is where the city opens up to the sea. Ride along dedicated coastal cycling paths, enjoy views of the Shenzhen skyline and Hong Kong across the water, pass waterfront parks and mangroves, and discover why this is one of the most popular outdoor experiences in Shenzhen. The route is flat, beginner-friendly, and perfect for photos.',
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
            body: "Meet near Shenzhen Bay Park Station. Get your bike ready and receive a quick introduction to the route.",
          },
          {
            at: '0:15',
            title: "Coastal Ride Begins",
            body: "Cycle along the waterfront greenway with sea views, palm trees, and dedicated cycling lanes.",
          },
          {
            at: '0:45',
            title: "Skyline Photo Stop",
            body: "Stop at one of the best viewpoints overlooking Shenzhen Bay, the skyline, and Hong Kong across the water.",
          },
          {
            at: '1:10',
            title: "Waterfront Parks & Mangroves",
            body: "Continue riding past scenic sections of the coastline while learning about Shenzhen Bay and the surrounding area.",
          },
          {
            at: '1:40',
            title: "The Best Bay Views",
            body: "Relax, take photos, enjoy the sea breeze, and explore one of the most beautiful stretches of the route.",
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
            body: "Meet near Shenzhen Bay Park Station and prepare for a longer coastal ride.",
          },
          {
            at: '0:15',
            title: "The Bay Route",
            body: "Ride along Shenzhen's famous waterfront cycling path with uninterrupted sea views.",
          },
          {
            at: '0:50',
            title: "Skyline & Photo Stops",
            body: "Stop at several scenic viewpoints for photos of the bay, skyline, and Shenzhen Bay Bridge.",
          },
          {
            at: '1:20',
            title: "Talent Park Area",
            body: "Ride through the waterfront areas around Talent Park and enjoy some of Shenzhen's best city-meets-nature views.",
          },
          {
            at: '1:50',
            title: "Coastal Highlights",
            body: "Continue along the coastline, passing public art, waterfront promenades, and popular local recreation areas.",
          },
          {
            at: '2:30',
            title: "Sunset & Sea Views",
            body: "Enjoy the most scenic section of the route and take final photos before heading back.",
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
      "2–3 hours one-on-one with a local",
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
      "🌍 Travelers wanting to see a different side of Shenzhen",
    ],
    insiderTip:
      "Shenzhen Bay is much longer than most visitors expect. The best experience isn't rushing from point to point—it's riding at a relaxed pace, stopping for photos, enjoying the sea breeze, and taking in the changing views along the waterfront. The route is mostly flat and beginner-friendly, making it enjoyable even if you don't cycle often.",
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
