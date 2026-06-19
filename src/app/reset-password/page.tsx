import { redirect } from 'next/navigation'
import { SubmitButton } from '@/components/SubmitButton'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { updatePassword } from './actions'

type Props = {
  searchParams: Promise<{ error?: string }>
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { error } = await searchParams

  // Reaching this page requires the recovery session set by /auth/confirm.
  // Without it there's nothing to update, so send them back to request a link.
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect(
      `/forgot-password?error=${encodeURIComponent('Open the reset link from your email to set a new password.')}`,
    )
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
      <form
        action={updatePassword}
        className="w-full max-w-sm space-y-5 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Almost there
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Set a new password</h1>
        </div>

        <label className="block">
          <span className="text-sm font-medium">New password</span>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          />
          <span className="mt-1 block text-xs text-zinc-500">
            At least 8 characters.
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Confirm new password</span>
          <input
            type="password"
            name="confirm"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <SubmitButton
          pendingLabel="Updating…"
          className="w-full rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Update password
        </SubmitButton>
      </form>
    </main>
  )
}
