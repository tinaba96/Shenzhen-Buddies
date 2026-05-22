import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type Props = {
  searchParams: Promise<{ role?: string; city?: string }>
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
}

const PAGE_LIMIT = 50

export default async function BrowsePage({ searchParams }: Props) {
  const { role, city } = await searchParams
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let query = supabase
    .from('profiles')
    .select('id, role, display_name, bio, city, hobbies, languages, personality_traits')
    .neq('id', user.id)
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .limit(PAGE_LIMIT)

  if (role === 'guide' || role === 'tourist') {
    query = query.eq('role', role)
  }
  if (city && city.trim()) {
    query = query.ilike('city', `%${city.trim()}%`)
  }

  const { data: profiles, error } = await query.returns<ProfileRow[]>()

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Browse buddies</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Public profiles in the network.
          </p>
        </div>
        <Link
          href="/profile"
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Your profile
        </Link>
      </div>

      <form method="GET" className="mb-6 flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Role
          </span>
          <select
            name="role"
            defaultValue={role ?? ''}
            className="mt-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          >
            <option value="">All</option>
            <option value="guide">Guides</option>
            <option value="tourist">Tourists</option>
          </select>
        </label>

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

        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Filter
        </button>
        {(role || city) && (
          <Link
            href="/browse"
            className="text-sm text-zinc-600 underline dark:text-zinc-400"
          >
            Clear
          </Link>
        )}
      </form>

      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          Couldn&apos;t load profiles: {error.message}
        </p>
      )}

      {profiles && profiles.length === 0 && (
        <p className="rounded-lg border border-dashed border-zinc-300 px-6 py-12 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          No matching profiles yet. Try a different filter or invite friends to
          sign up.
        </p>
      )}

      <ul className="grid gap-4 sm:grid-cols-2">
        {profiles?.map((p) => (
          <li
            key={p.id}
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-lg font-semibold">{p.display_name}</h2>
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

            {p.bio && (
              <p className="mt-2 line-clamp-3 text-sm text-zinc-700 dark:text-zinc-300">
                {p.bio}
              </p>
            )}

            <Chips label="Hobbies" items={p.hobbies} />
            <Chips label="Languages" items={p.languages} />
            <Chips label="Traits" items={p.personality_traits} />
          </li>
        ))}
      </ul>
    </main>
  )
}

function Chips({ label, items }: { label: string; items: string[] }) {
  if (!items || items.length === 0) return null
  return (
    <div className="mt-3">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {items.slice(0, 8).map((it) => (
          <span
            key={it}
            className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  )
}
