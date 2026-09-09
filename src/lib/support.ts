// One-off "support" payments — tips after a tour and donations to the pilot.
// These ride the existing Stripe rails but deliberately never touch the
// bookings table: the money is the record, in the Stripe dashboard. The
// webhook only recognises sessions carrying metadata.kind from here (it keys
// booking payments on metadata.booking_id, which these sessions do not set at
// the session level — a tip's booking reference lives under tip_booking_id).

import { siteUrl } from '@/lib/config'
import { stripe } from '@/lib/stripe'
import { CURRENCY } from '@/lib/booking'

export const SUPPORT_AMOUNT_MIN_CENTS = 100 // CA$1
export const SUPPORT_AMOUNT_MAX_CENTS = 50_000 // CA$500 — fat-finger guard

export function supportConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY
}

// Parse a preset or custom dollar amount from a form into cents, or null if
// it is not a sane amount. Whole dollars only.
export function parseSupportAmountCents(raw: string): number | null {
  const dollars = Number(raw)
  if (!Number.isInteger(dollars)) return null
  const cents = dollars * 100
  if (cents < SUPPORT_AMOUNT_MIN_CENTS || cents > SUPPORT_AMOUNT_MAX_CENTS) {
    return null
  }
  return cents
}

// Create a Stripe Checkout session for a tip or donation and return its URL.
// Throws on Stripe errors — callers redirect with a friendly message.
export async function createSupportCheckout(params: {
  kind: 'tip' | 'donation'
  amountCents: number
  productName: string
  successPath: string
  cancelPath: string
  customerEmail?: string
  // Extra metadata (e.g. tip_booking_id) for the Stripe dashboard record.
  metadata?: Record<string, string>
}): Promise<string> {
  const session = await stripe().checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card', 'link'],
    customer_email: params.customerEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: CURRENCY,
          unit_amount: params.amountCents,
          product_data: { name: params.productName },
        },
      },
    ],
    metadata: { kind: params.kind, ...(params.metadata ?? {}) },
    success_url: `${siteUrl()}${params.successPath}`,
    cancel_url: `${siteUrl()}${params.cancelPath}`,
  })
  if (!session.url) throw new Error('Stripe did not return a checkout URL')
  return session.url
}
