import Link from 'next/link'
import { redirect } from 'next/navigation'
import { PaymentPanel } from '@/components/PaymentPanel'
import { CURRENCY, formatDay, formatHourRange } from '@/lib/booking'
import { paypalConfigured } from '@/lib/paypal'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; cancelled?: string }>
}

export default async function PayPage({ params, searchParams }: Props) {
  const { id } = await params
  const { error, cancelled } = await searchParams

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Read via the service-role client (the hold isn't visible under normal RLS)
  // and enforce ownership + the awaiting-payment state ourselves.
  const admin = createSupabaseAdminClient()
  const { data: booking } = await admin
    .from('bookings')
    .select('id, tourist_id, day, start_hour, end_hour, status, amount_cents, currency')
    .eq('id', id)
    .maybeSingle<{
      id: string
      tourist_id: string
      day: string
      start_hour: number
      end_hour: number
      status: string
      amount_cents: number | null
      currency: string | null
    }>()

  // Not yours, gone, or already paid/expired — nothing to pay here.
  if (!booking || booking.tourist_id !== user.id) redirect('/guide')
  if (booking.status !== 'pending_payment') redirect('/guide')

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const showPaypal = paypalConfigured() && Boolean(paypalClientId)

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-10">
      <h1 className="text-2xl font-semibold">Complete your booking</h1>

      <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-500">Your tour</p>
        <p className="mt-1 font-medium">
          {formatDay(booking.day)} ·{' '}
          {formatHourRange(booking.start_hour, booking.end_hour)}
        </p>
      </div>

      {cancelled && (
        <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          Payment cancelled — nothing was charged. You can try again below.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <PaymentPanel
          bookingId={booking.id}
          baseAmountCents={booking.amount_cents ?? 0}
          currency={booking.currency ?? CURRENCY}
          paypalClientId={showPaypal ? paypalClientId! : null}
        />
      </div>

      <p className="mt-6 text-center text-xs text-zinc-500">
        We confirm within 3 business days — if we can&apos;t, you&apos;re fully
        refunded.{' '}
        <Link
          href="/cancellation"
          className="underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          Cancellation policy
        </Link>
      </p>
      <Link
        href="/guide"
        className="mt-4 text-center text-xs text-zinc-400 underline underline-offset-2 hover:text-zinc-600"
      >
        Cancel and go back
      </Link>
    </main>
  )
}
