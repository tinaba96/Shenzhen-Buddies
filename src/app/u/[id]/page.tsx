import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Avatar } from '@/components/Avatar'
import { StarRating, StarRatingInput } from '@/components/StarRating'
import { SubmitButton } from '@/components/SubmitButton'
import { avatarPublicUrl } from '@/lib/avatars'
import {
  scoreMatch,
  type MatchScore,
  type ProfileForMatching,
} from '@/lib/matching'
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
  updated_at: string
}

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

const REVIEW_VISIBILITY_THRESHOLD = 3

export default async function ProfileDetailPage({ params, searchParams }: Props) {
  const { id } = await params
  const { reviewed, error: queryError } = await searchParams

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const isSelf = user.id === id

  const { data: profile } = await supabase
    .from('profiles')
    .select(
      'id, role, display_name, bio, city, hobbies, languages, personality_traits, visibility, avatar_path, updated_at',
    )
    .eq('id', id)
    .maybeSingle<ProfileRow>()

  if (!profile) notFound()
  if (profile.visibility === 'private' && !isSelf) notFound()

  const { data: myProfile } = await supabase
    .from('profiles')
    .select('role, city, hobbies, languages, personality_traits')
    .eq('id', user.id)
    .maybeSingle<ProfileForMatching>()

  const score = scoreMatch(myProfile, profile)

  const { data: reviews } = await supabase
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

  const myReview = isSelf
    ? null
    : reviewList.find((r) => r.reviewer_id === user.id) ?? null

  const reviewerIds = Array.from(new Set(reviewList.map((r) => r.reviewer_id)))
  const reviewerById = new Map<string, ReviewerLite>()
  if (reviewerIds.length) {
    const { data: reviewers } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_path, updated_at')
      .in('id', reviewerIds)
      .returns<ReviewerLite[]>()
    for (const r of reviewers ?? []) reviewerById.set(r.id, r)
  }

  return (
    <main className="flex flex-1 flex-col">
      {/* Cover banner */}
      <section className="relative h-56 overflow-hidden sm:h-72">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1473625247510-8ceb1760943f?w=2000&q=80&auto=format&fit=crop"
          alt="Shenzhen skyline"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/20 via-rose-500/15 to-black/50" />
        <div className="relative mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link
            href="/browse"
            className="rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur hover:bg-white/20"
          >
            ← Browse
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/messages"
              className="rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur hover:bg-white/20"
            >
              Messages
            </Link>
            <Link
              href="/profile"
              className="rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur hover:bg-white/20"
            >
              Your profile
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto -mt-12 w-full max-w-3xl px-4 pb-12 sm:-mt-16">

      {reviewed && (
        <p className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          Review submitted.
        </p>
      )}
      {queryError && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          {queryError}
        </p>
      )}

      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start gap-4">
          <Avatar
            src={avatarPublicUrl(profile.avatar_path, profile.updated_at)}
            name={profile.display_name}
            size={96}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold">{profile.display_name}</h1>
              <span
                className={
                  profile.role === 'guide'
                    ? 'rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                }
              >
                {profile.role === 'guide' ? 'Guide' : 'Tourist'}
              </span>
              {myProfile && !isSelf && <MatchBadge score={score} />}
            </div>
            <p className="mt-1 text-sm text-zinc-500">{profile.city}</p>
            {reviewCount > 0 && (
              <div className="mt-2 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <StarRating value={avgStars} size={16} />
                <span>
                  {avgStars.toFixed(1)} · {reviewCount}{' '}
                  {reviewCount === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            )}
            {profile.bio && (
              <p className="mt-3 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        <Chips
          label="Hobbies"
          items={profile.hobbies}
          highlight={score.sharedHobbies}
        />
        <Chips
          label="Languages"
          items={profile.languages}
          highlight={score.sharedLanguages}
        />
        <Chips
          label="Personality traits"
          items={profile.personality_traits}
          highlight={score.sharedTraits}
        />

        <div className="mt-6">
          {isSelf ? (
            <Link
              href="/profile"
              className="inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Edit profile
            </Link>
          ) : myProfile?.role && myProfile.role === profile.role ? (
            <div className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              Messaging is between tourists and guides. You&apos;re both{' '}
              {profile.role === 'guide' ? 'guides' : 'tourists'}.
            </div>
          ) : (
            <form action={startConversationWith}>
              <input type="hidden" name="other_id" value={profile.id} />
              <SubmitButton
                pendingLabel="Opening…"
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Message {profile.display_name}
              </SubmitButton>
            </form>
          )}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Reviews</h2>
          {reviewCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <StarRating value={avgStars} size={14} />
              <span>
                {avgStars.toFixed(1)} · {reviewCount}{' '}
                {reviewCount === 1 ? 'review' : 'reviews'}
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
                {myReview ? 'Update your review' : 'Leave a review'}
              </p>
              <p className="text-xs text-zinc-500">
                You can review someone after exchanging at least one message.
              </p>
            </div>
            <div>
              <StarRatingInput
                name="stars"
                defaultValue={myReview?.stars ?? 0}
              />
            </div>
            <label className="block">
              <span className="text-sm font-medium">Comment</span>
              <span className="ml-1 text-xs text-zinc-500">
                (optional, up to 500 chars)
              </span>
              <textarea
                name="body"
                rows={3}
                maxLength={500}
                defaultValue={myReview?.body ?? ''}
                placeholder={`Share what it was like meeting ${profile.display_name}…`}
                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              />
            </label>
            <SubmitButton
              pendingLabel="Submitting…"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {myReview ? 'Update review' : 'Submit review'}
            </SubmitButton>
          </form>
        )}

        {reviewCount === 0 && (
          <p className="rounded-lg border border-dashed border-zinc-300 px-6 py-12 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
            No reviews yet.
          </p>
        )}

        {reviewCount > 0 && !canSeeReviews && (
          <div className="rounded-lg border border-dashed border-zinc-300 px-6 py-8 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
            <p>
              {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'} — not
              visible yet
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Reviews become public once a profile has at least{' '}
              {REVIEW_VISIBILITY_THRESHOLD} reviews.
            </p>
          </div>
        )}

        {reviewCount > 0 && canSeeReviews && (
          <ul className="space-y-3">
            {reviewList.map((r) => {
              const reviewer = reviewerById.get(r.reviewer_id)
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
                      name={reviewer?.display_name}
                      size={40}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="truncate font-medium">
                          {reviewer?.display_name ?? 'Unknown user'}
                        </p>
                        <span className="text-xs text-zinc-500">
                          {new Date(r.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <StarRating value={r.stars} size={14} className="mt-1" />
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

function MatchBadge({ score }: { score: MatchScore }) {
  if (score.total <= 0) return null
  const shared =
    score.sharedHobbies.length +
    score.sharedLanguages.length +
    score.sharedTraits.length
  const bits: string[] = []
  if (shared > 0) bits.push(`${shared} shared`)
  if (score.sameCity) bits.push('same city')
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
      <span aria-hidden>✦</span>
      {bits.join(' · ') || 'match'}
    </span>
  )
}

function Chips({
  label,
  items,
  highlight,
}: {
  label: string
  items: string[]
  highlight?: string[]
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
              {it}
            </span>
          )
        })}
      </div>
    </div>
  )
}
