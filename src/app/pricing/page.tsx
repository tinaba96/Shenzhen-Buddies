import { redirect } from 'next/navigation'
import { SubmitButton } from '@/components/SubmitButton'
import { isSubscriptionActive, type SubscriptionRow } from '@/lib/stripe'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { openBillingPortal, startCheckout } from './actions'

type Props = {
  searchParams: Promise<{
    success?: string
    canceled?: string
    error?: string
  }>
}

const TRIAL_DAYS = 14

export default async function PricingPage({ searchParams }: Props) {
  const { success, canceled, error } = await searchParams
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/pricing')

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select(
      'user_id, stripe_customer_id, stripe_subscription_id, status, price_id, current_period_end, trial_end, cancel_at_period_end',
    )
    .eq('user_id', user.id)
    .maybeSingle<SubscriptionRow>()

  const active = isSubscriptionActive(subscription)
  const stripeConfigured =
    !!process.env.STRIPE_SECRET_KEY && !!process.env.NEXT_PUBLIC_STRIPE_PRICE_ID

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Membership
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Shenzhen Buddies Premium
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Support the platform and unlock advanced matching, priority placement,
          and early access to new features.
        </p>
      </div>

      {success && (
        <p className="mt-6 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          You&apos;re in. Welcome to Premium.
        </p>
      )}
      {canceled && (
        <p className="mt-6 rounded-md bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
          Checkout canceled. No charge made.
        </p>
      )}
      {error && (
        <p className="mt-6 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          {humanError(error)}
        </p>
      )}

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-xl font-semibold">Premium</h2>
          {!active && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              {TRIAL_DAYS}-day free trial
            </span>
          )}
        </div>

        <ul className="mt-4 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          {[
            'Advanced matching: see who you match with best',
            'Priority placement in browse results',
            'Unlimited messaging',
            'Early access to new features as we ship them',
          ].map((line) => (
            <li key={line} className="flex items-start gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{line}</span>
            </li>
          ))}
        </ul>

        {active ? (
          <CurrentPlan subscription={subscription!} />
        ) : (
          <div className="mt-6">
            {!stripeConfigured ? (
              <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Subscription checkout isn&apos;t configured yet. The admin needs
                to set <code className="font-mono text-xs">STRIPE_SECRET_KEY</code>{' '}
                and{' '}
                <code className="font-mono text-xs">NEXT_PUBLIC_STRIPE_PRICE_ID</code>{' '}
                in the project environment.
              </p>
            ) : (
              <form action={startCheckout}>
                <SubmitButton
                  pendingLabel="Redirecting to Stripe…"
                  className="w-full rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Start your {TRIAL_DAYS}-day free trial
                </SubmitButton>
              </form>
            )}
            <p className="mt-3 text-center text-xs text-zinc-500">
              Cancel anytime during the trial. Payment after the trial ends.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

function CurrentPlan({ subscription }: { subscription: SubscriptionRow }) {
  return (
    <div className="mt-6 space-y-3">
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <dt className="text-zinc-500">Status</dt>
        <dd className="font-medium">{prettyStatus(subscription.status)}</dd>

        {subscription.trial_end && (
          <>
            <dt className="text-zinc-500">Trial ends</dt>
            <dd className="font-medium">
              {new Date(subscription.trial_end).toLocaleDateString()}
            </dd>
          </>
        )}

        {subscription.current_period_end && (
          <>
            <dt className="text-zinc-500">Renews</dt>
            <dd className="font-medium">
              {new Date(subscription.current_period_end).toLocaleDateString()}
              {subscription.cancel_at_period_end && ' (canceling)'}
            </dd>
          </>
        )}
      </dl>
      <form action={openBillingPortal}>
        <SubmitButton
          pendingLabel="Opening portal…"
          className="w-full rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          Manage subscription
        </SubmitButton>
      </form>
    </div>
  )
}

function prettyStatus(s: string): string {
  switch (s) {
    case 'trialing':
      return 'Trial active'
    case 'active':
      return 'Active'
    case 'past_due':
      return 'Past due — please update payment'
    case 'canceled':
      return 'Canceled'
    default:
      return s
  }
}

function humanError(code: string): string {
  switch (code) {
    case 'missing_price_id':
      return 'Stripe price ID is not configured. Set NEXT_PUBLIC_STRIPE_PRICE_ID in the project environment.'
    case 'no_subscription':
      return 'No active subscription found.'
    case 'checkout_failed':
      return "Couldn't start checkout. Try again in a moment."
    default:
      return decodeURIComponent(code)
  }
}
