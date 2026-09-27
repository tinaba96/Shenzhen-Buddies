// One-off "support" payments — tips after a tour and donations to the pilot.
// These ride the existing payment rails but deliberately never touch the
// bookings table: the money is the record, in the Stripe or PayPal dashboard.
// The Stripe webhook only recognises sessions carrying metadata.kind from here
// (it keys booking payments on metadata.booking_id, which these sessions do
// not set at the session level — a tip's booking reference lives under
// tip_booking_id). PayPal donations are captured server-side by
// /api/paypal/capture-donation, which calls notifyDonationReceived directly.

import { adminEmails, siteUrl } from '@/lib/config'
import { sendEmail } from '@/lib/email'
import { stripe } from '@/lib/stripe'
import { CURRENCY, formatMoney } from '@/lib/booking'

// reference_id stamped on every PayPal donation order so the capture route can
// tell a donation order from a booking order (those carry the booking id).
export const DONATION_PAYPAL_REFERENCE_ID = 'donation'

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

// Tell the operators a PayPal donation landed. Purely informational — the
// money already moved and there is no database row — so a mail failure must
// never fail the capture that already happened. (Stripe donations get the
// same email from the webhook.)
export async function notifyDonationReceived(params: {
  amountCents: number
  currency: string
  from: string | null
}): Promise<void> {
  try {
    const amount = formatMoney(params.amountCents, params.currency)
    await sendEmail({
      to: adminEmails(),
      subject: `Donation received — ${amount}`,
      text: [
        `A donation of ${amount} just came through PayPal.`,
        `From: ${params.from ?? 'someone (no email)'}`,
        '',
        'Details are in the PayPal dashboard (Activity).',
      ].join('\n'),
    })
  } catch (err) {
    console.error('Donation notification failed:', err)
  }
}
