import { NextResponse, type NextRequest } from 'next/server'
import { CURRENCY, formatDay } from '@/lib/booking'
import { createPaypalOrder, paypalConfigured } from '@/lib/paypal'
import { parseSupportAmountCents, tipPaypalReferenceId } from '@/lib/support'
import { checkTipEligibility, officialGuideDisplayName } from '@/lib/tips'

export const runtime = 'nodejs'

// Create a PayPal order for a post-tour tip. Same gate as the Stripe tip
// action: the signed-in tourist's own confirmed, finished booking. The amount
// gets the same CA$1–500 whole-dollar check. Nothing is written to the
// database — the PayPal dashboard is the ledger, as Stripe is for card tips.
export async function POST(request: NextRequest) {
  if (!paypalConfigured()) {
    return NextResponse.json({ error: 'paypal not configured' }, { status: 503 })
  }

  const body = (await request.json().catch(() => ({}))) as {
    bookingId?: unknown
    amount?: unknown
  }
  const bookingId = typeof body.bookingId === 'string' ? body.bookingId.trim() : ''
  if (!bookingId) {
    return NextResponse.json({ error: 'missing bookingId' }, { status: 400 })
  }
  const amountCents =
    typeof body.amount === 'string' || typeof body.amount === 'number'
      ? parseSupportAmountCents(String(body.amount).trim())
      : null
  if (amountCents == null) {
    return NextResponse.json({ error: 'invalid amount' }, { status: 400 })
  }

  const eligibility = await checkTipEligibility(bookingId)
  if (!eligibility.ok) {
    return eligibility.reason === 'signed_out'
      ? NextResponse.json({ error: 'unauthorized' }, { status: 401 })
      : NextResponse.json({ error: 'booking not tippable' }, { status: 400 })
  }

  try {
    const guideName = await officialGuideDisplayName()
    const order = await createPaypalOrder({
      amountCents,
      currency: CURRENCY,
      referenceId: tipPaypalReferenceId(bookingId),
      description: `Tip for ${guideName} — ${formatDay(eligibility.booking.day)}`,
    })
    return NextResponse.json({ orderId: order.id })
  } catch (err) {
    console.error('PayPal tip order failed:', err)
    return NextResponse.json({ error: 'could not create order' }, { status: 500 })
  }
}
