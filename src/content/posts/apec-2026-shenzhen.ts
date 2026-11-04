import type { Post } from './types'

// SOURCING NOTE — the discipline this post is written to.
//
// A 'logistics' post about the APEC 2026 leaders' meeting week in Shenzhen.
// Everything time-bound is dated in the text ("as of 3 November 2026"), and
// lastChecked is set, because every rule below was published in the two weeks
// before this post and more are expected. Sources checked 2026-11-04:
//
//   - Dates: 33rd APEC Economic Leaders' Meeting 18–19 Nov 2026, Shenzhen
//     (MFA announcement 2025-12-12, Xinhua; CGTN). CEO Summit 17–18 Nov;
//     final Senior Officials' Meeting 14–15 Nov; Finance Ministers' Meeting
//     Hong Kong 19–21 Oct (CGTN, 2026-10-17). China's earlier hostings:
//     Shanghai 2001, Beijing 2014 (China Daily via sz.gov.cn). APEC: 21
//     economies; first leaders' meeting 1993.
//   - Theme "Building an Asia-Pacific Community to Prosper Together";
//     priorities openness, innovation, cooperation (apec.org press release,
//     2025-12-12; Wang Yi at SOM1 Guangzhou, 2026-02-10).
//   - Venue: Shenzhen International Exchange Center, Xiangmi Lake, Futian;
//     designed by He Jingtang's team; hosted the APEC Forestry Ministers'
//     Meeting in July 2026 as its first event (Sing Tao, HK01, zh.wikipedia
//     citing TVBS 2026-10-31). Not open to the public.
//   - No holiday; flexible work encouraged 16–20 Nov; metro and bus half
//     price "during the meeting"; some lines at 2-minute headways; 50 new
//     feeder bus routes; ~20% more capacity; voluntary car-parking scheme
//     with a commemorative Shenzhen Tong card (city press conference,
//     2026-10-15: The Paper, 21st Century Business Herald, STCN, CNA).
//   - Beijing 2014 gave a six-day holiday (SCMP, 2014).
//   - Three notices published 3 Nov 2026 (The Paper / Shenzhen Fabu digest,
//     Shenzhen Special Zone Daily, CNA). The car ban and the low-altitude ban
//     are decisions of the Municipal People's Government; the truck notice is
//     from the Public Security Bureau. Non-Shenzhen-plate passenger cars banned 17–20 Nov 06:00–22:00 in
//     Futian, Luohu, Nanshan, Bao'an, Longgang, Longhua, with airport roads
//     and expressways north of the Shenhai Expressway excepted, HK/Macau
//     plates and permitted taxis/ride-hailing exempt, rental cars NOT exempt;
//     small trucks banned 18–19 Nov 06:00–22:00 in Futian,
//     Luohu, Nanshan; hazardous-goods vehicles banned citywide 16–20 Nov;
//     drones, kites and sky lanterns banned 7–10 Nov in Futian and Nanshan
//     and 11–21 Nov citywide (Shenshan excluded).
//   - Visa-free: unilateral 30-day entry extended to 31 Dec 2026 (MFA, Nov
//     2025); UK and Canada added from 17 Feb 2026 (MFA, Feb 2026): 50
//     countries per the NIA list of 17 Feb 2026 (Russia's runs to 31 Dec
//     2027); the US is not on the list. 240-hour transit: 57 countries after Kyrgyzstan and
//     Vietnam were added 20 Aug 2026 (Xinhua via Beijing gov). APEC Business
//     Travel Card stay 60→90 days from 1 Nov 2026 (MFA via Global Times,
//     2026-10-30; Fragomen).
//   - Payments: PBOC Shenzhen branch, July 2026 (China Daily): 41,000+
//     merchants and 51,000 terminals take overseas cards; 3,600+ ATMs; five
//     service centres at Bao'an airport, Shenzhen Bay, Futian and Luohu
//     ports, and Longhua; China Daily (2026-10-23) counts eight by October.
//   - Venue hotels: two flank the centre (InterContinental, listed to open
//     Dec 2026; Wuzhou Xiangmi Lake Hotel), so "two hotels built alongside".
//   - Beijing 2014: six days off 7–12 Nov for government bodies and schools,
//     not a general public holiday (China Daily, 2014-10-14).
//   - E-scooter clampdown ahead of the summit (CNA, 2026-04-13). Police
//     visibility from 1 Nov (Southern Net, HK01, 2026-11-02).
//
// Deliberately absent: hotel names and prices, the list of attending leaders
// (unconfirmed until they land), anything about which roads will physically
// close on the two meeting days (not published at the time of writing).

export const apec2026Shenzhen: Post = {
  slug: 'apec-2026-shenzhen',
  title: 'APEC 2026 in Shenzhen: what visitors need to know',
  excerpt:
    'The leaders’ meeting is on 18 and 19 November. Road rules, half-price metro and visas for anyone visiting Shenzhen that week.',
  pillar: 'logistics',
  tags: ['apec-2026', 'apec', 'futian', 'events', 'visa', 'first-visit'],
  publishedAt: '2026-11-04',
  lastChecked: '2026-11',
  author: 'bryan',
  heroGalleryId: 'futian-caitian-towers-night',
  relatedSlugs: ['shenzhen-from-hong-kong-day-trip', 'futian-new-downtown'],
  seo: {
    title: 'APEC 2026 Shenzhen: dates, venue, traffic rules and visiting the city',
  },
  body: [
    {
      k: 'p',
      text: 'In the middle of November, Shenzhen hosts the APEC leaders’ meeting. Leaders from twenty-one economies come to Futian for two days, and the streets around the venue are expected to be shut while they are there. China has done this twice before, in Shanghai in 2001 and in Beijing in 2014. It is the first time for Shenzhen, and the city has been getting ready for a year.',
    },
    {
      k: 'p',
      text: 'We live here, so we have watched the preparations happen. The venue by the lake went up and the e-scooter crackdown came in the spring. The road notices started arriving this month. This is what we know as of early November, and what it means if you are visiting that week, whether or not you are here for the meeting.',
    },

    { k: 'h2', text: 'The meeting' },
    {
      k: 'p',
      text: 'APEC is the Asia-Pacific Economic Cooperation forum. Twenty-one economies around the Pacific belong to it, from Chile to Thailand, and their leaders have met once a year since 1993. It is a forum rather than a treaty body, and the leaders’ meeting is the two days a year when they sit in the same room. China’s theme for its year is “Building an Asia-Pacific Community to Prosper Together”, with openness, innovation and cooperation as the three priorities.',
    },
    {
      k: 'p',
      text: 'The 33rd leaders’ meeting is on 18 and 19 November 2026. The CEO Summit runs on 17 and 18 November, and the last senior officials’ meeting on 14 and 15 November. The main venue is the Shenzhen International Exchange Center at Xiangmi Lake in Futian, a new building by He Jingtang’s team with a deep overhanging roof and two hotels built alongside it. It opened this year, and the APEC forestry ministers’ meeting in July was its first event. None of it is open to the public. The streets around it will almost certainly be closed too, though that notice has not been published yet.',
    },
    {
      k: 'img',
      galleryId: 'futian-cbd-street-night',
      caption:
        'Futian after dark. The meeting is a short way west of this, at Xiangmi Lake.',
    },

    { k: 'h2', text: 'The week: 16 to 20 November' },
    {
      k: 'p',
      text: 'There is no public holiday, which is a change from Beijing, where government offices and schools were given six days off in 2014. Shenzhen is asking companies to let people work from home, stagger their hours or take leave in the week of 16 to 20 November, and that is all it is asking. The metro and buses will be half price for the meeting period, some lines will run a train every two minutes, and fifty extra feeder bus routes go in. The exact dates of the discount had not been published when we wrote this. Residents can even register to leave their car parked for the week in exchange for a commemorative transit card.',
    },
    {
      k: 'table',
      head: ['Dates', 'Rule', 'Who it affects'],
      rows: [
        [
          '7 to 10 November',
          'No drones, kites or sky lanterns in Futian and Nanshan',
          'Anyone with a drone in those two districts',
        ],
        [
          '11 to 21 November',
          'The same ban across the whole city',
          'Anyone with a drone',
        ],
        [
          '16 to 20 November',
          'Hazardous-goods trucks banned citywide; companies asked to work flexibly',
          'Residents more than visitors',
        ],
        [
          '17 to 20 November, 6am to 10pm',
          'Cars with plates from outside Shenzhen banned from Futian, Luohu, Nanshan, Bao’an, Longgang and Longhua, with the airport roads excepted. Hong Kong plates are exempt.',
          'Anyone driving in from another mainland city',
        ],
        [
          '18 and 19 November, 6am to 10pm',
          'Small trucks banned from Futian, Luohu and Nanshan',
          'Couriers, and shops waiting on deliveries',
        ],
        [
          '18 and 19 November',
          'The leaders’ meeting itself. Closures around Xiangmi Lake and the delegation hotels are likely but had not been announced as of 3 November.',
          'Everyone in central Futian',
        ],
      ],
    },
    {
      k: 'p',
      text: 'The car and drone rules are decisions of the city government, the truck rules come from the Shenzhen police, and all three were published on 3 November. The rule that matters to a visitor is the car ban, and since it covers plates from outside the city, Shenzhen’s own taxis and ride-hailing cars are not affected by it. Rental cars are not exempt, so do not plan to drive one in from Guangzhou or Dongguan that week. The city has said it wants people on the metro all the same, and that is how we get around in any case.',
    },

    { k: 'h2', text: 'Should you come that week?' },
    {
      k: 'p',
      text: 'If you are here for the meeting the question does not arise, and the useful part for you is the list under ‘How we can help that week’. If you are coming for the city, it will work, with some friction. The police presence has been obvious since the start of the month, and Xiangmi Lake will be cordoned off on the meeting days. Nothing else has been announced as closed, and the metro will be cheaper and more frequent than usual.',
    },
    {
      k: 'p',
      text: 'Our plan for that week keeps out of central Futian during the day. The west coast, which is [Shenzhen Bay, Talent Park and Sea World](/blog/shenzhen-bay-waterfront), is a metro ride from wherever you are staying. [Dongmen](/blog/dongmen-old-downtown) is in Luohu, on the far side of the centre. Dafen and OCT are in their own corners. We would skip the Futian skyline walk on the two meeting nights, since the cordon will be a few streets west of it.',
    },

    { k: 'h2', text: 'Getting in' },
    {
      k: 'p',
      text: 'Many visitors no longer need a visa. China’s unilateral visa-free entry covers ordinary passports from fifty countries, including Japan, Australia, most of Europe and, since 17 February 2026, the United Kingdom and Canada, for stays of up to thirty days. The policy currently runs to 31 December 2026. The United States is not on the list. Travellers from fifty-seven countries, Americans among them, can use the 240-hour visa-free transit instead if they are moving on to a third country or region. Holders of an APEC Business Travel Card can stay up to ninety days from 1 November, up from sixty.',
    },
    {
      k: 'p',
      text: 'From Hong Kong the crossings work as they always do, with longer queues. Our [border-crossing guide](/blog/shenzhen-from-hong-kong-day-trip) covers which crossing to use and which apps to install. Set the apps up before you leave. Payments trip more people up here than passports do.',
    },

    { k: 'h2', text: 'Paying for things' },
    {
      k: 'p',
      text: 'The city has spent the year preparing for foreign cards. The central bank’s Shenzhen branch says more than 41,000 merchants and 3,600 cash machines now take overseas cards, and there are payment help desks at the airport, Shenzhen Bay port, Futian port and Luohu port. That is new, and it holds at the help desks and the big shops. It does not hold at the places you will eat. Taxis, street food, shared bikes and the beer tower on the Sea World plaza are paid for on Alipay or WeChat Pay, so have both working before you arrive.',
    },

    { k: 'h2', text: 'How we can help that week' },
    {
      k: 'p',
      text: 'Shenzhen Buddies pairs visitors with a local, for two or three hours, free during our pilot. The buddy sets up your payments with you and tests them, orders dinner, reads the metro map and gets you to wherever you were trying to go. In APEC week it comes down to a few situations.',
    },
    {
      k: 'ul',
      items: [
        'A delegate with only the evenings free gets met at a metro exit and walked to Sea World or the Talent Park lights, with no car involved.',
        'A partner who is not attending can have a buddy for the day at the waterfront, in Dafen or in the electronics markets, and eat somewhere we would eat ourselves.',
        'Press and delegation staff who need something specific, such as a place to film the skyline or a menu read over the phone, can write to us and we will say whether we can do it.',
        'An ordinary visitor gets a day planned around the road rules: metro rather than taxis, and nothing near Xiangmi Lake on the meeting days.',
      ],
    },
    {
      k: 'cta',
      label: 'Book a buddy for APEC week',
      sub: 'Evenings, a day out for a partner, or a specific request. Tell us the dates.',
    },
    {
      k: 'callout',
      tone: 'warn',
      title: 'Rules change by the day',
      text: 'Everything above is what had been published as of 3 November 2026. The city said in October that traffic measures would be released in stages, and nothing yet covers particular roads on the two meeting days. Check the Shenzhen Traffic Police account on WeChat or the city government site the day before you move, and treat anything from a travel blog, including this one, as a starting point.',
    },
    {
      k: 'p',
      text: 'The meeting takes two days, the car ban lifts on the evening of the twentieth, and the drone ban, the last of the notices, expires on the twenty-first. If your dates are flexible, the week after is easier. If they are not, the evenings are mostly unaffected and the metro is half price.',
    },
    {
      k: 'contact',
      title: 'Talk to us before you arrive',
      text: 'Write to us and we reply the same day. WhatsApp is quickest from outside China, and WeChat once you are on the mainland side.',
    },
  ],
  faq: [
    {
      q: 'When is APEC 2026?',
      a: 'The 33rd APEC Economic Leaders’ Meeting is on 18 and 19 November 2026 in Shenzhen. The CEO Summit is on 17 and 18 November and the final senior officials’ meeting on 14 and 15 November. Ministerial meetings ran all year in other Chinese cities, including the finance ministers in Hong Kong in October.',
    },
    {
      q: 'Where is the APEC 2026 venue?',
      a: 'The Shenzhen International Exchange Center at Xiangmi Lake in Futian District, west of the CBD. It is a new conference centre with two hotels built alongside it, designed by He Jingtang’s team and finished this year. Visitors cannot go in.',
    },
    {
      q: 'Is there a public holiday in Shenzhen for APEC?',
      a: 'No. The city said on 15 October 2026 that there is no general holiday. Companies are encouraged to allow remote work, flexible hours or leave from 16 to 20 November.',
    },
    {
      q: 'Will roads be closed in Shenzhen during APEC?',
      a: 'Yes, in stages, though no specific road closures had been announced as of 3 November. Cars with plates from outside Shenzhen are banned from six districts from 6am to 10pm on 17 to 20 November, small trucks from Futian, Luohu and Nanshan on 18 and 19 November, and drones and kites citywide from 11 to 21 November. Expect closures around Xiangmi Lake on the meeting days. The metro and buses run at half price with extra capacity.',
    },
    {
      q: 'Can tourists visit Shenzhen during APEC 2026?',
      a: 'Yes. No attractions have been announced as closed, visa-free entry for fifty countries continues to the end of 2026, and the metro is cheaper that week. Avoid central Futian on 18 and 19 November, book a hotel outside the centre, and expect taxis to be slow in Futian.',
    },
  ],
}
