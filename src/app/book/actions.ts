'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPackage } from '@/content/packages'
import { getI18n } from '@/i18n/server'
import { FREE_TOUR_LENGTHS, GUEST_REQUESTS } from '@/lib/booking'
import { adminEmails, siteUrl } from '@/lib/config'
import { sendEmail } from '@/lib/email'
import { describeGuideNotify, notifyGuide } from '@/lib/notify'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

export type RequestFormState = {
  error?: 'package' | 'name' | 'contact' | 'email' | 'hours' | 'long' | 'generic'
  // What they typed, echoed back on an error. React resets an uncontrolled
  // form after every action, so without this a typo in the email would
  // wipe the whole form.
  values?: Partial<Record<keyof typeof MAX, string>> & { hours?: string }
}

const MAX = {
  name: 80,
  email: 120,
  phone: 40,
  whatsapp: 40,
  wechat: 80,
  preferred_dates: 200,
  message: 500,
} as const

function field(formData: FormData, key: keyof typeof MAX): string {
  return String(formData.get(key) ?? '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Guest tour request: no account, no slot. Validates, stores the row, then
// emails the guide, the admins and (if they gave one) the visitor. Email is
// the channel that matters here — the database row is the record for /admin.
export async function submitTourRequest(
  _prev: RequestFormState,
  formData: FormData,
): Promise<RequestFormState> {
  if (!GUEST_REQUESTS) redirect('/tours')

  // Honeypot: real browsers leave this hidden field empty. Bots that fill
  // every input get a silent "success" and nothing is stored or sent.
  const slug = String(formData.get('package') ?? '')
  if (String(formData.get('website') ?? '') !== '') {
    redirect(`/book?package=${encodeURIComponent(slug)}&sent=1`)
  }

  const pkg = getPackage(slug)
  if (!pkg) return { error: 'package' }

  const values: NonNullable<RequestFormState['values']> = {
    name: field(formData, 'name'),
    email: field(formData, 'email'),
    phone: field(formData, 'phone'),
    whatsapp: field(formData, 'whatsapp'),
    wechat: field(formData, 'wechat'),
    preferred_dates: field(formData, 'preferred_dates'),
    message: String(formData.get('message') ?? '').trim(),
    hours: String(formData.get('hours') ?? ''),
  }
  const fail = (error: NonNullable<RequestFormState['error']>): RequestFormState => ({ error, values })

  const name = field(formData, 'name')
  const email = field(formData, 'email')
  const phone = field(formData, 'phone')
  const whatsapp = field(formData, 'whatsapp')
  const wechat = field(formData, 'wechat')
  const preferredDates = field(formData, 'preferred_dates')
  // The message keeps its line breaks; everything else is one line.
  const message = values.message ?? ''

  if (!name) return fail('name')
  if (!email && !phone && !whatsapp && !wechat) return fail('contact')
  if (email && !/^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/.test(email)) return fail('email')
  for (const key of Object.keys(MAX) as (keyof typeof MAX)[]) {
    if ((values[key] ?? '').length > MAX[key]) return fail('long')
  }

  // Length: fixed packages carry their own; the rest offer the pilot lengths,
  // the same rule /guide uses.
  const allowed = pkg.hours ? [pkg.hours] : FREE_TOUR_LENGTHS
  const hours = Number(formData.get('hours'))
  if (!Number.isInteger(hours) || !allowed.includes(hours)) return fail('hours')

  const { locale } = await getI18n()
  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
  const userAgent = h.get('user-agent') ?? null

  // Store first, but never let a storage problem lose the request: the
  // emails below carry every detail, and the admin email says if the row
  // did not save.
  let saved = true
  let requestId: string | null = null
  try {
    const admin = createSupabaseAdminClient()
    const { data, error } = await admin
      .from('tour_requests')
      .insert({
        package_slug: pkg.slug,
        package_title: pkg.title,
        hours,
        name,
        email: email || null,
        phone: phone || null,
        whatsapp: whatsapp || null,
        wechat: wechat || null,
        preferred_dates: preferredDates || null,
        message: message || null,
        locale,
        ip,
        user_agent: userAgent,
      })
      .select('id')
      .single()
    if (error) throw error
    requestId = data?.id ?? null
  } catch (err) {
    saved = false
    console.error('tour_requests insert failed:', err)
  }

  const base = siteUrl()
  const contactLines = [
    whatsapp && `WhatsApp: ${whatsapp}`,
    wechat && `WeChat: ${wechat}`,
    phone && `Phone: ${phone}`,
    email && `Email: ${email}`,
  ].filter(Boolean) as string[]

  const details = [
    `Experience: ${pkg.title} (${pkg.cn})`,
    `Length: ${hours} hours`,
    `When: ${preferredDates || 'not given — ask them'}`,
    `Name: ${name}`,
    ...contactLines,
    `Language they used: ${locale}`,
    '',
    'Message:',
    message || '(none)',
  ]

  const subject = `New tour request — ${pkg.title} — ${name}`

  const guideResult = await notifyGuide(
    subject,
    [
      `${name} asked for a tour. No account, no slot — please reach out on the contact below and settle the day and time together.`,
      '',
      ...details,
      '',
      `Experience page: ${base}/tours/${pkg.slug}`,
    ].join('\n'),
  )

  await sendEmail({
    to: adminEmails(),
    subject,
    text: [
      `A visitor sent a tour request from the website (no account).`,
      '',
      ...details,
      '',
      describeGuideNotify(guideResult),
      saved
        ? `Saved to /admin (request ${requestId}).`
        : 'NOT SAVED to the database — this email is the only record. Check that migration 0020_tour_requests has been run.',
      `Admin: ${base}/admin`,
    ].join('\n'),
  })

  if (email) {
    await sendEmail({
      to: email,
      subject: `We got your request — ${pkg.title}`,
      text: [
        `Hi ${name},`,
        '',
        `Thanks for your interest in ${pkg.title} (${hours} hours). Your buddy will get back to you on the contact you gave, usually within a day, to set the day and time.`,
        '',
        preferredDates ? `You mentioned: ${preferredDates}` : '',
        '',
        `Nothing to pay — tours are free during our pilot.`,
        `Questions in the meantime: ${base}/contact`,
        '',
        '— Shenzhen Buddies',
      ]
        .filter((l, i, arr) => !(l === '' && arr[i - 1] === ''))
        .join('\n'),
    })
  }

  redirect(`/book?package=${encodeURIComponent(pkg.slug)}&sent=1`)
}
