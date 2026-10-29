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
    // Carries the "local help in Shenzhen" search phrasing. /local-help is the
    // page written for that query; the homepage title backs it up.
    siteTitle: 'Shenzhen Buddies — Local help and private outings in Shenzhen',
    siteDescription:
      'Get local help in Shenzhen from someone who shares your interests. Spend 2 or 3 hours together while they help you set up phone payments, order food and ride the metro. Free during our pilot.',
    toursTitle: 'Free local experiences in Shenzhen — Shenzhen Buddies',
    toursDescription:
      'Six private experiences in Shenzhen, free during our pilot: the Huaqiangbei electronics market, Dongmen street food, Futian after dark, Talent Park, the Shekou waterfront and a bike ride along Shenzhen Bay.',
    // Per-page <title>, description and share card. English values are the
    // strings the pages shipped with before they were translated.
    about: {
      title: 'About — Shenzhen Buddies',
      description: 'Built for explorers and the locals who love their city. Why we made Shenzhen Buddies, and how it works.',
    },
    contact: {
      title: 'Contact — Shenzhen Buddies',
      description: 'Get in touch with the Shenzhen Buddies team on WhatsApp, WeChat or email — questions, feedback, partnerships, press, or trust and safety.',
    },
    book: {
      title: 'Request a tour — Shenzhen Buddies',
    },
    donate: {
      title: 'Support the pilot — Shenzhen Buddies',
      description: 'Tours are free while we get Shenzhen Buddies off the ground. If it made your trip better, a small donation keeps it running.',
    },
    explore: {
      title: 'Explore Shenzhen by district — Shenzhen Buddies',
      description: "Shenzhen's six main districts — Nanshan, Futian, Luohu, Bao'an, Longhua and Longgang — what each one is actually for, and a local who knows it.",
    },
    gallery: {
      title: 'Shenzhen, as we actually found it — Shenzhen Buddies',
      description: 'Real photos of Shenzhen from the people who live here — night skylines, street-food stalls, workbenches mid-project. No stock imagery.',
      photoTitle: '{title} — Shenzhen Buddies',
    },
    blog: {
      title: 'Field notes on Shenzhen — Shenzhen Buddies',
      ogTitle: 'Field notes on Shenzhen',
      description: 'Border crossings, payments, neighbourhoods and the people who live here. The things worth knowing before you arrive.',
    },
    welcome: {
      title: 'Your first day in Shenzhen, free — Shenzhen Buddies',
      description: 'Book a local buddy in Shenzhen for a free 2 or 3 hour day out while we pilot. No card, no deposit — request a day and we confirm by email.',
    },
    guide: {
      title: 'Book a free tour with a local in Shenzhen — Shenzhen Buddies',
      description: 'Pick a day and spend two or three hours with someone who actually lives here — no coach, no script, no fixed route. Free during our pilot, booked direct.',
    },
    review: {
      title: 'How was your tour? — Shenzhen Buddies',
    },
    openReview: {
      title: 'Leave a review — Shenzhen Buddies',
    },
    localHelp: {
      title: 'Get local help in Shenzhen — Shenzhen Buddies',
      description: 'Get help in Shenzhen from someone who lives there. Book a local for 2 or 3 hours to set up Alipay and WeChat Pay, read menus and find your way on the metro. Free during our pilot.',
    },
  },

  common: {
    hours: '{n} hours',
    hoursRange: '{a} or {b} hours',
    free: 'Free',
    oneOnOne: 'Private · 1–2 people',
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
    // The WeChat chip in the footer and on /book. {id} is the account ID.
    wechatId: 'WeChat · {id}',
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
      imageAlt: 'Nanshan\'s skyline lit up at night across Shenzhen Bay, the towers mirrored in still water',
      badge: 'Now matching in Shenzhen',
      titleLead: 'See Shenzhen with someone ',
      titleAccent: 'who gets you.',
      body: 'Skip the tour bus. Spend two or three free hours with a local who is into the same things you are: electronics, food, skylines, early mornings.',
      primaryCta: 'See the free experiences',
      secondaryCta: 'Become a guide',
      scroll: 'Scroll',
    },
    trust: {
      verified: 'ID-verified locals',
      refund: 'Free during the pilot',
      reviewed: 'Reviewed by the community',
      noGroups: 'Never a group tour',
    },
    packages: {
      kicker: 'A few hours, one local',
      title: 'Two or three hours, your pick.',
      body: 'Every experience below is just you (and a friend, if you like) and a local, free while we pilot. Most run 2 or 3 hours, your pick; Talent Park and Shekou run 2. Each one is built around one thing done properly rather than six things glimpsed from a coach window.',
      featuredLabel: 'Most booked',
      allLink: 'All experiences',
      priceNote: '{price} during the pilot — your buddy’s time costs nothing, and what you eat or ride you pay at local prices.',
    },
    districts: {
      kicker: 'The map',
      title: 'Six districts, six different cities.',
      body: 'Shenzhen is too big to “see” in a day. Pick the part that matches what you came for.',
      cta: 'Open the district guide',
    },
    audiences: {
      travelerAlt: 'A Shenzhen night market stall laid with trays of skewered insects',
      localAlt: 'A shared table of chicken rice, noodles and fried tofu skin in Shenzhen',
      travelerTitle: 'For travelers',
      travelerSubtitle: 'Visiting Shenzhen',
      travelerPoints: [
        'Skip the language barrier — match by shared languages',
        'Go where the locals actually go',
        'Just you, or you and a friend. Never a group tour',
      ],
      localTitle: 'For locals',
      localSubtitle: 'Live in Shenzhen',
      localPoints: [
        'Meet people from around the world',
        'Show people the places you actually like',
        'Pick the days, topics, and pace that work for you',
      ],
    },
    promise: {
      kicker: 'What a buddy actually does',
      title: 'The friction, handled.',
      body: 'Not a licence, not a coach, not a flag on a stick. A person who lives here and takes the awkward parts off your plate.',
      helpLink: 'How to get local help in Shenzhen',
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
          title: 'Free, honestly',
          body: 'Booking costs nothing during the pilot — no card, no deposit. If we cannot confirm your day, we tell you straight away, and nothing was ever charged.',
        },
      ],
    },
    howItWorks: {
      photoAlts: [
        'Sourdough rounds and baguettes on a Shenzhen bakery counter',
        'Clip-top jars of kumquats and plums preserved in syrup',
        'Shenzhen towers lit blue at night, seen from street level',
      ],
      kicker: 'How it works',
      title: 'Three small steps.',
      steps: [
        {
          title: 'Pick your experience',
          body: 'Choose an experience, or say what you are into and let your buddy build the day around it.',
        },
        {
          title: 'Pick your day',
          body: 'Open days are listed live. Request one for free — 2 or 3 hours — and we confirm within three business days.',
        },
        {
          title: 'Meet and go',
          body: 'Message beforehand, meet at the point you agreed, and explore. Leave a review afterward.',
        },
      ],
    },
    testimonials: {
      kicker: 'Reviews',
      title: 'No reviews yet — we only just opened.',
      body: 'Every review on this site will come from a completed booking. We do not write them ourselves and we do not buy them. Book a day during the pilot, and the first words here could be yours — good or bad.',
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
      body: 'Every photo in our gallery was taken by us, in this city.',
      cta: 'Open the gallery',
    },
    finalCta: {
      titleAnon: 'Ready to explore together?',
      titleLoggedIn: 'Find your next buddy.',
      bodyAnon: 'Free to join during the pilot. Takes under a minute.',
      bodyLoggedIn: 'Browse public profiles and start a conversation.',
      // Shown instead of bodyLoggedIn while single-guide mode hides the
      // marketplace: there are no profiles to browse, only a day to book.
      bodySingleGuide: 'Pick a day and book a free few hours with a local.',
    },
  },

  tours: {
    index: {
      heroAlt: 'The Shenzhen Bay skyline at dusk, its lit towers reflected in the water',
      kicker: 'Experiences',
      title: 'A few hours, done properly.',
      body: 'Six private experiences for one or two people, free while we pilot. Some run two hours; on the others you pick two or three. You are booking a local’s afternoon, not a seat on a bus, so the route bends to you on the day.',
      priceLine: '{price} · 1–2 people · 2 or 3 hours depending on the tour',
      countLine: '{n} experiences',
      notATour: {
        title: 'This is not a tour company.',
        body: 'There is no coach, no group, no flag and no commission. You book a few hours of a Shenzhen local’s time — free during our pilot — and everything you eat, ride or buy that day you pay for directly at local prices.',
      },
    },
    detail: {
      readMoreTitle: 'Read the full guide: {title}',
      moreBeats: '+{n} more stops',
      itinerary: 'How the day runs',
      itineraryNote: 'Times are elapsed from your meeting point, not clock times — you pick the start hour when you book.',
      tourLength: 'Tour length',
      customizable: 'Every tour can be changed to suit you. Tell us what you have in mind when you book.',
      includes: 'What is included',
      notIncluded: 'What is not included',
      goodFor: 'Good for',
      insiderTip: 'One thing worth knowing',
      meetingPoint: 'Meeting point',
      bestStart: 'Best start',
      district: 'District',
      duration: 'Duration',
      groupSize: 'Group size',
      groupSizeValue: '1–2 people',
      price: 'Price',
      priceNote: 'Free during the pilot — you pay nothing to book. What you eat, ride or buy on the day is yours, at local prices.',
      readMore: 'See the full tour',
      otherExperiences: 'Other experiences',
      bookCta: 'Reserve your spot',
      bookNote: 'Next you pick a day, a length — 2 or 3 hours — and a start time.',
      bookNoteFixed: 'Next you pick a day and a start time. This experience is {n} hours.',
      bookNoteGuest: 'No account needed. Tell us how to reach you — WhatsApp, WeChat or email — and your buddy messages you to set the day.',
      backToAll: 'All experiences',
    },
  },

  guide: {
    selectedPackage: {
      label: 'Selected experience',
      note: 'We have added it to your booking note — your buddy will see it. Change or clear it below before you send your request.',
      clear: 'Clear selection',
      change: 'Pick a different experience',
    },
  },

  footer: {
    tagline: 'Match with a local buddy in Shenzhen who shares your interests.',
    product: 'Product',
    account: 'Account',
    company: 'Company',
    discount: 'Free tours (pilot)',
    localHelp: 'Local help in Shenzhen',
    donate: 'Support us',
    about: 'About',
    contact: 'Contact',
    privacy: 'Privacy',
    terms: 'Terms',
    cancellation: 'Cancellation policy',
    rights: '© {year} Tensai Tech Inc.',
    pilot: 'Pilot release · Shenzhen 深圳',
    languageNote: 'Site language',
  },

  // Guest request form (/book) — the no-account way to ask for a tour while
  // GUEST_REQUESTS is on in src/lib/booking.ts.
  request: {
    title: 'Request this experience',
    kicker: 'No account needed',
    intro: 'Tell us how to reach you and your buddy will message you to set the day and time.',
    name: 'Your name',
    namePlaceholder: 'What should we call you?',
    contactHeading: 'How can we reach you?',
    contactHint: 'Fill in at least one. WhatsApp or WeChat gets the quickest reply.',
    whatsapp: 'WhatsApp',
    whatsappPlaceholder: '+1 555 123 4567',
    wechat: 'WeChat ID',
    wechatPlaceholder: 'your_wechat_id',
    phone: 'Phone',
    phonePlaceholder: '+852 ...',
    email: 'Email',
    emailPlaceholder: 'you@example.com',
    length: 'Tour length',
    hours: '{n} hours',
    when: 'When are you thinking of coming?',
    whenPlaceholder: 'e.g. 18–20 October, any evening',
    whenHint: 'Optional. Rough is fine — you and your buddy settle the exact time together.',
    message: 'Anything else?',
    messagePlaceholder: 'Who is coming, what you are into, anything to avoid…',
    submit: 'Send request',
    sending: 'Sending…',
    // Shown above the submit button on both booking forms while tours are
    // free (FREE_TOURS). The checkbox is required; tips stay optional.
    pledgeNote: 'Our tours are free, so a short, honest review after your tour means a lot to your buddy. All feedback is welcome, and tips are entirely optional.',
    pledgeCheck: 'Happy to leave a review after my tour',
    termsPrefix: 'By sending, you agree to our ',
    termsLink: 'Terms',
    termsAnd: ' and ',
    cancellationLink: 'Cancellation policy',
    termsSuffix: '.',
    errors: {
      package: 'Please pick an experience first.',
      name: 'Please tell us your name.',
      contact: 'Please give us at least one way to reach you.',
      email: 'That email address does not look right.',
      hours: 'Please pick a tour length.',
      long: 'One of the fields is a bit too long.',
      generic: 'Something went wrong on our side. Please try again, or message us on WhatsApp.',
      pledge: 'Please tick the box about leaving a review.',
    },
    thanksTitle: 'Request sent!',
    thanksBody: 'Your buddy will get back to you on the contact you gave to set the day and time. We confirm within 3 business days.',
    thanksFaster: 'Want a faster reply? Message us directly:',
    thanksBack: 'Back to the experience',
    thanksMore: 'All experiences',
    // Soft mention of the account route — what it offers, no "easier" claim.
    accountPrefix: 'Prefer to use an account? ',
    accountLogin: 'Log in',
    accountOr: ' or ',
    accountSignup: 'sign up',
    accountSuffix: ' to pick an exact time and message your buddy here on the site.',
  },

  partner: {
    bannerAlt: 'SplitWhom — split shared expenses with friends',
    kicker: 'From a friend',
    title: 'SplitWhom',
    body: 'BBQs, parties & trips — buy together, then track who paid what and settle up automatically.',
    cta: 'Try it',
  },

  // The account booking page (/guide) for travellers, plus the booking form
  // fields and requestBooking's error messages. Guide-only tools on the same
  // page (availability, approve/decline) stay English on purpose.
  // Several entries are sentence fragments around links; keep their leading
  // and trailing spaces — they are what separates words in English.
  booking: {
    fields: {
      startTime: 'Start time',
      endTime: 'End time',
      hours: '{n} hours',
      hoursShort: '{n}h',
      daysRun: 'Days run {min}–{max} hours.',
      tourLength: 'Tour length',
      hourTour: '{n} hour tour',
      free: 'Free',
    },
    notReadyTitle: 'Our guide is almost ready',
    notReadyBody: 'We\'re setting things up — please check back soon.',
    coverAlt: '{name}\'s cover',
    localGuide: 'Your local guide',
    withBrand: '{city} · with Shenzhen Buddies',
    reviewOne: '{n} review',
    reviewMany: '{n} reviews',
    newGuide: 'New guide — be among the first to explore with {name}',
    fullProfile: 'Full profile & reviews',
    highlights: {
      localTitle: 'A real local',
      localBody: 'A few hours with {name}, not a tour script.',
      speaksOne: 'Speaks {n} language',
      speaksMany: 'Speaks {n} languages',
      easyTalk: 'Easy to talk to',
      talkBody: 'Match the day to how you like to explore.',
      freeTitle: 'Free right now',
      freeBody: 'Tours cost nothing during our pilot. Really.',
      riskFreeTitle: 'Risk-free',
      riskFreeBody: 'Full refund if we can’t confirm your day.',
    },
    banners: {
      paid: 'Payment received! Your request is in — we\'ll confirm by email within 3 business days. If we can\'t confirm, you\'re fully refunded.',
      requested: 'Request sent! We\'ll confirm by email within 3 business days.',
      paymentCancelled: 'Payment cancelled — nothing was charged. You can pick a slot and try again.',
      cancelled: 'Booking cancelled. ',
      refund: '{amount} will be refunded within a few business days.',
      reopened: 'The day is open again if you change your mind.',
      noRefund: 'No refund applies under the cancellation policy.',
    },
    about: 'About {name}',
    hobbies: 'Hobbies',
    languages: 'Languages',
    personality: 'Personality',
    ideasTitle: 'Ideas for your day',
    ideasBody: 'A few ways {name} can show you around — tell them what you\'re into, and they\'ll shape the day with you.',
    ideas: [
      'Street food & dim sum',
      'Electronics & maker markets',
      'Skyline & city views',
      'Bakeries & coffee stops',
    ],
    bookTitle: 'Book a day together',
    introFreeFixed: 'Tours are free during our pilot — this one is a {n} hour tour, no payment, no card. One free tour per person at a time, so everyone gets a turn. Request a day and we confirm by email.',
    introFreeChoice: 'Tours are free during our pilot — pick a 2 or 3 hour tour, no payment, no card. One free tour per person at a time, so everyone gets a turn. Request a day and we confirm by email.',
    introPaid: 'Tours run from {min} to {max} hours at {rate}/hour ({low}–{high}). You pay when you book; if we can\'t confirm, you\'re fully refunded.',
    touristsOnly: 'Booking is open to tourists. ',
    createProfileLink: 'Create your profile',
    createProfileSuffix: ' as a tourist to request a day.',
    dateTime: '{date}, {time}',
    checkout: {
      prefix: 'You have a checkout in progress for ',
      middle: '. It\'s one booking per person at a time, so ',
      finish: 'finish paying',
      or: ' or ',
      release: 'release it',
      suffix: ' to pick a different time.',
    },
    live: {
      prefix: 'You already have a tour booked for ',
      suffix: '. Tours are free, so it\'s one booking per person at a time and everyone gets a turn — once it\'s done you\'re welcome to book another. Need a different day? Cancel it under “Your bookings” below first.',
    },
    noDates: 'No open dates right now — please check back soon.',
    availableDays: 'Available days',
    hoursOn: '{name}\'s hours on {date}: {ranges}',
    noteLabel: 'Anything {name} should know?',
    optional: '(optional)',
    notePlaceholder: 'What you\'d love to see, dietary needs, meeting point ideas…',
    policy: {
      title: 'Cancellation policy',
      free: 'The tour is free, and so is cancelling — just do it before the tour starts so the time slot opens up for someone else.',
      beforeConfirm: 'Before we confirm: ',
      fullRefund: 'full refund',
      anytime: ', anytime',
      before72: '72h+ before the tour: ',
      within72: '72–24h before: 90% refund (10% fee)',
      within24: 'Under 24h before: 20% refund (80% fee)',
      readFull: 'Read the full policy',
    },
    submit: {
      free: 'Request this day — it’s free',
      paid: 'Continue to payment',
      pendingFree: 'Sending request…',
      pendingPaid: 'Going to payment…',
      noteFree: 'Nothing to pay — we confirm by email within 3 business days.',
      notePaid: 'You pay {rate}/hour now to hold the day. We confirm within 3 business days — if we can’t, you’re fully refunded.',
    },
    agree: {
      prefix: ' By booking you agree to our ',
      terms: 'Terms',
      and: ' and ',
      cancellation: 'Cancellation Policy',
      suffix: '.',
    },
    support: {
      lead: 'The tours are free.',
      body: ' If you like what we\'re building, you can chip in to keep the pilot running.',
      cta: 'Support the pilot →',
    },
    mine: {
      title: 'Your requests',
      cancelFree: 'Cancelling is free, any time before the tour starts. ',
      cancelPaid: 'Cancellation: free up to 72h before · 10% fee within 72h · 80% fee within 24h. Before it\'s confirmed, you\'re always fully refunded. ',
      fullPolicy: 'Full policy',
      fullPolicySuffix: '.',
      refunded: '{amount} refunded',
      opening: 'Opening…',
      message: 'Message {name}',
      howWasIt: 'How was it? 👍👎',
      cancelling: 'Cancelling…',
      cancel: 'Cancel',
      cancelFullRefund: 'Cancel (full refund)',
      cancelFee: 'Cancel ({pct}% fee)',
      cancelNoRefund: 'Cancel (no refund)',
    },
    status: {
      pending_payment: 'Payment incomplete',
      pending: 'Awaiting confirmation (within 3 business days)',
      approved: 'Confirmed',
      rejected: 'Declined',
      cancelled: 'Cancelled',
    },
    anon: {
      guest: 'Request without an account',
      guestNote: 'Leave your WhatsApp, WeChat or email and {name} will message you to set the time. Or, to pick an exact slot now:',
      signup: 'Sign up to book this day',
      loginPrefix: 'Takes under a minute. Already have an account? ',
      loginSuffixFree: '. This day stays open while you do — and the tour itself is free during our pilot.',
      loginSuffixPaid: '. This day stays open while you do — and if {name}\'s day can\'t be confirmed, you\'re fully refunded.',
    },
    errors: {
      touristsOnly: 'Only tourists can request a booking. Set your role on your profile.',
      pickDay: 'Pick a day first.',
      pastDay: 'That day has already passed — pick another one.',
      startTime: 'Pick a valid start time.',
      lengthRange: 'Tours run from {min} to {max} hours.',
      freeLengths: 'Pick one of the free tour lengths: {lengths} hours.',
      or: ' or ',
      checkBookings: 'Could not check your bookings — please try again.',
      liveBooked: 'You already have a tour booked for {when}. Tours are free, so it\'s one booking per person at a time — cancel it first if you\'d like a different one.',
      notAvailable: 'The guide is not available on that day.',
      checkAvailability: 'Could not check availability — please try again.',
      slotTaken: '{range} isn\'t available on that day — it\'s outside the guide\'s hours or too close to another booking. Pick a listed slot.',
      justBooked: 'Sorry — that time was just booked by someone else.',
      alreadyBooked: 'You already have a tour booked. Tours are free, so it\'s one booking per person at a time — cancel it first if you\'d like a different one.',
      createFailed: 'Could not create the booking.',
      cancelMissing: 'Missing booking id.',
      cancelNotFound: 'Booking not found.',
      cancelNotYours: 'That is not your booking.',
      cancelClosed: 'This booking can no longer be cancelled.',
      cancelChanged: 'This booking was just updated — please refresh.',
    },
  },
  // Contact page (/contact). Company and team names in the facts grid stay in
  // the page: they are proper nouns, not copy.
  contact: {
    hero: {
      kicker: 'Get in touch',
      // Rendered lead + highlighted accent + tail with no spaces added in
      // between, so each language decides its own spacing.
      titleLead: "We'd ",
      titleAccent: 'love',
      titleTail: ' to hear from you.',
      body: 'Two humans on the other end. We try to reply within two business days.',
      imageAlt: 'Shenzhen at night',
    },
    channels: {
      email: {
        title: 'Say hello',
        description: 'Questions, feedback, partnership ideas, or just a friendly hi. We read every message.',
        cta: 'Email us',
      },
      whatsapp: {
        title: 'WhatsApp',
        description: 'The quickest way to reach us before or during your trip. Message us and we reply from Shenzhen, usually the same day.',
        cta: 'Chat on WhatsApp',
      },
      wechat: {
        title: 'WeChat',
        description: 'Already on WeChat? Add our founder Bryan by ID and send a quick hello so we know who you are.',
        copy: 'Copy ID',
        copied: 'Copied',
      },
      guide: {
        title: 'Become a guide',
        description: 'Living in Shenzhen and want to host visitors? Apply and we’ll fast-track your profile review.',
        cta: 'Apply',
      },
      press: {
        title: 'Press',
        description: 'Working on a story? We have founder bios, screenshots, and stats ready to share.',
        cta: 'Press kit',
      },
      safety: {
        title: 'Safety',
        description: 'Concerned about another user? Report it from their profile, or email our trust & safety team.',
        cta: 'Safety contact',
      },
    },
    facts: {
      kicker: 'The facts',
      title: 'In case you wondered.',
      company: 'Company',
      founded: 'Founded',
      foundedValue: '2026 · Toronto + Shenzhen',
      team: 'Team',
      stage: 'Stage',
      stageValue: 'Pilot — Shenzhen first',
    },
    cta: {
      title: 'Or just sign up and explore.',
      body: 'The fastest way to understand the product is to use it.',
      join: 'Join the pilot',
      explore: 'Explore Shenzhen',
    },
  },

  // About page (/about). Founder names stay in the page; bios are ours, not
  // user-generated, so they are translated here.
  about: {
    hero: {
      badge: 'Pilot · Shenzhen first',
      titleLead: 'Built for explorers, and the locals who ',
      titleAccent: 'love their city.',
      body: 'Shenzhen Buddies matches travelers with locals who share their interests. You (and a friend, if you like), one local, no tour bus.',
      imageAlt: 'A bowl of crayfish and a lift of noodles on a Shenzhen table',
    },
    why: {
      kicker: 'Why we built this',
      title: 'Tourists deserve more than tour buses.',
      body: "Friends kept telling us the food was incredible, the people were warm — but they spent half their trip translating menus and arguing with map apps. The missing piece wasn't a slicker booking site. It was a person.",
    },
    pillars: {
      interests: {
        title: 'Matched on interests',
        body: 'Not a list of dates. A real person who cares about the same food, art, gadgets, or hikes you do.',
      },
      casual: {
        title: 'Casual, not commercial',
        body: 'Locals here aren’t licensed tour operators. They’re neighbors who’d show a visiting friend around the same way.',
      },
      trust: {
        title: 'Earned trust',
        body: 'Reviews only surface once a profile has enough interactions. First impressions stay honest.',
      },
    },
    team: {
      kicker: 'The team',
      title: 'Two people. One city. A second one soon.',
    },
    founders: {
      bryan: {
        role: 'CEO · Shenzhen',
        bio: 'Native Chinese but have spent 8+ years in Canada. I love both countries 🇨🇦🇨🇳 Comfortable with adventure and meeting new people 🚵‍♂️ Currently based in Shenzhen — a coffee or a walk around the city on the weekend would be nice ☕🚶‍♂️',
      },
      taka: {
        role: 'CTO · Toronto',
        bio: 'Engineer from Japan, based in Toronto after ten-plus years in software. I build and look after everything technical here — the bookings, the payments, the page you are reading 💻',
      },
    },
    together: {
      kicker: 'Off the clock',
      sunsetAlt: 'Bryan and Takahiro by the water at sunset',
      sunsetCaption: 'Sunset by the lake',
      bbqAlt: 'Bryan and Takahiro over Korean BBQ',
      bbqCaption: 'Plotting over Korean BBQ',
    },
    quote: "Every good day we've had in a new city started the same way: someone who lived there said, “come on, I'll show you.”",
    cta: {
      title: "Come along while it's small.",
      body: 'Tours are free during the pilot, the two of us look at every new sign-up ourselves, and what early users ask for decides what we build next.',
      join: 'Join the pilot',
      talk: 'Talk to us',
    },
  },

  // District guide (/explore). Photo credits (author, licence, source) stay in
  // the page: they are attribution data and must match the source exactly.
  explore: {
    hero: {
      kicker: 'Explore',
      title: 'Six districts, six different cities.',
      body: 'Shenzhen is too big to “see” in a day. Pick the part that matches what you came for — and meet someone who lives there.',
      cta: 'Meet a local',
      imageAlt: 'Shenzhen towers lit blue at night, seen from street level',
    },
    findGuide: 'Find a guide',
    // `sub` is the small second line under the district name on each tile.
    districts: {
      nanshan: {
        name: 'Nanshan',
        sub: '南山',
        blurb: "The tech end of the city, and the green one. Company headquarters and universities inland, Shenzhen Bay and the coastal park on the water side, Shekou's expat bars and ferry pier further west.",
        alt: 'The shell-like perforated roof of Shenzhen Bay Sports Center in Nanshan, against a clear sky',
      },
      futian: {
        name: 'Futian',
        sub: '福田',
        blurb: 'The central business district — the tallest towers, the civic centre, and the checkpoint most people cross from Hong Kong. Lianhuashan park is the climb everyone does for the skyline view back over it.',
        alt: 'Ping An Finance Centre, the tapered supertall tower in Futian, rising into a blue sky',
      },
      luohu: {
        name: 'Luohu',
        sub: '罗湖',
        blurb: 'Where the city started, and where most first-timers arrive — the Luohu crossing puts you a short walk from the old downtown. Dongmen’s market streets are here, and the food is older and cheaper than the towers to the west.',
        alt: 'The Guangzhou–Shenzhen intercity railway entrance at Luohu station, with its blue signage',
      },
      baoan: {
        name: "Bao'an",
        sub: '宝安',
        blurb: 'The airport district, and the one that actually makes things — workshops and factories that supply the markets downtown. The coastal strip has been rebuilt with parks and a promenade worth the trip out.',
        alt: "Shenzhen Bao'an International Airport Terminal 3 from above, its white perforated roof spread across the apron",
      },
      longhua: {
        name: 'Longhua',
        sub: '龙华',
        blurb: 'The high-speed rail gateway — trains to Guangzhou in half an hour and most of the country from the same hall. Around the station it is manufacturing and dense new housing, with prices that pull younger residents north.',
        alt: 'The roofline of Shenzhen North Railway Station in Longhua, with 深圳北站 in red characters',
      },
      longgang: {
        name: 'Longgang',
        sub: '龙岗',
        blurb: 'The outer east — the Universiade complex built for the 2011 games, big tech campuses, and the point where the city thins out into hills and reservoirs. Furthest from the border, and the least touristed of the six.',
        alt: 'The faceted green crystal roofs of the Universiade Sports Centre in Longgang',
      },
    },
    moments: {
      kicker: 'Moments',
      title: 'A day in Shenzhen, give or take.',
      // Lead + gallery link + tail, joined with no added spaces.
      bodyLead: 'Our own photos, not stock. ',
      galleryLink: 'See the whole gallery',
      bodyTail: '.',
      // Alt text, in the same order as the photos in the page.
      alts: [
        'A night market stall of skewered insects in Shenzhen',
        'Chopsticks lifting noodles beside a bowl of garlic crayfish',
        'Single-board computers and jumper wires on a workbench',
        'A Shenzhen tower lit white at night above a pedestrian walkway',
        'Poached chicken over rice with ginger-scallion oil and greens',
        'Clip-top jars of kumquats and plums preserved in syrup',
        'Sourdough rounds and baguettes on a Shenzhen bakery counter',
        'An AR headset opened on a bench with its ribbon cables exposed',
      ],
    },
    closing: {
      title: "Don't see what you're after?",
      body: "Tell a local what you like — hiking, electronics, late-night jazz, tea ceremonies — and we'll match you with someone who actually does it.",
      cta: 'Get matched',
    },
    credits: {
      title: 'District photo credits',
      body: 'District photographs are from Wikimedia Commons, cropped to the building. Adaptations of share-alike originals are offered under the same licence. The hero and the Moments strip above are our own.',
    },
  },
  // Guide listing (/browse) and its filter drawer. The *Names maps translate
  // the fixed language/hobby/trait tags for display only — keys are the
  // lower-cased stored value, which stays English in the database.
  browse: {
    heroAlt: 'Shenzhen at dusk',
    kicker: 'Discover',
    title: 'Browse buddies',
    introAnon: 'Local guides in Shenzhen — browse who you could spend a day with, no account needed.',
    introTouristMatch: 'Local guides in Shenzhen — sorted by match with your profile.',
    introTouristRecent: 'Local guides in Shenzhen — most recent first.',
    introGuideMatch: 'Tourists looking for a buddy — sorted by match with your profile.',
    introGuideRecent: 'Tourists looking for a buddy — most recent first.',
    introNoRole: 'Pick a role on your profile to see matches.',
    signUpToConnect: 'Sign up to connect',
    searchPlaceholder: 'Search names or bios…',
    search: 'Search',
    searching: 'Searching…',
    filters: 'Filters',
    closeFilters: 'Close filters',
    close: 'Close',
    activeCount: '{n} active',
    refine: 'Refine your matches',
    languages: 'Languages',
    languagesSelected: '{n} selected — must speak at least one',
    anyLanguage: 'any language',
    hobbies: 'Hobbies',
    hobbiesSelected: '{n} selected — must enjoy at least one',
    anyHobby: 'any hobby',
    traits: 'Personality traits',
    traitsSelected: '{n} selected — must share at least one vibe',
    anyVibe: 'any vibe',
    minRating: 'Minimum rating',
    minRatingSelected: '{n}+ stars only',
    anyRating: 'any rating',
    any: 'Any',
    minReviews: 'Minimum reviews',
    reviewsAtLeast: '{n}+ reviews',
    anyCount: 'any count',
    greatOnly: 'Great matches only',
    withPhoto: 'With photo',
    activeRecently: 'Active in last 30 days',
    sort: 'Sort',
    sortMatch: 'Best match',
    sortRated: 'Highest rated',
    sortRecent: 'Most recent',
    apply: 'Apply filters',
    applying: 'Applying…',
    reset: 'Reset',
    clearAll: 'Clear all',
    countOne: '{n} match',
    countOther: '{n} matches',
    roleFirstTitle: 'Set your role first.',
    roleFirstBody: 'Tourists match with guides and vice versa.',
    roleFirstLink: 'Go to your profile →',
    loadError: "Couldn't load profiles: {error}",
    empty: 'No matching profiles yet. Try a different filter or invite friends to sign up.',
    chipHobbies: 'Hobbies',
    chipLanguages: 'Languages',
    chipTraits: 'Traits',
    message: 'Message',
    opening: 'Opening…',
    signUpToMessage: 'Sign up to message',
    aiKicker: 'AI suggested',
    aiTitle: 'Your best matches in Shenzhen.',
    why: 'Why: {reasons}',
    whySpeaks: 'speaks {list}',
    whyInto: 'into {list}',
    whyFeels: 'feels {list}',
    whySameCity: 'in your city',
    whyAllRound: 'A solid all-round match.',
    // Joins two shared tags inside one reason ("English & Mandarin").
    listJoin: ' & ',
    badgeShared: '{n} shared',
    badgeSameCity: 'same city',
    badgeMatch: 'match',
    // Cities as profiles store them. Unknown cities are shown as written.
    cityNames: {
      shenzhen: 'Shenzhen',
      'hong kong': 'Hong Kong',
      guangzhou: 'Guangzhou',
    },
    languageNames: {
      english: 'English',
      mandarin: 'Mandarin',
      cantonese: 'Cantonese',
      japanese: 'Japanese',
      korean: 'Korean',
      spanish: 'Spanish',
      french: 'French',
      german: 'German',
      italian: 'Italian',
      portuguese: 'Portuguese',
      vietnamese: 'Vietnamese',
    },
    hobbyNames: {
      'street food': 'street food',
      'dim sum': 'dim sum',
      coffee: 'coffee',
      tea: 'tea',
      hiking: 'hiking',
      photography: 'photography',
      art: 'art',
      design: 'design',
      architecture: 'architecture',
      electronics: 'electronics',
      makers: 'makers',
      jazz: 'jazz',
      karaoke: 'karaoke',
      history: 'history',
      museums: 'museums',
      yoga: 'yoga',
      running: 'running',
    },
    traitNames: {
      curious: 'curious',
      outgoing: 'outgoing',
      patient: 'patient',
      observant: 'observant',
      creative: 'creative',
      thoughtful: 'thoughtful',
      easygoing: 'easygoing',
      witty: 'witty',
      kind: 'kind',
      warm: 'warm',
      calm: 'calm',
      fun: 'fun',
      adventurous: 'adventurous',
      direct: 'direct',
      energetic: 'energetic',
    },
  },

  // Public profile page (/u/[id]). Reuses browse.* for the tag chips.
  buddy: {
    coverAlt: "{name}'s cover",
    backToBrowse: '← Browse',
    roleGuide: 'Guide',
    roleTourist: 'Tourist',
    reviewCountOne: '{n} review',
    reviewCountOther: '{n} reviews',
    reviewed: 'Review submitted.',
    signUpToMessage: 'Sign up to message {name}',
    editProfile: 'Edit profile',
    sameRoleGuides: "Messaging is between tourists and guides. You're both guides.",
    sameRoleTourists: "Messaging is between tourists and guides. You're both tourists.",
    messageName: 'Message {name}',
    reviews: 'Reviews',
    leaveReview: 'Leave a review',
    updateYourReview: 'Update your review',
    reviewHint: 'You can review your guide after your tour has finished.',
    comment: 'Comment',
    commentHint: '(optional, up to 5000 chars)',
    commentPlaceholder: 'Share what it was like meeting {name}…',
    submitReview: 'Submit review',
    updateReview: 'Update review',
    submitting: 'Submitting…',
    noReviews: 'No reviews yet.',
    hiddenOne: '{n} review — not visible yet',
    hiddenOther: '{n} reviews — not visible yet',
    hiddenNote: 'Reviews become public once a profile has at least {n} reviews.',
    // Stands in for a reviewer whose profile we may not show.
    traveler: 'Traveler',
    // Written into ?error= by ./u/[id]/actions.ts and shown as-is.
    errors: {
      stars: 'Pick between 1 and 5 stars.',
      self: "You can't review yourself.",
      notYet: 'You can leave a review after your tour with this guide has finished.',
      generic: 'Could not save your review — please try again.',
    },
  },

  // Post-tour review page (/guide/review/[id]) and its actions' errors.
  review: {
    back: '← Your bookings',
    title: 'How was your tour?',
    when: '{when} · with {name}',
    yourGuide: 'your guide',
    tipped: 'Tip received — thank you! 100% of it goes to {name}.',
    thanks: 'Thanks — your review is in.',
    notFinished: 'Your tour has not finished yet — come back here afterwards to leave a review.',
    notConfirmed: 'This booking is not a confirmed tour, so there is nothing to review.',
    changeRating: 'Change your rating',
    oneTap: 'One tap is enough',
    saving: 'Saving…',
    words: 'A few words',
    // The limits are MIN/MAX_REVIEW_WORDS (and _CHARS for Chinese and
    // Japanese, which are counted by character) in src/lib/review-length.
    wordsHint: '(optional, 5–50 words)',
    placeholder: 'What stood out — good or bad?',
    note: "Tapping a thumb saves your review. Honest reviews — good or bad — are published on {name}'s profile.",
    tipTitle: 'Want to leave {name} a tip?',
    tipBody: 'Totally optional — the tour stays free either way. 100% goes to {name}.',
    errors: {
      notFound: 'Booking not found.',
      notApproved: 'Only confirmed tours can be reviewed.',
      notFinished: 'You can review once your tour has finished.',
      thumb: 'Pick thumbs up or thumbs down.',
      noGuide: 'No guide to review.',
      words: 'A written review is {min}–{max} words (yours is {n}). Or leave it empty — the thumb is enough.',
      chars: 'A written review is {min}–{max} characters (yours is {n}). Or leave it empty — the thumb is enough.',
      rls: 'You can leave a review once your tour has finished.',
      generic: 'Could not save your review — please try again.',
      tipAmount: 'Pick a tip between CA$1 and CA$500 (whole dollars).',
      tipCheckout: 'Could not start the tip payment — please try again.',
    },
  },

  // /review — the open review link the guide shares with tourists whose tour
  // was arranged outside the website. Posting also creates their account.
  openReview: {
    kicker: 'Shenzhen Buddies',
    title: 'How was your time with {name}?',
    sub: 'Leave a review and create your account in one go. It takes about a minute.',
    subSignedIn: "You're signed in, so just pick your stars and add a few words.",
    haveAccount: 'Already have an account?',
    rating: 'Your rating for {name}',
    words: 'A few words',
    placeholder: 'What stood out — good or bad?',
    name: 'Your name',
    nameHint: 'Shown next to your review.',
    photo: 'Profile photo',
    optional: '(optional)',
    accountHint: 'This creates your Shenzhen Buddies account, so you can book your next outing with it.',
    pending: 'Posting…',
    submit: 'Post review & create account',
    submitSignedIn: 'Post review',
    consent: "Your review, name and photo are published on your guide's profile. By posting, you agree to our Terms and Privacy Policy.",
    thanks: 'Thank you — your review is posted!',
    live: "It's now on {name}'s profile.",
    checkEmail: "Your review is live. We've emailed you a link to confirm your address — open it to finish setting up your account.",
    seeProfile: "See {name}'s profile",
    invalidLink: "This review link isn't valid. Please ask your guide for the latest link.",
    errors: {
      invalidLink: "This review link isn't valid. Please ask your guide for the latest link.",
      noGuide: 'Reviews are not open right now.',
      stars: 'Pick from 1 to 5 stars.',
      name: 'Enter your name (up to 60 characters).',
      words: 'A written review is {min}–{max} words (yours is {n}). Or leave it empty — the stars are enough.',
      chars: 'A written review is {min}–{max} characters (yours is {n}). Or leave it empty — the stars are enough.',
      photoSize: 'That photo is too large — please pick one under 3 MB.',
      photoType: 'Please use a JPEG, PNG, WebP or GIF photo.',
      self: "You can't review yourself.",
      email: 'Enter your email address.',
      password: 'Your password needs at least 8 characters.',
      exists: 'That email already has an account. Log in first, then come back to this page.',
      rateLimit: 'Too many sign-ups just now — please try again in a few minutes.',
      signup: 'Could not create your account — check your email address and try again.',
      generic: 'Could not save your review — please try again.',
    },
  },

  // Inbox (/messages) and a single thread (/messages/[id]).
  messages: {
    unread: '{n} unread',
    emptyTitle: 'No conversations yet',
    emptyBody: 'Find someone on Browse who shares your interests and start the first hello.',
    unknownUser: 'Unknown user',
    youPrefix: 'You: ',
    noMessagesYet: 'No messages yet — say hi!',
    justNow: 'just now',
    minutesAgo: '{n}m',
    hoursAgo: '{n}h',
    daysAgo: '{n}d',
    back: 'Back to messages',
    threadEmpty: 'No messages yet. Say hi!',
    placeholder: 'Write a message…',
    send: 'Send',
    hint: 'Enter to send · Shift + Enter for a new line',
  },

  // Accessible labels for <StarRating> / <StarRatingInput>.
  stars: {
    outOf: '{value} out of 5',
    starOne: '{n} star',
    starOther: '{n} stars',
  },

  // /gallery — page chrome, filter chips, grid and lightbox. Photo titles and
  // captions live in src/content/gallery.ts and stay English.
  gallery: {
    kicker: 'Gallery',
    title: 'Shenzhen, as we actually found it.',
    intro: "Every frame here was shot by us or by a buddy, in a place we would actually take you. If a photo isn't of this city, it isn't on this page.",
    emptyTitle: 'The first batch is being shot.',
    emptyBody: 'We would rather show you nothing than show you stock photos of a different city — so this page fills up as the real ones come back.',
    emptyCta: 'Meet a local instead',
    filterLabel: 'Filter photos by location',
    all: 'All',
    // Keyed by LocationId in src/content/gallery.ts. `short` is the chip,
    // `label` is the lightbox heading.
    locations: {
      huaqiangbei: { label: 'Huaqiangbei — electronics megamarket', short: 'Huaqiangbei' },
      futian: { label: 'Futian — the modern downtown', short: 'Futian' },
      'oct-loft': { label: 'OCT-Loft — art & design', short: 'OCT-Loft' },
      dafen: { label: 'Dafen Village — oil-painting alleys', short: 'Dafen Village' },
      shekou: { label: 'Shekou & the coast', short: 'Shekou' },
      dongmen: { label: 'Dongmen — old-town street food', short: 'Dongmen' },
      other: { label: 'Elsewhere in Shenzhen', short: 'Elsewhere' },
    },
    openPhoto: 'Open {title}',
    dialogLabel: '{title} — photo {n} of {total}',
    close: 'Close',
    prev: 'Previous photo',
    next: 'Next photo',
    cta: 'Have a local show you this',
  },

  // Share buttons on blog posts and gallery photos (src/components/ShareLinks).
  share: {
    copyLink: 'Copy link',
    copyInstagram: 'Copy Instagram link',
    linkCopied: 'Link copied',
    instagramCopied: 'Instagram link copied',
    copyFailed: 'Could not copy the link — it is in the address bar',
    instagramCopyFailed: 'Could not copy the instagram link — it is in the address bar',
    shareFailed: 'Could not share the link — it is in the address bar',
  },

  // /blog index chrome. Post titles, excerpts and bodies are English-only.
  blog: {
    kicker: 'Field notes',
    title: 'Field notes on Shenzhen',
    description: 'Border crossings, payments, neighbourhoods and the people who live here. The things worth knowing before you arrive.',
    filterLabel: 'Filter posts by topic',
    everything: 'Everything',
    emptyLead: 'Nothing here yet. ',
    emptyLink: 'See everything instead',
    emptySuffix: '.',
    minRead: '{n} min read',
    readIt: 'Read it',
    // Article page chrome (/blog/[slug]). The article itself stays English.
    commonQuestions: 'Common questions',
    readNext: 'Read next',
    ctaLabel: 'Have a local show you around',
    ctaBody: 'Matched on what you are actually into, not on a fixed itinerary.',
    // Button on the inline call-out cards inside an article.
    ctaButton: 'Find a buddy',
    lastChecked: 'Last checked: {date}. Border and visa rules change — confirm anything time-sensitive with an official source before you travel.',
    // Keyed by Pillar in src/content/posts/types.ts.
    pillars: {
      logistics: {
        label: 'Getting around',
        blurb: 'Borders, payments, phones — the friction between you and the city.',
      },
      neighborhoods: {
        label: 'Neighbourhoods',
        blurb: 'One area at a time, walked properly.',
      },
      interests: {
        label: 'By interest',
        blurb: 'A day built around the thing you actually came for.',
      },
      buddies: {
        label: 'Buddies',
        blurb: 'The locals showing people around, in their own words.',
      },
    },
  },

  // /local-help — the page written for "get local help in Shenzhen" searches.
  // Only claims what a buddy already does on the homepage's promise list; the
  // emergency numbers are the national mainland ones.
  localHelp: {
    heroAlt: 'Crayfish noodles lifted from the bowl at a Shenzhen restaurant',
    kicker: 'Visiting Shenzhen',
    title: 'Get local help in Shenzhen from someone who lives here.',
    body: 'Shenzhen runs on phone payments, and many of the apps you use at home do not work here. Book a local for 2 or 3 hours and sort it out together.',
    primaryCta: 'Book a local, free',
    secondaryCta: 'Ask us a question',
    helpWith: {
      kicker: 'What a local can help with',
      title: 'The things visitors get stuck on.',
      items: [
        {
          title: 'Paying for things',
          body: 'Many places do not take foreign cards. Your buddy helps you set up Alipay and WeChat Pay on your phone and you test them together, so you are not stuck at the till later.',
        },
        {
          title: 'Ordering food',
          body: 'Menus are in Chinese, and many restaurants take orders through a QR code at the table. Your buddy talks you through the dishes and places the order with you.',
        },
        {
          title: 'Getting around',
          body: 'Your buddy shows you how the metro QR code works and which exit to take. When it is time to head back, they call a ride and tell the driver where you are going.',
        },
        {
          title: 'Talking to people',
          body: 'Your buddy does the talking at market stalls, at shop counters and in taxis, so you do not have to rely on a translation app.',
        },
        {
          title: 'Fair prices',
          body: 'In markets like Huaqiangbei, your buddy asks the local price for you. Nothing you buy passes through us, and we take no cut.',
        },
        {
          title: 'Knowing where to go',
          body: 'Your buddy can tell you which district suits what you are into and where people who live here go to eat.',
        },
      ],
    },
    how: {
      kicker: 'How to get help',
      title: 'Three small steps.',
      steps: [
        {
          title: 'Say what you need',
          body: 'Pick an experience, or just tell us what you want help with — payments, food, a district to explore.',
        },
        {
          title: 'Pick a day',
          body: 'Open days are listed live. Request 2 or 3 hours for free, and we reply by email within three business days.',
        },
        {
          title: 'Meet your local',
          body: 'Message each other beforehand, meet where you agreed, and work through your list together.',
        },
      ],
    },
    limits: {
      kicker: 'Good to know',
      title: 'What we are not.',
      body: 'A buddy is a local who spends a few hours with you. We are not an emergency service, a visa agent or a 24-hour helpline. In an emergency anywhere in mainland China, call 110 for the police, 120 for an ambulance or 119 for the fire service.',
    },
    reading: {
      kicker: 'Before you arrive',
      title: 'Read up first.',
    },
    faq: {
      kicker: 'Questions',
      title: 'Common questions about getting help in Shenzhen.',
      items: [
        {
          q: 'How can a foreigner get local help in Shenzhen?',
          a: 'Book a local buddy on Shenzhen Buddies. Pick a day and request 2 or 3 hours. Once we confirm, someone who lives in Shenzhen meets you and helps with payments, food and getting around. It is free during our pilot.',
        },
        {
          q: 'Do I need to speak Chinese?',
          a: 'No. Your buddy handles the conversations in Chinese, so you do not need to.',
        },
        {
          q: 'Can someone help me set up Alipay or WeChat Pay?',
          a: 'Yes. Your buddy can set both up on your phone with you and check they work before you need them.',
        },
        {
          q: 'Is this a tour guide service?',
          a: 'Not in the usual sense. There is no coach and no fixed script, just one local with you (and a friend, if you like), and the plan can change as you go.',
        },
        {
          q: 'How much does it cost?',
          a: 'Nothing during the pilot — no card, no deposit. If we cannot confirm your day, we tell you straight away.',
        },
      ],
    },
    final: {
      title: 'Need a hand in Shenzhen?',
      body: 'Pick a day and meet a local who knows the city. Free while we pilot.',
      primaryCta: 'See open days',
      secondaryCta: 'Contact us',
    },
  },

  // /welcome — the landing page linked from social bios.
  welcome: {
    heroAlt: 'Shenzhen skyline at dusk',
    badge: 'Pilot season · every tour is free',
    titleLead: 'Your first day in Shenzhen, ',
    titleAccent: 'free.',
    body: 'Skip the tour bus. Spend 2 or 3 hours with someone who lives here and knows where the food is. While we’re piloting, it costs you nothing.',
    ticketLabel: 'Pilot price',
    ticketFree: 'FREE',
    ticketNoCode: 'no code needed',
    ticketNote: 'No card, no deposit, no checkout — just pick a day',
    primaryCta: 'Book my free day →',
    secondaryCta: 'See the experiences',
    trust: ['Free 2 or 3 hour tours', 'No card, no deposit', 'Confirmed by email'],
    deal: {
      kicker: 'The pilot deal',
      titleLead: 'Your buddy’s time, for ',
      titleAccent: 'nothing.',
      body: 'While we get Shenzhen Buddies off the ground, every tour is free — pick a 2 or 3 hour day with a local buddy. There is no payment step at all: request a day, and we confirm by email within three business days.',
      cta: 'Pick a day',
      exampleLabel: 'Example · a 3-hour tour',
      rateNote: 'The usual CA$10/hour rate is off during the pilot',
      rows: {
        length: 'Tour length',
        lengthValue: '2 or 3 hours',
        time: 'Your buddy’s time',
        timeValue: 'Free',
        extras: 'What you eat & ride',
        extrasValue: 'Local prices, paid direct',
        payment: 'Payment step',
        paymentValue: 'None',
      },
    },
    how: {
      kicker: 'How it works',
      title: 'Booked in three taps.',
      steps: [
        {
          title: 'Pick your day',
          body: 'Choose an open date, then a 2 or 3 hour tour — your pick.',
        },
        {
          title: 'Request it, free',
          body: 'No card, no checkout. Your request goes straight to your buddy.',
        },
        {
          title: 'Get confirmed',
          body: 'We confirm by email within 3 business days. Then just show up.',
        },
      ],
    },
    why: {
      kicker: 'Why book a buddy',
      title: 'The opposite of a tour bus.',
      items: [
        {
          title: 'A local, not a script',
          body: 'A few hours with someone who actually lives here and likes showing people around.',
        },
        {
          title: 'Completely free',
          body: 'The pilot costs you nothing. If the day deserved it, you can tip your buddy afterwards — that part is up to you.',
        },
        {
          title: 'Nothing at stake',
          body: 'No payment means nothing to refund. If we can’t confirm your day, we tell you straight away and you’ve lost nothing.',
        },
      ],
    },
    honest: {
      kicker: 'The honest part',
      title: 'No reviews yet.',
      body: "We only just opened, and reviews here will only ever come from real, completed bookings — we don't write our own. Book a day and be the first to say how it actually went.",
    },
    faq: {
      kicker: 'Good to know',
      title: 'Before you book',
      items: [
        {
          q: 'Is it really free?',
          a: 'Yes. While we pilot the service, your buddy’s time costs nothing — no card, no deposit, no checkout page. Anything you eat, ride or buy on the day you pay for directly, at local prices.',
        },
        {
          q: 'What’s the catch?',
          a: 'There isn’t one. We’re new and we’d rather earn reviews than revenue right now. If you loved your day, you can leave a tip or a donation — both optional.',
        },
        {
          q: 'How long is a tour?',
          a: 'Most tours run 2 or 3 hours, your choice. Talent Park and Shekou run 2. Always private: you (and a friend, if you like) and your buddy.',
        },
        {
          q: 'Can I book more than one tour?',
          a: 'One at a time. Tours are free, so we keep it to one booking per person until that tour is done — that way everyone gets a turn. Once it’s over, you’re welcome to book another.',
        },
        {
          q: 'When will I know it’s confirmed?',
          a: 'We confirm by email within 3 business days of your request.',
        },
      ],
    },
    final: {
      title: 'Shenzhen is better with a friend.',
      body: 'Pick a date and book your first day out — completely free while we pilot.',
      primaryCta: 'Book my free day →',
      secondaryCta: 'I already have an account',
    },
  },
  // Auth pages: /login, /signup, /forgot-password, /reset-password. errors are
  // looked up by src/lib/auth-errors.ts — codes our actions set, plus the few
  // Supabase messages visitors actually hit (English kept verbatim).
  auth: {
    email: 'Email',
    password: 'Password',
    minLength: 'At least 8 characters.',
    login: {
      kicker: 'Welcome back',
      title: 'Log in',
      resume: "We'll take you right back to where you left off.",
      forgot: 'Forgot password?',
      pending: 'Logging in…',
      submit: 'Log in',
      noAccount: 'No account?',
      signupLink: 'Sign up',
      bannerAlt: 'SplitWhom — split shared expenses with friends',
      photoAlt: 'Shenzhen at night',
    },
    signup: {
      kicker: 'Get started',
      title: 'Create your account',
      sub: 'Free during pilot. Takes under a minute.',
      checkEmail: 'Check your email to confirm your address, then log in.',
      pending: 'Signing up…',
      submit: 'Sign up',
      haveAccount: 'Already have an account?',
      loginLink: 'Log in',
      photoAlt: 'Skewers grilling at a Shenzhen night-market stall',
      panelTitle: 'Casual. Personal. Free for now.',
      panelBody:
        'Match by what you actually like — language, food, art, hiking, electronics — and meet a local who knows the spot.',
      points: ['Free during the pilot', 'Cancel anytime', 'Reviewed by the community'],
    },
    forgot: {
      kicker: 'Forgot your password?',
      title: 'Reset password',
      body: "Enter your email and we'll send you a link to set a new password.",
      sent: 'If an account exists for that email, a reset link is on its way. Check your inbox.',
      pending: 'Sending…',
      submit: 'Send reset link',
      remembered: 'Remembered it?',
      loginLink: 'Log in',
    },
    reset: {
      kicker: 'Almost there',
      title: 'Set a new password',
      newPassword: 'New password',
      confirm: 'Confirm new password',
      pending: 'Updating…',
      submit: 'Update password',
    },
    errors: {
      tooShort: 'Password must be at least 8 characters.',
      mismatch: 'Passwords do not match.',
      openLink: 'Open the reset link from your email to set a new password.',
      expired: 'Your reset link expired. Request a new one.',
      invalidCredentials: 'Invalid login credentials',
      emailNotConfirmed: 'Email not confirmed',
      userExists: 'User already registered',
      rateLimit: 'Email rate limit exceeded',
      linkInvalid: 'Email link is invalid or has expired',
      samePassword: 'New password should be different from the old password.',
    },
  },

  // /donate. errors are keyed by the code ./actions puts in ?error=.
  donate: {
    kicker: 'Support the pilot',
    titleLine1: 'The tours are free.',
    titleLine2: "Running them isn't.",
    body: "While we get Shenzhen Buddies off the ground, every tour is free — no booking fee, no hourly rate. If a day out with a buddy made your trip better, or you just like what we're building, a small donation helps cover the guides' time and keeps the pilot going. Any amount, any time — booking or no booking.",
    thanks: 'Thank you! Your donation came through — it genuinely keeps this running.',
    bookPrefix: "Haven't booked yet? ",
    bookLink: 'Book a free tour first',
    bookSuffix: ' — that helps us even more.',
    errors: {
      setup: 'Donations are not set up yet — thank you for the thought!',
      amount: 'Pick an amount between CA$1 and CA$500 (whole dollars).',
      checkout: 'Could not start the payment — please try again.',
    },
  },

  // SupportPanel — the amount picker shared by /donate and the post-tour tip
  // step. donation/tip hold the wording that differs by kind.
  support: {
    chooseAmount: 'Choose an amount',
    presets: 'Preset amounts',
    customPlaceholder: 'Custom amount (CA$)',
    customLabel: 'Custom amount in Canadian dollars',
    customInvalid: 'Pick a whole amount between CA${min} and CA${max}.',
    opening: 'Opening…',
    or: 'or',
    paypalError: 'Something went wrong with PayPal. Please try again.',
    footCardPaypal:
      'Paid securely by card via Stripe, or with PayPal. One-off, no account needed, and no perks attached — this is a thank-you, not a purchase.',
    footCard:
      'Paid securely by card via Stripe. One-off, no account needed, and no perks attached — this is a thank-you, not a purchase.',
    footPaypal:
      'Paid securely with PayPal. One-off, no account needed, and no perks attached — this is a thank-you, not a purchase.',
    donation: {
      notSetUp: 'Donations are not set up yet — thank you for the thought!',
      cardAmount: 'Donate CA${amount} by card',
      card: 'Donate by card',
      failed: 'Your donation could not be completed. Nothing was charged — please try again.',
      confirming: 'Confirming your donation…',
    },
    tip: {
      notSetUp: 'Tips are not set up yet — thank you for the thought!',
      cardAmount: 'Tip CA${amount} by card',
      card: 'Tip by card',
      failed: 'Your tip could not be completed. Nothing was charged — please try again.',
      confirming: 'Confirming your tip…',
    },
  },
}

// Deliberately NOT `as const`. A const assertion would type every value as its
// own string literal, and `const ja: Dictionary` would then be required to
// contain the English text verbatim — which is the opposite of the point.
// Widened inference gives `string`, so the shape is enforced and the content
// is free.
export type Dictionary = typeof en
