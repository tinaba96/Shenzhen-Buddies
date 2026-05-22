import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function stripe(): Stripe {
  if (_stripe) return _stripe
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  _stripe = new Stripe(key)
  return _stripe
}

export type SubscriptionRow = {
  user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  status: string
  price_id: string | null
  current_period_end: string | null
  trial_end: string | null
  cancel_at_period_end: boolean
}

const ACTIVE_STATUSES = new Set([
  'active',
  'trialing',
  'past_due', // grace period; still treat as entitled
])

export function isSubscriptionActive(row: SubscriptionRow | null | undefined): boolean {
  if (!row) return false
  if (!ACTIVE_STATUSES.has(row.status)) return false
  if (row.current_period_end) {
    return new Date(row.current_period_end).getTime() > Date.now()
  }
  return true
}
