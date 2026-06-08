import { NextResponse, type NextRequest } from 'next/server'
import type Stripe from 'stripe'
import { formatDay, formatHourRange, formatMoney } from '@/lib/booking'
import { adminEmails, siteUrl } from '@/lib/config'
import { sendEmail } from '@/lib/email'
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
        // Booking payments carry a booking_id; subscriptions carry a
        // subscription reference. Dispatch on that.
        if (session.metadata?.booking_id) {
          await markBookingPaid(session)
          break
        }
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
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        const bookingId = session.metadata?.booking_id as string | undefined
        if (bookingId) {
          // Free the day: only touch a still-unpaid hold (idempotent).
          const admin = createSupabaseAdminClient()
          await admin
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', bookingId)
            .eq('status', 'pending_payment')
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

// Payment cleared: flip the hold to a paid 'pending' booking awaiting admin
// review, and notify the operators. Guarded on 'pending_payment' so duplicate
// webhook deliveries don't double-notify.
async function markBookingPaid(session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.booking_id as string
  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : (session.payment_intent?.id ?? null)

  const admin = createSupabaseAdminClient()
  const { data: booking } = await admin
    .from('bookings')
    .update({ status: 'pending', stripe_payment_intent_id: paymentIntentId })
    .eq('id', bookingId)
    .eq('status', 'pending_payment')
    .select('id, tourist_id, day, start_hour, end_hour, note, amount_cents, currency')
    .maybeSingle<{
      id: string
      tourist_id: string
      day: string
      start_hour: number
      end_hour: number
      note: string | null
      amount_cents: number | null
      currency: string | null
    }>()
  // Already processed (or never a hold) — nothing to notify.
  if (!booking) return

  const { data: tourist } = await admin
    .from('profiles')
    .select('display_name')
    .eq('id', booking.tourist_id)
    .maybeSingle<{ display_name: string }>()
  const { data: touristAuth } = await admin.auth.admin.getUserById(
    booking.tourist_id,
  )
  const paid =
    booking.amount_cents != null
      ? formatMoney(booking.amount_cents, booking.currency ?? undefined)
      : '—'

  await sendEmail({
    to: adminEmails(),
    subject: `New paid booking — ${formatDay(booking.day)}, ${formatHourRange(booking.start_hour, booking.end_hour)}`,
    text: [
      'A paid booking request is waiting for review.',
      '',
      `Tourist: ${tourist?.display_name ?? 'Unknown'} (${touristAuth?.user?.email ?? 'no email'})`,
      `Day: ${formatDay(booking.day)}`,
      `Time: ${formatHourRange(booking.start_hour, booking.end_hour)} (${booking.end_hour - booking.start_hour} hours)`,
      `Paid: ${paid}`,
      booking.note ? `Note: ${booking.note}` : 'Note: —',
      '',
      'If you decline, the tourist is automatically refunded.',
      `Approve or decline it here: ${siteUrl()}/admin`,
    ].join('\n'),
  })
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
