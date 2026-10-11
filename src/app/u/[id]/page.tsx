import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Avatar } from '@/components/Avatar'
import { StarRating, StarRatingInput } from '@/components/StarRating'
import { SubmitButton } from '@/components/SubmitButton'
import { fill, type Dictionary } from '@/i18n'
import { getI18n } from '@/i18n/server'
import { avatarPublicUrl } from '@/lib/avatars'
import {
  scoreMatch,
  type MatchScore,
  type ProfileForMatching,
} from '@/lib/matching'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { startConversationWith } from '@/app/messages/actions'
import { submitReview } from './actions'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ reviewed?: string; error?: string }>
}

type ProfileRow = {
  id: string
  role: 'guide' | 'tourist'
  display_name: string
  bio: string | null
  city: string
  hobbies: string[]
  languages: string[]
  personality_traits: string[]
  visibility: 'public' | 'private'
  avatar_path: string | null
  cover_path: string | null
  updated_at: string
}

const DEFAULT_COVER =
  '/hero/skyline-tower-walkway-night.webp'

type ReviewRow = {
  id: string
  reviewer_id: string
  reviewee_id: string
  stars: number
  body: string | null
  created_at: string
  updated_at: string
}

type ReviewerLite = {
  id: string
  display_name: string
  avatar_path: string | null
  updated_at: string
}

const REVIEW_VISIBILITY_THRESHOLD = 1

// Same rule as /browse: translate the known language/hobby/trait tags, show
// anything else (or an English entry) exactly as the profile has it.
function tagLabel(names: Record<string, string>, value: string): string {
  const key = value.trim().toLowerCase()
  // Own properties only: a profile tag of "constructor" must not resolve to
  // Object's constructor.
  const label = Object.hasOwn(names, key) ? names[key] : undefined
  return label && label.toLowerCase() !== key ? label : value
}

export default async function ProfileDetailPage({ params, searchParams }: Props) {
  const { id } = await params
  const { reviewed, error: queryError } = await searchParams
  const { t, meta } = await getI18n()
  const c = t.buddy
  const reviewCountLabel = (n: number) =>
    fill(n === 1 ? c.reviewCountOne : c.reviewCountOther, { n })

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isSelf = user?.id === id

  // Guide profiles are the public landing page for cold traffic, and RLS
  // doesn't expose profiles without a session — so anonymous reads go through
  // the service-role client and are narrowed to public guides right below.
  const reader = user ? supabase : createSupabaseAdminClient()

  const { data: profile } = await reader
    .from('profiles')
    .select(
      'id, role, display_name, bio, city, hobbies, languages, personality_traits, visibility, avatar_path, cover_path, updated_at',
    )
    .eq('id', id)
    .maybeSingle<ProfileRow>()

  if (!profile) notFound()
  if (profile.visibility === 'private' && !isSelf) notFound()
  // Only public *guide* profiles are part of the anonymous preview. Tourist
  // profiles stay behind login exactly as before.
  if (!user && profile.role !== 'guide') {
    redirect(`/login?next=${encodeURIComponent(`/u/${id}`)}`)
  }

  let myProfile: ProfileForMatching | null = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('role, city, hobbies, languages, personality_traits')
      .eq('id', user.id)
      .maybeSingle<ProfileForMatching>()
    myProfile = data
  }

  const score = scoreMatch(myProfile, profile)

  const { data: reviews } = await reader
    .from('reviews')
    .select('id, reviewer_id, reviewee_id, stars, body, created_at, updated_at')
    .eq('reviewee_id', id)
    .order('created_at', { ascending: false })
    .returns<ReviewRow[]>()

  const reviewList = reviews ?? []
  const reviewCount = reviewList.length
  const avgStars =
    reviewCount === 0
      ? 0
      : reviewList.reduce((sum, r) => sum + r.stars, 0) / reviewCount
  const canSeeReviews = isSelf || reviewCount >= REVIEW_VISIBILITY_THRESHOLD

  const myReview =
    isSelf || !user
      ? null
      : reviewList.find((r) => r.reviewer_id === user.id) ?? null

  // Reviewers are tourists, not part of the public preview. The anonymous
  // path reads with the service-role client, which bypasses RLS, so the
  // profiles rule (`visibility = 'public' or id = auth.uid()`) is restated
  // here as a query filter. Reviews from reviewers we can't name still
  // render — the identity degrades to "Traveler", the rating never changes.
  const reviewerIds = Array.from(new Set(reviewList.map((r) => r.reviewer_id)))
  const reviewerById = new Map<string, ReviewerLite>()
  if (reviewerIds.length) {
    const reviewerQuery = reader
      .from('profiles')
      .select('id, display_name, avatar_path, updated_at')
      .in('id', reviewerIds)
    const { data: reviewers } = await (user
      ? reviewerQuery.or(`visibility.eq.public,id.eq.${user.id}`)
      : reviewerQuery.eq('visibility', 'public')
    ).returns<ReviewerLite[]>()
    for (const r of reviewers ?? []) reviewerById.set(r.id, r)
  }

  return (
    <main className="flex flex-1 flex-col">
      {/* Cover banner */}
      <section className="relative h-56 overflow-hidden sm:h-72">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            avatarPublicUrl(profile.cover_path, profile.updated_at) ??
            DEFAULT_COVER
          }
          alt={fill(c.coverAlt, { name: profile.display_name })}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/20 via-rose-500/15 to-black/50" />
        <div className="relative mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link
            href="/browse"
            className="rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur hover:bg-white/20"
          >
            {c.backToBrowse}
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  href="/messages"
                  className="rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur hover:bg-white/20"
                >
                  {t.nav.messages}
                </Link>
                <Link
                  href="/profile"
                  className="rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur hover:bg-white/20"
                >
                  {t.common.yourProfile}
                </Link>
              </>
            ) : (
              <Link
                href={`/signup?next=${encodeURIComponent(`/u/${id}`)}`}
                className="rounded-md bg-white px-4 py-1.5 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-white/90"
              >
                {t.common.signUp}
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-3xl px-4 pb-12 pt-8">
        {/* Identity row — sits cleanly below the cover banner */}
        <div className="flex flex-wrap items-center gap-4">
          <Avatar
            src={avatarPublicUrl(profile.avatar_path, profile.updated_at)}
            name={profile.display_name}
            size={96}
            className="ring-4 ring-white shadow-lg dark:ring-zinc-900"
          />
          <div className="min-w-0 flex-1 pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold">{profile.display_name}</h1>
              <span
                className={
                  profile.role === 'guide'
                    ? 'rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                }
              >
                {profile.role === 'guide' ? c.roleGuide : c.roleTourist}
              </span>
              {myProfile && !isSelf && <MatchBadge score={score} b={t.browse} />}
            </div>
            <p className="mt-1 text-sm text-zinc-500">{profile.city}</p>
            {reviewCount > 0 && (
              <div className="mt-2 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <StarRating
                  value={avgStars}
                  size={16}
                  label={fill(t.stars.outOf, { value: avgStars.toFixed(1) })}
                />
                <span>
                  {avgStars.toFixed(1)} · {reviewCountLabel(reviewCount)}
                </span>
              </div>
            )}
          </div>
        </div>

        {reviewed && (
          <p className="mt-6 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            {c.reviewed}
          </p>
        )}
        {queryError && (
          <p className="mt-6 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
            {queryError}
          </p>
        )}

        <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {profile.bio && (
            <p className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
              {profile.bio}
            </p>
          )}

          <Chips
            label={t.browse.hobbies}
            items={profile.hobbies}
            highlight={score.sharedHobbies}
            names={t.browse.hobbyNames}
          />
          <Chips
            label={t.browse.languages}
            items={profile.languages}
            highlight={score.sharedLanguages}
            names={t.browse.languageNames}
          />
          <Chips
            label={t.browse.traits}
            items={profile.personality_traits}
            highlight={score.sharedTraits}
            names={t.browse.traitNames}
          />

          <div className="mt-6">
          {!user ? (
            // Auth kicks in here: viewing is public, messaging is not.
            <Link
              href={`/signup?next=${encodeURIComponent(`/u/${id}`)}`}
              className="inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {fill(c.signUpToMessage, { name: profile.display_name })}
            </Link>
          ) : isSelf ? (
            <Link
              href="/profile"
              className="inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {c.editProfile}
            </Link>
          ) : myProfile?.role && myProfile.role === profile.role ? (
            <div className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              {profile.role === 'guide' ? c.sameRoleGuides : c.sameRoleTourists}
            </div>
          ) : (
            <form action={startConversationWith}>
              <input type="hidden" name="other_id" value={profile.id} />
              <SubmitButton
                pendingLabel={t.browse.opening}
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {fill(c.messageName, { name: profile.display_name })}
              </SubmitButton>
            </form>
          )}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">{c.reviews}</h2>
          {reviewCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <StarRating
                value={avgStars}
                size={14}
                label={fill(t.stars.outOf, { value: avgStars.toFixed(1) })}
              />
              <span>
                {avgStars.toFixed(1)} · {reviewCountLabel(reviewCount)}
              </span>
            </div>
          )}
        </div>

        {!isSelf && myProfile?.role && myProfile.role !== profile.role && (
          <form
            action={submitReview}
            className="mb-6 space-y-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <input type="hidden" name="reviewee_id" value={profile.id} />
            <div>
              <p className="text-sm font-medium">
                {myReview ? c.updateYourReview : c.leaveReview}
              </p>
              <p className="text-xs text-zinc-500">
                {c.reviewHint}
              </p>
            </div>
            <div>
              <StarRatingInput
                name="stars"
                defaultValue={myReview?.stars ?? 0}
                labels={{ one: t.stars.starOne, other: t.stars.starOther }}
              />
            </div>
            <label className="block">
              <span className="text-sm font-medium">{c.comment}</span>
              <span className="ml-1 text-xs text-zinc-500">
                {c.commentHint}
              </span>
              <textarea
                name="body"
                rows={4}
                maxLength={5000}
                defaultValue={myReview?.body ?? ''}
                placeholder={fill(c.commentPlaceholder, { name: profile.display_name })}
                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              />
            </label>
            <SubmitButton
              pendingLabel={c.submitting}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {myReview ? c.updateReview : c.submitReview}
            </SubmitButton>
          </form>
        )}

        {reviewCount === 0 && (
          <p className="rounded-lg border border-dashed border-zinc-300 px-6 py-12 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
            {c.noReviews}
          </p>
        )}

        {reviewCount > 0 && !canSeeReviews && (
          <div className="rounded-lg border border-dashed border-zinc-300 px-6 py-8 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
            <p>
              {fill(reviewCount === 1 ? c.hiddenOne : c.hiddenOther, {
                n: reviewCount,
              })}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {fill(c.hiddenNote, { n: REVIEW_VISIBILITY_THRESHOLD })}
            </p>
          </div>
        )}

        {reviewCount > 0 && canSeeReviews && (
          <ul className="space-y-3">
            {reviewList.map((r) => {
              const reviewer = reviewerById.get(r.reviewer_id)
              // Reviewers whose profile isn't ours to show (private, or hidden
              // from anonymous visitors) keep the review and lose the name.
              const reviewerName = reviewer?.display_name ?? c.traveler
              return (
                <li
                  key={r.id}
                  className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-start gap-3">
                    <Avatar
                      src={avatarPublicUrl(
                        reviewer?.avatar_path,
                        reviewer?.updated_at,
                      )}
                      name={reviewerName}
                      size={40}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="truncate font-medium">{reviewerName}</p>
                        <span className="text-xs text-zinc-500">
                          {new Date(r.created_at).toLocaleDateString(meta.intlLocale)}
                        </span>
                      </div>
                      <StarRating
                        value={r.stars}
                        size={14}
                        className="mt-1"
                        label={fill(t.stars.outOf, { value: r.stars.toFixed(1) })}
                      />
                      {r.body && (
                        <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                          {r.body}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
      </div>
    </main>
  )
}

function MatchBadge({
  score,
  b,
}: {
  score: MatchScore
  b: Dictionary['browse']
}) {
  if (score.total <= 0) return null
  const shared =
    score.sharedHobbies.length +
    score.sharedLanguages.length +
    score.sharedTraits.length
  const bits: string[] = []
  if (shared > 0) bits.push(fill(b.badgeShared, { n: shared }))
  if (score.sameCity) bits.push(b.badgeSameCity)
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
      <span aria-hidden>✦</span>
      {bits.join(' · ') || b.badgeMatch}
    </span>
  )
}

function Chips({
  label,
  items,
  highlight,
  names,
}: {
  label: string
  items: string[]
  highlight?: string[]
  names: Record<string, string>
}) {
  if (!items || items.length === 0) return null
  const highlightSet = new Set((highlight ?? []).map((s) => s.trim().toLowerCase()))
  return (
    <div className="mt-4">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {items.map((it) => {
          const isShared = highlightSet.has(it.trim().toLowerCase())
          return (
            <span
              key={it}
              className={
                isShared
                  ? 'rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }
            >
              {tagLabel(names, it)}
            </span>
          )
        })}
      </div>
    </div>
  )
}
