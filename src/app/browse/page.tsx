import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Avatar } from '@/components/Avatar'
import { SubmitButton } from '@/components/SubmitButton'
import { avatarPublicUrl } from '@/lib/avatars'
import { scoreMatch, type MatchScore, type ProfileForMatching } from '@/lib/matching'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { startConversationWith } from '@/app/messages/actions'

type Props = {
  searchParams: Promise<{ city?: string; sort?: string }>
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

export default async function BrowsePage({ searchParams }: Props) {
  const { city, sort } = await searchParams
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

    if (city && city.trim()) {
      query = query.ilike('city', `%${city.trim()}%`)
    }

    const result = await query
      .order('created_at', { ascending: false })
      .returns<ProfileRow[]>()
    profiles = result.data
    error = result.error
  }

  const sortByMatch = sort !== 'recent' && !!myProfile
  const scored = (profiles ?? []).map((p) => ({
    profile: p,
    score: scoreMatch(myProfile, p),
  }))
  if (sortByMatch) {
    scored.sort((a, b) => b.score.total - a.score.total)
  }

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

      <form method="GET" className="mb-6 flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            City
          </span>
          <input
            type="text"
            name="city"
            defaultValue={city ?? ''}
            placeholder="Shenzhen"
            className="mt-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>

        <label className="block">
          <span className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Sort
          </span>
          <select
            name="sort"
            defaultValue={sort ?? 'match'}
            className="mt-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          >
            <option value="match">Best match</option>
            <option value="recent">Most recent</option>
          </select>
        </label>

        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Filter
        </button>
        {(city || sort) && (
          <Link
            href="/browse"
            className="text-sm text-zinc-600 underline dark:text-zinc-400"
          >
            Clear
          </Link>
        )}
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
