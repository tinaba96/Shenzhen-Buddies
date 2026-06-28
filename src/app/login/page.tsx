import Link from 'next/link'
import { SubmitButton } from '@/components/SubmitButton'
import { login } from './actions'

type Props = {
  searchParams: Promise<{ error?: string }>
}

const SIDE_PHOTO =
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&q=80&auto=format&fit=crop'

const SPLITWHOM_URL =
  'https://splitwhom.com/?utm_source=shenzhen-buddies&utm_medium=referral&utm_campaign=og_banner&utm_content=login'

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <main className="flex flex-1">
      {/* Form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-12">
        <form
          action={login}
          className="w-full max-w-sm space-y-5 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Welcome back
            </p>
            <h1 className="mt-1 text-2xl font-semibold">Log in</h1>
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
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium">Password</span>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-zinc-500 underline hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <SubmitButton
            pendingLabel="Logging in…"
            className="w-full rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Log in
          </SubmitButton>

          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            No account?{' '}
            <Link href="/signup" className="font-medium underline">
              Sign up
            </Link>
          </p>
        </form>

        {/* Small partner banner */}
        <div className="mt-5 w-full max-w-sm">
          <p className="mb-1.5 text-center text-[11px] uppercase tracking-wider text-zinc-400">
            From a friend
          </p>
          <a
            href={SPLITWHOM_URL}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group block overflow-hidden rounded-xl border border-zinc-200 shadow-sm transition hover:shadow-md dark:border-zinc-800"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/splitwhom-banner.png"
              alt="SplitWhom — split shared expenses with friends"
              className="w-full transition duration-500 group-hover:scale-[1.02]"
            />
          </a>
        </div>
      </div>

      {/* Photo panel */}
      <aside className="relative hidden lg:flex lg:flex-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SIDE_PHOTO}
          alt="Shenzhen at night"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 via-rose-500/30 to-black/60" />
        <div className="relative flex items-end p-12">
          <blockquote className="max-w-md text-white drop-shadow">
            <p className="text-2xl font-medium leading-snug">
              &ldquo;Daniel took me to a dumpling place no map app would have
              found. We&apos;re still texting about food.&rdquo;
            </p>
            <p className="mt-4 text-sm text-white/85">
              — Marco R., visiting from Milan
            </p>
          </blockquote>
        </div>
      </aside>
    </main>
  )
}
