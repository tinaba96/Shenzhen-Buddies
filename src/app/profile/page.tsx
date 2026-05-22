import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { saveProfile, signOut } from './actions'

type Props = {
  searchParams: Promise<{ error?: string; saved?: string }>
}

type Profile = {
  id: string
  role: 'guide' | 'tourist'
  display_name: string
  bio: string | null
  city: string
  hobbies: string[]
  languages: string[]
  personality_traits: string[]
  visibility: 'public' | 'private'
}

export default async function ProfilePage({ searchParams }: Props) {
  const { error, saved } = await searchParams
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle<Profile>()

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Your profile</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/browse"
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Browse
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      {saved && (
        <p className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          Profile saved.
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          {error}
        </p>
      )}

      <form
        action={saveProfile}
        className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">I am a…</legend>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="role"
                value="tourist"
                required
                defaultChecked={profile?.role === 'tourist' || !profile}
              />
              Tourist
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="role"
                value="guide"
                defaultChecked={profile?.role === 'guide'}
              />
              Guide
            </label>
          </div>
        </fieldset>

        <label className="block">
          <span className="text-sm font-medium">Display name</span>
          <input
            type="text"
            name="display_name"
            required
            defaultValue={profile?.display_name ?? ''}
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">City</span>
          <input
            type="text"
            name="city"
            defaultValue={profile?.city ?? 'Shenzhen'}
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Bio</span>
          <textarea
            name="bio"
            rows={3}
            defaultValue={profile?.bio ?? ''}
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Hobbies</span>
          <span className="ml-1 text-xs text-zinc-500">(comma-separated)</span>
          <input
            type="text"
            name="hobbies"
            defaultValue={profile?.hobbies?.join(', ') ?? ''}
            placeholder="hiking, photography, street food"
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Languages</span>
          <span className="ml-1 text-xs text-zinc-500">(comma-separated)</span>
          <input
            type="text"
            name="languages"
            defaultValue={profile?.languages?.join(', ') ?? ''}
            placeholder="English, Mandarin"
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Personality traits</span>
          <span className="ml-1 text-xs text-zinc-500">(comma-separated)</span>
          <input
            type="text"
            name="personality_traits"
            defaultValue={profile?.personality_traits?.join(', ') ?? ''}
            placeholder="curious, outgoing, easygoing"
            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Visibility</legend>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="visibility"
                value="public"
                defaultChecked={profile?.visibility !== 'private'}
              />
              Public
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="visibility"
                value="private"
                defaultChecked={profile?.visibility === 'private'}
              />
              Private
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {profile ? 'Save changes' : 'Create profile'}
        </button>
      </form>
    </main>
  )
}
