// Beta-mode configuration, driven entirely by environment variables so the
// original matching experience can be brought back without a deploy diff.

// The operator-managed guide that tourists book during the beta.
export function officialGuideId(): string | null {
  return process.env.OFFICIAL_GUIDE_ID?.trim() || null
}

// While OFFICIAL_GUIDE_ID is set the app runs in "single guide" beta mode:
// /browse redirects to /guide and tourists can only book the official guide.
// Unset the variable to restore the original matching/browse experience.
export function isSingleGuideMode(): boolean {
  return officialGuideId() !== null
}

export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return adminEmails().includes(email.toLowerCase())
}

export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'http://localhost:3000'
  )
}
