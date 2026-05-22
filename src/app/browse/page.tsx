import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Avatar } from '@/components/Avatar'
import { StarRating } from '@/components/StarRating'
import { SubmitButton } from '@/components/SubmitButton'
import { avatarPublicUrl } from '@/lib/avatars'
import { scoreMatch, type MatchScore, type ProfileForMatching } from '@/lib/matching'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { startConversationWith } from '@/app/messages/actions'
import { applyFilters } from './actions'
import { FilterDrawer } from './FilterDrawer'

type Props = {
  searchParams: Promise<{
    q?: string
    lang?: string | string[]
    hobby?: string | string[]
    trait?: string | string[]
    great?: string
    min_stars?: string
    min_reviews?: string
    with_photo?: string
    active?: string
    sort?: string
  }>
}

type RatingStats = { avg: number; count: number }

type ProfileRow = {
  id: string
  role: 'guide' | 'tourist'
  display_name: string
  bio: string | null
  city: string
  hobbies: string[]
  languages: string[]
  personality_traits: string[]
  avatar_path: string | null
  updated_at: string
}

// Generous upper bound so post-scoring filters (min_stars, min_reviews,
// greatOnly) work over a wide enough candidate window. At ~10KB of data per
// row this is still well under the PostgREST default response cap, and the
// JS-side filtering is O(n) over the result.
const PAGE_LIMIT = 200

const LANGUAGE_OPTIONS = [
  'English',
  'Mandarin',
  'Cantonese',
  'Japanese',
  'Korean',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Vietnamese',
] as const

const TRAIT_OPTIONS = [
  'curious',
  'outgoing',
  'patient',
  'observant',
  'creative',
  'thoughtful',
  'easygoing',
  'witty',
  'kind',
  'warm',
  'calm',
  'fun',
  'adventurous',
  'direct',
  'energetic',
] as const

const HOBBY_OPTIONS = [
  'street food',
  'dim sum',
  'coffee',
  'tea',
  'hiking',
  'photography',
  'art',
  'design',
  'architecture',
  'electronics',
  'makers',
  'jazz',
  'karaoke',
  'history',
  'museums',
  'yoga',
  'running',
] as const

function asArray(input: string | string[] | undefined): string[] {
  if (!input) return []
  return Array.isArray(input) ? input : [input]
}

export default async function BrowsePage({ searchParams }: Props) {
  const sp = await searchParams
  const rawQ = typeof sp.q === 'string' ? sp.q : ''
  // Sanitize free-text search: strip PostgREST .or() metacharacters and cap length.
  const q = rawQ
    .trim()
    .replace(/[,()*]/g, ' ')
    .slice(0, 50)
  const langs = asArray(sp.lang)
  const hobbies = asArray(sp.hobby)
  const traits = asArray(sp.trait)
  const greatOnly = sp.great === '1'
  const withPhoto = sp.with_photo === '1'
  const activeOnly = sp.active === '1'
  const minStarsRaw = Number(sp.min_stars ?? '0')
  const minStars =
    Number.isFinite(minStarsRaw) && minStarsRaw > 0
      ? Math.min(5, Math.floor(minStarsRaw))
      : 0
  const minReviewsRaw = Number(sp.min_reviews ?? '0')
  const minReviews =
    Number.isFinite(minReviewsRaw) && minReviewsRaw > 0
      ? Math.min(1000, Math.floor(minReviewsRaw))
      : 0
  const sort = sp.sort
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: myProfile } = await supabase
    .from('profiles')
    .select('role, city, hobbies, languages, personality_traits')
    .eq('id', user.id)
    .maybeSingle<ProfileForMatching>()

  // Tourist ↔ guide matching only. Without a role we have nothing to match against.
  const oppositeRole: 'guide' | 'tourist' | null =
    myProfile?.role === 'tourist'
      ? 'guide'
      : myProfile?.role === 'guide'
      ? 'tourist'
      : null

  let profiles: ProfileRow[] | null = null
  let error: { message: string } | null = null
  if (oppositeRole) {
    let query = supabase
      .from('profiles')
      .select(
        'id, role, display_name, bio, city, hobbies, languages, personality_traits, avatar_path, updated_at',
      )
      .neq('id', user.id)
      .eq('visibility', 'public')
      .eq('role', oppositeRole)
      .limit(PAGE_LIMIT)

    if (q) {
      query = query.or(`display_name.ilike.%${q}%,bio.ilike.%${q}%`)
    }
    if (langs.length > 0) {
      query = query.overlaps('languages', langs)
    }
    if (hobbies.length > 0) {
      query = query.overlaps('hobbies', hobbies)
    }
    if (traits.length > 0) {
      query = query.overlaps('personality_traits', traits)
    }
    if (withPhoto) {
      query = query.not('avatar_path', 'is', null)
    }
    if (activeOnly) {
      // eslint-disable-next-line react-hooks/purity -- request-time clock is intentional in a Server Component
      const thirtyDaysAgo = new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000,
      ).toISOString()
      query = query.gte('updated_at', thirtyDaysAgo)
    }

    const result = await query
      .order('created_at', { ascending: false })
      .returns<ProfileRow[]>()
    profiles = result.data
    error = result.error
  }

  // Fetch review aggregates for the candidate profiles so we can display +
  // optionally filter by minimum rating.
  const ratings = new Map<string, RatingStats>()
  if (profiles && profiles.length) {
    const { data: reviewRows } = await supabase
      .from('reviews')
      .select('reviewee_id, stars')
      .in(
        'reviewee_id',
        profiles.map((p) => p.id),
      )
      .returns<{ reviewee_id: string; stars: number }[]>()
    const agg = new Map<string, { sum: number; count: number }>()
    for (const r of reviewRows ?? []) {
      const cur = agg.get(r.reviewee_id) ?? { sum: 0, count: 0 }
      cur.sum += r.stars
      cur.count += 1
      agg.set(r.reviewee_id, cur)
    }
    for (const [id, { sum, count }] of agg) {
      ratings.set(id, { avg: sum / count, count })
    }
  }

  let scored = (profiles ?? []).map((p) => ({
    profile: p,
    score: scoreMatch(myProfile, p),
    rating: ratings.get(p.id) ?? null,
  }))

  if (greatOnly) {
    scored = scored.filter(
      (s) =>
        s.score.sharedHobbies.length +
          s.score.sharedLanguages.length +
          s.score.sharedTraits.length >
        0,
    )
  }
  if (minStars > 0) {
    scored = scored.filter((s) => (s.rating?.avg ?? 0) >= minStars)
  }
  if (minReviews > 0) {
    scored = scored.filter((s) => (s.rating?.count ?? 0) >= minReviews)
  }

  const sortByMatch = sort !== 'recent' && sort !== 'rated' && !!myProfile
  if (sort === 'rated') {
    scored.sort(
      (a, b) =>
        (b.rating?.avg ?? 0) - (a.rating?.avg ?? 0) ||
        (b.rating?.count ?? 0) - (a.rating?.count ?? 0),
    )
  } else if (sortByMatch) {
    scored.sort((a, b) => b.score.total - a.score.total)
  }

  const activeCount =
    langs.length +
    hobbies.length +
    traits.length +
    (q ? 1 : 0) +
    (greatOnly ? 1 : 0) +
    (withPhoto ? 1 : 0) +
    (activeOnly ? 1 : 0) +
    (minStars > 0 ? 1 : 0) +
    (minReviews > 0 ? 1 : 0) +
    (sort === 'recent' || sort === 'rated' ? 1 : 0)

  const hasFilters = activeCount > 0

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero banner */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=2000&q=80&auto=format&fit=crop"
          alt="Shenzhen at dusk"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="relative mx-auto flex max-w-5xl flex-col gap-4 px-4 py-12 text-white sm:flex-row sm:items-end sm:justify-between sm:py-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-white/70">
              Discover
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight drop-shadow sm:text-4xl">
              Browse buddies
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/85">
              {myProfile?.role === 'tourist'
                ? `Local guides in Shenzhen — ${sortByMatch ? 'sorted by match with your profile' : 'most recent first'}.`
                : myProfile?.role === 'guide'
                ? `Tourists looking for a buddy — ${sortByMatch ? 'sorted by match with your profile' : 'most recent first'}.`
                : 'Pick a role on your profile to see matches.'}
            </p>
          </div>
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

      <div className="mx-auto w-full max-w-4xl px-4 py-10">

      <AiSuggestedPicks scored={scored.filter((s) => s.score.total > 0).slice(0, 3)} />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <form
          method="GET"
          action="/browse"
          className="flex flex-1 min-w-[200px] items-center gap-1 rounded-full border border-zinc-300 bg-white pl-1 pr-3 text-sm shadow-sm focus-within:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
        >
          <button
            type="submit"
            aria-label="Search"
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search names or bios…"
            className="flex-1 bg-transparent py-1.5 outline-none placeholder:text-zinc-400"
          />
          {/* Preserve other filter state across search submits. */}
          {langs.map((l) => (
            <input key={`q-lang-${l}`} type="hidden" name="lang" value={l} />
          ))}
          {hobbies.map((h) => (
            <input key={`q-hobby-${h}`} type="hidden" name="hobby" value={h} />
          ))}
          {traits.map((t) => (
            <input key={`q-trait-${t}`} type="hidden" name="trait" value={t} />
          ))}
          {greatOnly && <input type="hidden" name="great" value="1" />}
          {withPhoto && <input type="hidden" name="with_photo" value="1" />}
          {activeOnly && <input type="hidden" name="active" value="1" />}
          {minStars > 0 && (
            <input type="hidden" name="min_stars" value={String(minStars)} />
          )}
          {minReviews > 0 && (
            <input type="hidden" name="min_reviews" value={String(minReviews)} />
          )}
          {sort && sort !== 'match' && (
            <input type="hidden" name="sort" value={sort} />
          )}
        </form>
        <FilterDrawer activeCount={activeCount}>
          <form action={applyFilters} className="space-y-5">
            {/* Preserve the current search query across filter applies. */}
            <input type="hidden" name="q" defaultValue={q} />
            <div>
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Languages
                </p>
            <span className="text-xs text-zinc-500">
              {langs.length
                ? `${langs.length} selected — must speak at least one`
                : 'any language'}
            </span>
          </div>
          <ChipGroup
            name="lang"
            options={LANGUAGE_OPTIONS}
            selected={langs}
          />
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Hobbies
            </p>
            <span className="text-xs text-zinc-500">
              {hobbies.length
                ? `${hobbies.length} selected — must enjoy at least one`
                : 'any hobby'}
            </span>
          </div>
          <ChipGroup
            name="hobby"
            options={HOBBY_OPTIONS}
            selected={hobbies}
          />
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Personality traits
            </p>
            <span className="text-xs text-zinc-500">
              {traits.length
                ? `${traits.length} selected — must share at least one vibe`
                : 'any vibe'}
            </span>
          </div>
          <ChipGroup name="trait" options={TRAIT_OPTIONS} selected={traits} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Minimum rating
            </p>
            <span className="text-xs text-zinc-500">
              {minStars > 0
                ? `${minStars}+ stars only`
                : 'any rating'}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { v: 0, label: 'Any' },
              { v: 3, label: '★ 3+' },
              { v: 4, label: '★ 4+' },
              { v: 5, label: '★ 5' },
            ].map((opt) => (
              <label key={opt.v} className="cursor-pointer select-none">
                <input
                  type="radio"
                  name="min_stars"
                  value={String(opt.v)}
                  defaultChecked={minStars === opt.v}
                  className="peer sr-only"
                />
                <span className="inline-block rounded-full border border-zinc-300 px-3 py-1 text-xs transition hover:bg-zinc-50 peer-checked:border-amber-500 peer-checked:bg-amber-50 peer-checked:text-amber-900 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:peer-checked:bg-amber-950 dark:peer-checked:text-amber-200">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
          </div>

          <div>
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Minimum reviews
              </p>
              <span className="text-xs text-zinc-500">
                {minReviews > 0 ? `${minReviews}+ reviews` : 'any count'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { v: 0, label: 'Any' },
                { v: 3, label: '3+ reviews' },
                { v: 10, label: '10+ reviews' },
              ].map((opt) => (
                <label key={opt.v} className="cursor-pointer select-none">
                  <input
                    type="radio"
                    name="min_reviews"
                    value={String(opt.v)}
                    defaultChecked={minReviews === opt.v}
                    className="peer sr-only"
                  />
                  <span className="inline-block rounded-full border border-zinc-300 px-3 py-1 text-xs transition hover:bg-zinc-50 peer-checked:border-amber-500 peer-checked:bg-amber-50 peer-checked:text-amber-900 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:peer-checked:bg-amber-950 dark:peer-checked:text-amber-200">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="great"
              value="1"
              defaultChecked={greatOnly}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 dark:border-zinc-700"
            />
            <span>Great matches only</span>
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="with_photo"
              value="1"
              defaultChecked={withPhoto}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 dark:border-zinc-700"
            />
            <span>With photo</span>
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="active"
              value="1"
              defaultChecked={activeOnly}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 dark:border-zinc-700"
            />
            <span>Active in last 30 days</span>
          </label>

          <label className="ml-auto flex items-center gap-2 text-sm">
            <span className="text-zinc-500">Sort</span>
            <select
              name="sort"
              defaultValue={sort ?? 'match'}
              className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            >
              <option value="match">Best match</option>
              <option value="rated">Highest rated</option>
              <option value="recent">Most recent</option>
            </select>
          </label>
        </div>

            <div className="sticky bottom-0 -mx-6 -mb-5 flex items-center gap-3 border-t border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
              <SubmitButton
                pendingLabel="Applying…"
                className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Apply filters
              </SubmitButton>
              {hasFilters && (
                <Link
                  href="/browse"
                  className="text-sm text-zinc-600 underline dark:text-zinc-400"
                >
                  Reset
                </Link>
              )}
            </div>
          </form>
        </FilterDrawer>
        {hasFilters && (
          <Link
            href="/browse"
            className="text-sm text-zinc-600 underline dark:text-zinc-400"
          >
            Clear all
          </Link>
        )}
        <p className="ml-auto text-xs text-zinc-500">
          {scored.length} {scored.length === 1 ? 'match' : 'matches'}
        </p>
      </div>

      {!myProfile?.role && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          <p>
            <strong>Set your role first.</strong> Tourists match with guides
            and vice versa.{' '}
            <Link href="/profile" className="font-medium underline">
              Go to your profile →
            </Link>
          </p>
        </div>
      )}

      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          Couldn&apos;t load profiles: {error.message}
        </p>
      )}

      {scored.length === 0 && (
        <p className="rounded-lg border border-dashed border-zinc-300 px-6 py-12 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          No matching profiles yet. Try a different filter or invite friends to
          sign up.
        </p>
      )}

      <ul className="grid gap-4 sm:grid-cols-2">
        {scored.map(({ profile: p, score, rating }) => (
          <li
            key={p.id}
            className="group relative rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-start gap-3">
              <Avatar
                src={avatarPublicUrl(p.avatar_path, p.updated_at)}
                name={p.display_name}
                size={48}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/u/${p.id}`}
                    className="min-w-0 flex-1 after:absolute after:inset-0 after:content-['']"
                  >
                    <h2 className="truncate text-lg font-semibold group-hover:underline">
                      {p.display_name}
                    </h2>
                  </Link>
                  <span
                    className={
                      p.role === 'guide'
                        ? 'rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                    }
                  >
                    {p.role === 'guide' ? 'Guide' : 'Tourist'}
                  </span>
                </div>
                <p className="text-xs text-zinc-500">{p.city}</p>
                {rating && rating.count > 0 && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                    <StarRating value={rating.avg} size={12} />
                    <span>
                      {rating.avg.toFixed(1)} · {rating.count}
                    </span>
                  </div>
                )}
                {myProfile && <MatchBadge score={score} />}
              </div>
            </div>

            {p.bio && (
              <p className="mt-2 line-clamp-3 text-sm text-zinc-700 dark:text-zinc-300">
                {p.bio}
              </p>
            )}

            <Chips label="Hobbies" items={p.hobbies} highlight={score.sharedHobbies} />
            <Chips label="Languages" items={p.languages} highlight={score.sharedLanguages} />
            <Chips label="Traits" items={p.personality_traits} highlight={score.sharedTraits} />

            <form action={startConversationWith} className="relative z-10 mt-4">
              <input type="hidden" name="other_id" value={p.id} />
              <SubmitButton
                pendingLabel="Opening…"
                className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Message
              </SubmitButton>
            </form>
          </li>
        ))}
      </ul>
      </div>
    </main>
  )
}

function ChipGroup({
  name,
  options,
  selected,
}: {
  name: string
  options: readonly string[]
  selected: string[]
}) {
  const set = new Set(selected.map((s) => s.toLowerCase()))
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <label key={opt} className="cursor-pointer select-none">
          <input
            type="checkbox"
            name={name}
            value={opt}
            defaultChecked={set.has(opt.toLowerCase())}
            className="peer sr-only"
          />
          <span className="inline-block rounded-full border border-zinc-300 px-3 py-1 text-xs transition hover:bg-zinc-50 peer-checked:border-zinc-900 peer-checked:bg-zinc-900 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-amber-400 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:peer-checked:border-white dark:peer-checked:bg-white dark:peer-checked:text-zinc-900">
            {opt}
          </span>
        </label>
      ))}
    </div>
  )
}

function AiSuggestedPicks({
  scored,
}: {
  scored: { profile: ProfileRow; score: MatchScore; rating: RatingStats | null }[]
}) {
  if (scored.length === 0) return null
  return (
    <section className="mb-8 overflow-hidden rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50 via-white to-rose-50 p-6 shadow-sm dark:border-amber-900/30 dark:from-amber-950/30 dark:via-zinc-900 dark:to-rose-950/30">
      <div className="mb-4 flex items-center gap-3">
        <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 text-white shadow-sm">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
            <path d="M12 2l1.6 4.4 4.4 1.6-4.4 1.6L12 14l-1.6-4.4L6 8l4.4-1.6zM19.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
          </svg>
        </span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            AI suggested
          </p>
          <p className="text-sm font-semibold">
            Your best matches in Shenzhen, hand-picked.
          </p>
        </div>
      </div>

      <ul className="grid gap-4 sm:grid-cols-3">
        {scored.map(({ profile: p, score, rating }) => (
          <li
            key={p.id}
            className="group relative flex flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-start gap-3">
              <Avatar
                src={avatarPublicUrl(p.avatar_path, p.updated_at)}
                name={p.display_name}
                size={56}
              />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/u/${p.id}`}
                  className="block truncate text-sm font-semibold group-hover:underline after:absolute after:inset-0 after:content-['']"
                >
                  {p.display_name}
                </Link>
                <p className="truncate text-xs text-zinc-500">
                  {p.city} · {p.role === 'guide' ? 'Guide' : 'Tourist'}
                </p>
                {rating && rating.count > 0 && (
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-600 dark:text-zinc-400">
                    <StarRating value={rating.avg} size={11} />
                    <span>{rating.avg.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
            <p className="mt-3 flex-1 text-sm text-zinc-700 dark:text-zinc-300">
              {describeMatch(score)}
            </p>
            <form action={startConversationWith} className="relative z-10 mt-4">
              <input type="hidden" name="other_id" value={p.id} />
              <SubmitButton
                pendingLabel="Opening…"
                className="w-full rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Message
              </SubmitButton>
            </form>
          </li>
        ))}
      </ul>
    </section>
  )
}

function describeMatch(score: MatchScore): string {
  const parts: string[] = []
  if (score.sharedLanguages.length > 0) {
    parts.push(`speaks ${formatList(score.sharedLanguages.slice(0, 2))}`)
  }
  if (score.sharedHobbies.length > 0) {
    parts.push(`into ${formatList(score.sharedHobbies.slice(0, 2))}`)
  }
  if (score.sharedTraits.length > 0 && parts.length < 2) {
    parts.push(`feels ${formatList(score.sharedTraits.slice(0, 2))}`)
  }
  if (score.sameCity) {
    parts.push('in your city')
  }
  if (parts.length === 0) return 'A solid all-round match.'
  return 'Why: ' + parts.join(' · ')
}

function formatList(items: string[]): string {
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]
  return items.join(' & ')
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
    <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
      <span aria-hidden>✦</span>
      {bits.join(' · ') || 'match'}
    </p>
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
    <div className="mt-3">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {items.slice(0, 8).map((it) => {
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
