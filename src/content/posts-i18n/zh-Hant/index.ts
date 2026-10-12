import type { PostTranslations } from '../types'

import { dongmenOldDowntown } from './dongmen-old-downtown'
import { shenzhenAfterDark } from './shenzhen-after-dark'
import { shenzhenFromHongKongDayTrip } from './shenzhen-from-hong-kong-day-trip'
import { whatShenzhenActuallyEats } from './what-shenzhen-actually-eats'

export const postsZhHant: PostTranslations = {
  posts: {
    'dongmen-old-downtown': dongmenOldDowntown,
    'shenzhen-after-dark': shenzhenAfterDark,
    'shenzhen-from-hong-kong-day-trip': shenzhenFromHongKongDayTrip,
    'what-shenzhen-actually-eats': whatShenzhenActuallyEats,
  },
  authors: {
    bryan: {
      role: '聯合創辦人 · 常駐深圳',
      bio: '在中國長大，在加拿大住了八年，現在回到深圳。教人怎樣進入深圳的文章都由他執筆，因為這段路他來回走的次數，比他自己想走的還多。',
    },
    taka: {
      role: '聯合創辦人 · 多倫多',
      bio: '日本工程師，在北美和亞洲的科技業做了十年。負責開發產品；旅行經驗也夠多，知道一趟旅程裏哪些事真正值得擔心。',
    },
  },
}
