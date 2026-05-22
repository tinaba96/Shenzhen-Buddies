export function avatarPublicUrl(
  path: string | null | undefined,
  cacheKey?: string | null,
): string | null {
  if (!path) return null
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!base) return null
  const url = `${base}/storage/v1/object/public/avatars/${path}`
  return cacheKey ? `${url}?v=${encodeURIComponent(cacheKey)}` : url
}

export function initialsFor(name: string | null | undefined): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2) || '?'
}
