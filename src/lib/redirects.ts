// Post-auth redirect targets travel as a `?next=` query param (see
// /auth/confirm, /login, /signup) so a visitor who hits an auth wall lands
// back where they were — e.g. the day they picked on /guide.
//
// Only same-origin relative paths are accepted, so a crafted link can't turn
// login into an open redirect. Returns null when there's nothing safe to use,
// letting each caller pick its own default.
// Reserved TLD (RFC 2606): guaranteed never to resolve, so nothing can be
// registered to make a crafted value match it.
const PLACEHOLDER_ORIGIN = 'https://placeholder.invalid'

export function safeNextPath(raw: string | null | undefined): string | null {
  if (!raw) return null

  // Parse first, judge after. Inspecting the raw string for a '//' or '/\'
  // prefix checks a string the URL parser never sees: browsers and the WHATWG
  // parser strip TAB, LF and CR out of a URL before parsing it, so '/<TAB>/evil.com'
  // passes a prefix check and is then parsed as '//evil.com' — protocol-relative,
  // and a working credential-phishing redirect off a link to our own domain.
  //
  // Resolving against an unregistrable origin and demanding the origin survive
  // is decided by the same parser the browser will use, so there is no second
  // string for an attacker to aim at. It also rejects absolute URLs and
  // javascript:/data: (whose origin is "null") without enumerating schemes.
  let url: URL
  try {
    url = new URL(raw, PLACEHOLDER_ORIGIN)
  } catch {
    return null
  }
  if (url.origin !== PLACEHOLDER_ORIGIN) return null

  // Rebuilt from the parsed URL rather than returned verbatim, so the value
  // handed to redirect() is the one the parser agreed to and always starts '/'.
  return `${url.pathname}${url.search}${url.hash}`
}

// `&next=…` (or '') for appending to a URL that already has a query string.
export function nextParam(path: string | null | undefined): string {
  const safe = safeNextPath(path)
  return safe ? `&next=${encodeURIComponent(safe)}` : ''
}
