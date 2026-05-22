import Link from 'next/link'
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
const HERO_PHOTO =
  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=2000&q=80&auto=format&fit=crop'

const features = [
  {
    title: 'Advanced matching',
    body: 'Sort browse results by shared languages, hobbies, traits, and city. See exactly why someone matches.',
    icon: 'sparkles' as const,
  },
  {
    title: 'Priority placement',
    body: 'Your profile surfaces toward the top of relevant searches.',
    icon: 'arrow-up' as const,
  },
  {
    title: 'Unlimited messaging',
    body: 'No caps on conversations. Talk to as many guides or travelers as you like.',
    icon: 'chat' as const,
  },
  {
    title: 'Early access',
    body: 'Try new features before they ship to free users. Shape the roadmap with your feedback.',
    icon: 'rocket' as const,
  },
]

const faqs = [
  {
    q: 'How does the free trial work?',
    a: `You get ${TRIAL_DAYS} days of full Premium access. Cancel any time during the trial and you won't be charged.`,
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes — manage your subscription from the billing portal. You keep Premium access until the end of the current billing period.',
  },
  {
    q: 'What happens to my reviews and messages if I cancel?',
    a: "Your profile, conversations, and reviews stay. You'll just lose Premium-only sorting and priority placement.",
  },
  {
    q: 'Is the pilot really free?',
    a: 'Yes — during the pilot phase, signup, profiles, browsing, chat, and reviews are all free. Premium is optional and only adds the perks above.',
  },
]

export default async function PricingPage({ searchParams }: Props) {
  const { success, canceled, error } = await searchParams
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const subscription = user
    ? (
        await supabase
          .from('subscriptions')
          .select(
            'user_id, stripe_customer_id, stripe_subscription_id, status, price_id, current_period_end, trial_end, cancel_at_period_end',
          )
          .eq('user_id', user.id)
          .maybeSingle<SubscriptionRow>()
      ).data ?? null
    : null

  const active = isSubscriptionActive(subscription)
  const stripeConfigured =
    !!process.env.STRIPE_SECRET_KEY && !!process.env.NEXT_PUBLIC_STRIPE_PRICE_ID

  return (
    <main className="flex flex-1 flex-col">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_PHOTO}
          alt="City lights"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/55 to-black/75" />
        <div
          className="absolute inset-0 mix-blend-soft-light opacity-70"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 30%, rgba(245,158,11,0.45), transparent 50%), radial-gradient(circle at 70% 80%, rgba(244,63,94,0.45), transparent 50%)',
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center text-white sm:py-28">
          <p className="text-xs font-medium uppercase tracking-wide text-white/80">
            Membership
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight drop-shadow sm:text-6xl">
            Premium for{' '}
            <span className="bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-transparent">
              real explorers.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/85 sm:text-lg">
            One price, all the perks. {TRIAL_DAYS}-day free trial, cancel
            anytime, no charge during the pilot if you change your mind.
          </p>
        </div>
      </section>

      {/* STATUS BANNERS */}
      {(success || canceled || error) && (
        <section className="mx-auto w-full max-w-3xl px-6 pt-6">
          {success && (
            <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              You&apos;re in. Welcome to Premium.
            </p>
          )}
          {canceled && (
            <p className="rounded-md bg-zinc-100 px-3 py-2 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
              Checkout canceled. No charge made.
            </p>
          )}
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
              {humanError(error)}
            </p>
          )}
        </section>
      )}

      {/* PLAN CARD */}
      <section className="mx-auto w-full max-w-3xl px-6 py-12">
        <article className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-amber-300/40 to-rose-300/40 blur-3xl"
            aria-hidden
          />

          <div className="relative flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Premium plan
              </p>
              <h2 className="mt-1 text-2xl font-semibold">Shenzhen Buddies Premium</h2>
            </div>
            {!active && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {TRIAL_DAYS}-day free trial
              </span>
            )}
          </div>

          <ul className="relative mt-6 grid gap-3 sm:grid-cols-2">
            {features.map((f) => (
              <li
                key={f.title}
                className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-950/50"
              >
                <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-200 to-rose-200 text-zinc-700 dark:from-amber-900/40 dark:to-rose-900/40 dark:text-zinc-200">
                  <FeatureIcon name={f.icon} />
                </span>
                <div>
                  <p className="text-sm font-medium">{f.title}</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">{f.body}</p>
                </div>
              </li>
            ))}
          </ul>

          {active ? (
            <CurrentPlan subscription={subscription!} />
          ) : !user ? (
            <div className="relative mt-8">
              <Link
                href="/signup?next=/pricing"
                className="block w-full rounded-full bg-zinc-900 px-6 py-3 text-center text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Sign up to start your free trial
              </Link>
              <p className="mt-3 text-center text-xs text-zinc-500">
                Already have an account?{' '}
                <Link href="/login" className="underline">
                  Log in
                </Link>
              </p>
            </div>
          ) : !stripeConfigured ? (
            <p className="relative mt-8 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              Subscription checkout isn&apos;t configured yet — the admin needs
              to set <code className="font-mono text-xs">STRIPE_SECRET_KEY</code>{' '}
              and{' '}
              <code className="font-mono text-xs">
                NEXT_PUBLIC_STRIPE_PRICE_ID
              </code>{' '}
              in the project environment.
            </p>
          ) : (
            <div className="relative mt-8">
              <form action={startCheckout}>
                <SubmitButton
                  pendingLabel="Redirecting to Stripe…"
                  className="w-full rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Start your {TRIAL_DAYS}-day free trial
                </SubmitButton>
              </form>
              <p className="mt-3 text-center text-xs text-zinc-500">
                Cancel anytime during the trial. Payment after the trial ends.
              </p>
            </div>
          )}
        </article>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-3xl px-6 pb-20">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          Common questions
        </h2>
        <dl className="mt-8 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-zinc-200 bg-white p-4 open:shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium">
                <span>{f.q}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 flex-shrink-0 transition group-open:rotate-180">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                {f.a}
              </p>
            </details>
          ))}
        </dl>
      </section>
    </main>
  )
}

function CurrentPlan({ subscription }: { subscription: SubscriptionRow }) {
  return (
    <div className="relative mt-8 space-y-3">
      <dl className="grid grid-cols-2 gap-2 rounded-xl bg-zinc-50 p-4 text-sm dark:bg-zinc-950/50">
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
          className="w-full rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          Manage subscription
        </SubmitButton>
      </form>
    </div>
  )
}

function FeatureIcon({ name }: { name: 'sparkles' | 'arrow-up' | 'chat' | 'rocket' }) {
  const cls = 'h-4 w-4'
  switch (name) {
    case 'sparkles':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M12 3l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z" />
          <path d="M20 15l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" />
        </svg>
      )
    case 'arrow-up':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </svg>
      )
    case 'chat':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />
        </svg>
      )
    case 'rocket':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls}>
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        </svg>
      )
  }
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
