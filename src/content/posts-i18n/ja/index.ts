import type { PostTranslations } from '../types'

import { dongmenOldDowntown } from './dongmen-old-downtown'
import { futianNewDowntown } from './futian-new-downtown'
import { shenzhenAfterDark } from './shenzhen-after-dark'
import { shenzhenFromHongKongDayTrip } from './shenzhen-from-hong-kong-day-trip'
import { whatShenzhenActuallyEats } from './what-shenzhen-actually-eats'

export const postsJa: PostTranslations = {
  posts: {
    'dongmen-old-downtown': dongmenOldDowntown,
    'futian-new-downtown': futianNewDowntown,
    'shenzhen-after-dark': shenzhenAfterDark,
    'shenzhen-from-hong-kong-day-trip': shenzhenFromHongKongDayTrip,
    'what-shenzhen-actually-eats': whatShenzhenActuallyEats,
  },
  authors: {
    bryan: {
      role: '共同創業者・深圳在住',
      bio: '中国で育ち、カナダで8年過ごして、今は深圳に戻っています。この街への入り方の記事を書いているのは、その行き来を本人が望む以上にしょっちゅう繰り返しているからです。',
    },
    taka: {
      role: '共同創業者・トロント',
      bio: '日本人エンジニア。北米とアジアのテック業界で10年。プロダクトをつくっていて、旅のどこを心配すべきかがわかる程度には旅をしています。',
    },
  },
}
