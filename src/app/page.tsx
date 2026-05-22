import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
        Shenzhen-Buddies
      </h1>
      <p className="mt-4 max-w-xl text-base text-zinc-600 dark:text-zinc-400">
        Match with a local buddy in Shenzhen who shares your interests. Casual,
        affordable, personal.
      </p>

      <div className="mt-8 flex gap-3">
        {user ? (
          <Link
            href="/profile"
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Go to your profile
          </Link>
        ) : (
          <>
            <Link
              href="/signup"
              className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Log in
            </Link>
          </>
        )}
      </div>
    </main>
  )
}
