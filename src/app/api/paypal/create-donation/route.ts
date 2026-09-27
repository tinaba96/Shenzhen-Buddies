import { NextResponse, type NextRequest } from 'next/server'
import { CURRENCY } from '@/lib/booking'
import { createPaypalOrder, paypalConfigured } from '@/lib/paypal'
import {
  DONATION_PAYPAL_REFERENCE_ID,
  parseSupportAmountCents,
} from '@/lib/support'

export const runtime = 'nodejs'

// Create a PayPal order for a donation to the pilot. Open to anyone — like the
// Stripe donation action, there is no sign-in requirement — so the only input
// we trust is the amount, and only after the same CA$1–500 whole-dollar check
// the card path applies. Nothing is written to the database: the PayPal
// dashboard is the ledger, exactly as Stripe is for card donations.
export async function POST(request: NextRequest) {
  if (!paypalConfigured()) {
    return NextResponse.json({ error: 'paypal not configured' }, { status: 503 })
  }

  const body = (await request.json().catch(() => ({}))) as { amount?: unknown }
  const amountCents =
    typeof body.amount === 'string' || typeof body.amount === 'number'
      ? parseSupportAmountCents(String(body.amount).trim())
      : null
  if (amountCents == null) {
    return NextResponse.json({ error: 'invalid amount' }, { status: 400 })
  }

  try {
    const order = await createPaypalOrder({
      amountCents,
      currency: CURRENCY,
      referenceId: DONATION_PAYPAL_REFERENCE_ID,
      description: 'Donation — Shenzhen Buddies pilot',
    })
    return NextResponse.json({ orderId: order.id })
  } catch (err) {
    console.error('PayPal donation order failed:', err)
    return NextResponse.json({ error: 'could not create order' }, { status: 500 })
  }
}
