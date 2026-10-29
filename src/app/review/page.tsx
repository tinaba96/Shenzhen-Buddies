import Link from 'next/link'
import type { Metadata } from 'next'
import { fill } from '@/i18n'
import { getI18n } from '@/i18n/server'
import { isValidReviewLinkKey, officialGuideId } from '@/lib/config'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { ReviewForm } from './ReviewForm'

// The open review page — the link the guide sends to tourists whose tour was
// arranged outside the website. Stars, a few words, name and photo, plus
// email and password when signed out: one submit makes the account and
// publishes the review (./actions). Booked tourists keep using
// /guide/review/[id]. The link carries a secret code (?k=, REVIEW_LINK_KEY)
// so the page cannot be found by guessing /review.

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return {
    title: t.seo.openReview.title,
    robots: { index: false },
  }
}

type Props = {
  searchParams: Promise<{ sent?: string; check_email?: string; k?: string }>
}

export default async function OpenReviewPage({ searchParams }: Props) {
  const [sp, { locale, t }] = await Promise.all([searchParams, getI18n()])
  const o = t.openReview
  // The error and email strings are used by the action only; keep them out
  // of the client bundle.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { errors, thankYouEmail, ...formLabels } = o
  const guideId = officialGuideId()

  // The thank-you view is reached by the action's redirect, without the code.
  if (!sp.sent && !isValidReviewLinkKey(sp.k)) {
    return (
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-12">
        <p className="rounded-2xl border border-dashed border-zinc-300 px-6 py-10 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          {o.invalidLink}
        </p>
      </main>
    )
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const admin = createSupabaseAdminClient()
  const [{ data: guide }, { data: me }] = await Promise.all([
    guideId
      ? admin
          .from('profiles')
          .select('display_name')
          .eq('id', guideId)
          .maybeSingle<{ display_name: string }>()
      : Promise.resolve({ data: null }),
    user
      ? admin
          .from('profiles')
          .select('display_name')
          .eq('id', user.id)
          .maybeSingle<{ display_name: string }>()
      : Promise.resolve({ data: null }),
  ])
  // First name only, as on the post-tour page; the fallback is a phrase.
  const guideName = guide?.display_name
    ? guide.display_name.split(' ')[0]
    : t.review.yourGuide

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-12">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        {o.kicker}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        {fill(o.title, { name: guideName }, locale)}
      </h1>

      {sp.sent ? (
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-8 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          <p className="text-base font-semibold">{o.thanks}</p>
          <p className="mt-2">
            {sp.check_email ? o.checkEmail : fill(o.live, { name: guideName }, locale)}
          </p>
          {guideId && (
            <Link
              href={`/u/${guideId}`}
              className="mt-4 inline-block font-medium underline"
            >
              {fill(o.seeProfile, { name: guideName }, locale)}
            </Link>
          )}
        </div>
      ) : (
        <>
          <p className="mt-2 text-sm text-zinc-500">
            {user ? o.subSignedIn : o.sub}
          </p>
          {!user && (
            <p className="mt-1 text-sm text-zinc-500">
              {o.haveAccount}{locale === 'en' ? ' ' : ''}
              <Link
                href={`/login?next=${encodeURIComponent(`/review?k=${encodeURIComponent(sp.k ?? '')}`)}`}
                className="font-medium underline"
              >
                {t.auth.signup.loginLink}
              </Link>
            </p>
          )}
          <ReviewForm
            signedIn={!!user}
            defaultName={me?.display_name ?? ''}
            linkKey={sp.k ?? ''}
            labels={{
              ...formLabels,
              rating: fill(o.rating, { name: guideName }, locale),
              email: t.auth.email,
              password: t.auth.password,
              minLength: t.auth.minLength,
              wordsHint: t.review.wordsHint,
              stars: { one: t.stars.starOne, other: t.stars.starOther },
            }}
          />
        </>
      )}
    </main>
  )
}
