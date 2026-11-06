import type { Post } from './types'

// SOURCING NOTE — the discipline this post is written to.
//
// A 'logistics' post about the APEC 2026 leaders' meeting week in Shenzhen.
// Everything time-bound is dated in the text ("as of 3 November 2026"), and
// lastChecked is set, because every rule below was published in the weeks
// before this post and more are expected. Sources re-checked 2026-11-04 by an
// independent pass:
//
//   - Dates: 33rd APEC Economic Leaders' Meeting 18–19 Nov 2026, Shenzhen
//     (lg.gov.cn; szjj.sz.gov.cn truck notice title; CGTN 2025-12-13). CEO
//     Summit 17–18 Nov (english.www.gov.cn 2026-09-10, CCPIT); final Senior
//     Officials' Meeting 14–15 Nov (CGTN 2026-10-17); Finance Ministers'
//     Meeting Hong Kong 20–21 Oct (HK gov). China's earlier hostings:
//     Shanghai 2001, Beijing 2014 (sz.gov.cn en). APEC: 21 economies; first
//     leaders' meeting 1993.
//   - Theme "Building an Asia-Pacific Community to Prosper Together";
//     priorities openness, innovation, cooperation (sz.gov.cn en; fmprc.gov.cn
//     Wang Yi at SOM1 Guangzhou, 2026-02-10).
//   - Venue: Shenzhen International Exchange Center, Xiangmi Lake, Futian
//     (corner of Hongli Rd and Xiangmihu Rd); designed by He Jingtang's team;
//     steel roof cantilevers up to 18 m (Shenzhen SASAC); hosted the APEC
//     Forestry Ministers' Meeting 27–28 July 2026 as its first large
//     conference (sz.gov.cn, chinanews, Sing Tao). Not open to the public.
//     Hotels: InterContinental (listed to open Dec 2026) and Wuzhou Xiangmi
//     Lake Hotel flank the centre (runhotel.hk 2026-10-23), hence "a hotel on
//     either side, one of them opening in December".
//   - No general holiday (city press conference 2026-10-15: "全市不统一放假",
//     STCN, The Paper); flexible work encouraged 16–20 Nov; metro and bus half
//     price "during the meeting", exact dates and payment method unpublished;
//     some lines at 2-minute headways; "more than 50" new feeder routes;
//     voluntary car-parking scheme with a commemorative Shenzhen Tong card.
//     Schools: Shenzhen Education Bureau autumn break 17–20 Nov for compulsory
//     education incl. private schools, kindergartens by reference, high
//     schools decide themselves (announced 2026-10-09; sz.gov.cn en, CNA).
//     90% of official and SOE cars idled (Xinhua via cls.cn).
//   - Beijing 2014: six days off 7–12 Nov for government bodies and schools,
//     not a general public holiday (China Daily, 2014-10-14).
//   - Three notices published 3 Nov 2026 (The Paper digest, szjj.sz.gov.cn).
//     The car ban and the low-altitude ban are decisions of the Municipal
//     People's Government; the truck notice is from the Public Security
//     Bureau. Non-Shenzhen-plate passenger cars banned 17–20 Nov 06:00–22:00
//     in Futian, Luohu, Nanshan, Bao'an, Longgang, Longhua, with airport roads
//     and expressways north of the Shenhai Expressway excepted; HK, Macau and
//     consular plates exempt; licensed taxis and ride-hailing cars exempt
//     regardless of plate; rental cars (driverless hire) NOT exempt. Small
//     trucks (enclosed light vans excepted) banned 18–19 Nov 06:00–22:00 in
//     Futian, Luohu, Nanshan; hazardous-goods vehicles banned citywide 16–20
//     Nov. Drones, model aircraft, balloons, kites and sky lanterns banned
//     7–10 Nov in Futian and Nanshan and 11–21 Nov citywide (Shenshan
//     excluded). Separate police notice of 16 July: no low-altitude objects
//     in the box Xinzhou Rd–Nonglin Rd–Beihuan Ave–Binhe Ave until 24:00 on
//     23 Nov (sznews 2026-07-20).
//   - Visa-free: unilateral 30-day entry to 31 Dec 2026; UK and Canada added
//     from 17 Feb 2026; 50 countries per the NIA list (Russia to 31 Dec 2027,
//     Brunei open-ended); the US is not on the list. 240-hour transit: 57
//     countries after Kyrgyzstan and Vietnam were added 20 Aug 2026 (Xinhua).
//     APEC Business Travel Card stay 60→90 days from 1 Nov 2026 (mfa.gov.cn
//     2026-10-30).
//   - Payments: PBOC Shenzhen branch (21jingji 2026-07-28): 41,000 merchants
//     and 3,600+ ATMs take overseas cards; eight payment service centres at
//     the airport and ports by 23 Oct 2026 (21jingji).
//   - Metro bag checks tightened ahead of the meeting (Sing Tao, Nov 2026).
//
//   - Photos (2026-11-06): the venue (Lhzss8, CC BY-SA 4.0, taken 2 Aug
//     2026) and the 2014 Beijing leaders' photo (Kremlin.ru, CC BY 4.0), both
//     from Wikimedia Commons and credited in src/content/licensed-photos.ts.
//     The White House's public-domain 2014 photos were left out: their notice
//     bars commercial use. The two gallery photos are ours and used nowhere
//     else, replacing the Futian pair this post used to share with the Futian
//     post.
//
// Deliberately absent: hotel names and prices, the list of attending leaders
// (unconfirmed until they land), anything about which roads will physically
// close on the two meeting days (not published at the time of writing), and
// the e-scooter restrictions, which do not touch visitors.

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
  heroPhotoId: 'shenzhen-international-exchange-center-2026',
  relatedSlugs: ['shenzhen-from-hong-kong-day-trip', 'futian-new-downtown'],
  seo: {
    title: 'APEC 2026 Shenzhen: dates, venue, traffic rules and visiting the city',
  },
  body: [
    {
      k: 'p',
      text: 'In the middle of November, Shenzhen hosts the APEC leaders’ meeting. Leaders from twenty-one economies come to Futian, the central district, for two days, and the streets around the venue are expected to be shut while they are there. China has done this twice before, in Shanghai in 2001 and in Beijing in 2014. It is the first time for Shenzhen, and the city has been getting ready for a year.',
    },
    {
      k: 'p',
      text: 'We live here and have watched the preparations. The venue at Xiangmi Lake was finished over the past year, and the traffic notices came out on 3 November. This is what we know as of early November, and what it means if you are in Shenzhen that week, for the meeting or not.',
    },

    { k: 'h2', text: 'The meeting' },
    {
      k: 'p',
      text: 'APEC is the Asia-Pacific Economic Cooperation forum. Twenty-one economies around the Pacific belong to it, from Chile to Thailand, and their leaders have met once a year since 1993. They are called economies rather than countries, which is how Hong Kong and Chinese Taipei each have a seat of their own. It is a forum rather than a treaty body. The leaders’ meeting is simply the two days a year when they are all in one place. China has given its year the slogan ‘Building an Asia-Pacific Community to Prosper Together’. The three priorities under it are openness, innovation and cooperation.',
    },
    {
      k: 'photo',
      photoId: 'apec-2014-beijing-leaders-photo',
      caption: 'Beijing, 10 November 2014: the leaders and their spouses in jackets the host had made for the occasion. Every APEC host stages a group photo like this.',
    },
    {
      k: 'p',
      text: 'The 33rd leaders’ meeting is on 18 and 19 November 2026. The CEO Summit runs on 17 and 18 November, and the last senior officials’ meeting on 14 and 15 November. The main venue is the Shenzhen International Exchange Center at Xiangmi Lake in Futian. It is a new building with a long cantilevered roof and a hotel on either side, one of which opens in December. The architects were He Jingtang’s team, who did the China pavilion at the Shanghai Expo. The APEC forestry ministers’ meeting in July was its first big event. None of it is open to the public.',
    },
    {
      k: 'photo',
      photoId: 'shenzhen-international-exchange-center-2026',
      caption: 'The exchange centre in August 2026, three months before the meeting.',
    },

    { k: 'h2', text: 'The week: 16 to 20 November' },
    {
      k: 'p',
      text: 'There is no general public holiday. Primary and secondary schools and most kindergartens are on an autumn break from 17 to 20 November. The city is taking 90 per cent of its official cars off the road, and companies are asked to let people work from home, stagger their hours or take leave in the week of 16 to 20 November. The metro and buses are due to be half price for the meeting period, with some lines running a train every two minutes and more than fifty extra bus routes feeding metro stations. The exact dates of the discount had not been published when we wrote this. Residents can register to leave their car parked for the week in exchange for a commemorative transport card. Beijing went further in 2014 and gave government offices and schools six days off.',
    },
    {
      k: 'table',
      head: ['Dates', 'Rule', 'Who it affects'],
      rows: [
        [
          '7 to 10 November',
          'No drones, kites or sky lanterns in Futian and Nanshan districts',
          'Anyone flying a drone in those two districts',
        ],
        [
          '11 to 21 November',
          'The same ban across the whole city',
          'Anyone flying a drone',
        ],
        [
          'Until 23 November',
          'Nothing airborne at all in the streets around the venue, between Xinzhou Road and Nonglin Road, under a separate police notice from July',
          'Anyone flying a drone near Xiangmi Lake',
        ],
        [
          '16 to 20 November',
          'Hazardous-goods trucks banned citywide; companies asked to work flexibly',
          'Mostly residents',
        ],
        [
          '17 to 20 November, 6am to 10pm',
          'Cars with plates from outside Shenzhen banned from Futian, Luohu, Nanshan, Bao’an, Longgang and Longhua, with the airport roads excepted. Hong Kong and Macau plates are exempt.',
          'Anyone driving in from another mainland city',
        ],
        [
          '18 and 19 November, 6am to 10pm',
          'Small trucks banned from Futian, Luohu and Nanshan',
          'Couriers, and shops waiting for deliveries',
        ],
        [
          '18 and 19 November',
          'The leaders’ meeting itself. Closures around Xiangmi Lake and the delegation hotels are expected but had not been announced when we wrote this.',
          'Everyone in central Futian',
        ],
      ],
    },
    {
      k: 'p',
      text: 'The car ban and the citywide drone ban are city government decisions. The two truck bans and the no-fly zone around the venue come from the police. The car, drone and truck bans were all published on 3 November. Leave the drone at home. Apart from the drone ban and the closures expected around the venue on the two meeting days, the only rule a visitor is likely to run into is the car ban, and even then only if you have driven in from another city. Licensed taxis and ride-hailing cars are exempt whatever their plates, so getting around inside the city is unchanged, apart from Futian traffic being slow that week. Hire cars are not exempt, so do not drive one in from Guangzhou or Dongguan. The city wants everyone on the metro that week. We would say the same; it is how we get about anyway.',
    },

    { k: 'h2', text: 'Should you come that week?' },
    {
      k: 'p',
      text: 'If you are here for the meeting the question does not arise, and the useful part for you is the list under ‘How we can help that week’. If you are coming for the city, you will manage, but expect queues and detours. Bag checks on the metro have tightened, and Xiangmi Lake is expected to be cordoned off on the meeting days. Nothing else has been announced as closed, and the metro should be cheaper and more frequent than usual. If you have not booked a hotel yet, book one outside central Futian, meaning the business district around Civic Center and the lake to its west.',
    },
    {
      k: 'p',
      text: 'Our own plan is to stay out of central Futian on the two meeting days. The western waterfront in Nanshan is on the metro and well away from the venue. It runs from [Shenzhen Bay Park, past Talent Park, to Sea World](/blog/shenzhen-bay-waterfront) at Shekou, the old port at the far western end. Sea World is a plaza of bars and restaurants, not an aquarium. [Dongmen](/blog/dongmen-old-downtown) is in Luohu, the next district east. Dafen, the painting village, and Overseas Chinese Town, the theme-park and arts district, are outside Futian too. We would skip [our Futian skyline walk](/blog/futian-new-downtown) on the two meeting nights. Nobody knows yet how far the cordon will reach.',
    },
    {
      k: 'img',
      galleryId: 'shenzhen-bay-railing-day',
      caption: 'Shenzhen Bay on a clear day. The hills across the water are Hong Kong.',
    },

    { k: 'h2', text: 'Getting in' },
    {
      k: 'p',
      text: 'Many visitors no longer need a visa. China’s unilateral visa-free entry covers ordinary passports from fifty countries, including Japan, Australia, most of Europe and, since 17 February 2026, the United Kingdom and Canada, for stays of up to thirty days. The policy currently runs to 31 December 2026. The United States is not on the list. Travellers from fifty-seven countries, Americans among them, can use the 240-hour visa-free transit instead if they are moving on to a third country or region. Since 1 November, holders of an APEC Business Travel Card can stay ninety days rather than sixty.',
    },
    {
      k: 'p',
      text: 'From Hong Kong the crossings should work as they always do, with longer queues. Our [border-crossing guide](/blog/shenzhen-from-hong-kong-day-trip) covers which crossing to use and which apps to install. Set the apps up before you leave.',
    },

    { k: 'h2', text: 'Paying for things' },
    {
      k: 'p',
      text: 'In our experience most visitors clear immigration without trouble and then cannot pay for lunch. The city has spent the year preparing for foreign cards. The central bank’s Shenzhen branch says more than 41,000 merchants and more than 3,600 cash machines now take overseas cards, and there are eight payment help desks at the airport and the border crossings from Hong Kong, including the Shenzhen Bay, Futian and Luohu checkpoints. Useful as far as it goes, but it covers the department stores and the help desks, not the noodle shop you will end up in. Taxis, street food, shared bikes and the beer stands on the Sea World plaza are paid for on Alipay or WeChat Pay, so have both working before you arrive.',
    },

    { k: 'h2', text: 'How we can help that week' },
    {
      k: 'p',
      text: 'Shenzhen Buddies pairs visitors with a local for two or three hours, free during our pilot. The buddy sets up your payment apps, orders your dinner and sees you onto the right train back. In APEC week we expect it to be one of four things.',
    },
    {
      k: 'ul',
      items: [
        'A delegate with only the evenings free gets met at a metro exit and walked to Sea World or to Talent Park for the towers lit up across the water, with no taxi involved.',
        'A partner who is not attending gets an afternoon with a buddy at the waterfront, in Dafen or in the Huaqiangbei electronics markets, which are at the east end of Futian and well clear of the lake, and dinner somewhere we would eat ourselves.',
        'Press and delegation staff who need something specific, such as a place to film the skyline or a menu read over the phone, can write to us and we will say whether we can do it.',
        'An ordinary visitor gets an afternoon planned around the road rules: metro rather than taxis, and nothing near Xiangmi Lake on the meeting days.',
      ],
    },
    {
      k: 'img',
      galleryId: 'sea-world-minghua-ship-night',
      caption: 'The Minghua at Sea World after dark, where the evening walk ends.',
    },
    {
      k: 'cta',
      label: 'Book a buddy for APEC week',
      sub: 'Tell us your dates and what you need.',
    },
    {
      k: 'callout',
      tone: 'warn',
      title: 'More notices will follow',
      text: 'Everything above is what had been published as of 3 November 2026. The city said in October that traffic measures would come out in stages, and nothing yet covers particular roads on the two meeting days. Check the Shenzhen Traffic Police account on WeChat or the city government site the day before you set out. Do not rely on a blog post written a fortnight earlier.',
    },
    {
      k: 'p',
      text: 'The car ban lifts on the evening of 20 November, the citywide drone ban after 21 November, and the no-fly zone around the venue after 23 November. If your dates are flexible, the week after is easier. If not, keep out of central Futian on the two meeting days. Elsewhere the difference will be longer bag checks and a cheaper metro.',
    },
    {
      k: 'contact',
      title: 'Talk to us before you arrive',
      text: 'Write to us and we will reply the same day. WhatsApp is quickest from outside China, and WeChat once you are on the mainland side.',
    },
  ],
  faq: [
    {
      q: 'When is APEC 2026?',
      a: 'The 33rd APEC Economic Leaders’ Meeting is on 18 and 19 November 2026 in Shenzhen. The CEO Summit is on 17 and 18 November and the final senior officials’ meeting on 14 and 15 November. Ministerial meetings ran all year, including the forestry ministers in Shenzhen in July and the finance ministers in Hong Kong in October.',
    },
    {
      q: 'Where is the APEC 2026 venue?',
      a: 'The Shenzhen International Exchange Center at Xiangmi Lake in Futian District, west of the central business district. It is a new conference centre designed by He Jingtang’s team, finished this year, with a hotel on either side, one of which opens in December. Visitors cannot go in.',
    },
    {
      q: 'Is there a public holiday in Shenzhen for APEC?',
      a: 'No. The city said on 15 October 2026 that there is no general holiday, though primary and secondary schools and most kindergartens are on an autumn break from 17 to 20 November. Companies are encouraged to allow remote work, flexible hours or leave from 16 to 20 November.',
    },
    {
      q: 'Will roads be closed in Shenzhen during APEC?',
      a: 'Probably, around Xiangmi Lake on 18 and 19 November, but as of 3 November no specific closures had been announced. What has been announced is a ban on cars with plates from outside Shenzhen in six districts from 6am to 10pm on 17 to 20 November, a ban on small trucks in Futian, Luohu and Nanshan on 18 and 19 November, and a citywide ban on drones and kites from 11 to 21 November. The metro and buses are due to run at half price with extra capacity.',
    },
    {
      q: 'Can tourists visit Shenzhen during APEC 2026?',
      a: 'Yes. No attractions have been announced as closed, visa-free entry for fifty countries continues to the end of 2026, and the metro should be cheaper that week. Avoid central Futian on 18 and 19 November and book a hotel outside the centre. Taxis are exempt from the ban on out-of-town cars but will be slow in Futian that week.',
    },
  ],
}
