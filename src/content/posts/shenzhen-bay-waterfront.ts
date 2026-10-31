import type { Post } from './types'

// SOURCING NOTE — the discipline this post is written to.
//
// A 'neighborhoods' post on the Nanshan waterfront: Shenzhen Bay Park, Talent
// Park and the Houhai towers, and Sea World in Shekou. The claims are the
// kind that hold — what each place is, how it was made, how it feels at the
// hour we go — not shop names, prices or opening hours.
//
//   - Shenzhen Bay Park: opened August 2011, about 13 km of coast from the
//     Futian mangrove reserve to the Shenzhen Bay Bridge, free, separate
//     paths for walking and cycling. Length is quoted as "about thirteen
//     kilometres" because sources range from 11 to 15 depending on what they
//     count. The mangrove section is older (2000).
//   - The Shenzhen Bay Bridge is the road crossing to Hong Kong (the Western
//     Corridor, opened 2007); the hills behind it are the New Territories.
//   - Black-faced spoonbills and other migratory birds winter in the bay,
//     roughly November to March, best seen at the mangrove end. Stated as a
//     season, not a date.
//   - Low-tide clam digging on the mudflats is founder experience (August and
//     October 2026); the mudflat frame was cropped above the people on it.
//   - Talent Park opened in 2017 on reclaimed land; the blue-lit footbridge is
//     in the owner-written Talent Park package and in the gallery frame.
//   - China Resources Headquarters: 392.5 m, completed 2018, nicknamed the
//     Spring Bamboo (春笋). Shenzhen Bay Sports Center: the white mesh arena
//     built for the 2011 Universiade. Both are in the hero frame.
//   - The Minghua: built in France in 1962 as the Ancerville, bought by China
//     in 1973 and renamed, moored at Shekou since 1983. Land was reclaimed
//     around her in the 1990s, which is why she now sits inland in a pond.
//     Sources checked 2026-10-31 (Wikipedia; Shenzhen Daily / EyeShenzhen).
//   - Metro: Shenzhen Bay Park station is on Line 9; Sea World on Lines 2
//     and 12 (Exit A, as in the Sea World package). Talent Park is reached
//     from Houhai station, so the post says "Houhai", not a line number.
//   - The 24-hour self-service beer tower on the Sea World plaza and the
//     grilled eggplant dinner are founder experience (February 2026). The
//     restaurant is not named.
//
// Prices are absent. Payment setup is linked, not restated.
//
// Every image is from src/content/gallery.ts: the founder's own frames, no
// stock. Two frames were cropped to exclude people (see gallery notes).

export const shenzhenBayWaterfront: Post = {
  slug: 'shenzhen-bay-waterfront',
  title: 'Shenzhen Bay: where the city stops',
  excerpt:
    'Thirteen kilometres of waterfront with Hong Kong on the far side, and a liner in Shekou that has not been to sea since 1983. How we do the west coast.',
  pillar: 'neighborhoods',
  tags: ['shenzhen-bay', 'shekou', 'nanshan', 'skyline', 'cycling', 'first-visit'],
  publishedAt: '2026-10-31',
  author: 'bryan',
  heroGalleryId: 'shenzhen-bay-houhai-dusk',
  relatedSlugs: ['shenzhen-after-dark', 'futian-new-downtown'],
  seo: {
    title: 'Shenzhen Bay, Talent Park and Sea World: the waterfront at dusk',
  },
  body: [
    {
      k: 'p',
      text: 'Most of Shenzhen is inland. The towers go on for an hour on the metro in either direction and you can forget there is a coast at all. In Nanshan the towers run out at a railing, and Hong Kong is on the other side of the water.',
    },
    {
      k: 'p',
      text: 'This is the stretch we take people to when they have seen enough glass. Shenzhen Bay Park at one end, Sea World in Shekou at the other, and Talent Park with the Houhai towers in between. All of it is on the same shore, and you can do it in an afternoon that ends after dark, on foot or on a bike.',
    },

    { k: 'h2', text: 'The bay' },
    {
      k: 'p',
      text: 'Shenzhen Bay Park is about thirteen kilometres of waterfront, opened in 2011, free, with one path for walking and another for bikes. It runs from the mangrove reserve on the Futian side to the bridge at the far west end. That bridge is the road to Hong Kong, and the hills behind it are the New Territories. On a clear day you can count the apartment towers of Tin Shui Wai. Nothing marks the border on the water, so most people do not realise they are looking at one.',
    },
    {
      k: 'img',
      galleryId: 'shenzhen-bay-bridge-hongkong',
      caption:
        'Low tide, looking west towards the bridge. Everything beyond it is Hong Kong.',
    },
    {
      k: 'p',
      text: 'The bay is shallow, and the tide changes it completely. When it is out, the mud goes a long way, and families come down the rocks with buckets to dig for clams. When it is in, the water comes up to the wall and the whole skyline is reflected in it. In winter, roughly November to March, the bay fills with migratory birds, including the black-faced spoonbill, which is rare enough that people fly in to see it. The mangrove end is where they feed. The rest of the year it is egrets, and a lot of people flying kites.',
    },
    {
      k: 'p',
      text: 'The park is long and flat, which is why we ride it. The bike path is separate from the walking path, so nobody has to dodge anybody, and the bikes are sorted out at the start. On weekends and public holidays the park closes to shared bikes during the day, so the ride is a weekday plan. [The bay ride](/tours/shenzhen-bay-cycling) covers the best stretch of it in two or three hours.',
    },

    { k: 'h2', text: 'Talent Park and the Houhai towers' },
    {
      k: 'p',
      text: 'Halfway along, the park turns inland around a lake. This is Talent Park, opened in 2017 on reclaimed land and named, in earnest, after the city’s talent, which here mostly means engineers. Across the lake is the Houhai skyline, which is the one on the cover of this post. The tapered tower is the China Resources headquarters, 392 metres, finished in 2018. Everyone here calls it the Spring Bamboo. The white mesh dome beside it, the Spring Cocoon, is the Shenzhen Bay Sports Center, built for the student games in 2011.',
    },
    {
      k: 'img',
      galleryId: 'talent-park-skyline-night',
      caption:
        'Talent Park from the lake side, a few minutes after the towers came on.',
    },
    {
      k: 'p',
      text: 'The park is at its best in the last hour of light. The towers come on one by one and the footbridge turns blue. If there is no wind, the lake reflects all of it. On holiday nights there is sometimes a drone show over the bay. We do not plan around it, because the dates are announced only days ahead and the viewing spots book out within the hour. [The Talent Park walk](/tours/talent-park-night) is timed to end with the lights.',
    },

    { k: 'h2', text: 'Sea World' },
    {
      k: 'p',
      text: 'Keep going west and the towers thin out. This is Shekou, the old port, and the part of the city where the foreigners have always lived. In the middle of it is a white ocean liner, sitting in a pond. The ship is the Minghua. She was built in France in 1962, bought by China in 1973, and moored here in 1983, where she became a hotel. Then the city reclaimed the land around her, and she has been a few hundred metres inland ever since. There is still a hotel on board, and restaurants. Nobody has been to sea on her in forty years.',
    },
    {
      k: 'img',
      galleryId: 'sea-world-minghua-ship-day',
      caption:
        'The Minghua in daylight. The land around her was all water when she arrived.',
    },
    {
      k: 'p',
      text: 'The plaza around her is Sea World, which is where Shekou goes in the evening. The fountains come on after dark and the restaurants put their tables out on the square. There is more English on the menus here than anywhere else in Shenzhen. Our favourite thing on the plaza is a round kiosk with a saucer roof that sells beer from taps, with no staff. You scan a code, pour your own glass, and the tap charges you for what you poured. It is open all night. [Sea World after dark](/tours/shekou-sea-world) starts at the metro exit and ends on the plaza.',
    },
    {
      k: 'img',
      galleryId: 'sea-world-beer-tower',
      caption:
        'The beer tower on the plaza, before the evening crowd.',
    },
    {
      k: 'cta',
      label: 'Walk the waterfront with someone who lives here',
      sub: 'A local buddy knows where the tide will be and where to eat once the lights are on.',
    },

    { k: 'h2', text: 'Dinner in Shekou' },
    {
      k: 'img',
      galleryId: 'shekou-grilled-eggplant',
      caption:
        'Grilled eggplant on an iron tray, which keeps it hot longer than you need.',
    },
    {
      k: 'p',
      text: 'Shekou eats late and outdoors. The streets behind the plaza are full of grills, and the thing to order at any of them is the eggplant. It is split down the middle, grilled until it collapses, and covered in minced garlic and spring onion. One tray feeds two people. Order skewers with it, or whatever the next table has, and walk back to the water afterwards. What else to eat in this city, and how to order it, is in [our food guide](/blog/what-shenzhen-actually-eats).',
    },

    { k: 'h2', text: 'Go at the right hour' },
    {
      k: 'p',
      text: 'Start at the Futian end of the bay in the middle of the afternoon, when the light is flat and the path is empty. Ride or walk west and be at Talent Park an hour before sunset. Stay for the lights. Then take Line 2 six stops west to Sea World for the fountains and dinner. Doing it the other way round means walking the bay in the dark, which is pleasant but wastes the view. The rest of the night is in [our after-dark guide](/blog/shenzhen-after-dark).',
    },
    {
      k: 'ul',
      items: [
        'Shenzhen Bay Park has its own metro station on Line 9. Use the exit on the park side of Binhai Boulevard and you are at the water in a few minutes. Talent Park is a short walk from Houhai station. Sea World has its own station too, on Lines 2 and 12, and Exit A puts you almost on the plaza.',
        'Everything from the bikes to the beer tower is paid by phone. Do the setup in [our border-crossing guide](/blog/shenzhen-from-hong-kong-day-trip) before you come down to the water.',
        'Check the haze before you commit. If you cannot see the hills across the bay from the Futian end, Hong Kong will not appear later either. Save the day for Dongmen and come back when the air is clear.',
      ],
    },
    {
      k: 'callout',
      tone: 'tip',
      title: 'If you only have one evening',
      text: 'Skip the bay ride and go straight to Talent Park an hour before sunset. Wait for the lights, then take the metro to Sea World for dinner. You miss the ride and the mudflats, which is a fair trade for one night.',
    },
    {
      k: 'p',
      text: 'Most visitors never come down here. People who live in Shenzhen spend their Sundays on it. Give it an afternoon.',
    },
    {
      k: 'cta',
      label: 'Book a waterfront evening',
      sub: 'Talent Park at sunset or Sea World after dark, with a buddy who has done it at the right hour before.',
    },
  ],
  faq: [
    {
      q: 'What is Shenzhen Bay Park?',
      a: 'A free coastal park in Nanshan, about thirteen kilometres long, that runs from the Futian mangrove reserve to the Shenzhen Bay Bridge. It opened in 2011 and has separate paths for walking and cycling. Hong Kong is across the water.',
    },
    {
      q: 'Can you see Hong Kong from Shenzhen Bay?',
      a: 'Yes. The hills across the water are the New Territories, and on a clear day the apartment towers of Tin Shui Wai are visible. The bridge at the west end of the park is the road crossing to Hong Kong. Haze hides all of it, so check the air before you go.',
    },
    {
      q: 'What is the ship at Sea World?',
      a: 'The Minghua, a liner built in France in 1962 as the Ancerville. China bought her in 1973 and moored her at Shekou in 1983, where she became a hotel. The land around her was reclaimed later, so she now sits in a pond in the middle of the Sea World plaza, with a hotel and restaurants on board.',
    },
    {
      q: 'How do I get to Sea World in Shenzhen?',
      a: 'Take the metro to Sea World station on Line 2 or Line 12 and leave by Exit A, a short walk from the plaza. Shenzhen Bay Park has its own station on Line 9, and Talent Park is a short walk from Houhai station.',
    },
    {
      q: 'When is the best time to visit Shenzhen Bay?',
      a: 'Late afternoon into evening, so you reach Talent Park an hour before sunset and Sea World after dark. For the migratory birds, including the black-faced spoonbill, come between November and March and go to the mangrove end of the park.',
    },
  ],
}
