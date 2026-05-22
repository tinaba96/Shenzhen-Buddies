import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Avatar } from '@/components/Avatar'
import { SubmitButton } from '@/components/SubmitButton'
import { avatarPublicUrl } from '@/lib/avatars'
import { scoreMatch, type MatchScore, type ProfileForMatching } from '@/lib/matching'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { startConversationWith } from '@/app/messages/actions'

type Props = {
  searchParams: Promise<{
    lang?: string | string[]
    hobby?: string | string[]
    great?: string
    sort?: string
  }>
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
  avatar_path: string | null
  updated_at: string
}

const PAGE_LIMIT = 50

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
  const langs = asArray(sp.lang)
  const hobbies = asArray(sp.hobby)
  const greatOnly = sp.great === '1'
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

    if (langs.length > 0) {
      query = query.overlaps('languages', langs)
    }
    if (hobbies.length > 0) {
      query = query.overlaps('hobbies', hobbies)
    }

    const result = await query
      .order('created_at', { ascending: false })
      .returns<ProfileRow[]>()
    profiles = result.data
    error = result.error
  }

  const sortByMatch = sort !== 'recent' && !!myProfile
  let scored = (profiles ?? []).map((p) => ({
    profile: p,
    score: scoreMatch(myProfile, p),
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
  if (sortByMatch) {
    scored.sort((a, b) => b.score.total - a.score.total)
  }

  const hasFilters = langs.length > 0 || hobbies.length > 0 || greatOnly || sort === 'recent'

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

      <form
        method="GET"
        className="mb-6 space-y-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
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

        <div className="flex flex-wrap items-center gap-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="great"
              value="1"
              defaultChecked={greatOnly}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 dark:border-zinc-700"
            />
            <span>Only great matches (shared interests)</span>
          </label>

          <label className="ml-auto flex items-center gap-2 text-sm">
            <span className="text-zinc-500">Sort</span>
            <select
              name="sort"
              defaultValue={sort ?? 'match'}
              className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            >
              <option value="match">Best match</option>
              <option value="recent">Most recent</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Apply filters
          </button>
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
      </form>

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
        {scored.map(({ profile: p, score }) => (
          <li
            key={p.id}
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-start gap-3">
              <Avatar
                src={avatarPublicUrl(p.avatar_path, p.updated_at)}
                name={p.display_name}
                size={48}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/u/${p.id}`} className="min-w-0 flex-1">
                    <h2 className="truncate text-lg font-semibold hover:underline">
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

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                href={`/u/${p.id}`}
                className="rounded-md border border-zinc-300 px-3 py-2 text-center text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                View profile
              </Link>
              <form action={startConversationWith}>
                <input type="hidden" name="other_id" value={p.id} />
                <SubmitButton
                  pendingLabel="Opening…"
                  className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Message
                </SubmitButton>
              </form>
            </div>
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
  scored: { profile: ProfileRow; score: MatchScore }[]
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
        {scored.map(({ profile: p, score }) => (
          <li
            key={p.id}
            className="flex flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
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
                  className="block truncate text-sm font-semibold hover:underline"
                >
                  {p.display_name}
                </Link>
                <p className="truncate text-xs text-zinc-500">
                  {p.city} · {p.role === 'guide' ? 'Guide' : 'Tourist'}
                </p>
              </div>
            </div>
            <p className="mt-3 flex-1 text-sm text-zinc-700 dark:text-zinc-300">
              {describeMatch(score)}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                href={`/u/${p.id}`}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-center text-xs font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                View
              </Link>
              <form action={startConversationWith}>
                <input type="hidden" name="other_id" value={p.id} />
                <SubmitButton
                  pendingLabel="Opening…"
                  className="w-full rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Message
                </SubmitButton>
              </form>
            </div>
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
