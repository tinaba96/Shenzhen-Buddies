import Link from 'next/link'
import { SubmitButton } from '@/components/SubmitButton'
import { signup } from './actions'

type Props = {
  searchParams: Promise<{ error?: string; check_email?: string }>
}

export default async function SignupPage({ searchParams }: Props) {
  const { error, check_email } = await searchParams

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <form
        action={signup}
        className="w-full max-w-sm space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <h1 className="text-2xl font-semibold">Create account</h1>

        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Password</span>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {check_email && (
          <p className="text-sm text-emerald-700 dark:text-emerald-400">
            Check your email to confirm your address, then log in.
          </p>
        )}

        <SubmitButton
          pendingLabel="Signing up…"
          className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Sign up
        </SubmitButton>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{' '}
          <Link href="/login" className="font-medium underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  )
}
