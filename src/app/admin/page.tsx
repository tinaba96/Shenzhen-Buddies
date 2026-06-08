import { notFound, redirect } from 'next/navigation'
import { SubmitButton } from '@/components/SubmitButton'
import {
  formatDay,
  formatHour,
  formatHourRange,
  todayInShenzhen,
  type AvailabilityWindow,
  type BookingRow,
  type BookingStatus,
} from '@/lib/booking'
import { isAdminEmail } from '@/lib/config'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { addAvailability, approveBooking, deleteAvailability, rejectBooking } from './actions'

type Props = {
  searchParams: Promise<{
    saved?: string
    deleted?: string
    approved?: string
    rejected?: string
    error?: string
  }>
}

type TouristLite = {
  id: string
  display_name: string
}

const STATUS_BADGES: Record<BookingStatus, string> = {
  pending:
    'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  approved:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
  cancelled: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
}

export default async function AdminPage({ searchParams }: Props) {
  const sp = await searchParams
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  if (!isAdminEmail(user.email)) notFound()

  const admin = createSupabaseAdminClient()
  const today = todayInShenzhen()

  const [{ data: windows }, { data: bookings }] = await Promise.all([
    admin
      .from('availability_windows')
      .select('id, day, start_hour, end_hour')
      .gte('day', today)
      .order('day')
      .order('start_hour')
      .returns<AvailabilityWindow[]>(),
    admin
      .from('bookings')
      .select('id, tourist_id, day, start_hour, end_hour, status, note, created_at')
      .order('created_at', { ascending: false })
      .limit(100)
      .returns<BookingRow[]>(),
  ])

  const bookingList = bookings ?? []
  const pending = bookingList.filter((b) => b.status === 'pending')
  const resolved = bookingList.filter((b) => b.status !== 'pending')

  // Tourist names + emails for the booking cards.
  const touristIds = Array.from(new Set(bookingList.map((b) => b.tourist_id)))
  const touristById = new Map<string, TouristLite>()
  const emailById = new Map<string, string>()
  if (touristIds.length) {
    const [{ data: tourists }, emails] = await Promise.all([
      admin
        .from('profiles')
        .select('id, display_name')
        .in('id', touristIds)
        .returns<TouristLite[]>(),
      Promise.all(
        touristIds.map(async (id) => {
          const { data } = await admin.auth.admin.getUserById(id)
          return [id, data?.user?.email ?? ''] as const
        }),
      ),
    ])
    for (const t of tourists ?? []) touristById.set(t.id, t)
    for (const [id, email] of emails) if (email) emailById.set(id, email)
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-10">
      <h1 className="text-2xl font-semibold">Operations</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Publish the guide&apos;s availability and confirm booking requests.
      </p>

      {/* Banners */}
      {sp.saved && <Banner tone="ok">Availability window added.</Banner>}
      {sp.deleted && <Banner tone="ok">Availability window removed.</Banner>}
      {sp.approved && (
        <Banner tone="ok">Booking confirmed — the tourist has been emailed.</Banner>
      )}
      {sp.rejected && (
        <Banner tone="ok">
          Booking declined — the slot is free again and the tourist has been
          emailed.
        </Banner>
      )}
      {sp.error && <Banner tone="error">{sp.error}</Banner>}

      {/* Pending requests */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold">
          Booking requests{' '}
          {pending.length > 0 && (
            <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              {pending.length} pending
            </span>
          )}
        </h2>
        {pending.length === 0 ? (
          <p className="mt-3 rounded-lg border border-dashed border-zinc-300 px-6 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
            No pending requests.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {pending.map((b) => {
              const tourist = touristById.get(b.tourist_id)
              const email = emailById.get(b.tourist_id)
              return (
                <li
                  key={b.id}
                  className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {formatDay(b.day)} ·{' '}
                        {formatHourRange(b.start_hour, b.end_hour)} (
                        {b.end_hour - b.start_hour}h)
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {tourist?.display_name ?? 'Unknown tourist'}
                        {email && <> · {email}</>}
                      </p>
                      {b.note && (
                        <p className="mt-2 whitespace-pre-wrap rounded-md bg-zinc-50 px-3 py-2 text-xs text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
                          {b.note}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <form action={approveBooking}>
                        <input type="hidden" name="id" value={b.id} />
                        <SubmitButton
                          pendingLabel="Approving…"
                          className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
                        >
                          Approve
                        </SubmitButton>
                      </form>
                      <form action={rejectBooking}>
                        <input type="hidden" name="id" value={b.id} />
                        <SubmitButton
                          pendingLabel="Declining…"
                          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                          Decline
                        </SubmitButton>
                      </form>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* Availability */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">Availability</h2>
        <form
          action={addAvailability}
          className="mt-3 flex flex-wrap items-end gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
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

        {(windows?.length ?? 0) === 0 ? (
          <p className="mt-3 rounded-lg border border-dashed border-zinc-300 px-6 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
            No upcoming availability yet — tourists can&apos;t book until you
            add a window.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {windows!.map((w) => (
              <li
                key={w.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <span>
                  {formatDay(w.day)} ·{' '}
                  {formatHourRange(w.start_hour, w.end_hour)}
                </span>
                <form action={deleteAvailability}>
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

      {/* History */}
      {resolved.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">History</h2>
          <ul className="mt-3 space-y-2">
            {resolved.map((b) => {
              const tourist = touristById.get(b.tourist_id)
              return (
                <li
                  key={b.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <span className="min-w-0">
                    {formatDay(b.day)} ·{' '}
                    {formatHourRange(b.start_hour, b.end_hour)} ·{' '}
                    <span className="text-zinc-500">
                      {tourist?.display_name ?? 'Unknown tourist'}
                    </span>
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGES[b.status]}`}
                  >
                    {b.status}
                  </span>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </main>
  )
}

function Banner({
  tone,
  children,
}: {
  tone: 'ok' | 'error'
  children: React.ReactNode
}) {
  return (
    <p
      className={
        tone === 'ok'
          ? 'mt-6 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
          : 'mt-6 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400'
      }
    >
      {children}
    </p>
  )
}
