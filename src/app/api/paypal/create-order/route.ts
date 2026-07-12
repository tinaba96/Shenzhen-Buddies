import { NextResponse, type NextRequest } from 'next/server'
import { CURRENCY } from '@/lib/booking'
import { createPaypalOrder } from '@/lib/paypal'
import { validatePromoCode } from '@/lib/promo'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// Create a PayPal order for a held booking. The browser calls this from the
// PayPal buttons; we authorise the tourist and price the order server-side from
// the stored hold so the amount can't be tampered with client-side.
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = (await request.json().catch(() => ({}))) as {
    bookingId?: string
    promoCode?: string
  }
  if (!body.bookingId) {
    return NextResponse.json({ error: 'missing bookingId' }, { status: 400 })
  }

  const admin = createSupabaseAdminClient()
  const { data: booking } = await admin
    .from('bookings')
    .select('id, tourist_id, day, status, amount_cents, currency')
    .eq('id', body.bookingId)
    .maybeSingle<{
      id: string
      tourist_id: string
      day: string
      status: string
      amount_cents: number | null
      currency: string | null
    }>()
  if (
    !booking ||
    booking.tourist_id !== user.id ||
    booking.status !== 'pending_payment' ||
    !booking.amount_cents
  ) {
    return NextResponse.json({ error: 'booking not payable' }, { status: 400 })
  }

  // Apply a promo code if supplied. PayPal can't charge 0, so a code that
  // zeroes the total is rejected here — the payment page steers free bookings
  // to the card ($0 Stripe Checkout) path instead.
  let chargeCents = booking.amount_cents
  if (body.promoCode) {
    const promo = await validatePromoCode(body.promoCode, booking.amount_cents)
    if (!promo) {
      return NextResponse.json({ error: 'invalid promo code' }, { status: 400 })
    }
    chargeCents = promo.discountedCents
  }
  if (chargeCents <= 0) {
    return NextResponse.json(
      { error: 'free bookings use card checkout' },
      { status: 400 },
    )
  }

  try {
    const order = await createPaypalOrder({
      amountCents: chargeCents,
      currency: booking.currency ?? CURRENCY,
      referenceId: booking.id,
      description: `Shenzhen Buddies tour — ${booking.day}`,
    })
    // Store the order id so capture can verify it belongs to this booking.
    await admin
      .from('bookings')
      .update({ paypal_order_id: order.id })
      .eq('id', booking.id)
    return NextResponse.json({ orderId: order.id })
  } catch (err) {
    console.error('PayPal create order failed:', err)
    return NextResponse.json({ error: 'could not create order' }, { status: 500 })
  }
}
