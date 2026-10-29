'use client'

import { useActionState } from 'react'
import { ImageUpload } from '@/components/ImageUpload'
import { StarRatingInput } from '@/components/StarRating'
import { SubmitButton } from '@/components/SubmitButton'
import type { Dictionary } from '@/i18n'
import { submitOpenReview, type OpenReviewState } from './actions'

type Labels = Omit<Dictionary['openReview'], 'errors' | 'thankYouEmail'> & {
  email: string
  password: string
  minLength: string
  wordsHint: string
  stars: { one: string; other: string }
}

const INPUT =
  'mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950'

export function ReviewForm({
  labels: l,
  signedIn,
  defaultName,
  linkKey,
}: {
  // Filled by the server page (the guide's name is already in `rating`).
  labels: Labels
  signedIn: boolean
  defaultName: string
  linkKey: string
}) {
  const initial: OpenReviewState = {
    error: null,
    values: { name: defaultName, email: '', stars: 0, body: '' },
    attempt: 0,
  }
  const [state, action] = useActionState(submitOpenReview, initial)
  const v = state.values

  return (
    // Remounts after a failed submit so the fields show what was sent.
    <form
      key={state.attempt}
      action={action}
      className="mt-8 space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <input type="hidden" name="k" value={linkKey} />

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          {state.error}
        </p>
      )}

      <div>
        <p className="text-sm font-medium">{l.rating}</p>
        <div className="mt-2">
          <StarRatingInput
            name="stars"
            defaultValue={v.stars}
            size={32}
            labels={l.stars}
          />
        </div>
      </div>

      <label className="block">
        <span className="text-sm font-medium">{l.words}</span>
        <span className="ml-1 text-xs text-zinc-500">{l.wordsHint}</span>
        <textarea
          name="body"
          rows={4}
          maxLength={600}
          defaultValue={v.body}
          placeholder={l.placeholder}
          className={INPUT}
        />
      </label>

      <hr className="border-zinc-200 dark:border-zinc-800" />

      <label className="block">
        <span className="text-sm font-medium">{l.name}</span>
        <input
          name="name"
          required
          maxLength={60}
          autoComplete="name"
          defaultValue={v.name}
          className={INPUT}
        />
        <span className="mt-1 block text-xs text-zinc-500">{l.nameHint}</span>
      </label>

      <label className="block">
        <span className="text-sm font-medium">{l.photo}</span>
        <span className="ml-1 text-xs text-zinc-500">{l.optional}</span>
        <ImageUpload
          name="photo"
          className="mt-1 block w-full text-sm text-zinc-600 file:mr-3 file:rounded-full file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-zinc-200 dark:text-zinc-400 dark:file:bg-zinc-800 dark:hover:file:bg-zinc-700"
        />
      </label>

      {!signedIn && (
        <>
          <label className="block">
            <span className="text-sm font-medium">{l.email}</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              defaultValue={v.email}
              className={INPUT}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">{l.password}</span>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              autoComplete="new-password"
              className={INPUT}
            />
            <span className="mt-1 block text-xs text-zinc-500">
              {l.minLength} {l.accountHint}
            </span>
          </label>
          <label className="block">
            <span className="text-sm font-medium">{l.passwordConfirm}</span>
            <input
              type="password"
              name="password_confirm"
              required
              minLength={8}
              autoComplete="new-password"
              className={INPUT}
            />
          </label>
        </>
      )}

      {/* Honeypot: hidden from people, filled in by bots. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <SubmitButton
        pendingLabel={l.pending}
        className="w-full rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {signedIn ? l.submitSignedIn : l.submit}
      </SubmitButton>
      <p className="text-xs text-zinc-500">{l.consent}</p>
    </form>
  )
}
