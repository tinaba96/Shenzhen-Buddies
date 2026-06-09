import { NextResponse, type NextRequest } from 'next/server'
import { siteUrl } from '@/lib/config'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'

// Stripe's cancel_url lands here when a tourist backs out of checkout. We
// release their hold immediately (instead of waiting for the 30-min session
// expiry) so the day frees up right away, then send them back to /guide.
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const day = request.nextUrl.searchParams.get('day')

  if (user) {
    const admin = createSupabaseAdminClient()
    let query = admin
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('tourist_id', user.id)
      .eq('status', 'pending_payment')
    if (day) query = query.eq('day', day)
    await query
  }

  const target = new URL('/guide', siteUrl())
  target.searchParams.set('payment_cancelled', '1')
  if (day) target.searchParams.set('day', day)
  return NextResponse.redirect(target)
}
