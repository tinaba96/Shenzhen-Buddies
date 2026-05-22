import { NextResponse, type NextRequest } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'STRIPE_WEBHOOK_SECRET not configured' },
      { status: 500 },
    )
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'missing stripe-signature' }, { status: 400 })
  }

  const rawBody = await request.text()

  let event: Stripe.Event
  try {
    event = stripe().webhooks.constructEvent(rawBody, signature, secret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'invalid signature'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id as string | undefined
        if (userId && session.subscription) {
          const sub = await stripe().subscriptions.retrieve(
            typeof session.subscription === 'string'
              ? session.subscription
              : session.subscription.id,
          )
          await upsertSubscription(userId, sub)
        }
        break
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.user_id as string | undefined
        if (userId) {
          await upsertSubscription(userId, sub)
        }
        break
      }
      default:
        break
    }
  } catch (err) {
    // Return 500 so Stripe retries — silent 200 here permanently loses the
    // subscription row when Supabase has a transient outage.
    console.error('Stripe webhook handler error', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'handler_failed' },
      { status: 500 },
    )
  }

  return NextResponse.json({ received: true })
}

async function upsertSubscription(userId: string, sub: Stripe.Subscription) {
  const admin = createSupabaseAdminClient()
  const priceId = sub.items.data[0]?.price.id ?? null
  const periodEnd =
    (sub as unknown as { current_period_end?: number }).current_period_end ?? null
  const trialEnd = sub.trial_end ?? null

  const row = {
    user_id: userId,
    stripe_customer_id:
      typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
    stripe_subscription_id: sub.id,
    status: sub.status,
    price_id: priceId,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    trial_end: trialEnd ? new Date(trialEnd * 1000).toISOString() : null,
    cancel_at_period_end: sub.cancel_at_period_end ?? false,
    updated_at: new Date().toISOString(),
  }

  const { error } = await admin.from('subscriptions').upsert(row, {
    onConflict: 'user_id',
  })
  if (error) throw error
}
