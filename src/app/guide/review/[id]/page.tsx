import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { SubmitButton } from '@/components/SubmitButton'
import { SupportPanel } from '@/components/SupportPanel'
import {
  CURRENCY,
  formatDay,
  formatHourRange,
  hoursUntilTourStart,
  type BookingRow,
} from '@/lib/booking'
import { fill } from '@/i18n'
import { getI18n } from '@/i18n/server'
import { isSingleGuideMode, officialGuideId } from '@/lib/config'
import { paypalConfigured } from '@/lib/paypal'
import { supportConfigured } from '@/lib/support'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { startTipCheckout, submitTourReview } from './actions'

// Post-tour page: thumbs up/down + an optional 5–50 word review, then the
// option to tip the guide by card (Stripe, ./actions) or PayPal
// (api/paypal/create-tip + capture-tip), both via SupportPanel. Linked from
// the tourist's booking list on /guide and from the confirmation email, so it
// works as a durable URL they can come back to after the tour.

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return {
    title: t.seo.review.title,
    robots: { index: false },
  }
}

const TIP_PRESETS = [1, 5, 10, 20]

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ thanks?: string; tipped?: string; error?: string }>
}

export default async function ReviewPage({ params, searchParams }: Props) {
  if (!isSingleGuideMode()) redirect('/browse')
  const [{ id }, sp, { locale, meta, t }] = await Promise.all([
    params,
    searchParams,
    getI18n(),
  ])
  const r = t.review
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const showPaypal = paypalConfigured() && Boolean(paypalClientId)

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
  const guideName = guide?.display_name ?? r.yourGuide
  // The fallback is a phrase, not a name — splitting it would leave "your".
  const firstName = guide?.display_name
    ? guide.display_name.split(' ')[0]
    : r.yourGuide

  // eslint-disable-next-line react-hooks/purity -- request-time clock to gate the post-tour form
  const ended = hoursUntilTourStart(booking.day, booking.end_hour, Date.now()) <= 0
  const reviewable = booking.status === 'approved' && ended
  // English keeps formatDay's exact output, as on /guide.
  const day =
    locale === 'en'
      ? formatDay(booking.day)
      : new Date(`${booking.day}T00:00:00`).toLocaleDateString(meta.intlLocale, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
  const when = `${day} · ${formatHourRange(booking.start_hour, booking.end_hour)}`

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
        {r.back}
      </Link>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight">
        {r.title}
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        {fill(r.when, { when, name: guideName })}
      </p>

      {sp.error && (
        <p className="mt-6 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          {sp.error}
        </p>
      )}
      {sp.tipped && (
        <p className="mt-6 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          {fill(r.tipped, { name: firstName })}
        </p>
      )}
      {sp.thanks && !sp.tipped && (
        <p className="mt-6 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          {r.thanks}
        </p>
      )}

      {!reviewable ? (
        <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 px-6 py-10 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          {booking.status === 'approved' ? r.notFinished : r.notConfirmed}
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
              {reviewed ? r.changeRating : r.oneTap}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <SubmitButton
                name="thumb"
                value="up"
                pendingLabel={r.saving}
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
                pendingLabel={r.saving}
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
              <span className="text-sm font-medium">{r.words}</span>
              <span className="ml-1 text-xs text-zinc-500">{r.wordsHint}</span>
              <textarea
                name="body"
                rows={3}
                maxLength={600}
                defaultValue={existingReview?.body ?? undefined}
                placeholder={r.placeholder}
                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
              />
            </label>
            <p className="mt-3 text-xs text-zinc-500">
              {fill(r.note, { name: firstName })}
            </p>
          </form>

          {/* Tip, once a thumb has landed (and only when a processor is set up) */}
          {reviewed && (supportConfigured() || showPaypal) && (
            <section className="mt-6 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-rose-50 p-6 dark:border-amber-900/40 dark:from-amber-950/20 dark:to-rose-950/20">
              <p className="text-sm font-semibold">
                {fill(r.tipTitle, { name: firstName })}
              </p>
              <p className="mt-1 mb-4 text-xs text-zinc-600 dark:text-zinc-400">
                {fill(r.tipBody, { name: firstName })}
              </p>
              <SupportPanel
                kind="tip"
                bookingId={booking.id}
                presets={TIP_PRESETS}
                defaultPreset={5}
                cardEnabled={supportConfigured()}
                paypalClientId={showPaypal ? paypalClientId! : null}
                currency={CURRENCY}
                cardAction={startTipCheckout}
                successHref={`/guide/review/${booking.id}?tipped=1`}
                labels={t.support}
                frame={false}
              />
            </section>
          )}
        </>
      )}
    </main>
  )
}
