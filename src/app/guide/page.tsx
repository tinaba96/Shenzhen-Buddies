import Link from 'next/link'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Avatar } from '@/components/Avatar'
import { BookingFields } from '@/components/BookingFields'
import { FreeBookingFields } from '@/components/FreeBookingFields'
import { ReviewPledge } from '@/components/GuestRequestForm'
import { StarRating } from '@/components/StarRating'
import { SubmitButton } from '@/components/SubmitButton'
import { avatarPublicUrl } from '@/lib/avatars'
import {
  ACTIVE_BOOKING_STATUSES,
  amountCentsForHours,
  bookableSegments,
  cancellationRefundPercent,
  formatDay,
  formatHourRange,
  formatMoney,
  FREE_TOURS,
  GUEST_REQUESTS,
  hoursUntilTourStart,
  HOURLY_RATE_CENTS,
  isHoldExpired,
  isLiveBooking,
  MAX_BOOKING_HOURS,
  MIN_BOOKING_HOURS,
  todayInShenzhen,
  type AvailabilityWindow,
  type BookingRow,
  type BookingStatus,
  type FreeSegment,
  type TimeRange,
} from '@/lib/booking'
import { bookingNoteFor } from '@/content/packages'
import { localizedCn, localizedPackage } from '@/content/packages-i18n'
import { fill, type Dictionary } from '@/i18n'
import { getI18n } from '@/i18n/server'
import { DEFAULT_OG_IMAGE, isSingleGuideMode, officialGuideId } from '@/lib/config'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { startConversationWith } from '@/app/messages/actions'
import {
  approveGuideBooking,
  cancelOwnBooking,
  deleteGuideAvailability,
  rejectGuideBooking,
  requestBooking,
} from './actions'
import { AvailabilityEditor } from './AvailabilityEditor'

// This page declared no metadata at all, which is not the same as declaring
// nothing: it inherited the root layout's, including `alternates.canonical:
// '/'`. So the booking page — the one route where money changes hands, listed
// in the sitemap at priority 0.8 — served a canonical naming the homepage as
// its real address, and a <title> identical to the homepage's. A self-referential
// canonical is the whole point of the tag; pointing it elsewhere is an explicit
// instruction to index that page instead of this one.

export async function generateMetadata(): Promise<Metadata> {
  const seo = (await getI18n()).t.seo.guide
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: '/guide' },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: '/guide',
      // Required alongside any openGraph object — see the note in about/page.tsx.
      images: [DEFAULT_OG_IMAGE],
    },
    // Its own block, or twitter keeps the root layout's site-wide title and
    // description while og: says something else. twitter:image still comes
    // from the og image.
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
  }
}

type Props = {
  searchParams: Promise<{
    day?: string
    // Set by the "Book these four hours" button on /tours/[slug]. It only
    // pre-fills the note field below — no schema change, and the guide sees
    // which experience was booked in the email they already receive.
    package?: string
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
  visibility: 'public' | 'private'
  avatar_path: string | null
  cover_path: string | null
  updated_at: string
}

const DEFAULT_COVER =
  '/hero/skyline-tower-walkway-night.webp'

// Labels live in the dictionary (booking.status); only the colours are here.
const STATUS_STYLES: Record<BookingStatus, { className: string }> = {
  pending_payment: {
    className: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  },
  pending: {
    className:
      'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  },
  approved: {
    className:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  },
  rejected: {
    className: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
  },
  cancelled: {
    className: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  },
}

// Labels are translated by position (booking.ideas); `key` is the stable
// English id used as the React key.
const IDEAS = [
  {
    key: 'Street food & dim sum',
    img: '/gallery/night-market-skewers-stall.webp',
  },
  {
    key: 'Electronics & maker markets',
    img: '/gallery/maker-desk-dev-boards.webp',
  },
  {
    key: 'Skyline & city views',
    img: '/gallery/skyline-blue-towers-night.webp',
  },
  // Was 'Parks & easy hikes'. Relabelled to match the photo library — there is
  // no park shot in it yet, and an idea illustrated by a picture of something
  // else is the stock-photo problem in miniature. Change it back the day a
  // real park photo lands.
  {
    key: 'Bakeries & coffee stops',
    img: '/gallery/bakery-bread-counter.webp',
  },
]

export default async function GuidePage({ searchParams }: Props) {
  if (!isSingleGuideMode()) redirect('/browse')

  const sp = await searchParams
  const { locale, meta, t: i18n } = await getI18n()
  const b = i18n.booking
  // English keeps formatDay's exact output; other locales get the same
  // fields in their own order and script ("2026年6月10日(水)").
  const localDay = (d: string) =>
    locale === 'en'
      ? formatDay(d)
      : new Date(`${d}T00:00:00`).toLocaleDateString(meta.intlLocale, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
  // An unknown ?package= is ignored rather than 404ing: the booking page still
  // works perfectly without one, and a stale link from an old campaign should
  // land on a usable form, not an error.
  const selectedPackage = sp.package
    ? localizedPackage(sp.package, locale)
    : undefined
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const guideId = officialGuideId()!
  const admin = createSupabaseAdminClient()

  // The guide's profile and availability are the public preview cold traffic
  // lands on, so they're read with the service-role client — RLS only exposes
  // them to signed-in users. Auth kicks in at the booking action below, and
  // every mutation re-checks it server-side in ./actions.ts.
  const [{ data: guide }, { data: myProfile }] = await Promise.all([
    admin
      .from('profiles')
      .select(
        'id, display_name, bio, city, hobbies, languages, personality_traits, visibility, avatar_path, cover_path, updated_at',
      )
      .eq('id', guideId)
      .maybeSingle<GuideProfile>(),
    user
      ? supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle<{ role: 'guide' | 'tourist' }>()
      : Promise.resolve({ data: null as { role: 'guide' | 'tourist' } | null }),
  ])

  // A private guide is hidden from everyone but themselves — and that rule has
  // to be restated here, because the read above goes through the service-role
  // client and so bypasses the RLS policy that used to enforce it
  // (`visibility = 'public' or id = auth.uid()`). Checking only `!user` would
  // make "private" mean "visible to anyone who registers an account", which is
  // weaker than what signed-in visitors saw before this page went public.
  const guideHidden =
    !!guide && guide.visibility === 'private' && user?.id !== guideId

  if (!user && guideHidden) redirect('/login?next=/guide')

  // A signed-in non-owner gets exactly what RLS gave them before: no row, and
  // therefore this page.
  if (!guide || guideHidden) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">{b.notReadyTitle}</h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          {b.notReadyBody}
        </p>
      </main>
    )
  }

  const today = todayInShenzhen()
  const [
    { data: windows },
    { data: activeBookings },
    { data: myBookings },
    { data: guideReviews },
  ] = await Promise.all([
      // Part of the public preview (RLS limits it to signed-in users), so it
      // goes through the service-role client. Read-only, days and hours only.
      admin
        .from('availability_windows')
        .select('id, day, start_hour, end_hour')
        .gte('day', today)
        .order('day')
        .order('start_hour')
        .returns<AvailabilityWindow[]>(),
      // Tourists can only read their own bookings through RLS, but the picker
      // needs to know which hours are taken — any active booking (incl. one
      // mid-checkout) blocks its own hours plus BOOKING_GAP_HOURS either side.
      // Read with the service-role client; only the resulting free slots ever
      // reach the page, never who booked or their note.
      admin
        .from('bookings')
        .select('id, day, start_hour, end_hour, status, created_at, tourist_id')
        .gte('day', today)
        .in('status', ACTIVE_BOOKING_STATUSES)
        .returns<
          {
            id: string
            day: string
            start_hour: number
            end_hour: number
            status: BookingStatus
            created_at: string
            tourist_id: string
          }[]
        >(),
      user
        ? supabase
            .from('bookings')
            .select(
              'id, tourist_id, day, start_hour, end_hour, status, note, amount_cents, currency, stripe_payment_intent_id, created_at',
            )
            .eq('tourist_id', user.id)
            .neq('status', 'pending_payment')
            .order('created_at', { ascending: false })
            .limit(20)
            .returns<BookingRow[]>()
        : Promise.resolve({ data: null as BookingRow[] | null }),
      admin
        .from('reviews')
        .select('stars')
        .eq('reviewee_id', guideId)
        .returns<{ stars: number }[]>(),
    ])

  const reviewCount = guideReviews?.length ?? 0
  const avgStars =
    reviewCount > 0
      ? guideReviews!.reduce((s, r) => s + r.stars, 0) / reviewCount
      : 0
  const firstName = guide.display_name.split(' ')[0]

  // Hours taken by a confirmed/awaiting booking or a *fresh* hold, per day.
  // An abandoned hold (older than 30 min) no longer blocks anything, so the
  // picker self-heals even if Stripe's checkout.session.expired webhook is
  // missed.
  // eslint-disable-next-line react-hooks/purity -- request-time clock for hold expiry
  const nowMs = Date.now()
  const bookedByDay = new Map<string, TimeRange[]>()
  // One booking at a time: the signed-in tourist's live booking (awaiting
  // review, confirmed, or a fresh checkout hold; not yet over), if any.
  // While it exists the form gives way to a notice — the same rule
  // requestBooking (isLiveBooking) and the bookings_one_at_a_time trigger
  // enforce, so the page never offers a form the server would reject.
  let myLiveBooking: {
    id: string
    day: string
    start_hour: number
    end_hour: number
    status: BookingStatus
  } | null = null
  for (const b of activeBookings ?? []) {
    if (isHoldExpired(b.status, new Date(b.created_at).getTime(), nowMs)) {
      continue
    }
    const mine = user != null && b.tourist_id === user.id
    if (mine && !myLiveBooking && isLiveBooking(b, nowMs)) myLiveBooking = b
    // Your own in-progress hold still blocks its hours for everyone else,
    // including anonymous visitors browsing the preview, but not for you:
    // the notice above offers to finish or release it instead.
    if (mine && b.status === 'pending_payment') continue
    const list = bookedByDay.get(b.day) ?? []
    list.push({ start_hour: b.start_hour, end_hour: b.end_hour })
    bookedByDay.set(b.day, list)
  }

  // Days with at least one free segment that still fits a minimum-length
  // tour, at least BOOKING_GAP_HOURS clear of every existing booking.
  const dayOptions: { day: string; segments: FreeSegment[] }[] = []
  const windowsByDay = new Map<string, AvailabilityWindow[]>()
  for (const w of windows ?? []) {
    const list = windowsByDay.get(w.day) ?? []
    list.push(w)
    windowsByDay.set(w.day, list)
  }
  for (const [day, dayWindows] of windowsByDay) {
    const booked = bookedByDay.get(day) ?? []
    const segments = dayWindows
      .flatMap((w) => bookableSegments(w, booked))
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
  const isOfficialGuide = user?.id === guideId

  // Anonymous visitors get the full preview; signing in is only asked for at
  // the booking step, and `next` brings them back to the day they picked —
  // and to the experience they picked, which is otherwise lost across the
  // login round trip.
  const packageParam = selectedPackage ? `package=${selectedPackage.slug}` : ''
  const dayHref = (day: string) =>
    `/guide?day=${day}${packageParam ? `&${packageParam}` : ''}`
  const bookingNext = selectedDay ? dayHref(selectedDay.day) : '/guide'

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
      .order('start_hour')
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
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            avatarPublicUrl(guide.cover_path, guide.updated_at) ?? DEFAULT_COVER
          }
          alt={fill(b.coverAlt, { name: guide.display_name })}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black/85" />
        <div
          className="pointer-events-none absolute inset-0 opacity-60 mix-blend-soft-light"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(245,158,11,0.5), transparent 45%), radial-gradient(circle at 80% 60%, rgba(244,63,94,0.5), transparent 50%)',
          }}
        />
        <div className="relative mx-auto w-full max-w-3xl px-4 pb-10 pt-4">
          <div className="flex justify-end">
            {user && (
              <Link
                href="/profile"
                className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur transition hover:bg-white/20"
              >
                {i18n.common.yourProfile}
              </Link>
            )}
          </div>

          <div className="mt-8 flex flex-col items-center text-center text-white sm:mt-12">
            <Avatar
              src={avatarPublicUrl(guide.avatar_path, guide.updated_at)}
              name={guide.display_name}
              size={120}
              className="ring-4 ring-white/80 shadow-2xl"
            />
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              {b.localGuide}
            </span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight drop-shadow-lg sm:text-4xl">
              {guide.display_name}
            </h1>
            <p className="mt-1 text-sm text-white/85">
              📍 {fill(b.withBrand, { city: guide.city })}
            </p>

            {reviewCount > 0 ? (
              <div className="mt-3 flex items-center gap-2 text-sm">
                <StarRating
                  value={avgStars}
                  size={16}
                  label={fill(i18n.stars.outOf, { value: avgStars.toFixed(1) })}
                />
                <span className="text-white/90">
                  {avgStars.toFixed(1)} ·{' '}
                  {fill(reviewCount === 1 ? b.reviewOne : b.reviewMany, {
                    n: reviewCount,
                  })}
                </span>
              </div>
            ) : (
              <span className="mt-3 rounded-full bg-white/15 px-3 py-0.5 text-xs font-medium backdrop-blur">
                ✨ {fill(b.newGuide, { name: firstName })}
              </span>
            )}

            {guide.languages.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                {guide.languages.map((l) => (
                  <span
                    key={l}
                    className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-xs font-medium backdrop-blur"
                  >
                    {l}
                  </span>
                ))}
              </div>
            )}

            <Link
              href={`/u/${guide.id}`}
              className="mt-4 text-sm text-white/90 underline underline-offset-2 transition hover:text-white"
            >
              {b.fullProfile}
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-8">
        {/* Highlights */}
        {!isOfficialGuide && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Highlight
              icon="🗺️"
              title={b.highlights.localTitle}
              body={fill(b.highlights.localBody, { name: firstName })}
            />
            <Highlight
              icon="💬"
              title={
                guide.languages.length > 0
                  ? fill(
                      guide.languages.length === 1
                        ? b.highlights.speaksOne
                        : b.highlights.speaksMany,
                      { n: guide.languages.length },
                    )
                  : b.highlights.easyTalk
              }
              body={b.highlights.talkBody}
            />
            <Highlight
              icon="🛟"
              title={FREE_TOURS ? b.highlights.freeTitle : b.highlights.riskFreeTitle}
              body={
                FREE_TOURS ? b.highlights.freeBody : b.highlights.riskFreeBody
              }
            />
          </div>
        )}

        {/* Banners */}
        {(sp.requested || sp.paid) && (
          <p className="mt-6 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            {sp.paid ? b.banners.paid : b.banners.requested}
          </p>
        )}
        {sp.payment_cancelled && (
          <p className="mt-6 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            {b.banners.paymentCancelled}
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
              : 'Booking declined — the tourist was refunded and that time slot is free again.'}
          </p>
        )}
        {sp.cancelled && (
          <p className="mt-6 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            {b.banners.cancelled}
            {Number(sp.refund_cents) > 0
              ? fill(b.banners.refund, {
                  amount: formatMoney(Number(sp.refund_cents)),
                })
              : FREE_TOURS
                ? b.banners.reopened
                : b.banners.noRefund}
          </p>
        )}
        {sp.error && (
          <p className="mt-6 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
            {sp.error}
          </p>
        )}

        {/* About the guide */}
        <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold">
            {fill(b.about, { name: firstName })}
          </h2>
          {guide.bio && (
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {guide.bio}
            </p>
          )}
          {(guide.hobbies.length > 0 ||
            guide.languages.length > 0 ||
            guide.personality_traits.length > 0) && (
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              <InterestGroup label={b.hobbies} items={guide.hobbies} tone="amber" />
              <InterestGroup label={b.languages} items={guide.languages} tone="sky" />
              <InterestGroup
                label={b.personality}
                items={guide.personality_traits}
                tone="rose"
              />
            </div>
          )}
        </section>

        {/* Ideas for your day */}
        {!isOfficialGuide && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold">{b.ideasTitle}</h2>
            <p className="mt-1 text-sm text-zinc-500">
              {fill(b.ideasBody, { name: firstName })}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {IDEAS.map((idea, i) => (
                <div
                  key={idea.key}
                  className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={idea.img}
                    alt={b.ideas[i]}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <p className="absolute bottom-2 left-2 right-2 text-xs font-medium leading-tight text-white drop-shadow">
                    {b.ideas[i]}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Booking — open days are public; claiming one needs an account */}
        {!isOfficialGuide && (
        <section className="mt-8">
          {/* The experience carried in from /tours/[slug], if there was one. */}
          {selectedPackage && (
            <div className="mb-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex gap-4 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedPackage.photo}
                  alt={selectedPackage.alt}
                  className="h-20 w-20 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    {i18n.guide.selectedPackage.label}
                  </p>
                  <p className="mt-0.5 truncate text-base font-semibold">
                    {selectedPackage.title}{' '}
                    <span className="font-normal text-zinc-500">
                      {localizedCn(selectedPackage, locale)}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {i18n.guide.selectedPackage.note}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs">
                    <Link
                      href={`/tours/${selectedPackage.slug}`}
                      className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-white"
                    >
                      {i18n.common.seeDetails}
                    </Link>
                    <Link
                      href="/tours"
                      className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-white"
                    >
                      {i18n.guide.selectedPackage.change}
                    </Link>
                    <Link
                      href={selectedDay ? `/guide?day=${selectedDay.day}` : '/guide'}
                      className="text-zinc-400 underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300"
                    >
                      {i18n.guide.selectedPackage.clear}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          <h2 className="text-xl font-semibold">{b.bookTitle}</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {FREE_TOURS
              ? selectedPackage?.hours
                ? fill(b.introFreeFixed, { n: selectedPackage.hours })
                : b.introFreeChoice
              : fill(b.introPaid, {
                  min: MIN_BOOKING_HOURS,
                  max: MAX_BOOKING_HOURS,
                  rate: formatMoney(HOURLY_RATE_CENTS),
                  low: formatMoney(amountCentsForHours(MIN_BOOKING_HOURS)),
                  high: formatMoney(amountCentsForHours(MAX_BOOKING_HOURS)),
                })}
          </p>

          {user && !isTourist ? (
            <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-8 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              {b.touristsOnly}
              {!myProfile && (
                <>
                  <Link href="/profile" className="underline underline-offset-2">
                    {b.createProfileLink}
                  </Link>
                  {b.createProfileSuffix}
                </>
              )}
            </div>
          ) : myLiveBooking?.status === 'pending_payment' ? (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8 text-center text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
              {b.checkout.prefix}
              <span className="font-medium">
                {fill(b.dateTime, {
                  date: localDay(myLiveBooking.day),
                  time: formatHourRange(myLiveBooking.start_hour, myLiveBooking.end_hour),
                })}
              </span>
              {b.checkout.middle}
              <Link
                href={`/guide/pay/${myLiveBooking.id}`}
                className="underline underline-offset-2"
              >
                {b.checkout.finish}
              </Link>
              {b.checkout.or}
              <Link
                href={`/guide/cancel?day=${myLiveBooking.day}`}
                className="underline underline-offset-2"
              >
                {b.checkout.release}
              </Link>
              {b.checkout.suffix}
            </div>
          ) : myLiveBooking ? (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8 text-center text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
              {b.live.prefix}
              <span className="font-medium">
                {fill(b.dateTime, {
                  date: localDay(myLiveBooking.day),
                  time: formatHourRange(myLiveBooking.start_hour, myLiveBooking.end_hour),
                })}
              </span>
              {b.live.suffix}
            </div>
          ) : dayOptions.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 px-6 py-12 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
              {b.noDates}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              {/* Day picker */}
              <p className="text-sm font-medium">{b.availableDays}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {dayOptions.map((d) => (
                  <Link
                    key={d.day}
                    href={dayHref(d.day)}
                    className={
                      d.day === selectedDay?.day
                        ? 'rounded-full bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-white dark:text-zinc-900'
                        : 'rounded-full border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
                    }
                  >
                    {localDay(d.day)}
                  </Link>
                ))}
              </div>

              {selectedDay && (
                <>
                  <p className="mt-4 text-xs text-zinc-500">
                    {fill(b.hoursOn, {
                      name: guide.display_name,
                      date: localDay(selectedDay.day),
                      ranges: selectedDay.segments
                        .map((s) => formatHourRange(s.start, s.end))
                        .join(' · '),
                    })}
                  </p>

                  {!user ? (
                    <AnonBookingCta
                      nextPath={bookingNext}
                      firstName={firstName}
                      labels={b.anon}
                      logIn={i18n.common.logIn}
                      guestHref={
                        GUEST_REQUESTS
                          ? `/book${selectedPackage ? `?package=${selectedPackage.slug}` : ''}`
                          : null
                      }
                    />
                  ) : (
                  <form action={requestBooking} className="mt-4 space-y-4">
                    <input type="hidden" name="day" value={selectedDay.day} />
                    {FREE_TOURS ? (
                      <FreeBookingFields
                        startOptions={startOptions}
                        labels={b.fields}
                        lengths={
                          selectedPackage?.hours
                            ? [selectedPackage.hours]
                            : undefined
                        }
                      />
                    ) : (
                      <BookingFields
                        startOptions={startOptions}
                        minHours={MIN_BOOKING_HOURS}
                        maxHours={MAX_BOOKING_HOURS}
                        labels={b.fields}
                      />
                    )}
                    <label className="block">
                      <span className="text-sm font-medium">
                        {fill(b.noteLabel, { name: guide.display_name })}
                      </span>
                      <span className="ml-1 text-xs text-zinc-500">
                        {b.optional}
                      </span>
                      <textarea
                        name="note"
                        rows={3}
                        maxLength={500}
                        // Pre-filled from ?package=, and editable — the
                        // traveller can delete it, and the server action
                        // treats it as an ordinary note either way. Nothing
                        // downstream depends on this string being present.
                        defaultValue={
                          selectedPackage
                            ? `${bookingNoteFor(selectedPackage)}\n`
                            : undefined
                        }
                        placeholder={b.notePlaceholder}
                        className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
                      />
                    </label>
                    {/* Cancellation policy, visible before booking */}
                    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                      <p className="font-medium text-zinc-700 dark:text-zinc-300">
                        {b.policy.title}
                      </p>
                      {FREE_TOURS ? (
                        <p className="mt-1">{b.policy.free}</p>
                      ) : (
                        <ul className="mt-1 space-y-0.5">
                          <li>
                            • {b.policy.beforeConfirm}
                            <strong>{b.policy.fullRefund}</strong>
                            {b.policy.anytime}
                          </li>
                          <li>
                            • {b.policy.before72}
                            <strong>{b.policy.fullRefund}</strong>
                          </li>
                          <li>• {b.policy.within72}</li>
                          <li>• {b.policy.within24}</li>
                        </ul>
                      )}
                      <Link
                        href="/cancellation"
                        className="mt-1 inline-block underline underline-offset-2 hover:text-zinc-800 dark:hover:text-zinc-200"
                      >
                        {b.policy.readFull}
                      </Link>
                    </div>

                    {FREE_TOURS && (
                      <ReviewPledge
                        note={i18n.request.pledgeNote}
                        check={i18n.request.pledgeCheck}
                      />
                    )}

                    <SubmitButton
                      pendingLabel={
                        FREE_TOURS ? b.submit.pendingFree : b.submit.pendingPaid
                      }
                      className="w-full rounded-full bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                      {FREE_TOURS ? b.submit.free : b.submit.paid}
                    </SubmitButton>
                    <p className="text-center text-xs text-zinc-500">
                      {FREE_TOURS
                        ? b.submit.noteFree
                        : fill(b.submit.notePaid, {
                            rate: formatMoney(HOURLY_RATE_CENTS),
                          })}
                      {b.agree.prefix}
                      <Link
                        href="/terms"
                        className="underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300"
                      >
                        {b.agree.terms}
                      </Link>
                      {b.agree.and}
                      <Link
                        href="/cancellation"
                        className="underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300"
                      >
                        {b.agree.cancellation}
                      </Link>
                      {b.agree.suffix}
                    </p>
                  </form>
                  )}
                </>
              )}
            </div>
          )}
        </section>
        )}

        {/* Free pilot: the one quiet ask. Tours cost nothing, donations keep
            them running — anyone can give, any time, booking or not. */}
        {FREE_TOURS && !isOfficialGuide && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-rose-50 px-5 py-4 dark:border-amber-900/40 dark:from-amber-950/20 dark:to-rose-950/20">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              <span className="font-semibold">{b.support.lead}</span>
              {b.support.body}
            </p>
            <Link
              href="/donate"
              className="rounded-full border border-zinc-900/20 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-white/20 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
            >
              {b.support.cta}
            </Link>
          </div>
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
            <h2 className="text-xl font-semibold">{b.mine.title}</h2>
            <p className="mt-1 text-xs text-zinc-500">
              {FREE_TOURS ? b.mine.cancelFree : b.mine.cancelPaid}
              <Link
                href="/cancellation"
                className="underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                {b.mine.fullPolicy}
              </Link>
              {b.mine.fullPolicySuffix}
            </p>
            <ul className="mt-3 space-y-3">
              {myBookings!.map((b) => {
                const status = {
                  ...STATUS_STYLES[b.status],
                  label: i18n.booking.status[b.status],
                }
                const hrs = hoursUntilTourStart(b.day, b.start_hour, nowMs)
                const canCancel =
                  (b.status === 'pending' || b.status === 'approved') &&
                  hrs > 0
                const pct = cancellationRefundPercent(b.status, hrs)
                const wasFree = !b.amount_cents
                // A confirmed tour whose end time has passed can be reviewed
                // (and tipped) — same gate the review page enforces.
                const finished =
                  b.status === 'approved' &&
                  hoursUntilTourStart(b.day, b.end_hour, nowMs) <= 0
                return (
                  <li
                    key={b.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {localDay(b.day)} ·{' '}
                        {formatHourRange(b.start_hour, b.end_hour)}
                        {b.amount_cents != null && (
                          <span className="ml-2 font-normal text-zinc-500">
                            {b.amount_cents === 0
                              ? i18n.common.free
                              : b.status === 'rejected'
                                ? fill(i18n.booking.mine.refunded, {
                                    amount: formatMoney(b.amount_cents, b.currency ?? undefined),
                                  })
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
                    {/* Phones: the actions wrap under the date as one row.
                        Wider screens: a right-aligned column beside it. */}
                    <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                      {/* Confirmed, before or after the tour: open (or
                          resume) the chat with the guide — to plan the day
                          ahead of it, or to say thanks afterwards. Same
                          action as the Message button on /browse. */}
                      {b.status === 'approved' && (
                        <form action={startConversationWith}>
                          <input type="hidden" name="other_id" value={guideId} />
                          <SubmitButton
                            pendingLabel={i18n.booking.mine.opening}
                            className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                          >
                            {fill(i18n.booking.mine.message, { name: firstName })}
                          </SubmitButton>
                        </form>
                      )}
                      {finished && (
                        <Link
                          href={`/guide/review/${b.id}`}
                          className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 transition hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:hover:bg-amber-900"
                        >
                          {i18n.booking.mine.howWasIt}
                        </Link>
                      )}
                      {canCancel && (
                        <form action={cancelOwnBooking}>
                          <input type="hidden" name="id" value={b.id} />
                          <SubmitButton
                            pendingLabel={i18n.booking.mine.cancelling}
                            className="text-xs text-zinc-500 underline underline-offset-2 hover:text-red-600"
                          >
                            {wasFree
                              ? i18n.booking.mine.cancel
                              : pct === 100
                                ? i18n.booking.mine.cancelFullRefund
                                : pct > 0
                                  ? fill(i18n.booking.mine.cancelFee, { pct: 100 - pct })
                                  : i18n.booking.mine.cancelNoRefund}
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

// Where the auth wall sits for cold traffic: anonymous visitors see the guide
// and their real open days, and only need an account to claim one. `next`
// carries the day they picked through login/signup and back here.
function AnonBookingCta({
  nextPath,
  firstName,
  labels: l,
  logIn,
  guestHref,
}: {
  nextPath: string
  firstName: string
  labels: Dictionary['booking']['anon']
  logIn: string
  // While guest requests are on: the no-account form, offered first.
  guestHref: string | null
}) {
  const next = encodeURIComponent(nextPath)
  return (
    <div className="mt-4 space-y-3">
      {guestHref && (
        <>
          <Link
            href={guestHref}
            className="block w-full rounded-full bg-zinc-900 px-4 py-3 text-center text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {l.guest}
          </Link>
          <p className="text-center text-xs text-zinc-500">
            {fill(l.guestNote, { name: firstName })}
          </p>
        </>
      )}
      <Link
        href={`/signup?next=${next}`}
        className={
          guestHref
            ? 'block w-full rounded-full border border-zinc-300 px-4 py-3 text-center text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800'
            : 'block w-full rounded-full bg-zinc-900 px-4 py-3 text-center text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200'
        }
      >
        {l.signup}
      </Link>
      <p className="text-center text-xs text-zinc-500">
        {l.loginPrefix}
        <Link
          href={`/login?next=${next}`}
          className="underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          {logIn}
        </Link>
        {FREE_TOURS
          ? l.loginSuffixFree
          : fill(l.loginSuffixPaid, { name: firstName })}
      </p>
    </div>
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
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Confirmed
                    </span>
                    {/* Open (or resume) the chat with this tourist — the
                        mirror of the Message button they get on their side. */}
                    <form action={startConversationWith}>
                      <input type="hidden" name="other_id" value={b.tourist_id} />
                      <SubmitButton
                        pendingLabel="Opening…"
                        className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                      >
                        Message {(names.get(b.tourist_id) ?? 'tourist').split(' ')[0]}
                      </SubmitButton>
                    </form>
                  </div>
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
        Open the days and hours you can guide. Tourists book a{' '}
        {FREE_TOURS
          ? `free ${MIN_BOOKING_HOURS} or ${MAX_BOOKING_HOURS} hour tour`
          : `${MIN_BOOKING_HOURS}–${MAX_BOOKING_HOURS} hour slot`}{' '}
        inside a window.
      </p>

      <AvailabilityEditor
        openDays={windows.map((w) => w.day)}
        today={today}
      />

      <h3 className="mt-6 text-sm font-semibold">
        {windows.length === 0
          ? 'Open windows'
          : `Open windows (${windows.length})`}
      </h3>
      {windows.length === 0 ? (
        <p className="mt-2 rounded-lg border border-dashed border-zinc-300 px-6 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
          No upcoming availability yet — tourists can&apos;t book until you add a
          window.
        </p>
      ) : (
        <ul className="mt-2 space-y-2">
          {windows.map((w) => (
            <li
              key={w.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span>
                <span className="font-medium">{formatDay(w.day)}</span>
                <span className="text-zinc-500">
                  {' '}
                  · {formatHourRange(w.start_hour, w.end_hour)} (
                  {w.end_hour - w.start_hour}h)
                </span>
              </span>
              <form action={deleteGuideAvailability}>
                <input type="hidden" name="id" value={w.id} />
                <SubmitButton
                  pendingLabel="Removing…"
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-red-900 dark:hover:bg-red-950 dark:hover:text-red-400"
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

function Highlight({
  icon,
  title,
  body,
}: {
  icon: string
  title: string
  body: string
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="text-xl" aria-hidden>
        {icon}
      </div>
      <p className="mt-1.5 text-sm font-semibold">{title}</p>
      <p className="mt-0.5 text-xs text-zinc-500">{body}</p>
    </div>
  )
}

function InterestGroup({
  label,
  items,
  tone,
}: {
  label: string
  items: string[]
  tone: 'amber' | 'sky' | 'rose'
}) {
  if (!items || items.length === 0) return null
  const chip = {
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    sky: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
    rose: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
  }[tone]
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.map((it) => (
          <span
            key={it}
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${chip}`}
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  )
}
