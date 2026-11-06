import type { Locale } from '@/i18n/config'

// Photos taken by other people and published under a licence that lets us
// reuse them: Creative Commons or public domain, almost always found on
// Wikimedia Commons.
//
// Kept apart from gallery.ts on purpose. The gallery is the founders' own
// library and feeds the public /gallery page, so mixing these in would present
// someone else's work as ours. Every entry here carries its credit and licence,
// and the blog renders that credit under the photo wherever it appears.
//
// Rules for adding one:
//   - A licence that allows commercial reuse: CC0, CC BY, CC BY-SA or public
//     domain. Not CC BY-NC or CC BY-ND, and not "credit the photographer" on a
//     news or agency photo, which is not a licence at all.
//   - Read the file page, not only the licence badge. US White House photos
//     are public domain but come with a notice against commercial use, so they
//     are left out of a site that sells tours.
//   - Credit exactly as the file page asks, link the file page and the licence,
//     and say the image was resized. CC BY-SA asks for that and costs nothing.
//   - Files go in public/photos/<id>.webp (1600px longest edge, <= 300 KB) and
//     public/photos/og/<id>.jpg (1200x630), the same sizes as the gallery.

export type LicensedPhoto = {
  id: string
  src: string
  ogSrc: string
  width: number
  height: number
  alt: Record<Locale, string>
  // As the file page credits it.
  author: string
  // The page that states the licence, usually a Commons file page.
  sourceUrl: string
  license: 'CC BY 4.0' | 'CC BY-SA 4.0' | 'CC BY 2.0' | 'CC BY-SA 3.0' | 'Public domain'
  licenseUrl?: string
}

export const licensedPhotos: LicensedPhoto[] = [
  {
    id: 'shenzhen-international-exchange-center-2026',
    src: '/photos/shenzhen-international-exchange-center-2026.webp',
    ogSrc: '/photos/og/shenzhen-international-exchange-center-2026.jpg',
    width: 1600,
    height: 1200,
    alt: {
      en: 'The Shenzhen International Exchange Center at Xiangmi Lake on an overcast day in August 2026: a pale stone building under a wide, sharply overhanging roof, with pine trees and an engraved boulder at the entrance.',
      ja: '2026年8月の曇りの日の深圳国際交流センター。大きく張り出した屋根の下に淡い色の石張りの建物、入口には松と施設名を刻んだ岩',
      'zh-Hans': '2026 年 8 月阴天时的深圳国际交流中心：浅色石材外墙，上面是挑出很远的大屋檐，入口处有松树和刻着中心名字的景石。',
      'zh-Hant': '2026 年 8 月陰天時的深圳國際交流中心：淺色石材外牆，上面是伸出很遠的大屋簷，入口處有松樹和刻着中心名字的景石。',
    },
    author: 'Lhzss8',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:%E6%B7%B1%E5%9C%B3%E5%9B%BD%E9%99%85%E4%BA%A4%E6%B5%81%E4%B8%AD%E5%BF%83.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  {
    id: 'apec-2014-beijing-leaders-photo',
    src: '/photos/apec-2014-beijing-leaders-photo.webp',
    ogSrc: '/photos/og/apec-2014-beijing-leaders-photo.jpg',
    width: 1600,
    height: 987,
    alt: {
      en: 'The leaders and their spouses at the 22nd APEC Economic Leaders’ Meeting in Beijing on 10 November 2014, standing in two rows on a stage in matching dark red, green and blue jackets, under a sign reading “The 22nd APEC Economic Leaders’ Meeting, Beijing, China, 10–11 November 2014”.',
      ja: '2014年11月10日、北京での第22回APEC首脳会議の記念撮影。おそろいのえんじ、緑、青の上着を着た首脳と配偶者が2列に並び、背後に会議名と日付の看板',
      'zh-Hans': '2014 年 11 月 10 日，北京 APEC 第二十二次领导人非正式会议的合影：各经济体领导人和配偶穿着同款的深红、墨绿、蓝色中式外套站成两排，背后是会议名称和日期。',
      'zh-Hant': '2014 年 11 月 10 日，北京 APEC 第二十二次領導人非正式會議的合照：各經濟體領導人和配偶穿着同款的深紅、墨綠、藍色中式外套站成兩排，背後是會議名稱和日期。',
    },
    author: 'Kremlin.ru',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:APEC_Summit_China_2014.jpg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
]

export function requireLicensedPhoto(id: string, context?: string): LicensedPhoto {
  const photo = licensedPhotos.find((p) => p.id === id)
  if (!photo) {
    throw new Error(
      `licensed-photos.ts: no photo with id "${id}"${context ? ` (referenced by ${context})` : ''}. ` +
        `Known ids: ${licensedPhotos.map((p) => p.id).join(', ')}`,
    )
  }
  return photo
}

function assertLicensedPhotosValid() {
  const seen = new Set<string>()
  for (const p of licensedPhotos) {
    if (seen.has(p.id)) throw new Error(`licensed-photos.ts: duplicate id "${p.id}"`)
    seen.add(p.id)
    if (p.src !== `/photos/${p.id}.webp` || p.ogSrc !== `/photos/og/${p.id}.jpg`) {
      throw new Error(`licensed-photos.ts: "${p.id}" paths must follow /photos/<id>.webp and /photos/og/<id>.jpg`)
    }
    for (const [locale, text] of Object.entries(p.alt)) {
      if (!text.trim()) throw new Error(`licensed-photos.ts: "${p.id}" has empty ${locale} alt text`)
    }
    if (!p.author.trim() || !p.sourceUrl.startsWith('https://')) {
      throw new Error(`licensed-photos.ts: "${p.id}" needs an author and an https source page`)
    }
  }
}

assertLicensedPhotosValid()
