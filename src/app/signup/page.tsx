import Link from 'next/link'
import { SubmitButton } from '@/components/SubmitButton'
import { safeNextPath } from '@/lib/redirects'
import { signup } from './actions'
import { HeroImage } from '@/components/HeroImage'
import { getI18n } from '@/i18n/server'
import { authErrorText } from '@/lib/auth-errors'

type Props = {
  searchParams: Promise<{ error?: string; check_email?: string; next?: string }>
}


export default async function SignupPage({ searchParams }: Props) {
  const [{ error, check_email, next }, { t }] = await Promise.all([
    searchParams,
    getI18n(),
  ])
  const errorText = authErrorText(error, t.auth.errors)
  // Set when the visitor was bounced here from a gated action (e.g. booking).
  const nextPath = safeNextPath(next)
  const loginHref = nextPath
    ? `/login?next=${encodeURIComponent(nextPath)}`
    : '/login'

  return (
    <main className="flex flex-1">
      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
        <form
          action={signup}
          className="w-full max-w-sm space-y-5 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          {nextPath && <input type="hidden" name="next" value={nextPath} />}

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {t.auth.signup.kicker}
            </p>
            <h1 className="mt-1 text-2xl font-semibold">{t.auth.signup.title}</h1>
            <p className="mt-1 text-xs text-zinc-500">
              {t.auth.signup.sub}
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

          <label className="block">
            <span className="text-sm font-medium">{t.auth.password}</span>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
            />
            <span className="mt-1 block text-xs text-zinc-500">
              {t.auth.minLength}
            </span>
          </label>

          {errorText && <p className="text-sm text-red-600">{errorText}</p>}
          {check_email && (
            <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              {t.auth.signup.checkEmail}
            </p>
          )}

          <SubmitButton
            pendingLabel={t.auth.signup.pending}
            className="w-full rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {t.auth.signup.submit}
          </SubmitButton>

          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            {t.auth.signup.haveAccount}{' '}
            <Link href={loginHref} className="font-medium underline">
              {t.auth.signup.loginLink}
            </Link>
          </p>
        </form>
      </div>

      {/* Photo panel */}
      <aside className="relative hidden lg:flex lg:flex-1">
        <HeroImage
          name="night-market-skewers-stall"
          alt={t.auth.signup.photoAlt}
          className="absolute inset-0 h-full w-full object-cover"
          shape="panel"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/30 via-amber-500/30 to-black/60" />
        <div className="relative flex items-end p-12">
          <div className="text-white drop-shadow">
            <p className="text-2xl font-medium leading-snug">
              {t.auth.signup.panelTitle}
            </p>
            <p className="mt-4 max-w-sm text-sm text-white/85">
              {t.auth.signup.panelBody}
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/85">
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-300">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t.auth.signup.points[0]}
              </li>
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-300">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t.auth.signup.points[1]}
              </li>
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-300">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t.auth.signup.points[2]}
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </main>
  )
}
