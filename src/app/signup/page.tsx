import Link from 'next/link'
import { SubmitButton } from '@/components/SubmitButton'
import { signup } from './actions'

type Props = {
  searchParams: Promise<{ error?: string; check_email?: string }>
}

const SIDE_PHOTO =
  'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1400&q=80&auto=format&fit=crop'

export default async function SignupPage({ searchParams }: Props) {
  const { error, check_email } = await searchParams

  return (
    <main className="flex flex-1">
      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
        <form
          action={signup}
          className="w-full max-w-sm space-y-5 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Get started
            </p>
            <h1 className="mt-1 text-2xl font-semibold">Create your account</h1>
            <p className="mt-1 text-xs text-zinc-500">
              Free during pilot. Takes under a minute.
            </p>
          </div>

          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
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
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
            />
            <span className="mt-1 block text-xs text-zinc-500">
              At least 8 characters.
            </span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {check_email && (
            <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              Check your email to confirm your address, then log in.
            </p>
          )}

          <SubmitButton
            pendingLabel="Signing up…"
            className="w-full rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
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
      </div>

      {/* Photo panel */}
      <aside className="relative hidden lg:flex lg:flex-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SIDE_PHOTO}
          alt="Vibrant city scene"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/30 via-amber-500/30 to-black/60" />
        <div className="relative flex items-end p-12">
          <div className="text-white drop-shadow">
            <p className="text-2xl font-medium leading-snug">
              Casual. Affordable. Personal.
            </p>
            <p className="mt-4 max-w-sm text-sm text-white/85">
              Match by what you actually like — language, food, art, hiking,
              electronics — and meet a local who knows the spot.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/85">
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-300">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Free 14-day premium trial
              </li>
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-300">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Cancel anytime
              </li>
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-300">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Reviewed by the community
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </main>
  )
}
