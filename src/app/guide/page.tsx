import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Avatar } from '@/components/Avatar'
import { BookingFields } from '@/components/BookingFields'
import { SubmitButton } from '@/components/SubmitButton'
import { avatarPublicUrl } from '@/lib/avatars'
import {
  ACTIVE_BOOKING_STATUSES,
  amountCentsForHours,
  bookableSegments,
  cancellationRefundPercent,
  formatDay,
  formatHour,
  formatHourRange,
  formatMoney,
  hoursUntilTourStart,
  HOURLY_RATE_CENTS,
  isHoldExpired,
  MAX_BOOKING_HOURS,
  MIN_BOOKING_HOURS,
  todayInShenzhen,
  type AvailabilityWindow,
  type BookingRow,
  type BookingStatus,
  type FreeSegment,
} from '@/lib/booking'
import { isSingleGuideMode, officialGuideId } from '@/lib/config'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import {
  addGuideAvailability,
  approveGuideBooking,
  cancelOwnBooking,
  deleteGuideAvailability,
  rejectGuideBooking,
  requestBooking,
} from './actions'

type Props = {
  searchParams: Promise<{
    day?: string
    requested?: string
    paid?: string
    payment_cancelled?: string
    avail_saved?: string
    avail_deleted?: string
    approved?: string
    declined?: string
    cancelled?: string
    refund_cents?: string
    error?: string
  }>
}

type GuideProfile = {
  id: string
  display_name: string
  bio: string | null
  city: string
  hobbies: string[]
  languages: string[]
  personality_traits: string[]
  avatar_path: string | null
  updated_at: string
}

const STATUS_STYLES: Record<BookingStatus, { label: string; className: string }> = {
  pending_payment: {
    label: 'Payment incomplete',
    className: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  },
  pending: {
    label: 'Awaiting confirmation (within 3 business days)',
    className:
      'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  },
  approved: {
    label: 'Confirmed',
    className:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  },
  rejected: {
    label: 'Declined',
    className: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  },
}

export default async function GuidePage({ searchParams }: Props) {
  if (!isSingleGuideMode()) redirect('/browse')

  const sp = await searchParams
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const guideId = officialGuideId()!
  const admin = createSupabaseAdminClient()

  const [{ data: guide }, { data: myProfile }] = await Promise.all([
    admin
      .from('profiles')
      .select(
        'id, display_name, bio, city, hobbies, languages, personality_traits, avatar_path, updated_at',
      )
      .eq('id', guideId)
      .maybeSingle<GuideProfile>(),
    supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle<{ role: 'guide' | 'tourist' }>(),
  ])

  if (!guide) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Our guide is almost ready</h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          We&apos;re setting things up — please check back soon.
        </p>
      </main>
    )
  }

  const today = todayInShenzhen()
  const [{ data: windows }, { data: activeBookings }, { data: myBookings }] =
    await Promise.all([
      supabase
        .from('availability_windows')
        .select('id, day, start_hour, end_hour')
        .gte('day', today)
        .order('day')
        .order('start_hour')
        .returns<AvailabilityWindow[]>(),
      // Tourists can only read their own bookings through RLS, but the picker
      // needs to know which days are taken — any active booking (incl. one
      // mid-checkout) holds the whole day. Read with the service-role client
      // and expose nothing but the day itself.
      admin
        .from('bookings')
        .select('day, status, created_at, tourist_id')
        .gte('day', today)
        .in('status', ACTIVE_BOOKING_STATUSES)
        .returns<
          {
            day: string
            status: BookingStatus
            created_at: string
            tourist_id: string
          }[]
        >(),
      supabase
        .from('bookings')
        .select(
          'id, tourist_id, day, start_hour, end_hour, status, note, amount_cents, currency, stripe_payment_intent_id, created_at',
        )
        .eq('tourist_id', user.id)
        .neq('status', 'pending_payment')
        .order('created_at', { ascending: false })
        .limit(20)
        .returns<BookingRow[]>(),
    ])

  // A day is taken by a confirmed/awaiting booking or a *fresh* hold. An
  // abandoned hold (older than 30 min) no longer blocks it, so the picker
  // self-heals even if Stripe's checkout.session.expired webhook is missed.
  // eslint-disable-next-line react-hooks/purity -- request-time clock for hold expiry
  const nowMs = Date.now()
  const bookedDays = new Set(
    (activeBookings ?? [])
      // Abandoned holds (older than 30 min) no longer block the day.
      .filter(
        (b) => !isHoldExpired(b.status, new Date(b.created_at).getTime(), nowMs),
      )
      // Your own in-progress hold shouldn't hide the day from you — you can
      // reclaim it (requestBooking drops it first). It still blocks others.
      .filter(
        (b) => !(b.status === 'pending_payment' && b.tourist_id === user.id),
      )
      .map((b) => b.day),
  )

  // Days that are not taken yet and have at least one bookable (≥4h) window.
  const dayOptions: { day: string; segments: FreeSegment[] }[] = []
  const windowsByDay = new Map<string, AvailabilityWindow[]>()
  for (const w of windows ?? []) {
    const list = windowsByDay.get(w.day) ?? []
    list.push(w)
    windowsByDay.set(w.day, list)
  }
  for (const [day, dayWindows] of windowsByDay) {
    if (bookedDays.has(day)) continue // one booking blocks the whole day
    const segments = dayWindows
      .flatMap(bookableSegments)
      .sort((a, b) => a.start - b.start)
    if (segments.length > 0) dayOptions.push({ day, segments })
  }
  dayOptions.sort((a, b) => (a.day < b.day ? -1 : 1))

  const selectedDay =
    dayOptions.find((d) => d.day === sp.day) ?? dayOptions[0] ?? null

  // Start times where at least a minimum-length tour still fits, with the
  // longest duration possible from that hour (shown in the option label).
  const startOptions = (selectedDay?.segments ?? []).flatMap((seg) => {
    const options: { hour: number; maxDuration: number }[] = []
    for (let h = seg.start; h <= seg.end - MIN_BOOKING_HOURS; h++) {
      options.push({
        hour: h,
        maxDuration: Math.min(MAX_BOOKING_HOURS, seg.end - h),
      })
    }
    return options
  })

  const isTourist = myProfile?.role === 'tourist'
  const isOfficialGuide = user.id === guideId

  // The guide's own schedule: upcoming awaiting/confirmed bookings.
  let guideBookings: GuideBookingRow[] = []
  const guideTouristNames = new Map<string, string>()
  if (isOfficialGuide) {
    const { data } = await admin
      .from('bookings')
      .select('id, tourist_id, day, start_hour, end_hour, status, note')
      .gte('day', today)
      .in('status', ['pending', 'approved'])
      .order('day')
      .returns<GuideBookingRow[]>()
    guideBookings = data ?? []
    const ids = Array.from(new Set(guideBookings.map((b) => b.tourist_id)))
    if (ids.length) {
      const { data: profs } = await admin
        .from('profiles')
        .select('id, display_name')
        .in('id', ids)
        .returns<{ id: string; display_name: string }[]>()
      for (const p of profs ?? []) guideTouristNames.set(p.id, p.display_name)
    }
  }

  return (
    <main className="flex flex-1 flex-col">
      {/* Cover banner */}
      <section className="relative h-56 overflow-hidden sm:h-72">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1473625247510-8ceb1760943f?w=2000&q=80&auto=format&fit=crop"
          alt="Shenzhen skyline"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/20 via-rose-500/15 to-black/50" />
        <div className="relative mx-auto flex max-w-3xl items-center justify-end px-4 py-4">
          <Link
            href="/profile"
            className="rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur hover:bg-white/20"
          >
            Your profile
          </Link>
        </div>
      </section>

      <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-8">
        {/* Identity row */}
        <div className="flex flex-wrap items-center gap-4">
          <Avatar
            src={avatarPublicUrl(guide.avatar_path, guide.updated_at)}
            name={guide.display_name}
            size={96}
            className="ring-4 ring-white shadow-lg dark:ring-zinc-900"
          />
          <div className="min-w-0 flex-1 pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold">{guide.display_name}</h1>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Your guide
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-500">{guide.city}</p>
            <Link
              href={`/u/${guide.id}`}
              className="mt-1 inline-block text-sm text-zinc-600 underline underline-offset-2 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              Full profile &amp; reviews
            </Link>
          </div>
        </div>

        {/* Banners */}
        {(sp.requested || sp.paid) && (
          <p className="mt-6 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            {sp.paid
              ? "Payment received! Your request is in — we'll confirm by email within 3 business days. If we can't confirm, you're fully refunded."
              : "Request sent! We'll confirm by email within 3 business days."}
          </p>
        )}
        {sp.payment_cancelled && (
          <p className="mt-6 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            Payment cancelled — nothing was charged. You can pick a slot and try
            again.
          </p>
        )}
        {(sp.avail_saved || sp.avail_deleted) && (
          <p className="mt-6 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            {sp.avail_saved ? 'Availability added.' : 'Availability removed.'}
          </p>
        )}
        {(sp.approved || sp.declined) && (
          <p className="mt-6 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            {sp.approved
              ? 'Booking confirmed — the tourist has been emailed.'
              : 'Booking declined — the tourist was refunded and the day is free again.'}
          </p>
        )}
        {sp.cancelled && (
          <p className="mt-6 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            Booking cancelled.{' '}
            {Number(sp.refund_cents) > 0
              ? `${formatMoney(Number(sp.refund_cents))} will be refunded within a few business days.`
              : 'No refund applies under the cancellation policy.'}
          </p>
        )}
        {sp.error && (
          <p className="mt-6 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
            {sp.error}
          </p>
        )}

        {/* About the guide */}
        <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {guide.bio && (
            <p className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
              {guide.bio}
            </p>
          )}
          <Chips label="Hobbies" items={guide.hobbies} />
          <Chips label="Languages" items={guide.languages} />
          <Chips label="Personality traits" items={guide.personality_traits} />
        </section>

        {/* Booking (tourists) */}
        {!isOfficialGuide && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Book a day together</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Tours run from {MIN_BOOKING_HOURS} to {MAX_BOOKING_HOURS} hours at{' '}
            {formatMoney(HOURLY_RATE_CENTS)}/hour (
            {formatMoney(amountCentsForHours(MIN_BOOKING_HOURS))}–
            {formatMoney(amountCentsForHours(MAX_BOOKING_HOURS))}). You pay when
            you book; if we can&apos;t confirm, you&apos;re fully refunded.
          </p>

          {!isTourist ? (
            <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-8 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              Booking is open to tourists.{' '}
              {!myProfile && (
                <>
                  <Link href="/profile" className="underline underline-offset-2">
                    Create your profile
                  </Link>{' '}
                  as a tourist to request a day.
                </>
              )}
            </div>
          ) : dayOptions.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 px-6 py-12 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
              No open dates right now — please check back soon.
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              {/* Day picker */}
              <p className="text-sm font-medium">Available days</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {dayOptions.map((d) => (
                  <Link
                    key={d.day}
                    href={`/guide?day=${d.day}`}
                    className={
                      d.day === selectedDay?.day
                        ? 'rounded-full bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-white dark:text-zinc-900'
                        : 'rounded-full border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
                    }
                  >
                    {formatDay(d.day)}
                  </Link>
                ))}
              </div>

              {selectedDay && (
                <>
                  <p className="mt-4 text-xs text-zinc-500">
                    {guide.display_name}&apos;s hours on{' '}
                    {formatDay(selectedDay.day)}:{' '}
                    {selectedDay.segments
                      .map((s) => formatHourRange(s.start, s.end))
                      .join(' · ')}
                  </p>

                  <form action={requestBooking} className="mt-4 space-y-4">
                    <input type="hidden" name="day" value={selectedDay.day} />
                    <BookingFields
                      startOptions={startOptions}
                      minHours={MIN_BOOKING_HOURS}
                      maxHours={MAX_BOOKING_HOURS}
                    />
                    <label className="block">
                      <span className="text-sm font-medium">
                        Anything {guide.display_name} should know?
                      </span>
                      <span className="ml-1 text-xs text-zinc-500">
                        (optional)
                      </span>
                      <textarea
                        name="note"
                        rows={3}
                        maxLength={500}
                        placeholder="What you'd love to see, dietary needs, meeting point ideas…"
                        className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
                      />
                    </label>
                    <SubmitButton
                      pendingLabel="Going to payment…"
                      className="w-full rounded-full bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                      Continue to payment
                    </SubmitButton>
                    <p className="text-center text-xs text-zinc-500">
                      You pay {formatMoney(HOURLY_RATE_CENTS)}/hour now to hold
                      the day. We confirm within 3 business days — if we
                      can&apos;t, you&apos;re fully refunded.
                    </p>
                  </form>
                </>
              )}
            </div>
          )}
        </section>
        )}

        {/* Guide's own schedule + availability management */}
        {isOfficialGuide && (
          <>
            <GuideBookings bookings={guideBookings} names={guideTouristNames} />
            <GuideAvailability windows={windows ?? []} today={today} />
          </>
        )}

        {/* My bookings */}
        {(myBookings?.length ?? 0) > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold">Your requests</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Cancellation: free up to 72h before · 30% fee within 72h · no
              refund within 24h. Before it&apos;s confirmed, you&apos;re always
              fully refunded.
            </p>
            <ul className="mt-3 space-y-3">
              {myBookings!.map((b) => {
                const status = STATUS_STYLES[b.status]
                const hrs = hoursUntilTourStart(b.day, b.start_hour, nowMs)
                const canCancel =
                  (b.status === 'pending' || b.status === 'approved') &&
                  hrs > 0
                const pct = cancellationRefundPercent(b.status, hrs)
                return (
                  <li
                    key={b.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {formatDay(b.day)} ·{' '}
                        {formatHourRange(b.start_hour, b.end_hour)}
                        {b.amount_cents != null && (
                          <span className="ml-2 font-normal text-zinc-500">
                            {b.status === 'rejected'
                              ? `${formatMoney(b.amount_cents, b.currency ?? undefined)} refunded`
                              : formatMoney(b.amount_cents, b.currency ?? undefined)}
                          </span>
                        )}
                      </p>
                      {b.note && (
                        <p className="mt-1 max-w-md truncate text-xs text-zinc-500">
                          “{b.note}”
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                      {canCancel && (
                        <form action={cancelOwnBooking}>
                          <input type="hidden" name="id" value={b.id} />
                          <SubmitButton
                            pendingLabel="Cancelling…"
                            className="text-xs text-zinc-500 underline underline-offset-2 hover:text-red-600"
                          >
                            {pct === 100
                              ? 'Cancel (full refund)'
                              : pct > 0
                                ? `Cancel (${100 - pct}% fee)`
                                : 'Cancel (no refund)'}
                          </SubmitButton>
                        </form>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        )}
      </div>
    </main>
  )
}

type GuideBookingRow = {
  id: string
  tourist_id: string
  day: string
  start_hour: number
  end_hour: number
  status: BookingStatus
  note: string | null
}

// The guide's upcoming schedule (awaiting + confirmed bookings).
function GuideBookings({
  bookings,
  names,
}: {
  bookings: GuideBookingRow[]
  names: Map<string, string>
}) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">Your bookings</h2>
      {bookings.length === 0 ? (
        <p className="mt-3 rounded-lg border border-dashed border-zinc-300 px-6 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
          No upcoming bookings yet.
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {bookings.map((b) => {
            const confirmed = b.status === 'approved'
            return (
              <li
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {formatDay(b.day)} ·{' '}
                    {formatHourRange(b.start_hour, b.end_hour)}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {names.get(b.tourist_id) ?? 'Tourist'}
                    {b.note && ` · “${b.note}”`}
                  </p>
                </div>
                {confirmed ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Confirmed
                  </span>
                ) : (
                  <div className="flex shrink-0 gap-2">
                    <form action={approveGuideBooking}>
                      <input type="hidden" name="id" value={b.id} />
                      <SubmitButton
                        pendingLabel="Approving…"
                        className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
                      >
                        Approve
                      </SubmitButton>
                    </form>
                    <form action={rejectGuideBooking}>
                      <input type="hidden" name="id" value={b.id} />
                      <SubmitButton
                        pendingLabel="Declining…"
                        className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        Decline
                      </SubmitButton>
                    </form>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

// Availability manager shown to the official guide on their own /guide page.
function GuideAvailability({
  windows,
  today,
}: {
  windows: AvailabilityWindow[]
  today: string
}) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">Your availability</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Add the days and hours you can guide. Tourists can book any{' '}
        {MIN_BOOKING_HOURS}–{MAX_BOOKING_HOURS} hour slot inside a window.
      </p>

      <form
        action={addGuideAvailability}
        className="mt-3 flex flex-wrap items-end gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <label className="block">
          <span className="text-xs font-medium text-zinc-500">Day</span>
          <input
            type="date"
            name="day"
            required
            min={today}
            className="mt-1 block rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-zinc-500">From</span>
          <select
            name="start_hour"
            defaultValue={9}
            className="mt-1 block rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          >
            {Array.from({ length: 24 }, (_, h) => (
              <option key={h} value={h}>
                {formatHour(h)}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-zinc-500">Until</span>
          <select
            name="end_hour"
            defaultValue={22}
            className="mt-1 block rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          >
            {Array.from({ length: 24 }, (_, i) => i + 1).map((h) => (
              <option key={h} value={h}>
                {formatHour(h)}
              </option>
            ))}
          </select>
        </label>
        <SubmitButton
          pendingLabel="Adding…"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Add window
        </SubmitButton>
      </form>

      {windows.length === 0 ? (
        <p className="mt-3 rounded-lg border border-dashed border-zinc-300 px-6 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
          No upcoming availability yet — tourists can&apos;t book until you add a
          window.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {windows.map((w) => (
            <li
              key={w.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span>
                {formatDay(w.day)} · {formatHourRange(w.start_hour, w.end_hour)}
              </span>
              <form action={deleteGuideAvailability}>
                <input type="hidden" name="id" value={w.id} />
                <SubmitButton
                  pendingLabel="Removing…"
                  className="text-xs text-zinc-500 underline underline-offset-2 hover:text-red-600"
                >
                  Remove
                </SubmitButton>
              </form>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function Chips({ label, items }: { label: string; items: string[] }) {
  if (!items || items.length === 0) return null
  return (
    <div className="mt-4 first:mt-0">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {items.map((it) => (
          <span
            key={it}
            className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  )
}
