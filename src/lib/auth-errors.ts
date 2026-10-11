import type { Dictionary } from '@/i18n'

// Turns the ?error= value on the auth pages into text in the visitor's
// language.
//
// Two kinds of value arrive there: short codes our own actions set (so the
// page, not the action, decides the wording), and Supabase's error.message,
// passed through verbatim. The handful of Supabase messages a visitor really
// hits are matched exactly and translated; anything else is shown as-is, which
// is what the pages did before they were translated.
type AuthErrors = Dictionary['auth']['errors']

const CODES: Record<string, keyof AuthErrors> = {
  short: 'tooShort',
  mismatch: 'mismatch',
  open_link: 'openLink',
  expired: 'expired',
}

const SUPABASE_MESSAGES: Record<string, keyof AuthErrors> = {
  'Invalid login credentials': 'invalidCredentials',
  'Email not confirmed': 'emailNotConfirmed',
  'User already registered': 'userExists',
  'Email rate limit exceeded': 'rateLimit',
  'Email link is invalid or has expired': 'linkInvalid',
  'New password should be different from the old password.': 'samePassword',
}

export function authErrorText(
  raw: string | undefined,
  errors: AuthErrors,
): string | null {
  if (!raw) return null
  // Own properties only: `raw` comes straight from the query string, and a
  // plain lookup would match inherited keys — ?error=constructor would resolve
  // to Object's constructor instead of falling through to the raw text.
  const key = Object.hasOwn(CODES, raw)
    ? CODES[raw]
    : Object.hasOwn(SUPABASE_MESSAGES, raw)
      ? SUPABASE_MESSAGES[raw]
      : null
  return key ? errors[key] : raw
}
