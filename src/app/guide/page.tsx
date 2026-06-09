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
  formatDay,
  formatHourRange,
  formatMoney,
  HOURLY_RATE_CENTS,
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
import { requestBooking } from './actions'

type Props = {
  searchParams: Promise<{
    day?: string
    requested?: string
    paid?: string
    payment_cancelled?: string
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
        .select('day')
        .gte('day', today)
        .in('status', ACTIVE_BOOKING_STATUSES)
        .returns<{ day: string }[]>(),
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

  const bookedDays = new Set((activeBookings ?? []).map((b) => b.day))

  // Days that are not taken yet and have at least one bookable (≥5h) window.
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

        {/* Booking */}
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

        {/* My bookings */}
        {(myBookings?.length ?? 0) > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold">Your requests</h2>
            <ul className="mt-3 space-y-3">
              {myBookings!.map((b) => {
                const status = STATUS_STYLES[b.status]
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
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
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
