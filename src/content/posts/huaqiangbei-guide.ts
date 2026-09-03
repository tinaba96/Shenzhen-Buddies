import type { Post } from './types'

// SOURCING NOTE — the discipline this post is written to.
//
// This is a 'neighborhoods' post, so it is built from things that are stable
// and verifiable on the ground: which buildings exist, which metro lines stop
// underneath them, how the counters trade and how they take payment. It says
// nothing about prices, because a Huaqiangbei price is wrong by the time the
// page is cached, and it names only two buildings — SEG Plaza and Huaqiang
// Electronic World — because those are the two the founder's own photo and
// visits can vouch for. The used-phone trade deliberately gets no address:
// it moves faster than a page can be edited, and the tour copy in
// src/content/packages.ts makes the same call.
//
// Opening hours are given loosely ("mid-morning", "between six and seven")
// on purpose. They are consistent with the founder's visits and with the
// package copy, but they have not been checked against a posted schedule, so
// the post does not carry a lastChecked date it could not honestly defend.
//
// Images: one Huaqiangbei frame exists in src/content/gallery.ts (the
// electronic-world entrance, location verified from the signage in the
// photo). The two maker-desk photos are filed under location 'other' and are
// captioned here as what they are — what people build with the parts, not
// the market itself. The PRD asks for 4–6 images per neighbourhood post;
// this one ships with 3 rather than borrow a photo of somewhere else.
//
// The brand brief lists "counterfeit goods" among the Shenzhen stereotypes to
// avoid. The post talks about grading and bench tests, which are real and
// useful, and does not frame the market as a place to be cheated.

export const huaqiangbeiGuide: Post = {
  slug: 'huaqiangbei-guide',
  title: 'Huaqiangbei: how to walk the electronics market',
  excerpt:
    'Thirty-odd market buildings on one pedestrian street. Which ones to enter, what a counter expects of you, and a half-day route that ends with a shortlist.',
  pillar: 'neighborhoods',
  tags: ['huaqiangbei', 'electronics', 'tech', 'makers', 'first-visit'],
  publishedAt: '2026-09-03',
  author: 'bryan',
  // The only frame in the library that names the place in its own pixels: the
  // building reads 华强电子世界 twice and the metro entrance reads 华强北站.
  heroGalleryId: 'huaqiangbei-electronic-world-night',
  relatedSlugs: ['shenzhen-from-hong-kong-day-trip', 'what-shenzhen-actually-eats'],
  seo: {
    title: 'Huaqiangbei guide: walking the Shenzhen electronics market',
  },
  body: [
    {
      k: 'p',
      text: 'Huaqiangbei is not a market. It is a district of markets — thirty-odd buildings packed along one pedestrian street in Futian, each one a vertical warren of counters, and each floor trading in something the floor below does not. Components by the reel. Drones. Used iPhones graded and moved by the crate. This year, a visible wall of AI glasses. Thousands of overseas buyers shop it every day, and the vendors are entirely used to them.',
    },
    {
      k: 'p',
      text: 'Which is the first thing to understand: nobody here is surprised to see you. The second thing is that the street is easy and the buildings are not. You can wander the pedestrian strip in twenty minutes and see nothing but phone-case shops. The market is upstairs, behind doors that do not look like entrances, and it rewards people who walk in knowing what a counter is for.',
    },

    { k: 'h2', text: 'How to read the street' },
    {
      k: 'p',
      text: 'Come up out of Huaqiangbei station — Lines 2 and 7 — and you are already on the strip. It was closed for years while the metro was dug underneath, and came back as a pedestrian street: wide, tiled, lined with screens, and lined on both sides with the buildings that matter. Each one has a name over the door and, usually, a floor directory just inside. The directory is the map. Read it before the escalator.',
    },
    {
      k: 'img',
      galleryId: 'huaqiangbei-electronic-world-night',
      caption:
        'Huaqiang Electronic World, red sign over the door, directly above the metro. The night-market neon on the station entrance is the tell that the buying does not stop when the offices close.',
    },
    {
      k: 'p',
      text: 'Broadly, the buildings sort themselves. Some do components: passives, connectors, ICs, sensors, dev boards, LED, cable, the tools to work with all of it. Some do finished goods: phones, accessories, drones, whatever the category of the year is. Some do second-hand, which is its own trade with its own grammar. A building rarely does all three, and the fastest way to waste an afternoon is to hunt for a sensor in a phone building.',
    },

    { k: 'h2', text: 'The two buildings to start with' },
    { k: 'h3', text: 'SEG Plaza' },
    {
      k: 'p',
      text: 'The tall one. The tower is offices; the market is the lower floors, and the lower floors are the reason people fly here. Floors one and two are components — resistors and capacitors in tape, connectors by the bag, single-board computers, sensors, soldering gear — with computers and peripherals stacked above. Parts sell by the reel, and most conversations open with a minimum order quantity. Some counters will break a reel for one person. Some will not. Knowing which is most of the skill.',
    },
    { k: 'h3', text: 'Huaqiang Electronic World' },
    {
      k: 'p',
      text: 'The building in the photo, straight above the station. Six floors: components, ICs, LED, cables, second-hand gear, tools, and lately whole runs of AI-glasses and drone counters. If something tempts you here, ask for a bench test — the counter will plug it in and show it working before money moves. This is normal, expected, and the single best habit to bring into the building.',
    },
    {
      k: 'cta',
      label: 'Walk it with someone who buys here',
      sub: 'Four hours in Huaqiangbei with a local: the right building, the right floor, and a negotiation that starts from the local number.',
    },

    { k: 'h2', text: 'What the counters expect of you' },
    {
      k: 'p',
      text: 'A Huaqiangbei counter is a wholesale business that tolerates retail. That explains almost everything about how it behaves. The first price to a walk-in opens high — custom, not an insult — and comes down fast for anyone who knows the second number. Nobody minds a calculator. Nobody minds a phone held up with a part number on it. What does not work is browsing: a counter with no question in front of it will go back to its own phone.',
    },
    {
      k: 'ul',
      items: [
        'Bring the part number, the photo, or the broken thing. A specific question gets a specific answer; "what do you have" gets nothing.',
        'Ask for the bench test before you agree a price, not after. Good counters offer it unprompted.',
        'Pay by QR code. The counters read Alipay and WeChat Pay, take cash grudgingly, and take foreign cards not at all. "I will come back with cash" is how a good price disappears.',
        'Expect minimums on components and none on finished goods. A reel is a reel; a drone is a drone.',
        'Anything heavy or battery-shaped can be shipped from a logistics counter inside the market rather than argued with at an airport.',
      ],
    },
    {
      k: 'callout',
      tone: 'tip',
      title: 'Sort out payment before you get on the metro',
      text: 'Link a Visa or Mastercard to Alipay or WeChat Pay before you fly — binding sometimes takes hours and sometimes just fails, and there is no fixing it at a counter. The [border-crossing post](/blog/shenzhen-from-hong-kong-day-trip) covers what to set up before you leave Hong Kong.',
    },

    { k: 'h2', text: 'What the parts turn into' },
    {
      k: 'p',
      text: 'The market makes more sense once you have seen a desk. Shenzhen is a city where a normal weekday workbench has two single-board computers, a GPS module and a fan of jumper wires on it, and where an AR headset with its back off is a Tuesday, not a tragedy. The counters downstairs exist because these desks exist. Walk the market as a shopper and it is overwhelming; walk it as someone who has a project, and every floor is an answer to a question.',
    },
    {
      k: 'img',
      galleryId: 'maker-desk-dev-boards',
      caption:
        'Not the market — a desk across town, stocked from it. Dev boards, a GPS module, jumper wires: what a reel of parts becomes by Friday.',
    },
    {
      k: 'img',
      galleryId: 'maker-desk-headset-teardown',
      caption:
        'A headset with its back off. Nothing bought in Huaqiangbei is precious enough not to take apart, and the repair counters downstairs will put it back together.',
    },
    {
      k: 'p',
      text: 'That repair trade is worth ten minutes of standing still even if you buy nothing all day: board-level work under microscopes, chips lifted off logic boards with hot air while you watch. The counters cluster through the market rather than in one building. Ask, or follow the smell of flux.',
    },

    { k: 'h2', text: 'A half-day route' },
    {
      k: 'p',
      text: 'The market fills through the early afternoon and most buildings pull their shutters between six and seven, so this is an after-lunch plan, not an evening one. Mid-morning works too, and is quieter.',
    },
    {
      k: 'ol',
      items: [
        'Come up at Huaqiangbei station and spend ten minutes on the strip working out which building is which. Read two floor directories before entering either.',
        'SEG Plaza, floors one and two, for components. Go with a list or go with a question; do not go to browse.',
        'Huaqiang Electronic World, top to bottom. Ask for a bench test on anything that tempts you.',
        'Find a repair counter and watch a chip come off a board. Ten minutes.',
        'If you are carrying a used-phone question, ask a counter where that trade is this month. It moves, and a printed address will be wrong.',
        'Logistics counter for anything you cannot fly with, then a cold drink and a shortlist: building, floor, counter, what each one is actually good for. Tomorrow you can come back alone.',
      ],
    },
    {
      k: 'p',
      text: 'That last step is the one people skip and the one that pays. Huaqiangbei is a place that rewards the second visit, because on the second visit you already know which door.',
    },
    {
      k: 'cta',
      label: 'Skip the first-visit tax',
      sub: 'A local who knows which counter is the maker and which is the reseller, translating at the bench.',
    },
  ],
  faq: [
    {
      q: 'Where is Huaqiangbei and how do I get there?',
      a: 'Huaqiangbei is in Futian district, central Shenzhen. Take the metro to Huaqiangbei station on Lines 2 or 7; the pedestrian street and the main market buildings are directly above the station.',
    },
    {
      q: 'Which building in Huaqiangbei should I go to first?',
      a: 'SEG Plaza for components — floors one and two — and Huaqiang Electronic World, directly above the metro, for a bit of everything across six floors. Between them they cover most of what a first visit is looking for.',
    },
    {
      q: 'When is Huaqiangbei open?',
      a: 'Counters trade from mid-morning, the market is busiest in the early afternoon, and most buildings close between six and seven in the evening. Sundays are quieter than weekdays but the buildings are open.',
    },
    {
      q: 'Can I pay with a foreign credit card in Huaqiangbei?',
      a: 'Not at the counters. They read Alipay and WeChat Pay QR codes and take cash reluctantly. Link your Visa or Mastercard to one of those apps before you travel, and test it before you need it.',
    },
    {
      q: 'Can I buy just one part, or do I have to buy in bulk?',
      a: 'It depends on the counter. Components often carry a minimum order quantity, but many counters will sell a single board, sensor or tool to a walk-in; finished goods like drones and phones have no minimum. Ask — the worst case is a no.',
    },
    {
      q: 'Is it worth going to Huaqiangbei if I am not an engineer?',
      a: 'Yes, as a place. It is one of the densest concentrations of electronics trade anywhere, the repair counters are worth watching on their own, and the phone and gadget floors need no expertise at all. Go with a question, even a small one, and it stops being a wall of noise.',
    },
  ],
}
