import { NextResponse, type NextRequest } from 'next/server'
import { finalizePaypalBooking } from '@/lib/bookings'
import { capturePaypalOrder } from '@/lib/paypal'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// Capture an approved PayPal order and mark the booking paid. Authorises the
// tourist and checks the order id matches the one we created for this booking,
// so a captured order can't be pointed at someone else's hold.
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = (await request.json().catch(() => ({}))) as {
    bookingId?: string
    orderId?: string
  }
  if (!body.bookingId || !body.orderId) {
    return NextResponse.json({ error: 'missing params' }, { status: 400 })
  }

  const admin = createSupabaseAdminClient()
  const { data: booking } = await admin
    .from('bookings')
    .select('id, tourist_id, status, paypal_order_id')
    .eq('id', body.bookingId)
    .maybeSingle<{
      id: string
      tourist_id: string
      status: string
      paypal_order_id: string | null
    }>()
  if (
    !booking ||
    booking.tourist_id !== user.id ||
    booking.paypal_order_id !== body.orderId
  ) {
    return NextResponse.json({ error: 'invalid order' }, { status: 400 })
  }
  // Already finalized (e.g. a retried capture) — idempotent success.
  if (booking.status !== 'pending_payment') {
    return NextResponse.json({ ok: true })
  }

  try {
    const capture = await capturePaypalOrder(body.orderId)
    if (capture.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'payment not completed' }, { status: 402 })
    }
    await finalizePaypalBooking({
      bookingId: booking.id,
      captureId: capture.captureId,
      amountCents: capture.amountCents,
      currency: capture.currency,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('PayPal capture failed:', err)
    return NextResponse.json({ error: 'capture failed' }, { status: 500 })
  }
}
