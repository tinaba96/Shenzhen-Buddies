import { NextResponse, type NextRequest } from 'next/server'
import { validatePromoCode } from '@/lib/promo'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// Validate a promo code against a held booking and return the discounted total
// for display. Pricing is always re-validated server-side at payment time, so
// this endpoint is display-only and safe.
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = (await request.json().catch(() => ({}))) as {
    bookingId?: string
    code?: string
  }
  if (!body.bookingId || !body.code) {
    return NextResponse.json({ valid: false })
  }

  const admin = createSupabaseAdminClient()
  const { data: booking } = await admin
    .from('bookings')
    .select('id, tourist_id, status, amount_cents')
    .eq('id', body.bookingId)
    .maybeSingle<{
      id: string
      tourist_id: string
      status: string
      amount_cents: number | null
    }>()
  if (
    !booking ||
    booking.tourist_id !== user.id ||
    booking.status !== 'pending_payment' ||
    !booking.amount_cents
  ) {
    return NextResponse.json({ valid: false })
  }

  const promo = await validatePromoCode(body.code, booking.amount_cents)
  if (!promo) return NextResponse.json({ valid: false })

  return NextResponse.json({
    valid: true,
    discountedCents: promo.discountedCents,
    label: promo.label,
  })
}
