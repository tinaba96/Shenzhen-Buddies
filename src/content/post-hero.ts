import { ogImageSrc, requireGalleryItem } from '@/content/gallery'
import { localizeGalleryItem } from '@/content/gallery-i18n'
import { requireLicensedPhoto } from '@/content/licensed-photos'
import type { Post } from '@/content/posts/types'
import type { Locale } from '@/i18n/config'

// One answer to "what picture represents this post", for the blog cards, the
// home page journal strip and the share card. A post's hero is either one of
// our own gallery photos or a licensed photo; callers should not care which.
export type PostHero = {
  src: string
  ogSrc: string
  alt: string
  width: number
  height: number
}

export function postHero(post: Pick<Post, 'slug' | 'heroGalleryId' | 'heroPhotoId'>, locale: Locale): PostHero | null {
  if (post.heroPhotoId) {
    const photo = requireLicensedPhoto(post.heroPhotoId, `posts/${post.slug} hero`)
    return { src: photo.src, ogSrc: photo.ogSrc, alt: photo.alt[locale], width: photo.width, height: photo.height }
  }
  if (post.heroGalleryId) {
    const item = localizeGalleryItem(requireGalleryItem(post.heroGalleryId, `posts/${post.slug} hero`), locale)
    return { src: item.src, ogSrc: ogImageSrc(item), alt: item.alt, width: item.width, height: item.height }
  }
  return null
}
