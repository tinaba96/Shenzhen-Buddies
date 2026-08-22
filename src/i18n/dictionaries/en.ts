// English is the source dictionary. Its shape IS the contract: `Dictionary` is
// derived from this object with `typeof`, and every other locale file is typed
// against it, so a key added here and forgotten in ja.ts is a type error at
// `npm run build` rather than a stray "undefined" in production.
//
// Rules for anyone editing this file:
//   - No key may hold an empty string. A blank is worse than English.
//   - Interpolation uses {name} placeholders, filled by fill() in ../index.ts.
//     Placeholders must survive translation — see assertDictionariesValid().
//   - Nothing in here is user-generated. Every value is rendered as text.

export const en = {
  meta: {
    // Sits in <html lang>. Also the label the switcher shows for "the language
    // you are reading right now".
    name: 'English',
  },

  // Document <title> and meta description. These vary by the visitor's cookie
  // on a single URL, which is normal for cookie-carried i18n but worth being
  // explicit about: a crawler sends no cookie, so Google indexes the English
  // pair. That is deliberate — the canonical URL is one page, in one language,
  // and the translations are a reading convenience rather than separate
  // indexable documents. Switching to /zh path prefixes is what would change
  // that, and it would bring hreflang with it.
  seo: {
    siteTitle: 'Shenzhen Buddies',
    siteDescription:
      'Match with a local buddy in Shenzhen who shares your interests. Casual, affordable, personal.',
    toursTitle: 'Four-hour experiences in Shenzhen — Shenzhen Buddies',
    toursDescription:
      'Six one-on-one, four-hour experiences in Shenzhen — the Huaqiangbei electronics market, Dongmen street food, the skyline after dark, and the first four hours from Hong Kong.',
  },

  common: {
    hours: '{n} hours',
    fourHours: '4 hours',
    oneOnOne: 'One-on-one',
    perPerson: 'per person',
    from: 'from',
    readMore: 'Read more',
    viewAll: 'View all',
    back: 'Back',
    seeDetails: 'See details',
    bookThis: 'Book this experience',
    planYourDay: 'Plan your day',
    findALocal: 'Find a local',
    becomeAGuide: 'Become a guide',
    browseBuddies: 'Browse buddies',
    yourProfile: 'Your profile',
    getStarted: 'Get started',
    alreadyHaveAccount: 'Already have an account?',
    logIn: 'Log in',
    signUp: 'Sign up',
    exploreFirst: 'Explore Shenzhen first',
    freeDuringPilot: 'Free during pilot',
  },

  nav: {
    tours: 'Experiences',
    explore: 'Explore',
    gallery: 'Gallery',
    blog: 'Journal',
    browse: 'Browse',
    bookAGuide: 'Book a guide',
    mySchedule: 'My schedule',
    messages: 'Messages',
    admin: 'Admin',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    account: 'Account',
  },

  language: {
    label: 'Language',
    choose: 'Choose your language',
    switchTo: 'Switch to {language}',
    current: 'Current language',
    note: 'Your choice is remembered on this device.',
  },

  home: {
    hero: {
      badge: 'Now matching in Shenzhen',
      titleLead: 'See Shenzhen with someone',
      titleAccent: 'who gets you.',
      body: 'Skip the tour bus. Four hours, one local who shares what you are into — electronics, food, skylines, mornings — and a city that finally makes sense.',
      primaryCta: 'See the four-hour experiences',
      secondaryCta: 'Become a guide',
      scroll: 'Scroll',
    },
    trust: {
      verified: 'ID-verified locals',
      refund: 'Full refund if we cannot confirm',
      reviewed: 'Reviewed by the community',
      noGroups: 'Never a group tour',
    },
    packages: {
      kicker: 'Four hours, one local',
      title: 'Pick your four hours.',
      body: 'Every experience below is exactly four hours, one-on-one, and built around one thing done properly rather than six things glimpsed from a coach window.',
      featuredLabel: 'Most booked',
      allLink: 'All experiences',
      priceNote: '{price} for the full four hours — that is the guide, not a ticket price.',
    },
    districts: {
      kicker: 'The map',
      title: 'Six districts, six different cities.',
      body: 'Shenzhen is too big to “see” in a day. Pick the part that matches what you came for.',
      cta: 'Open the district guide',
    },
    audiences: {
      travelerTitle: 'For travelers',
      travelerSubtitle: 'Visiting Shenzhen',
      travelerPoints: [
        'Skip the language barrier — match by shared languages',
        'Discover spots only locals know',
        'Personal, casual, and affordable',
      ],
      localTitle: 'For locals',
      localSubtitle: 'Live in Shenzhen',
      localPoints: [
        'Meet people from around the world',
        'Share your favorite spots and stories',
        'Pick the days, topics, and pace that work for you',
      ],
    },
    promise: {
      kicker: 'What a buddy actually does',
      title: 'The friction, handled.',
      body: 'Not a licence, not a coach, not a flag on a stick. A person who lives here and takes the awkward parts off your plate.',
      items: [
        {
          title: 'Translation, live',
          body: 'Menus, stalls, counters, taxi drivers. Spoken for you in the moment, not typed into an app afterwards.',
        },
        {
          title: 'Payments that work',
          body: 'Alipay and WeChat Pay set up and tested on your phone, because almost nothing here takes a foreign card.',
        },
        {
          title: 'Getting around',
          body: 'Metro QR codes, the right exit, and a ride called and explained to the driver at the end of the night.',
        },
        {
          title: 'Local prices',
          body: 'Your buddy asks the real price in the room. Nothing you buy passes through us and we take no cut of it.',
        },
        {
          title: 'A plan that bends',
          body: 'Tell them at hour two that you would rather do something else, and the rest of the day changes. Try that on a coach.',
        },
        {
          title: 'Money back',
          body: 'You pay to hold the day. If we cannot confirm it, you are refunded in full — no argument, no form.',
        },
      ],
    },
    howItWorks: {
      kicker: 'How it works',
      title: 'Three small steps.',
      steps: [
        {
          title: 'Pick your four hours',
          body: 'Choose an experience, or say what you are into and let your buddy build the day around it.',
        },
        {
          title: 'Pick your day',
          body: 'Open days are listed live. You pay to hold one, and we confirm within three business days.',
        },
        {
          title: 'Meet and go',
          body: 'Message beforehand, meet at the point you agreed, and explore. Leave a review afterward.',
        },
      ],
    },
    testimonials: {
      kicker: 'From our pilot community',
      title: 'Real stories from buddies.',
    },
    journal: {
      kicker: 'The journal',
      title: 'Read before you come.',
      body: 'Long-form guides to the parts of this city that are genuinely confusing.',
      cta: 'All journal entries',
    },
    moments: {
      kicker: 'Moments',
      title: 'Our own photographs, not stock.',
      body: 'Every picture on this site was taken by us, in this city.',
      cta: 'Open the gallery',
    },
    finalCta: {
      titleAnon: 'Ready to explore together?',
      titleLoggedIn: 'Find your next buddy.',
      bodyAnon: 'Free to join during the pilot. Takes under a minute.',
      bodyLoggedIn: 'Browse public profiles and start a conversation.',
      // Shown instead of bodyLoggedIn while single-guide mode hides the
      // marketplace: there are no profiles to browse, only a day to book.
      bodySingleGuide: 'Pick a day and book your four hours with a local.',
    },
  },

  tours: {
    index: {
      kicker: 'Experiences',
      title: 'Four hours, done properly.',
      body: 'Six one-on-one experiences, each exactly four hours long. You are booking a local’s afternoon, not a seat on a bus — so the route bends to you on the day.',
      priceLine: '{price} for four hours, one-on-one',
      countLine: '{n} experiences',
      notATour: {
        title: 'This is not a tour company.',
        body: 'There is no coach, no group, no flag and no commission. You book four hours of a Shenzhen local’s time, and everything you eat, ride or buy that day you pay for directly at local prices.',
      },
    },
    detail: {
      itinerary: 'How the four hours run',
      itineraryNote: 'Times are elapsed from your meeting point, not clock times — you pick the start hour at checkout.',
      includes: 'What is included',
      notIncluded: 'What is not',
      goodFor: 'Good for',
      insiderTip: 'One thing worth knowing',
      meetingPoint: 'Meeting point',
      bestStart: 'Best start',
      district: 'District',
      duration: 'Duration',
      groupSize: 'Group size',
      groupSizeValue: 'Just you (and anyone you bring)',
      price: 'Price',
      priceNote: 'Paid when you book, to hold the day. Refunded in full if we cannot confirm it.',
      readMore: 'Read the full guide',
      otherExperiences: 'Other four-hour experiences',
      bookCta: 'Book these four hours',
      bookNote: 'Next you pick a day and a start time. Nothing is charged until you confirm.',
      backToAll: 'All experiences',
    },
  },

  guide: {
    selectedPackage: {
      label: 'Selected experience',
      note: 'We have added it to your booking note — your buddy will see it. Change or clear it below before you pay.',
      clear: 'Clear selection',
      change: 'Pick a different experience',
    },
  },

  footer: {
    tagline: 'Match with a local buddy in Shenzhen who shares your interests.',
    product: 'Product',
    account: 'Account',
    company: 'Company',
    discount: 'Get 10% off',
    about: 'About',
    contact: 'Contact',
    privacy: 'Privacy',
    terms: 'Terms',
    cancellation: 'Cancellation policy',
    rights: '© {year} Tensai Tech Inc.',
    pilot: 'Pilot release · Shenzhen 深圳',
    languageNote: 'Site language',
  },

  partner: {
    kicker: 'From a friend',
    title: 'SplitWhom',
    body: 'BBQs, parties & trips — buy together, then track who paid what and settle up automatically.',
    cta: 'Try it',
  },
}

// Deliberately NOT `as const`. A const assertion would type every value as its
// own string literal, and `const ja: Dictionary` would then be required to
// contain the English text verbatim — which is the opposite of the point.
// Widened inference gives `string`, so the shape is enforced and the content
// is free.
export type Dictionary = typeof en
