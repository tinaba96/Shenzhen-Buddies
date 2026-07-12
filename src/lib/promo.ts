// Promotion codes stay managed in the Stripe dashboard (single source of
// truth). We validate a code against Stripe and compute the discounted total so
// the SAME code can be applied whether the tourist pays via Stripe or PayPal.
// Note: PayPal payments don't decrement Stripe's redemption count — acceptable
// here because codes aren't usage-limited.

import { stripe } from '@/lib/stripe'

export type PromoResult = {
  code: string
  promotionCodeId: string
  discountedCents: number
  label: string
}

// Returns the discounted total for a valid, active code, or null if the code
// doesn't exist / isn't currently redeemable.
export async function validatePromoCode(
  code: string,
  baseAmountCents: number,
): Promise<PromoResult | null> {
  const trimmed = code.trim()
  if (!trimmed) return null

  const { data } = await stripe().promotionCodes.list({
    code: trimmed,
    active: true,
    limit: 1,
    expand: ['data.promotion.coupon'],
  })
  const pc = data[0]
  if (!pc) return null

  // In this API version the coupon lives under promotion.coupon and is
  // expandable — a string id unless expanded, so guard for the object.
  const coupon = pc.promotion?.coupon
  if (!coupon || typeof coupon === 'string' || !coupon.valid) return null
  let discountedCents: number
  let label: string
  if (coupon.percent_off != null) {
    discountedCents = Math.round(
      (baseAmountCents * (100 - coupon.percent_off)) / 100,
    )
    label = `${coupon.percent_off}% off`
  } else if (coupon.amount_off != null) {
    discountedCents = Math.max(0, baseAmountCents - coupon.amount_off)
    label = 'Discount applied'
  } else {
    return null
  }

  return { code: trimmed, promotionCodeId: pc.id, discountedCents, label }
}
