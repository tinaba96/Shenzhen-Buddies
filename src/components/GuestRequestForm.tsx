'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { submitTourRequest, type RequestFormState } from '@/app/book/actions'

type Labels = {
  name: string
  namePlaceholder: string
  contactHeading: string
  contactHint: string
  whatsapp: string
  whatsappPlaceholder: string
  wechat: string
  wechatPlaceholder: string
  phone: string
  phonePlaceholder: string
  email: string
  emailPlaceholder: string
  length: string
  hours: string
  when: string
  whenPlaceholder: string
  whenHint: string
  message: string
  messagePlaceholder: string
  submit: string
  sending: string
  pledgeNote: string
  pledgeCheck: string
  termsPrefix: string
  termsLink: string
  termsAnd: string
  cancellationLink: string
  termsSuffix: string
  errors: Record<NonNullable<RequestFormState['error']>, string>
}

const input =
  'mt-1 block w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950'

// The guest request form. Server-rendered labels come in as props so the
// page stays the one place that reads the dictionary; this component only
// owns the submit state (pending, error) that needs the client.
export function GuestRequestForm({
  packageSlug,
  lengths,
  defaultLength,
  askReview,
  labels: l,
}: {
  packageSlug: string
  lengths: number[]
  defaultLength: number
  // Free tours only: the review pledge checkbox above the submit button.
  askReview: boolean
  labels: Labels
}) {
  const [state, formAction, pending] = useActionState<RequestFormState, FormData>(
    submitTourRequest,
    {},
  )
  const error = state.error ? l.errors[state.error] : null
  const v = state.values ?? {}

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="package" value={packageSlug} />
      {/* Honeypot — hidden from people, filled by bots. */}
      <div className="hidden" aria-hidden>
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="block text-sm font-medium">
        {l.name}
        <input
          type="text"
          name="name" defaultValue={v.name ?? ''}
          required
          maxLength={80}
          autoComplete="name"
          placeholder={l.namePlaceholder}
          className={input}
        />
      </label>

      <fieldset>
        <legend className="text-sm font-medium">{l.contactHeading}</legend>
        <p className="mt-1 text-xs text-zinc-500">{l.contactHint}</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            {l.whatsapp}
            <input type="tel" name="whatsapp" defaultValue={v.whatsapp ?? ''} maxLength={40} autoComplete="tel" placeholder={l.whatsappPlaceholder} className={input} />
          </label>
          <label className="block text-sm font-medium">
            {l.wechat}
            <input type="text" name="wechat" defaultValue={v.wechat ?? ''} maxLength={80} autoComplete="off" placeholder={l.wechatPlaceholder} className={input} />
          </label>
          <label className="block text-sm font-medium">
            {l.phone}
            <input type="tel" name="phone" defaultValue={v.phone ?? ''} maxLength={40} autoComplete="tel" placeholder={l.phonePlaceholder} className={input} />
          </label>
          <label className="block text-sm font-medium">
            {l.email}
            <input type="email" name="email" defaultValue={v.email ?? ''} maxLength={120} autoComplete="email" placeholder={l.emailPlaceholder} className={input} />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium">{l.length}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {lengths.map((n) => (
            <label
              key={n}
              className="cursor-pointer rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium transition has-[:checked]:border-zinc-900 has-[:checked]:bg-zinc-900 has-[:checked]:text-white dark:border-zinc-700 dark:has-[:checked]:border-white dark:has-[:checked]:bg-white dark:has-[:checked]:text-zinc-900"
            >
              <input
                type="radio"
                name="hours"
                value={n}
                defaultChecked={v.hours ? String(n) === v.hours : n === defaultLength}
                className="sr-only"
              />
              {l.hours.replace('{n}', String(n))}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block text-sm font-medium">
        {l.when}
        <input type="text" name="preferred_dates" defaultValue={v.preferred_dates ?? ''} maxLength={200} placeholder={l.whenPlaceholder} className={input} />
        <span className="mt-1 block text-xs font-normal text-zinc-500">{l.whenHint}</span>
      </label>

      <label className="block text-sm font-medium">
        {l.message}
        <textarea name="message" defaultValue={v.message ?? ''} rows={4} maxLength={500} placeholder={l.messagePlaceholder} className={input} />
      </label>

      {askReview && <ReviewPledge note={l.pledgeNote} check={l.pledgeCheck} defaultChecked={v.review_pledge === 'yes'} />}

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200"
        >
          {error}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="block w-full rounded-full bg-zinc-900 px-6 py-3.5 text-center text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:bg-zinc-700 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {pending ? l.sending : l.submit}
        </button>
        <p className="mt-3 text-center text-xs leading-relaxed text-zinc-500">
          {l.termsPrefix}
          <Link href="/terms" className="underline underline-offset-2">
            {l.termsLink}
          </Link>
          {l.termsAnd}
          <Link href="/cancellation" className="underline underline-offset-2">
            {l.cancellationLink}
          </Link>
          {l.termsSuffix}
        </p>
      </div>
    </form>
  )
}

// The review ask. Shared with the account booking form on /guide so both say
// exactly the same thing. Required: the browser will not submit without it,
// and both server actions check it again.
export function ReviewPledge({
  note,
  check,
  defaultChecked = false,
}: {
  note: string
  check: string
  defaultChecked?: boolean
}) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900/60 dark:bg-amber-950/30">
      <p className="leading-relaxed text-amber-900 dark:text-amber-200">{note}</p>
      <label className="mt-3 flex cursor-pointer items-start gap-2.5 font-medium text-zinc-900 dark:text-white">
        <input
          type="checkbox"
          name="review_pledge"
          value="yes"
          required
          defaultChecked={defaultChecked}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-400 accent-zinc-900 dark:accent-white"
        />
        {check}
      </label>
    </div>
  )
}
