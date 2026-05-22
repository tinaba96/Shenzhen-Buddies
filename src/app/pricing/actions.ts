'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const TRIAL_DAYS = 14

async function siteOrigin(): Promise<string> {
  const h = await headers()
  const fromHost = h.get('origin') ?? (h.get('host') ? `https://${h.get('host')}` : null)
  return (
    fromHost ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    'http://localhost:3000'
  )
}

export async function startCheckout() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID
  if (!priceId) {
    redirect('/pricing?error=missing_price_id')
  }

  const origin = await siteOrigin()

  const session = await stripe().checkout.sessions.create({
    mode: 'subscription',
    customer_email: user.email ?? undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${origin}/pricing?success=1`,
    cancel_url: `${origin}/pricing?canceled=1`,
    subscription_data: {
      trial_period_days: TRIAL_DAYS,
      metadata: { user_id: user.id },
    },
    metadata: { user_id: user.id },
  })

  if (!session.url) {
    redirect('/pricing?error=checkout_failed')
  }
  redirect(session.url)
}

export async function openBillingPortal() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle<{ stripe_customer_id: string }>()

  if (!sub?.stripe_customer_id) {
    redirect('/pricing?error=no_subscription')
  }

  const origin = await siteOrigin()
  const portal = await stripe().billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${origin}/pricing`,
  })

  redirect(portal.url)
}
