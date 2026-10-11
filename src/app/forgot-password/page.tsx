import Link from 'next/link'
import { SubmitButton } from '@/components/SubmitButton'
import { getI18n } from '@/i18n/server'
import { authErrorText } from '@/lib/auth-errors'
import { requestPasswordReset } from './actions'

type Props = {
  searchParams: Promise<{ error?: string; sent?: string }>
}

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const [{ error, sent }, { t }] = await Promise.all([searchParams, getI18n()])
  const errorText = authErrorText(error, t.auth.errors)

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
      <form
        action={requestPasswordReset}
        className="w-full max-w-sm space-y-5 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {t.auth.forgot.kicker}
          </p>
          <h1 className="mt-1 text-2xl font-semibold">{t.auth.forgot.title}</h1>
          <p className="mt-1 text-xs text-zinc-500">
            {t.auth.forgot.body}
          </p>
        </div>

        <label className="block">
          <span className="text-sm font-medium">{t.auth.email}</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>

        {errorText && <p className="text-sm text-red-600">{errorText}</p>}
        {sent && (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            {t.auth.forgot.sent}
          </p>
        )}

        <SubmitButton
          pendingLabel={t.auth.forgot.pending}
          className="w-full rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {t.auth.forgot.submit}
        </SubmitButton>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          {t.auth.forgot.remembered}{' '}
          <Link href="/login" className="font-medium underline">
            {t.auth.forgot.loginLink}
          </Link>
        </p>
      </form>
    </main>
  )
}
