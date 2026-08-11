import type { Post } from './types'

// SOURCING NOTE — read before editing a single fact in this file.
//
// Border, visa and payment rules change without notice, and a traveller who
// acts on a stale line here can be turned around at the port. So this post is
// written to a rule: it states the things that are verifiable from a primary
// source and stable (which crossings exist, how you reach them, published
// opening hours), and it refuses to state the things that depend on the
// reader's passport (which visa or visa-free scheme applies to them).
//
// That is not hedging. "Which crossing, and how do I get to it" is genuinely
// the part people get wrong and the part we can answer; "can I get in without a
// visa" has ~50 different correct answers depending on the passport and two
// different answers depending on the port, and the only responsible version of
// it is a pointer to the authority that decides.
//
// Facts below sourced to the Hong Kong Immigration Department control-point
// listing, MTR, Octopus Cards Ltd, and Chinese embassy notices, checked
// 2026-08. Items still marked TODO are NOT yet verified against a primary
// source and must be confirmed before this post goes live — see the handoff
// notes that shipped with this file.

export const shenzhenFromHongKongDayTrip: Post = {
  slug: 'shenzhen-from-hong-kong-day-trip',
  title: 'Hong Kong to Shenzhen: which crossing to use',
  excerpt:
    'Six ways to cross from Hong Kong into Shenzhen, where each one drops you, and the one thing to sort out before you leave.',
  pillar: 'logistics',
  tags: ['border', 'hong-kong', 'first-visit', 'transport'],
  publishedAt: '2026-08-09',
  // TODO: bump to the month this is actually published and re-verify every
  // crossing's hours against immd.gov.hk that same week.
  lastChecked: '2026-08',
  author: 'bryan',
  // Drives the share card as well as the page hero, so it has to read as "the
  // place you crossed into" at thumbnail size. None of the library is a border
  // shot — the crossing photos in the batch had recognisable faces — so the
  // arrival skyline is the honest stand-in rather than a checkpoint we do not
  // have a photo of.
  heroGalleryId: 'skyline-blue-towers-night',
  body: [
    {
      k: 'p',
      text: 'Crossing from Hong Kong into Shenzhen takes about as long as a trip across town. Ride the East Rail Line to the end, walk through immigration, and come out inside a Shenzhen Metro station. Most people are through in well under an hour. The part worth planning is not the crossing — it is whether your passport lets you through it, and that answer is different for every passport.',
    },
    {
      k: 'p',
      text: 'So: the crossings first, because that part is the same for everyone. Then the paperwork, which is not.',
    },

    { k: 'h2', text: 'The six crossings, and which one is yours' },
    {
      k: 'p',
      text: 'Hong Kong and Shenzhen share a land border with several ports along it. They are not interchangeable — two of them you cannot walk through at all, and the one most people mean when they say "Lok Ma Chau" is not the one on the MTR map.',
    },
    {
      k: 'table',
      head: ['Crossing', 'How you get there', 'Where you come out', 'Open'],
      rows: [
        [
          'Lo Wu 羅湖',
          'East Rail Line to the last stop',
          'Luohu Port — Shenzhen Metro Line 1',
          '06:30–24:00',
        ],
        [
          'Lok Ma Chau Spur Line 落馬洲支線',
          'East Rail Line, the Lok Ma Chau branch',
          'Futian Checkpoint — Metro Lines 4 and 10',
          '06:30–22:30',
        ],
        [
          'Shenzhen Bay 深圳灣',
          'Bus from Yuen Long or Tin Shui Wai, or a cross-boundary coach',
          'Shenzhen Bay Port — Metro Line 13',
          '06:30–24:00',
        ],
        [
          'Heung Yuen Wai 香園圍',
          'Bus only — no MTR station',
          'Liantang Port, eastern Luohu',
          '07:00–22:00',
        ],
        [
          'West Kowloon (high-speed rail)',
          'Board at West Kowloon; mainland immigration is inside the station',
          'Futian or Shenzhen North station',
          'First to last train',
        ],
        [
          'Lok Ma Chau 落馬洲 / Huanggang 皇崗',
          'Cross-boundary coach or car — no pedestrians',
          'Huanggang Port',
          '24 hours',
        ],
      ],
    },
    {
      k: 'p',
      text: 'If you are staying anywhere on the MTR and have no strong opinion, take the East Rail Line to Lo Wu. It is the simplest version of this trip: one train, one walk, one metro line on the other side, and Luohu station puts you a few stops from most of central Shenzhen.',
    },
    {
      k: 'p',
      text: 'Take the Lok Ma Chau Spur Line instead if you are heading for Futian — you come out at Futian Checkpoint on Metro Lines 4 and 10, which is closer to the business district and usually quieter than Lo Wu. Watch the closing time, though: it shuts earlier than Lo Wu does.',
    },
    {
      k: 'p',
      text: 'The high-speed rail from West Kowloon is the fastest and the most expensive, and it is unusual in one way that matters: you clear mainland immigration inside the Hong Kong station before you board, not after you arrive. Trains run to Futian and to Shenzhen North, which are different stations on different metro lines — check which one your ticket is for.',
    },
    {
      k: 'callout',
      tone: 'warn',
      title: 'Two names, two different places',
      text: '"Lok Ma Chau" is two crossings. The Spur Line is the one on the MTR map, and you walk through it. Plain Lok Ma Chau, into Huanggang, is a road crossing for coaches and cars — you cannot arrive there on foot. It is open around the clock, which is why late-night advice online points at it, but only if you are on a bus.',
    },
    {
      k: 'p',
      text: 'Two more ports exist and are probably not for you. Man Kam To handles mostly cross-boundary coaches. Sha Tau Kok is closed for redevelopment — and note that the separate reopening of Sha Tau Kok town to Hong Kong visitors does not let you cross into Shenzhen from there.',
    },
    {
      k: 'p',
      text: 'Fares and journey times shift, so check the current numbers in the [MTR app](https://www.mtr.com.hk/) rather than trusting a figure in an article — including this one.',
    },

    {
      k: 'cta',
      label: 'Cross with someone who has done it before',
      sub: 'A local buddy meets you on the Shenzhen side and takes the guesswork out of the first hour.',
    },

    { k: 'h2', text: 'The paperwork, which depends on your passport' },
    {
      k: 'p',
      text: 'Here is the honest answer to "do I need a visa for Shenzhen": it depends on your passport, and there is no version of that sentence that is true for everybody. There are several separate schemes, they cover different nationalities, they allow different lengths of stay, and — the part people miss — they are not all valid at every port.',
    },
    {
      k: 'p',
      text: 'Broadly, one of these applies to you:',
    },
    {
      k: 'ul',
      items: [
        'A tourist visa you apply for in advance at a Chinese embassy or consulate. Works everywhere, takes planning.',
        'Visa-free entry, which China grants to a list of nationalities that has been growing and is reviewed periodically. If your country is on it, this is the easy path.',
        'Visa-free transit, which is time-limited and has its own list of eligible ports and its own onward-travel conditions.',
        'A Shenzhen-only permit issued at the port, historically limited to a short stay inside the city. Availability and eligibility here have changed repeatedly.',
      ],
    },
    {
      k: 'p',
      text: 'Check which one is yours at the [National Immigration Administration](https://en.nia.gov.cn/) and with the Chinese embassy or consulate for your country. Do it before you buy a train ticket, not at the station.',
    },
    {
      k: 'callout',
      tone: 'warn',
      title: 'The transit trap',
      text: 'Visa-free transit generally expects you to be passing through on the way somewhere else — arriving from one place and leaving for a different one. A day trip that starts in Hong Kong and ends back in Hong Kong is not obviously that. If transit is the scheme you are counting on, confirm that a return to your starting point qualifies before you travel. Getting this wrong means being refused at the counter.',
    },
    {
      k: 'p',
      text: 'Whatever gets you in, the border itself is the same short routine.',
    },
    {
      k: 'ol',
      items: [
        'Fill in the arrival card. There is an online version through the immigration authority\'s app and its WeChat and Alipay mini-programs, and paper forms are still accepted at the port. Doing it in advance saves you a queue.',
        'Give fingerprints and a photo at a self-service kiosk. This applies to most foreign travellers between 14 and 70.',
        'Hand over your passport at the counter and collect your stamp.',
        'Walk out into the metro station on the other side.',
      ],
    },

    { k: 'h2', text: 'Three things that catch people on the Shenzhen side' },

    { k: 'h3', text: 'Your Octopus card stops working' },
    {
      k: 'p',
      text: 'A standard Octopus card will not open a Shenzhen Metro gate. Octopus sells versions that do — a China T-Union card that converts as you travel, and a dual-purse card holding Hong Kong dollars and renminbi separately — but the plain card in your wallet is not one of them. Details are on the [Octopus site](https://www.octopus.com.hk/en/consumer/customer-service/faq/get-your-octopus/china-t-union.html). Otherwise, buy a single-journey token at the machine, or pay from your phone.',
    },

    { k: 'h3', text: 'Your phone is your problem, not China\'s' },
    {
      k: 'p',
      text: 'Whether you have data on the mainland side comes down to your own carrier having enabled roaming there, or to a travel eSIM you set up beforehand. Sort it out while you are still on wifi in Hong Kong. Standing at Luohu station with no connection, no map and no payment app is a bad first ten minutes.',
    },

    { k: 'h3', text: 'Cash is not the fallback it used to be' },
    {
      k: 'p',
      text: 'Shenzhen runs on Alipay and WeChat Pay to a degree that surprises first-time visitors — small stalls and market sellers may have no way to take a card, and sometimes not much change either. Both apps accept foreign cards now. Install one, link your card, and check that a payment actually goes through before you cross, because verification can need a working phone number.',
    },
    {
      k: 'callout',
      tone: 'tip',
      title: 'Do the setup the night before',
      text: 'Arrival card, payment app, data. All three take ten minutes on hotel wifi and all three are miserable to sort out standing in a station concourse.',
    },

    { k: 'h2', text: 'What a day actually looks like' },
    {
      k: 'p',
      text: 'Cross early. The ports get busy through the middle of the morning, and on Hong Kong public holidays they get very busy. Give yourself the whole day rather than trying to be back for dinner — the last trains are earlier than you think, and the Spur Line closes before Lo Wu does.',
    },
    {
      k: 'p',
      text: 'Where you go after that is the easy part. Huaqiangbei if you want to see the electronics markets that made the city\'s reputation, OCT-Loft for the art and coffee end of things, Dongmen for street food in the old town. Any of them fills an afternoon.',
    },
    {
      k: 'p',
      text: 'The thing most people say afterwards is not that the border was hard. It is that they spent the day guessing — which queue, which exit, which of the four identical stalls has the good noodles. That part is easier with someone who lives there.',
    },
    {
      k: 'cta',
      label: 'Find a buddy in Shenzhen',
      sub: 'Locals who share your interests, for a few hours or a whole day.',
    },
  ],
  faq: [
    {
      q: 'Can I visit Shenzhen from Hong Kong without a visa?',
      a: 'It depends on your passport. China grants visa-free entry to a list of nationalities, and runs separate visa-free transit arrangements with their own conditions and their own list of eligible ports — so the answer differs both by who you are and by which crossing you use. Check the National Immigration Administration at en.nia.gov.cn and your nearest Chinese embassy or consulate before you travel.',
    },
    {
      q: 'Which border crossing should I use from central Hong Kong?',
      a: 'Lo Wu, at the end of the East Rail Line, is the simplest: one train from Hong Kong, then Shenzhen Metro Line 1 on the other side. Take the Lok Ma Chau Spur Line instead if you are heading to Futian, but note it closes earlier than Lo Wu.',
    },
    {
      q: 'Can I walk across at Lok Ma Chau?',
      a: 'Only via the Lok Ma Chau Spur Line, which is the MTR crossing into Futian Checkpoint. The Lok Ma Chau road crossing into Huanggang is for coaches and cars only, with no pedestrian access, even though it is open 24 hours.',
    },
    {
      q: 'Does my Octopus card work on the Shenzhen Metro?',
      a: 'No. A standard Octopus card will not open Shenzhen Metro gates. Octopus sells a China T-Union version and a dual-currency card that do work on the mainland; otherwise buy a single-journey token or pay through Alipay or WeChat Pay.',
    },
    {
      q: 'Do I need to fill in an arrival card for mainland China?',
      a: 'Yes. You can complete it online in advance through the immigration authority\'s app or its WeChat and Alipay mini-programs, and paper forms are still available at the port. Most foreign travellers aged 14 to 70 also give fingerprints and a photo at a kiosk on arrival.',
    },
  ],
}
