// One-off "support" payments — tips after a tour and donations to the pilot.
// These ride the existing payment rails but deliberately never touch the
// bookings table: the money is the record, in the Stripe or PayPal dashboard.
// The Stripe webhook only recognises sessions carrying metadata.kind from here
// (it keys booking payments on metadata.booking_id, which these sessions do
// not set at the session level — a tip's booking reference lives under
// tip_booking_id). PayPal tips and donations are captured server-side by
// /api/paypal/capture-tip and /api/paypal/capture-donation, which call
// notifySupportPaymentReceived directly.

import { adminEmails, siteUrl } from '@/lib/config'
import { sendEmail } from '@/lib/email'
import { notifyGuide } from '@/lib/notify'
import { stripe } from '@/lib/stripe'
import { CURRENCY, formatMoney } from '@/lib/booking'

export type SupportKind = 'tip' | 'donation'

// reference_id stamped on every PayPal support order so the capture routes can
// tell a donation or tip order from a booking order (those carry the bare
// booking uuid) and from each other. A tip's reference embeds its booking id
// so the capture route can check the order was created for THAT booking.
export const DONATION_PAYPAL_REFERENCE_ID = 'donation'
export function tipPaypalReferenceId(bookingId: string): string {
  return `tip:${bookingId}`
}

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

// Tell the operators a PayPal tip or donation landed, and for a tip tell the
// guide too — the same pair of emails the Stripe webhook sends for card
// payments (notifySupportPayment in api/stripe/webhook). Purely informational:
// the money already moved and there is no database row, so a mail failure
// must never fail the capture that already happened.
export async function notifySupportPaymentReceived(params: {
  kind: SupportKind
  amountCents: number
  currency: string
  from: string | null
  // The tour a tip belongs to, for the admin email.
  bookingId?: string
}): Promise<void> {
  try {
    const amount = formatMoney(params.amountCents, params.currency)
    const label = params.kind === 'tip' ? 'Tip' : 'Donation'
    await sendEmail({
      to: adminEmails(),
      subject: `${label} received — ${amount}`,
      text: [
        `A ${params.kind} of ${amount} just came through PayPal.`,
        `From: ${params.from ?? 'someone (no email)'}`,
        params.bookingId ? `Booking: ${params.bookingId}` : '',
        '',
        'Details are in the PayPal dashboard (Activity).',
      ]
        .filter(Boolean)
        .join('\n'),
    })

    if (params.kind === 'tip') {
      await notifyGuide(
        `You received a tip — ${amount}`,
        [
          `A tourist left you a ${amount} tip after their tour. Nice work!`,
          '',
          'The operators will settle it with you.',
        ].join('\n'),
      )
    }
  } catch (err) {
    console.error('Support payment notification failed:', err)
  }
}
