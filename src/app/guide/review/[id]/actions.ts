'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { fill } from '@/i18n'
import { getI18n } from '@/i18n/server'
import { formatDay } from '@/lib/booking'
import { officialGuideId } from '@/lib/config'
import {
  createSupportCheckout,
  parseSupportAmountCents,
  supportConfigured,
} from '@/lib/support'
import { checkTipEligibility, officialGuideDisplayName } from '@/lib/tips'

// Post-tour review: a thumb up/down plus an optional short written review.
// Stored in the existing reviews table — up maps to 5 stars, down to 1 — so
// the guide's profile, the average on /guide and the old star-based form all
// keep working, and RLS (0016_review_after_tour.sql) stays the enforcement
// that only a tourist whose tour has finished can write one.

const MIN_REVIEW_WORDS = 5
const MAX_REVIEW_WORDS = 50
// Chinese and Japanese are written without spaces, so splitting on whitespace
// counts a whole sentence as one word and rejects every review. Text in those
// scripts is measured in characters instead, with limits sized to say about
// as much as 5–50 English words. The page's hint (t.review.wordsHint) quotes
// these numbers.
const MIN_REVIEW_CHARS = 10
const MAX_REVIEW_CHARS = 100
// ー (the katakana long-vowel mark) is script Common, so it is named outright.
const CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー]/u
const CJK_ALL = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー]/gu

// Each CJK character counts once; any run of other text between spaces counts
// as one word, so a Latin brand name inside a Chinese sentence is one unit.
function reviewLength(text: string): { unit: 'words' | 'chars'; n: number } {
  if (!CJK.test(text)) {
    return { unit: 'words', n: text.split(/\s+/).filter(Boolean).length }
  }
  const chars = text.match(CJK_ALL)?.length ?? 0
  const rest = text
    .replace(CJK_ALL, ' ')
    .split(/\s+/)
    .filter((w) => /[\p{L}\p{N}]/u.test(w)).length
  return { unit: 'chars', n: chars + rest }
}

function reviewFail(bookingId: string, message: string): never {
  redirect(`/guide/review/${bookingId}?error=${encodeURIComponent(message)}`)
}

// The booking this review/tip hangs off, verified to belong to the signed-in
// tourist and to be a finished, confirmed tour. The rule itself lives in
// lib/tips (shared with the PayPal tip routes); this turns its verdict into
// the redirects a form submission expects.
async function requireFinishedBooking(bookingId: string) {
  const eligibility = await checkTipEligibility(bookingId)
  if (!eligibility.ok) {
    const e = (await getI18n()).t.review.errors
    switch (eligibility.reason) {
      case 'signed_out':
        redirect(`/login?next=${encodeURIComponent(`/guide/review/${bookingId}`)}`)
      case 'not_found':
        reviewFail(bookingId, e.notFound)
      case 'not_approved':
        reviewFail(bookingId, e.notApproved)
      case 'not_finished':
        reviewFail(bookingId, e.notFinished)
    }
  }
  return {
    user: eligibility.user,
    booking: eligibility.booking,
    supabase: eligibility.supabase,
  }
}

export async function submitTourReview(formData: FormData) {
  const bookingId = String(formData.get('booking_id') ?? '')
  const thumb = String(formData.get('thumb') ?? '')
  // Errors travel to the page as display text in ?error=, so they are written
  // in the visitor's language here.
  const e = (await getI18n()).t.review.errors
  if (thumb !== 'up' && thumb !== 'down') {
    reviewFail(bookingId, e.thumb)
  }

  const { user, supabase } = await requireFinishedBooking(bookingId)

  const guideId = officialGuideId()
  if (!guideId || guideId === user.id) reviewFail(bookingId, e.noGuide)

  const text = String(formData.get('body') ?? '').trim()
  let body: string | null = null
  if (text) {
    const { unit, n } = reviewLength(text)
    const [min, max] =
      unit === 'words'
        ? [MIN_REVIEW_WORDS, MAX_REVIEW_WORDS]
        : [MIN_REVIEW_CHARS, MAX_REVIEW_CHARS]
    if (n < min || n > max) {
      reviewFail(
        bookingId,
        fill(unit === 'words' ? e.words : e.chars, { min, max, n }),
      )
    }
    body = text.slice(0, 5000)
  }

  const { error } = await supabase.from('reviews').upsert(
    {
      reviewer_id: user.id,
      reviewee_id: guideId,
      stars: thumb === 'up' ? 5 : 1,
      body,
    },
    { onConflict: 'reviewer_id,reviewee_id' },
  )
  if (error) {
    const rls =
      error.code === '42501' ||
      error.message.toLowerCase().includes('row-level security')
    // Postgres's own message is English and means nothing to a tourist; it
    // goes to the logs and they get a sentence in their language.
    if (!rls) console.error('Tour review upsert failed:', error)
    reviewFail(bookingId, rls ? e.rls : e.generic)
  }

  revalidatePath('/guide')
  revalidatePath(`/guide/review/${bookingId}`)
  redirect(`/guide/review/${bookingId}?thanks=${thumb}`)
}

// After the thumb, an optional tip — a one-off Stripe Checkout that never
// touches the bookings table. 100% goes to the guide (settled outside the app).
export async function startTipCheckout(formData: FormData) {
  const bookingId = String(formData.get('booking_id') ?? '')
  const { user, booking } = await requireFinishedBooking(bookingId)
  const { t } = await getI18n()

  if (!supportConfigured()) {
    reviewFail(bookingId, t.support.tip.notSetUp)
  }

  const raw = String(
    formData.get('custom_amount') || formData.get('amount') || '',
  ).trim()
  const amountCents = parseSupportAmountCents(raw)
  if (amountCents == null) {
    reviewFail(bookingId, t.review.errors.tipAmount)
  }

  const guideName = await officialGuideDisplayName()

  let checkoutUrl: string
  try {
    checkoutUrl = await createSupportCheckout({
      kind: 'tip',
      amountCents,
      productName: `Tip for ${guideName} — ${formatDay(booking.day)}`,
      successPath: `/guide/review/${bookingId}?tipped=1`,
      cancelPath: `/guide/review/${bookingId}?thanks=up`,
      customerEmail: user.email ?? undefined,
      metadata: { tip_booking_id: bookingId, user_id: user.id },
    })
  } catch (err) {
    console.error('Tip checkout creation failed:', err)
    reviewFail(bookingId, t.review.errors.tipCheckout)
  }
  redirect(checkoutUrl)
}
