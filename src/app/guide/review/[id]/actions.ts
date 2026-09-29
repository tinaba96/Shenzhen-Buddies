'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
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
    switch (eligibility.reason) {
      case 'signed_out':
        redirect(`/login?next=${encodeURIComponent(`/guide/review/${bookingId}`)}`)
      case 'not_found':
        reviewFail(bookingId, 'Booking not found.')
      case 'not_approved':
        reviewFail(bookingId, 'Only confirmed tours can be reviewed.')
      case 'not_finished':
        reviewFail(bookingId, 'You can review once your tour has finished.')
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
  if (thumb !== 'up' && thumb !== 'down') {
    reviewFail(bookingId, 'Pick thumbs up or thumbs down.')
  }

  const { user, supabase } = await requireFinishedBooking(bookingId)

  const guideId = officialGuideId()
  if (!guideId || guideId === user.id) reviewFail(bookingId, 'No guide to review.')

  const text = String(formData.get('body') ?? '').trim()
  let body: string | null = null
  if (text) {
    const words = text.split(/\s+/).filter(Boolean).length
    if (words < MIN_REVIEW_WORDS || words > MAX_REVIEW_WORDS) {
      reviewFail(
        bookingId,
        `A written review is ${MIN_REVIEW_WORDS}–${MAX_REVIEW_WORDS} words (yours is ${words}). Or leave it empty — the thumb is enough.`,
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
    const friendly =
      error.code === '42501' ||
      error.message.toLowerCase().includes('row-level security')
        ? 'You can leave a review once your tour has finished.'
        : error.message
    reviewFail(bookingId, friendly)
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

  if (!supportConfigured()) {
    reviewFail(bookingId, 'Tips are not set up yet — thank you for the thought!')
  }

  const raw = String(
    formData.get('custom_amount') || formData.get('amount') || '',
  ).trim()
  const amountCents = parseSupportAmountCents(raw)
  if (amountCents == null) {
    reviewFail(bookingId, 'Pick a tip between CA$1 and CA$500 (whole dollars).')
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
    reviewFail(bookingId, 'Could not start the tip payment — please try again.')
  }
  redirect(checkoutUrl)
}
