import { NextResponse, type NextRequest } from 'next/server'
import {
  capturePaypalOrder,
  getPaypalOrder,
  paypalConfigured,
} from '@/lib/paypal'
import {
  DONATION_PAYPAL_REFERENCE_ID,
  notifyDonationReceived,
} from '@/lib/support'

export const runtime = 'nodejs'

// Capture an approved PayPal donation order and email the operators.
//
// There is no signed-in user to authorise against here (donating while signed
// out is allowed), so the guard is on the order itself: we look it up first
// and only capture orders that carry our donation reference_id. That keeps
// this route from being pointed at a booking order — those are captured by
// /api/paypal/capture-order, which also finalises the booking.
export async function POST(request: NextRequest) {
  if (!paypalConfigured()) {
    return NextResponse.json({ error: 'paypal not configured' }, { status: 503 })
  }

  const body = (await request.json().catch(() => ({}))) as { orderId?: unknown }
  const orderId = typeof body.orderId === 'string' ? body.orderId.trim() : ''
  if (!orderId) {
    return NextResponse.json({ error: 'missing orderId' }, { status: 400 })
  }

  try {
    const order = await getPaypalOrder(orderId)
    if (order.referenceId !== DONATION_PAYPAL_REFERENCE_ID) {
      return NextResponse.json({ error: 'invalid order' }, { status: 400 })
    }
    // Already captured (e.g. a retried onApprove) — idempotent success, and
    // no second email: the first capture sent it.
    if (order.status === 'COMPLETED') {
      return NextResponse.json({ ok: true })
    }
    // The buyer has not finished the PayPal approval step (or backed out):
    // say so rather than letting the capture call fail as a generic 500.
    if (order.status !== 'APPROVED') {
      return NextResponse.json({ error: 'payment not approved' }, { status: 402 })
    }

    const capture = await capturePaypalOrder(orderId)
    if (capture.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'payment not completed' }, { status: 402 })
    }
    await notifyDonationReceived({
      amountCents: capture.amountCents,
      currency: capture.currency,
      from: capture.payerEmail,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('PayPal donation capture failed:', err)
    return NextResponse.json({ error: 'capture failed' }, { status: 500 })
  }
}
