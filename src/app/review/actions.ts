'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { fill } from '@/i18n'
import { getI18n } from '@/i18n/server'
import {
  adminEmails,
  isValidReviewLinkKey,
  officialGuideId,
  siteUrl,
} from '@/lib/config'
import { sendEmail } from '@/lib/email'
import { reviewLengthProblem } from '@/lib/review-length'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'

// The open review page (/review): a link the guide shares with tourists whose
// tour was arranged outside the website. One submit signs them up (unless
// they are already signed in), saves their name and photo to a tourist
// profile, and publishes the review. There is no approval step; the admin is
// emailed each one and can delete a bad one in Supabase.
//
// Every write after sign-up goes through the service-role client: RLS on
// reviews only admits tourists with a finished booking (0016), and a new
// account may have no session yet while its email is unconfirmed.

// Under next.config's 4 MB Server Action limit, leaving room for the text.
const MAX_PHOTO_BYTES = 3 * 1024 * 1024
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

// What the form re-renders with after a failed submit. The password and the
// photo cannot be put back into a form, so they are re-entered.
export type OpenReviewState = {
  error: string | null
  values: {
    name: string
    email: string
    stars: number
    body: string
  }
  // Bumped on every failed submit so the form remounts with these values.
  attempt: number
}

export async function submitOpenReview(
  prev: OpenReviewState,
  formData: FormData,
): Promise<OpenReviewState> {
  const { t, locale } = await getI18n()
  const e = t.openReview.errors

  const values = {
    name: String(formData.get('name') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim(),
    stars: Number(formData.get('stars') ?? 0),
    body: String(formData.get('body') ?? '').trim(),
  }
  const fail = (error: string): OpenReviewState => ({
    error,
    values,
    attempt: prev.attempt + 1,
  })

  // Honeypot: a field people never see. Bots that fill it get the thank-you
  // page and nothing is written.
  if (String(formData.get('website') ?? '')) redirect('/review?sent=1')

  // The page already checks the code; this stops a direct POST without it.
  if (!isValidReviewLinkKey(String(formData.get('k') ?? ''))) {
    return fail(e.invalidLink)
  }

  const guideId = officialGuideId()
  if (!guideId) return fail(e.noGuide)

  if (!Number.isInteger(values.stars) || values.stars < 1 || values.stars > 5) {
    return fail(e.stars)
  }
  if (!values.body) return fail(e.body)
  const problem = reviewLengthProblem(values.body)
  if (problem) {
    const { unit, min, max, n } = problem
    return fail(fill(unit === 'words' ? e.words : e.chars, { min, max, n }))
  }
  if (!values.name || values.name.length > 60) return fail(e.name)

  const photo = formData.get('photo')
  const hasPhoto = photo instanceof File && photo.size > 0
  if (hasPhoto) {
    if (photo.size > MAX_PHOTO_BYTES) return fail(e.photoSize)
    if (!MIME_TO_EXT[photo.type]) return fail(e.photoType)
  }

  // Made before sign-up, so a server misconfiguration fails here rather than
  // after an account exists that the review never reached.
  const admin = createSupabaseAdminClient()

  // Who is reviewing: the signed-in visitor, or a new account made now.
  const supabase = await createSupabaseServerClient()
  const {
    data: { user: current },
  } = await supabase.auth.getUser()

  let userId: string
  let email: string
  let needsConfirmation = false
  if (current) {
    if (current.id === guideId) return fail(e.self)
    userId = current.id
    email = current.email ?? ''
  } else {
    // A new account has no photo yet, so one is required.
    if (!hasPhoto) return fail(e.photo)
    const password = String(formData.get('password') ?? '')
    if (!values.email) return fail(e.email)
    if (password.length < 8) return fail(e.password)
    // A typo here would lock them out of the account they are making.
    if (password !== String(formData.get('password_confirm') ?? '')) {
      return fail(t.auth.errors.mismatch)
    }
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password,
      options: {
        emailRedirectTo: `${siteUrl()}/auth/confirm?next=${encodeURIComponent('/profile')}`,
      },
    })
    if (error) {
      if (error.message === 'User already registered') return fail(e.exists)
      if (error.message === 'Email rate limit exceeded') return fail(e.rateLimit)
      console.error('Open review sign-up failed:', error)
      return fail(e.signup)
    }
    // With email confirmation on, Supabase answers an already-registered
    // address with a stand-in user that has no identities instead of an
    // error, so it cannot be used to probe for accounts. Writing to that id
    // would fail, so this is the same "log in first" answer.
    if (!data.user || data.user.identities?.length === 0) return fail(e.exists)
    userId = data.user.id
    email = data.user.email ?? values.email
    needsConfirmation = !data.session
  }

  let avatarPath: string | null = null
  if (hasPhoto) {
    const path = `${userId}/avatar.${MIME_TO_EXT[photo.type]}`
    const { error } = await admin.storage
      .from('avatars')
      .upload(path, photo, { contentType: photo.type, upsert: true })
    // A failed photo is not worth losing the review over.
    if (error) console.error('Open review photo upload failed:', error)
    else avatarPath = path
  }

  // Keep the guide a guide; everyone else reviewing here is a tourist.
  const { data: existing, error: lookupError } = await admin
    .from('profiles')
    .select('role, avatar_path')
    .eq('id', userId)
    .maybeSingle<{ role: string; avatar_path: string | null }>()
  // Without the lookup, the upsert below could turn a guide into a tourist.
  if (lookupError) {
    console.error('Open review profile lookup failed:', lookupError)
    return fail(e.generic)
  }
  // Signed in: the photo they already have counts.
  if (!hasPhoto && !existing?.avatar_path) return fail(e.photo)
  const profile: Record<string, unknown> = {
    id: userId,
    role: existing?.role === 'guide' ? 'guide' : 'tourist',
    display_name: values.name,
  }
  if (avatarPath) profile.avatar_path = avatarPath
  const { error: profileError } = await admin
    .from('profiles')
    .upsert(profile, { onConflict: 'id' })
  if (profileError) {
    console.error('Open review profile upsert failed:', profileError)
    return fail(e.generic)
  }

  const { error: reviewError } = await admin.from('reviews').upsert(
    {
      reviewer_id: userId,
      reviewee_id: guideId,
      stars: values.stars,
      body: values.body ? values.body.slice(0, 5000) : null,
    },
    { onConflict: 'reviewer_id,reviewee_id' },
  )
  if (reviewError) {
    console.error('Open review upsert failed:', reviewError)
    return fail(e.generic)
  }

  // A thank-you in the reviewer's language. Best-effort, like every email
  // here: the review is already saved.
  if (email) {
    const m = t.openReview.thankYouEmail
    const vars = {
      name: values.name.split(' ')[0],
      guide: await officialGuideFirstName(admin, guideId, t.review.yourGuide),
    }
    const f = (s: string) => fill(s, vars, locale)
    await sendEmail({
      to: email,
      subject: f(m.subject),
      text: [
        f(m.greeting),
        '',
        f(m.thanks),
        '',
        m.yourReview,
        '★'.repeat(values.stars) + '☆'.repeat(5 - values.stars),
        ...(values.body ? [values.body] : []),
        '',
        f(m.profile),
        `${siteUrl()}/u/${guideId}`,
        '',
        needsConfirmation ? m.confirm : m.login,
        '',
        m.comeBack,
        `${siteUrl()}/tours`,
        '',
        m.signoff,
        m.team,
      ].join('\n'),
    })
  }

  // Best-effort, like every other admin email: the review is already saved.
  const h = await headers()
  await sendEmail({
    to: adminEmails(),
    subject: `New review — ${values.stars}★ from ${values.name}`,
    text: [
      `${values.name} <${email}> left a ${values.stars}-star review on /review.`,
      '',
      values.body || '(no written review)',
      '',
      `It is live on ${siteUrl()}/u/${guideId}. To remove it, delete the row in the Supabase reviews table.`,
      `Sent from ${h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown IP'}`,
    ].join('\n'),
  })

  revalidatePath('/guide')
  revalidatePath(`/u/${guideId}`)
  redirect(needsConfirmation ? '/review?sent=1&check_email=1' : '/review?sent=1')
}

// The guide's first name for the thank-you email; the fallback is a phrase
// ("your guide"), as on the page.
async function officialGuideFirstName(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  guideId: string,
  fallback: string,
): Promise<string> {
  const { data } = await admin
    .from('profiles')
    .select('display_name')
    .eq('id', guideId)
    .maybeSingle<{ display_name: string }>()
  return data?.display_name ? data.display_name.split(' ')[0] : fallback
}
