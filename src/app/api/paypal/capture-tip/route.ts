import { NextResponse, type NextRequest } from 'next/server'
import {
  capturePaypalOrder,
  getPaypalOrder,
  paypalConfigured,
} from '@/lib/paypal'
import {
  notifySupportPaymentReceived,
  tipPaypalReferenceId,
} from '@/lib/support'
import { checkTipEligibility } from '@/lib/tips'

export const runtime = 'nodejs'

// Capture an approved PayPal tip order and email the operators and the guide.
// Two guards: the caller must be the tourist who may tip this booking, and
// the order must be one we created for THIS booking (its reference_id embeds
// the booking id), so neither a booking order nor another tourist's tip order
// can be captured through here. Retried captures are idempotent.
export async function POST(request: NextRequest) {
  if (!paypalConfigured()) {
    return NextResponse.json({ error: 'paypal not configured' }, { status: 503 })
  }

  const body = (await request.json().catch(() => ({}))) as {
    bookingId?: unknown
    orderId?: unknown
  }
  const bookingId = typeof body.bookingId === 'string' ? body.bookingId.trim() : ''
  const orderId = typeof body.orderId === 'string' ? body.orderId.trim() : ''
  if (!bookingId || !orderId) {
    return NextResponse.json({ error: 'missing params' }, { status: 400 })
  }

  const eligibility = await checkTipEligibility(bookingId)
  if (!eligibility.ok) {
    return eligibility.reason === 'signed_out'
      ? NextResponse.json({ error: 'unauthorized' }, { status: 401 })
      : NextResponse.json({ error: 'booking not tippable' }, { status: 400 })
  }

  try {
    const order = await getPaypalOrder(orderId)
    if (order.referenceId !== tipPaypalReferenceId(bookingId)) {
      return NextResponse.json({ error: 'invalid order' }, { status: 400 })
    }
    // Already captured (e.g. a retried onApprove) — idempotent success, and
    // no second email: the first capture sent it.
    if (order.status === 'COMPLETED') {
      return NextResponse.json({ ok: true })
    }
    if (order.status !== 'APPROVED') {
      return NextResponse.json({ error: 'payment not approved' }, { status: 402 })
    }

    const capture = await capturePaypalOrder(orderId)
    if (capture.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'payment not completed' }, { status: 402 })
    }
    await notifySupportPaymentReceived({
      kind: 'tip',
      amountCents: capture.amountCents,
      currency: capture.currency,
      from: capture.payerEmail ?? eligibility.user.email ?? null,
      bookingId,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('PayPal tip capture failed:', err)
    return NextResponse.json({ error: 'capture failed' }, { status: 500 })
  }
}
