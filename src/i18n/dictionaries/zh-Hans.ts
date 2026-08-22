import type { Dictionary } from './en'

export const zhHans: Dictionary = {
  meta: {
    name: '简体中文',
  },

  seo: {
    siteTitle: '深圳伙伴 Shenzhen Buddies',
    siteDescription:
      '在深圳，匹配一位和你兴趣相投的本地伙伴。随性、私人，而且不贵。',
    toursTitle: '深圳四小时体验 — Shenzhen Buddies',
    toursDescription:
      '六个一对一的四小时深圳体验——华强北电子市场、东门小吃、入夜后的天际线，以及从香港过关后的头四小时。',
  },

  common: {
    hours: '{n} 小时',
    fourHours: '4 小时',
    oneOnOne: '一对一',
    perPerson: '每人',
    from: '起',
    readMore: '继续阅读',
    viewAll: '查看全部',
    back: '返回',
    seeDetails: '查看详情',
    bookThis: '预订这个体验',
    planYourDay: '安排你的一天',
    findALocal: '找一位本地人',
    becomeAGuide: '成为向导',
    browseBuddies: '浏览伙伴',
    yourProfile: '我的资料',
    getStarted: '开始',
    alreadyHaveAccount: '已经有账号了？',
    logIn: '登录',
    signUp: '注册',
    exploreFirst: '先逛逛深圳',
    freeDuringPilot: '试运营期间免费',
  },

  nav: {
    tours: '体验',
    explore: '城区',
    gallery: '相册',
    blog: '专栏',
    browse: '浏览',
    bookAGuide: '预订向导',
    mySchedule: '我的日程',
    messages: '消息',
    admin: '管理',
    openMenu: '打开菜单',
    closeMenu: '关闭菜单',
    account: '账号',
  },

  language: {
    label: '语言',
    choose: '选择语言',
    switchTo: '切换到{language}',
    current: '当前语言',
    note: '你的选择会记在这台设备上。',
  },

  home: {
    hero: {
      badge: '深圳，现已开放匹配',
      titleLead: '和一个懂你的人',
      titleAccent: '一起看深圳。',
      body: '别再挤旅游大巴。四小时，一位和你兴趣相投的本地人——电子、美食、天际线、清晨——这座城市终于说得通了。',
      primaryCta: '查看四小时体验',
      secondaryCta: '成为向导',
      scroll: '向下',
    },
    trust: {
      verified: '实名核验的本地人',
      refund: '无法确认，全额退款',
      reviewed: '来自社区的真实评价',
      noGroups: '绝不拼团',
    },
    packages: {
      kicker: '四小时，一位本地人',
      title: '挑一个四小时。',
      body: '下面每个体验都刚好四小时、一对一，只把一件事做透，而不是隔着车窗瞄六个地方。',
      featuredLabel: '预订最多',
      allLink: '全部体验',
      priceNote: '四小时共 {price}——这是向导的费用，不是门票价。',
    },
    districts: {
      kicker: '地图',
      title: '六个区，六座不同的城。',
      body: '深圳大到一天根本“看”不完。挑你真正为之而来的那一块。',
      cta: '打开城区指南',
    },
    audiences: {
      travelerTitle: '给旅行者',
      travelerSubtitle: '来深圳玩',
      travelerPoints: [
        '跨过语言这道坎——按共同语言匹配',
        '找到只有本地人才知道的地方',
        '私人、随性，而且不贵',
      ],
      localTitle: '给本地人',
      localSubtitle: '住在深圳',
      localPoints: [
        '认识来自世界各地的人',
        '分享你最喜欢的地方和故事',
        '时间、话题、节奏都由你定',
      ],
    },
    promise: {
      kicker: '本地伙伴到底做什么',
      title: '所有麻烦，都替你挡掉。',
      body: '没有导游证，没有大巴，也没有举在手里的小旗子。只是一个住在这儿的人，帮你把尴尬的部分处理掉。',
      items: [
        {
          title: '现场翻译',
          body: '菜单、摊位、柜台、司机。当场替你说，而不是事后再打字进翻译软件。',
        },
        {
          title: '能用的支付方式',
          body: '当场把支付宝或微信支付装好、试通——因为这里几乎没有柜台能刷外卡。',
        },
        {
          title: '出行这件事',
          body: '地铁乘车码、走对的出口，还有夜里散场时替你叫车、和司机讲清楚。',
        },
        {
          title: '本地价',
          body: '伙伴当场帮你问真实价格。你买的东西不经过我们，我们也不抽一分钱。',
        },
        {
          title: '随时能改的计划',
          body: '走到第二小时想换别的，剩下的行程就跟着换。跟团试试看。',
        },
        {
          title: '退得回来的钱',
          body: '付款只是把这天占住。如果我们没能确认，全额退款——不用争，也不用填表。',
        },
      ],
    },
    howItWorks: {
      kicker: '怎么用',
      title: '三个小步骤。',
      steps: [
        {
          title: '挑你的四小时',
          body: '选一个现成体验，或者说说你喜欢什么，让伙伴替你把这天搭起来。',
        },
        {
          title: '挑一天',
          body: '可约日期实时显示。付款把这天占住，我们会在三个工作日内确认。',
        },
        {
          title: '碰面，出发',
          body: '出发前先聊聊，按约好的地点见面，然后就去逛。回来别忘了写评价。',
        },
      ],
    },
    testimonials: {
      kicker: '来自试运营社区',
      title: '伙伴们的真实故事。',
    },
    journal: {
      kicker: '专栏',
      title: '来之前先读读。',
      body: '把这座城市里真正让人犯迷糊的部分，一篇写透。',
      cta: '全部文章',
    },
    moments: {
      kicker: '片刻',
      title: '全是我们自己拍的，没有一张图库照。',
      body: '这个网站上的每一张照片，都是我们在这座城市里拍的。',
      cta: '打开相册',
    },
    finalCta: {
      titleAnon: '准备好一起出发了吗？',
      titleLoggedIn: '找下一位伙伴。',
      bodyAnon: '试运营期间免费加入，一分钟不到。',
      bodySingleGuide: '选个日子，预订属于你的四小时。',
      bodyLoggedIn: '浏览公开资料，直接开聊。',
    },
  },

  tours: {
    index: {
      kicker: '体验',
      title: '四小时，认认真真过完。',
      body: '六个一对一体验，每个都刚好四小时。你订的是一位深圳本地人的下午，不是大巴上的一个座位——所以当天路线会跟着你走。',
      priceLine: '四小时一对一，{price}',
      countLine: '{n} 个体验',
      notATour: {
        title: '我们不是旅行社。',
        body: '没有大巴、没有团、没有小旗子，也没有回扣。你订的是一位深圳本地人的四小时；那天你吃的、坐的、买的，都按本地价直接付给店家。',
      },
    },
    detail: {
      itinerary: '这四小时怎么走',
      itineraryNote: '时间是从碰面开始算的，不是具体钟点——出发时间下单时你自己选。',
      includes: '包含什么',
      notIncluded: '不包含什么',
      goodFor: '适合谁',
      insiderTip: '有件事值得先知道',
      meetingPoint: '碰面地点',
      bestStart: '建议出发时间',
      district: '所在区',
      duration: '时长',
      groupSize: '人数',
      groupSizeValue: '就你（还有你带来的人）',
      price: '价格',
      priceNote: '下单时支付，用来占住这一天。如果我们没能确认，全额退款。',
      readMore: '读完整指南',
      otherExperiences: '其他四小时体验',
      bookCta: '预订这四小时',
      bookNote: '下一步选日期和出发时间。确认之前不会扣款。',
      backToAll: '全部体验',
    },
  },

  guide: {
    selectedPackage: {
      label: '已选体验',
      note: '我们已经写进你的预订备注里，伙伴会看到。付款前可以在下面修改或清除。',
      clear: '清除选择',
      change: '换一个体验',
    },
  },

  footer: {
    tagline: '在深圳，匹配一位和你兴趣相投的本地伙伴。',
    product: '产品',
    account: '账号',
    company: '关于我们',
    discount: '领取九折',
    about: '关于',
    contact: '联系我们',
    privacy: '隐私政策',
    terms: '服务条款',
    cancellation: '取消政策',
    rights: '© {year} Tensai Tech Inc.',
    pilot: '试运营 · 深圳',
    languageNote: '网站语言',
  },

  partner: {
    kicker: '来自朋友',
    title: 'SplitWhom',
    body: '烧烤、聚会、旅行——先一起买单，再自动算清谁付了多少、该还谁多少。',
    cta: '去看看',
  },
}
