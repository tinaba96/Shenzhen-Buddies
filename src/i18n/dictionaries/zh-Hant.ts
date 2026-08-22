import type { Dictionary } from './en'

// Traditional Chinese. Written in standard written Chinese (書面語) with Hong
// Kong vocabulary preferences — 私隱 not 隱私, 訊息 not 消息, 帳號 not 账号 —
// rather than as a character-by-character conversion of the Simplified file.
//
// The register is a deliberate call. The largest Traditional-reading audience
// for this site is Hong Kong day-trippers, and full Cantonese colloquial would
// read warmly to them while being genuinely hard work for a Taiwanese reader.
// 書面語 with HK word choice reads native in Hong Kong and stays legible
// everywhere else, so that is what this file uses.
export const zhHant: Dictionary = {
  meta: {
    name: '繁體中文',
  },

  seo: {
    siteTitle: '深圳夥伴 Shenzhen Buddies',
    siteDescription:
      '在深圳，配對一位和你興趣相投的本地夥伴。隨性、私人，而且不貴。',
    toursTitle: '深圳四小時體驗 — Shenzhen Buddies',
    toursDescription:
      '六個一對一的四小時深圳體驗——華強北電子市場、東門小食、入黑後的天際線，以及由香港過關後的頭四小時。',
  },

  common: {
    hours: '{n} 小時',
    fourHours: '4 小時',
    oneOnOne: '一對一',
    perPerson: '每人',
    from: '起',
    readMore: '繼續閱讀',
    viewAll: '查看全部',
    back: '返回',
    seeDetails: '查看詳情',
    bookThis: '預訂這個體驗',
    planYourDay: '安排你的一天',
    findALocal: '找一位本地人',
    becomeAGuide: '成為嚮導',
    browseBuddies: '瀏覽夥伴',
    yourProfile: '我的資料',
    getStarted: '開始',
    alreadyHaveAccount: '已經有帳號？',
    logIn: '登入',
    signUp: '註冊',
    exploreFirst: '先逛逛深圳',
    freeDuringPilot: '試營運期間免費',
  },

  nav: {
    tours: '體驗',
    explore: '城區',
    gallery: '相簿',
    blog: '專欄',
    browse: '瀏覽',
    bookAGuide: '預訂嚮導',
    mySchedule: '我的行程',
    messages: '訊息',
    admin: '管理',
    openMenu: '開啟選單',
    closeMenu: '關閉選單',
    account: '帳號',
  },

  language: {
    label: '語言',
    choose: '選擇語言',
    switchTo: '切換至{language}',
    current: '目前語言',
    note: '你的選擇會記在這部裝置上。',
  },

  home: {
    hero: {
      badge: '深圳，現已開放配對',
      titleLead: '和一個懂你的人',
      titleAccent: '一起看深圳。',
      body: '不必再擠旅遊巴。四小時，一位和你興趣相投的本地人——電子、美食、天際線、清晨——這座城市終於說得通了。',
      primaryCta: '查看四小時體驗',
      secondaryCta: '成為嚮導',
      scroll: '向下',
    },
    trust: {
      verified: '實名核實的本地人',
      refund: '無法確認，全額退款',
      reviewed: '來自社群的真實評價',
      noGroups: '絕不拼團',
    },
    packages: {
      kicker: '四小時，一位本地人',
      title: '挑一個四小時。',
      body: '下面每個體驗都剛好四小時、一對一，只把一件事做透，而不是隔著車窗看六個景點。',
      featuredLabel: '最多人預訂',
      allLink: '全部體驗',
      priceNote: '四小時共 {price}——這是嚮導的費用，不是門票價。',
    },
    districts: {
      kicker: '地圖',
      title: '六個區，六座不同的城。',
      body: '深圳大到一天根本「看」不完。挑你真正為之而來的那一塊。',
      cta: '打開城區指南',
    },
    audiences: {
      travelerTitle: '給旅客',
      travelerSubtitle: '來深圳玩',
      travelerPoints: [
        '跨過語言這一關——按共通語言配對',
        '找到只有本地人才知道的地方',
        '私人、隨性，而且不貴',
      ],
      localTitle: '給本地人',
      localSubtitle: '住在深圳',
      localPoints: [
        '認識來自世界各地的人',
        '分享你最喜歡的地方和故事',
        '時間、話題、節奏都由你決定',
      ],
    },
    promise: {
      kicker: '本地夥伴到底做什麼',
      title: '所有麻煩，都替你擋掉。',
      body: '沒有導遊牌，沒有旅遊巴，也沒有舉在手裡的小旗。只是一個住在這裡的人，幫你把尷尬的部分處理掉。',
      items: [
        {
          title: '即場翻譯',
          body: '餐牌、攤檔、櫃檯、司機。當場替你說，而不是事後才打進翻譯程式。',
        },
        {
          title: '用得上的支付方式',
          body: '當場替你裝好支付寶或微信支付並試通——因為這裡幾乎沒有櫃檯刷得了外地信用卡。',
        },
        {
          title: '怎麼走',
          body: '地鐵乘車碼、走對的出口，還有夜裡散場時替你叫車、跟司機講清楚。',
        },
        {
          title: '本地價',
          body: '夥伴當場替你問真實價錢。你買的東西不經我們手，我們也不抽一分錢。',
        },
        {
          title: '隨時可改的行程',
          body: '走到第二個小時想換別的，接下來的行程就跟著換。跟團你試試看。',
        },
        {
          title: '退得回的錢',
          body: '付款只是把這一天留住。如果我們無法確認，全額退款——不必爭，也不必填表。',
        },
      ],
    },
    howItWorks: {
      kicker: '怎麼用',
      title: '三個小步驟。',
      steps: [
        {
          title: '挑你的四小時',
          body: '選一個現成體驗，或者說說你喜歡什麼，讓夥伴替你把這天搭起來。',
        },
        {
          title: '挑一天',
          body: '可預約日期即時顯示。付款把那天留住，我們會在三個工作天內確認。',
        },
        {
          title: '見面，出發',
          body: '出發前先聊兩句，在約好的地點見面，然後就去逛。回來別忘了寫評價。',
        },
      ],
    },
    testimonials: {
      kicker: '來自試營運社群',
      title: '夥伴們的真實故事。',
    },
    journal: {
      kicker: '專欄',
      title: '來之前先讀讀。',
      body: '把這座城市裡真正令人一頭霧水的部分，一篇寫清楚。',
      cta: '全部文章',
    },
    moments: {
      kicker: '片刻',
      title: '全是我們自己拍的，沒有一張圖庫照。',
      body: '這個網站上的每一張照片，都是我們在這座城市拍的。',
      cta: '打開相簿',
    },
    finalCta: {
      titleAnon: '準備好一起出發了嗎？',
      titleLoggedIn: '找下一位夥伴。',
      bodyAnon: '試營運期間免費加入，一分鐘不到。',
      bodySingleGuide: '選個日子，預訂屬於你的四小時。',
      bodyLoggedIn: '瀏覽公開資料，直接開聊。',
    },
  },

  tours: {
    index: {
      kicker: '體驗',
      title: '四小時，認真走完。',
      body: '六個一對一體驗，每個都剛好四小時。你訂的是一位深圳本地人的下午，不是旅遊巴上的一個座位——所以當天路線會跟著你走。',
      priceLine: '四小時一對一，{price}',
      countLine: '{n} 個體驗',
      notATour: {
        title: '我們不是旅行社。',
        body: '沒有旅遊巴、沒有團、沒有小旗，也沒有佣金。你訂的是一位深圳本地人的四小時；那天你吃的、搭的、買的，全部按本地價直接付給店家。',
      },
    },
    detail: {
      itinerary: '這四小時怎麼走',
      itineraryNote: '時間由見面那一刻開始算，不是實際鐘點——出發時間你下單時自己選。',
      includes: '包含什麼',
      notIncluded: '不包含什麼',
      goodFor: '適合誰',
      insiderTip: '有件事值得先知道',
      meetingPoint: '見面地點',
      bestStart: '建議出發時間',
      district: '所在區',
      duration: '時長',
      groupSize: '人數',
      groupSizeValue: '就你（和你帶來的人）',
      price: '價錢',
      priceNote: '下單時付款，用來留住這一天。如果我們無法確認，全額退款。',
      readMore: '讀完整指南',
      otherExperiences: '其他四小時體驗',
      bookCta: '預訂這四小時',
      bookNote: '下一步選日期和出發時間。確認之前不會扣款。',
      backToAll: '全部體驗',
    },
  },

  guide: {
    selectedPackage: {
      label: '已選體驗',
      note: '我們已經寫進你的預訂備註，夥伴會看到。付款前可以在下面修改或清除。',
      clear: '清除選擇',
      change: '換另一個體驗',
    },
  },

  footer: {
    tagline: '在深圳，配對一位和你興趣相投的本地夥伴。',
    product: '產品',
    account: '帳號',
    company: '關於我們',
    discount: '領取九折',
    about: '關於',
    contact: '聯絡我們',
    privacy: '私隱政策',
    terms: '服務條款',
    cancellation: '取消政策',
    rights: '© {year} Tensai Tech Inc.',
    pilot: '試營運 · 深圳',
    languageNote: '網站語言',
  },

  partner: {
    kicker: '來自朋友',
    title: 'SplitWhom',
    body: 'BBQ、聚會、旅行——先一起付款，再自動算清誰付了多少、該還誰多少。',
    cta: '去看看',
  },
}
