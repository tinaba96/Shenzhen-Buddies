'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  bookableSegments,
  fitsInSegments,
  formatDay,
  formatHourRange,
  MAX_BOOKING_HOURS,
  MIN_BOOKING_HOURS,
  todayInShenzhen,
  type AvailabilityWindow,
} from '@/lib/booking'
import { adminEmails, isSingleGuideMode, siteUrl } from '@/lib/config'
import { sendEmail } from '@/lib/email'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'

function fail(message: string, day?: string): never {
  const dayParam = day ? `&day=${encodeURIComponent(day)}` : ''
  redirect(`/guide?error=${encodeURIComponent(message)}${dayParam}`)
}

export async function requestBooking(formData: FormData) {
  if (!isSingleGuideMode()) redirect('/browse')

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: myProfile } = await supabase
    .from('profiles')
    .select('role, display_name')
    .eq('id', user.id)
    .maybeSingle<{ role: 'guide' | 'tourist'; display_name: string }>()
  if (myProfile?.role !== 'tourist') {
    fail('Only tourists can request a booking. Set your role on your profile.')
  }

  const day = String(formData.get('day') ?? '')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    fail('Pick a day first.')
  }
  if (day < todayInShenzhen()) {
    fail('That day has already passed — pick another one.')
  }

  const startHour = Number(formData.get('start_hour'))
  const duration = Number(formData.get('duration'))
  if (!Number.isInteger(startHour) || startHour < 0 || startHour > 23) {
    fail('Pick a valid start time.', day)
  }
  if (
    !Number.isInteger(duration) ||
    duration < MIN_BOOKING_HOURS ||
    duration > MAX_BOOKING_HOURS
  ) {
    fail(
      `Tours run from ${MIN_BOOKING_HOURS} to ${MAX_BOOKING_HOURS} hours.`,
      day,
    )
  }
  const endHour = startHour + duration

  const note = String(formData.get('note') ?? '').trim().slice(0, 500) || null

  // Recheck the day is still bookable. With a single guide, any pending or
  // approved booking blocks the whole day (read with the service-role
  // client — tourists can only see their own bookings through RLS).
  const { data: windows } = await supabase
    .from('availability_windows')
    .select('id, day, start_hour, end_hour')
    .eq('day', day)
    .returns<AvailabilityWindow[]>()
  if (!windows?.length) {
    fail('The guide is not available on that day.', day)
  }

  const admin = createSupabaseAdminClient()
  const { count: activeCount } = await admin
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('day', day)
    .in('status', ['pending', 'approved'])
  if ((activeCount ?? 0) > 0) {
    fail('Sorry — that day was just booked by someone else.', day)
  }

  const segments = windows.flatMap(bookableSegments)
  if (!fitsInSegments(segments, startHour, endHour)) {
    fail(
      `${formatHourRange(startHour, endHour)} is outside the guide's hours on that day — pick a listed slot.`,
      day,
    )
  }

  const { error } = await supabase.from('bookings').insert({
    tourist_id: user.id,
    day,
    start_hour: startHour,
    end_hour: endHour,
    note,
  })
  if (error) {
    // 23P01 = exclusion constraint violation: someone grabbed the day
    // between our check and the insert.
    if (error.code === '23P01') {
      fail('Sorry — that day was just booked by someone else.', day)
    }
    fail(error.message, day)
  }

  await sendEmail({
    to: adminEmails(),
    subject: `New booking request — ${formatDay(day)}, ${formatHourRange(startHour, endHour)}`,
    text: [
      'A new booking request is waiting for review.',
      '',
      `Tourist: ${myProfile.display_name} (${user.email ?? 'no email'})`,
      `Day: ${formatDay(day)}`,
      `Time: ${formatHourRange(startHour, endHour)} (${duration} hours)`,
      note ? `Note: ${note}` : 'Note: —',
      '',
      `Approve or decline it here: ${siteUrl()}/admin`,
    ].join('\n'),
  })

  revalidatePath('/guide')
  redirect('/guide?requested=1')
}
