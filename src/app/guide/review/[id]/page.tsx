import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { SubmitButton } from '@/components/SubmitButton'
import {
  formatDay,
  formatHourRange,
  hoursUntilTourStart,
  type BookingRow,
} from '@/lib/booking'
import { isSingleGuideMode, officialGuideId } from '@/lib/config'
import { supportConfigured } from '@/lib/support'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { startTipCheckout, submitTourReview } from './actions'

// Post-tour page: thumbs up/down + an optional 5–50 word review, then the
// option to tip the guide. Linked from the tourist's booking list on /guide
// and from the confirmation email, so it works as a durable URL they can
// come back to after the tour.

export const metadata: Metadata = {
  title: 'How was your tour? — Shenzhen Buddies',
  robots: { index: false },
}

const TIP_PRESETS = [1, 5, 10, 20]

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ thanks?: string; tipped?: string; error?: string }>
}

export default async function ReviewPage({ params, searchParams }: Props) {
  if (!isSingleGuideMode()) redirect('/browse')
  const [{ id }, sp] = await Promise.all([params, searchParams])

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/guide/review/${id}`)}`)
  }

  // RLS: a tourist can only read their own bookings, so a foreign id is a 404.
  const { data: booking } = await supabase
    .from('bookings')
    .select('id, tourist_id, day, start_hour, end_hour, status')
    .eq('id', id)
    .eq('tourist_id', user.id)
    .maybeSingle<
      Pick<BookingRow, 'id' | 'tourist_id' | 'day' | 'start_hour' | 'end_hour' | 'status'>
    >()
  if (!booking) notFound()

  const guideId = officialGuideId()!
  const admin = createSupabaseAdminClient()
  const [{ data: guide }, { data: existingReview }] = await Promise.all([
    admin
      .from('profiles')
      .select('display_name')
      .eq('id', guideId)
      .maybeSingle<{ display_name: string }>(),
    supabase
      .from('reviews')
      .select('stars, body')
      .eq('reviewer_id', user.id)
      .eq('reviewee_id', guideId)
      .maybeSingle<{ stars: number; body: string | null }>(),
  ])
  const guideName = guide?.display_name ?? 'your guide'
  const firstName = guideName.split(' ')[0]

  // eslint-disable-next-line react-hooks/purity -- request-time clock to gate the post-tour form
  const ended = hoursUntilTourStart(booking.day, booking.end_hour, Date.now()) <= 0
  const reviewable = booking.status === 'approved' && ended
  const when = `${formatDay(booking.day)} · ${formatHourRange(booking.start_hour, booking.end_hour)}`

  // The tip step opens once a thumb has landed — either just now (?thanks=)
  // or on an earlier visit (a stored review).
  const reviewed = !!sp.thanks || !!existingReview
  const currentThumb =
    sp.thanks === 'up' || sp.thanks === 'down'
      ? sp.thanks
      : existingReview
        ? existingReview.stars >= 4
          ? 'up'
          : 'down'
        : null

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-12">
      <Link
        href="/guide"
        className="text-xs font-medium uppercase tracking-wider text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white"
      >
        ← Your bookings
      </Link>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight">
        How was your tour?
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        {when} · with {guideName}
      </p>

      {sp.error && (
        <p className="mt-6 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          {sp.error}
        </p>
      )}
      {sp.tipped && (
        <p className="mt-6 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          Tip received — thank you! 100% of it goes to {firstName}.
        </p>
      )}
      {sp.thanks && !sp.tipped && (
        <p className="mt-6 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          Thanks — your review is in.
        </p>
      )}

      {!reviewable ? (
        <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 px-6 py-10 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          {booking.status === 'approved'
            ? 'Your tour has not finished yet — come back here afterwards to leave a review.'
            : 'This booking is not a confirmed tour, so there is nothing to review.'}
        </div>
      ) : (
        <>
          {/* Thumb + optional words */}
          <form
            action={submitTourReview}
            className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <input type="hidden" name="booking_id" value={booking.id} />
            <p className="text-sm font-semibold">
              {reviewed ? 'Change your rating' : 'One tap is enough'}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <SubmitButton
                name="thumb"
                value="up"
                pendingLabel="Saving…"
                className={`rounded-xl border px-4 py-4 text-center text-2xl transition ${
                  currentThumb === 'up'
                    ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950'
                    : 'border-zinc-300 hover:border-emerald-400 hover:bg-emerald-50/50 dark:border-zinc-700 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/40'
                }`}
              >
                👍
              </SubmitButton>
              <SubmitButton
                name="thumb"
                value="down"
                pendingLabel="Saving…"
                className={`rounded-xl border px-4 py-4 text-center text-2xl transition ${
                  currentThumb === 'down'
                    ? 'border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-950'
                    : 'border-zinc-300 hover:border-red-300 hover:bg-red-50/50 dark:border-zinc-700 dark:hover:border-red-700 dark:hover:bg-red-950/40'
                }`}
              >
                👎
              </SubmitButton>
            </div>
            <label className="mt-4 block">
              <span className="text-sm font-medium">A few words</span>
              <span className="ml-1 text-xs text-zinc-500">
                (optional, 5–50 words)
              </span>
              <textarea
                name="body"
                rows={3}
                maxLength={600}
                defaultValue={existingReview?.body ?? undefined}
                placeholder="What stood out — good or bad?"
                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
              />
            </label>
            <p className="mt-3 text-xs text-zinc-500">
              Tapping a thumb saves your review. Honest reviews — good or bad —
              are published on {firstName}&apos;s profile.
            </p>
          </form>

          {/* Tip, once a thumb has landed (and only when Stripe is set up) */}
          {reviewed && supportConfigured() && (
            <section className="mt-6 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-rose-50 p-6 dark:border-amber-900/40 dark:from-amber-950/20 dark:to-rose-950/20">
              <p className="text-sm font-semibold">
                Want to leave {firstName} a tip?
              </p>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                Totally optional — the tour stays free either way. 100% goes to{' '}
                {firstName}.
              </p>
              <form action={startTipCheckout} className="mt-4">
                <input type="hidden" name="booking_id" value={booking.id} />
                <div className="grid grid-cols-4 gap-2">
                  {TIP_PRESETS.map((d) => (
                    <SubmitButton
                      key={d}
                      name="amount"
                      value={String(d)}
                      pendingLabel="…"
                      className="rounded-xl border border-zinc-300 bg-white px-2 py-3 text-sm font-semibold transition hover:border-amber-400 hover:bg-amber-50 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-amber-600 dark:hover:bg-amber-950/40"
                    >
                      CA${d}
                    </SubmitButton>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    type="number"
                    name="custom_amount"
                    min={1}
                    max={500}
                    step={1}
                    placeholder="Custom (CA$)"
                    className="block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
                  />
                  <SubmitButton
                    pendingLabel="Opening…"
                    className="shrink-0 rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Tip
                  </SubmitButton>
                </div>
              </form>
              <p className="mt-2 text-[11px] text-zinc-500">
                Paid securely by card via Stripe.
              </p>
            </section>
          )}
        </>
      )}
    </main>
  )
}
