import type { PostTranslations } from '../types'

import { dongmenOldDowntown } from './dongmen-old-downtown'
import { shenzhenAfterDark } from './shenzhen-after-dark'
import { shenzhenFromHongKongDayTrip } from './shenzhen-from-hong-kong-day-trip'
import { whatShenzhenActuallyEats } from './what-shenzhen-actually-eats'

export const postsZhHans: PostTranslations = {
  posts: {
    'dongmen-old-downtown': dongmenOldDowntown,
    'shenzhen-after-dark': shenzhenAfterDark,
    'shenzhen-from-hong-kong-day-trip': shenzhenFromHongKongDayTrip,
    'what-shenzhen-actually-eats': whatShenzhenActuallyEats,
  },
  authors: {
    bryan: {
      role: '联合创始人 · 常住深圳',
      bio: '在中国长大，在加拿大待了八年，现在回到深圳。过关进城的那几篇都出自他手——这条路他来回跑得太多，多到自己都嫌烦。',
    },
    taka: {
      role: '联合创始人 · 多伦多',
      bio: '日本工程师，在北美和亚洲的科技行业做了十年。负责做产品；自己也没少出门，知道一趟旅行里哪些事才真值得操心。',
    },
  },
}
