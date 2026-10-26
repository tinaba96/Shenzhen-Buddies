import type { Post } from './types'

// SOURCING NOTE — the discipline this post is written to.
//
// A 'neighborhoods' post, so the claims are the kind that hold: what Futian
// is, how it was laid out, and how it feels to walk — not shop names, prices
// or opening hours.
//
//   - The CBD was master-planned in the 1990s around a north–south central
//     axis (Lianhuashan Park, Civic Center, Shenzhen Library and Concert Hall,
//     the convention centre) — stable, documented planning history, and the
//     reason the district looks the way it does.
//   - Ping An Finance Centre "roughly six hundred metres", "tallest in the
//     city since 2017" — completed 2017 at 599 m, widely documented. The paid
//     observation deck is mentioned without a price or a floor number.
//   - Lianhuashan: a public park, free, with the Deng Xiaoping statue (bronze,
//     unveiled 2000) on the summit plaza and the kite lawn lower on the hill —
//     the post says "the big lawn on the hill", not "at the summit"; the walk
//     up is "twenty minutes" as in the after-dark post, which owns the
//     skyline-view claim. Deng is credited with the 1980 special economic
//     zone, not with any tower: he died in 1997, before the CBD was built.
//   - The city museum in the Civic Center's east wing is free to enter (state
//     museums are) but foreigners are asked for a passport, so the post says
//     so; stated without opening hours.
//   - THE LIGHT SHOW IS THE ONE DECAYING FACT HERE. As of October 2026 the
//     Futian light show runs Friday and Saturday nights and public holidays
//     (plus the evening before), three shows an evening, 19:30/20:30/21:30
//     April–October and 19:00/20:00/21:00 November–March, free; the Civic
//     Center square needs a booking via a Chinese mini-program, Lianhuashan
//     does not. It was paused 30 April – 1 October 2026 for maintenance.
//     (Sources checked 2026-10-24: sz.bendibao.com schedule page updated
//     2026-10-17; 163.com on the maintenance pause.) The post states the
//     pattern, dates it, and tells the reader to confirm — it does not print
//     a timetable. Update the "as of" when the pattern changes.
//   - Huaqiangbei's metro station (Lines 2 and 7) and the buildings closing
//     "around half past six" come from the owner-written Huaqiangbei package;
//     the post and the tour card describe the same afternoon.
//   - The hot pot dinner and the Lunar New Year God of Wealth are founder
//     experience (February 2026, Futian) — the photo is from that table.
//
// Prices are absent. Payment setup is linked, not restated — the
// border-crossing post carries the lastChecked date for that.
//
// Every image is from src/content/gallery.ts: the founder's own frames, no
// stock. The Caitian Road frame is placed by the road sign in the photo
// (彩田路 / 福中路 / 深南大道东), not by memory; the towers in it are
// deliberately not named, because they could not be verified from the frame.

export const futianNewDowntown: Post = {
  slug: 'futian-new-downtown',
  title: 'Futian: the Shenzhen that was planned',
  excerpt:
    'Shenzhen’s downtown was planned in the nineties and built to the plan. The plan is one straight line, and it is best walked at dusk.',
  pillar: 'neighborhoods',
  tags: ['futian', 'skyline', 'huaqiangbei', 'first-visit'],
  publishedAt: '2026-10-24',
  author: 'bryan',
  heroGalleryId: 'futian-cbd-street-night',
  relatedSlugs: ['shenzhen-after-dark', 'dongmen-old-downtown'],
  seo: {
    title: 'Futian, Shenzhen: the planned downtown, walked at dusk',
  },
  body: [
    {
      k: 'p',
      text: 'Dongmen grew. Futian is the opposite. It was drawn on paper first, in the nineties. There is a straight line ruled down the middle of the plan, with a hill at one end and a civic building with a roof like a pair of wings partway down. The tallest tower in the city stands off to one side of it. Then they built it, more or less to the drawing. The high-speed trains from Hong Kong pull in here, underground. A good part of the city’s business gets done here. After dark, it is the part of Shenzhen that looks like the pictures.',
    },
    {
      k: 'p',
      text: 'By day it is a working district. Lanyards, delivery scooters, lobbies with turnstiles and a security guard at each one. Nobody comes here for charm. But every first visit passes through it, and at dusk it is worth the evening. It is also free.',
    },

    { k: 'h2', text: 'What Futian actually is' },
    {
      k: 'p',
      text: 'The district is big. It runs from the Hong Kong border up past Huaqiangbei, but when people say Futian they usually mean the CBD in the middle of it, the part with the towers. Shennan Boulevard, the avenue the whole city is strung along, runs east to west through it. The central axis runs north to south, and that is the walk. Lianhuashan Park sits on its hill at the top. Below it come the library and the concert hall, then the Civic Center, then the square and the lawns, which slope down to the convention centre at the bottom. The Ping An Finance Centre stands just east of the line, roughly six hundred metres of it. It has been the tallest building in the city since 2017, and everybody gives directions by it.',
    },
    {
      k: 'p',
      text: 'The distances are bigger than they look. The blocks are long, and a mall that seems to be across the road turns out to be ten minutes and two underpasses away. The metro station called Civic Center puts you in the middle of it. From there, follow the axis rather than the roads.',
    },

    { k: 'h2', text: 'Walk the line, top to bottom' },
    {
      k: 'img',
      galleryId: 'futian-caitian-towers-night',
      caption:
        'The Caitian Road junction from Shennan Boulevard, on an ordinary Tuesday night.',
    },
    {
      k: 'p',
      text: 'Start at the top. Lianhuashan is a park on a low hill. It is free, the path up is paved, and the walk takes about twenty minutes. From the top you can see the whole axis at once. The big lawn on the hill is the city’s kite ground; on a weekend evening there are dozens up. The bronze at the top is Deng Xiaoping, mid-stride. He made Shenzhen a special economic zone in 1980, which is why there is a city here at all. Go up while there is still light and watch it go. Come down the south side once the skyline is lit, or on a show night, after the first show.',
    },
    {
      k: 'p',
      text: 'From there it is all downhill. Past the library and the concert hall to the Civic Center, the building with the wings. The city museum is in its east wing. It is free, you will need your passport, and it is worth an hour if you want the history of the place laid out in order. The big square is on the far side of the building, facing the boulevard, and across the boulevard the lawns run all the way down to the convention centre, past the public art and the LED facades the district is known for. [Our skyline evening](/tours/skyline-after-dark) walks the lower half of this line after dark.',
    },
    {
      k: 'p',
      text: 'People always ask about the light show. On show nights the towers across the district light up in time with each other, with the Civic Center in the middle of it, and it is free. As of October 2026 the pattern is Friday and Saturday nights plus public holidays, three short shows an evening from about half past seven, earlier in winter. Watching from the square itself needs a booking through a Chinese mini-program; watching from the hill does not, and the hill is the better seat anyway. It was switched off from May to the start of October this year for maintenance. Check the schedule the week you are here, and do not plan a flight around it.',
    },

    { k: 'h2', text: 'Huaqiangbei, two stops east' },
    {
      k: 'img',
      galleryId: 'huaqiangbei-electronic-world-night',
      caption:
        'Huaqiang Electronic World, which is also the metro entrance. The night-market signs are already lit along the bottom.',
    },
    {
      k: 'p',
      text: 'Huaqiangbei is in Futian too, two metro stops from the CBD, and it has none of this. No axis, no lawns. Block after block of electronics markets, stacked floors deep, the biggest of their kind anywhere. Components by the drawer, phones by the crate, drones, soldering stations, floor after floor of it. You do not have to care about electronics to go. Two hours is enough if someone shows you which floors to bother with, which is what [the Huaqiangbei walk](/tours/huaqiangbei-electronics) is for. It also finishes earlier than you would think. The buildings start shutting around half past six, and after that it is street stalls around the metro entrance.',
    },
    {
      k: 'cta',
      label: 'See Futian with someone who works here',
      sub: 'A local buddy walks the axis with you as the lights come on, and knows where to eat after.',
    },

    { k: 'h2', text: 'Then hot pot. Always.' },
    {
      k: 'img',
      galleryId: 'hotpot-split-broth-table',
      caption:
        'The split pot: clear broth on one side, the red one on the other. The trays were full ten minutes before this.',
    },
    {
      k: 'p',
      text: 'Dinner in Futian happens in a mall. That is normal here: the restaurants in this city live on the upper floors of the shopping centres, and the ones around the CBD are where the office crowd actually eats. The meal we keep coming back to after the walk is hot pot. A split pot sits in the middle of the table, clear broth on one side for the sensible and the red Sichuan one on the other, and you cook trays of sliced beef, mushrooms and greens yourself, a few seconds at a time. Order the half-and-half pot and say yes to the sesame sauce. Do not plan anything afterwards. We ate this one over Lunar New Year, when half the city had gone home and a man dressed as the God of Wealth was going round the mall with a basket of red envelopes. What else to eat here, and how, is in [our food guide](/blog/what-shenzhen-actually-eats).',
    },

    { k: 'h2', text: 'Go at the right hour' },
    {
      k: 'p',
      text: 'Futian in daylight is offices, heat and long blocks, and it does nothing for you before five. Be on the hill an hour before sunset, around six in summer and nearer five in winter. After that it is simple. The towers come on, and you walk down to dinner. If you have the whole day, do Huaqiangbei first and leave it by five, so you are on the hill before the light goes. The rest of the night, the late tables and the last train, is in [our after-dark guide](/blog/shenzhen-after-dark).',
    },
    {
      k: 'ul',
      items: [
        'Arrive by metro. Civic Center station sits under the axis, and Huaqiangbei has its own station nearby. The high-speed trains from Hong Kong stop at Futian station, also under the CBD, which makes this the easiest part of the city to reach by rail from West Kowloon.',
        'Everything here is phone-paid, down to the smallest kiosk. Do the setup in [our border-crossing guide](/blog/shenzhen-from-hong-kong-day-trip) before you arrive — on wifi, in daylight.',
        'Haze matters as much as the schedule does. If the top of the Ping An tower is in cloud at four in the afternoon, go to Dongmen instead and try again tomorrow.',
      ],
    },
    {
      k: 'callout',
      tone: 'tip',
      title: 'Make it the first evening',
      text: 'The train from Hong Kong arrives in Futian, so it makes sense as the first night of a trip. Off the train, up the hill before sunset, dinner under the towers. Then the skyline is done and you do not have to fit it in later.',
    },
    {
      k: 'p',
      text: 'Most visitors only cross Futian in daylight, on the way to somewhere else. Give it one evening.',
    },
    {
      k: 'cta',
      label: 'Book the Futian skyline walk',
      sub: 'Two or three hours in the CBD after dark, with a buddy who knows the route and when to start.',
    },
  ],
  faq: [
    {
      q: 'What is Futian in Shenzhen?',
      a: 'The central district of Shenzhen and its business centre. The CBD in the middle of it was planned in the 1990s around a north–south axis, with Lianhuashan Park, the library and concert hall, the Civic Center and the convention centre along the line, and the Ping An Finance Centre, the tallest building in the city, just beside it. Huaqiangbei, the electronics market district, is also in Futian.',
    },
    {
      q: 'When is the best time to visit Futian?',
      a: 'Dusk into evening. Go up Lianhuashan an hour before sunset and walk the central axis once the towers are lit. There is not much reason to be here in daylight unless you work here.',
    },
    {
      q: 'When is the Futian light show?',
      a: 'As of October 2026: Friday and Saturday nights and public holidays, three short shows an evening starting around half past seven, earlier in winter. It is free. The Civic Center square needs a booking through a Chinese mini-program; Lianhuashan does not. The schedule changes, and the show was paused from May to early October 2026 for maintenance, so confirm locally the week you visit.',
    },
    {
      q: 'How tall is the Ping An Finance Centre, and can you go up it?',
      a: 'About 599 metres, completed in 2017 and the tallest building in Shenzhen. There is a paid observation deck near the top. It is worth it on a clear night and not worth it in haze.',
    },
    {
      q: 'Is Huaqiangbei in Futian?',
      a: 'Yes. The electronics markets are a couple of metro stops from the business district, with their own station. The buildings start closing around half past six, so go in the afternoon and leave the business district for after dark.',
    },
  ],
}
