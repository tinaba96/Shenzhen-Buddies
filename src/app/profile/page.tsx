import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Avatar } from '@/components/Avatar'
import { SubmitButton } from '@/components/SubmitButton'
import { avatarPublicUrl } from '@/lib/avatars'
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
  avatar_path: string | null
  updated_at: string
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
    <main className="flex flex-1 flex-col">
      {/* Cover banner */}
      <section className="relative h-48 overflow-hidden sm:h-56">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=2000&q=80&auto=format&fit=crop"
          alt="Skyline at golden hour"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 via-rose-500/20 to-black/50" />
        <div className="relative mx-auto flex max-w-3xl items-start justify-end gap-2 px-4 py-4">
          {profile && (
            <Link
              href={`/u/${user.id}`}
              className="rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur hover:bg-white/20"
            >
              View public profile
            </Link>
          )}
          <form action={signOut}>
            <SubmitButton
              pendingLabel="Signing out…"
              className="rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur hover:bg-white/20"
            >
              Sign out
            </SubmitButton>
          </form>
        </div>
      </section>

      <div className="mx-auto w-full max-w-2xl px-4 pb-16">
        {/* Identity header — overlaps the cover */}
        <div className="-mt-14 flex items-end gap-4 sm:-mt-16">
          <Avatar
            src={avatarPublicUrl(profile?.avatar_path, profile?.updated_at)}
            name={profile?.display_name}
            size={104}
            className="ring-4 ring-white shadow-lg dark:ring-zinc-900"
          />
          <div className="min-w-0 flex-1 pb-2">
            <h1 className="truncate text-2xl font-semibold">
              {profile?.display_name || 'Your profile'}
            </h1>
            <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
              {user.email}
            </p>
          </div>
        </div>

        {/* Banners */}
        {saved && (
          <p className="mt-6 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            Profile saved.
          </p>
        )}
        {error && (
          <p className="mt-6 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
            {error}
          </p>
        )}
        {!profile && (
          <p className="mt-6 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            Welcome — fill this out and you&apos;ll appear on the Browse page
            for matching.
          </p>
        )}

        <form action={saveProfile} className="mt-8 space-y-8">
          {/* Photo + role + display name */}
          <FormSection
            title="The basics"
            description="What people see first when they find your profile."
          >
            <label className="block">
              <span className="text-sm font-medium">Profile photo</span>
              <div className="mt-2 flex items-center gap-4">
                <Avatar
                  src={avatarPublicUrl(profile?.avatar_path, profile?.updated_at)}
                  name={profile?.display_name}
                  size={56}
                />
                <input
                  type="file"
                  name="avatar"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-700 dark:file:bg-white dark:file:text-zinc-900 dark:hover:file:bg-zinc-200"
                />
              </div>
              <span className="mt-1 block text-xs text-zinc-500">
                JPG, PNG, WebP, or GIF. Max 5 MB.
              </span>
            </label>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">I am a…</legend>
              <div className="grid grid-cols-2 gap-3">
                <RolePill
                  value="tourist"
                  label="Tourist"
                  description="Visiting Shenzhen"
                  tone="sky"
                  defaultChecked={profile?.role === 'tourist' || !profile}
                />
                <RolePill
                  value="guide"
                  label="Guide"
                  description="Local who shows people around"
                  tone="emerald"
                  defaultChecked={profile?.role === 'guide'}
                />
              </div>
            </fieldset>

            <label className="block">
              <span className="text-sm font-medium">Display name</span>
              <input
                type="text"
                name="display_name"
                required
                defaultValue={profile?.display_name ?? ''}
                placeholder="What people should call you"
                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">City</span>
              <input
                type="text"
                name="city"
                defaultValue={profile?.city ?? 'Shenzhen'}
                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Bio</span>
              <textarea
                name="bio"
                rows={4}
                defaultValue={profile?.bio ?? ''}
                placeholder="A sentence or two about you. What kind of day would you like to share?"
                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
              />
            </label>
          </FormSection>

          {/* Interests */}
          <FormSection
            title="Your interests"
            description="Used for matching. Separate items with commas."
          >
            <TagsField
              name="hobbies"
              label="Hobbies"
              placeholder="hiking, photography, street food, jazz"
              defaultValue={profile?.hobbies?.join(', ') ?? ''}
            />
            <TagsField
              name="languages"
              label="Languages"
              placeholder="English, Mandarin, Italian"
              defaultValue={profile?.languages?.join(', ') ?? ''}
            />
            <TagsField
              name="personality_traits"
              label="Personality traits"
              placeholder="curious, outgoing, easygoing"
              defaultValue={profile?.personality_traits?.join(', ') ?? ''}
            />
          </FormSection>

          {/* Privacy */}
          <FormSection
            title="Privacy"
            description="Who can see your profile in Browse and on /u/[id]."
          >
            <fieldset className="space-y-2">
              <legend className="sr-only">Visibility</legend>
              <div className="grid grid-cols-2 gap-3">
                <RolePill
                  name="visibility"
                  value="public"
                  label="Public"
                  description="Anyone signed in can find you"
                  tone="emerald"
                  defaultChecked={profile?.visibility !== 'private'}
                />
                <RolePill
                  name="visibility"
                  value="private"
                  label="Private"
                  description="Only you can see your profile"
                  tone="zinc"
                  defaultChecked={profile?.visibility === 'private'}
                />
              </div>
            </fieldset>
          </FormSection>

          <SubmitButton
            pendingLabel="Saving…"
            className="w-full rounded-full bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {profile ? 'Save changes' : 'Create profile'}
          </SubmitButton>
        </form>
      </div>
    </main>
  )
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 border-b border-zinc-100 pb-3 dark:border-zinc-800">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  )
}

function TagsField({
  name,
  label,
  placeholder,
  defaultValue,
}: {
  name: string
  label: string
  placeholder: string
  defaultValue?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <span className="ml-1 text-xs text-zinc-500">(comma-separated)</span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
      />
    </label>
  )
}

function RolePill({
  name = 'role',
  value,
  label,
  description,
  tone,
  defaultChecked,
}: {
  name?: string
  value: string
  label: string
  description: string
  tone: 'sky' | 'emerald' | 'zinc'
  defaultChecked?: boolean
}) {
  const ringTone = {
    sky: 'has-[:checked]:border-sky-500 has-[:checked]:ring-sky-200 dark:has-[:checked]:ring-sky-900',
    emerald:
      'has-[:checked]:border-emerald-500 has-[:checked]:ring-emerald-200 dark:has-[:checked]:ring-emerald-900',
    zinc: 'has-[:checked]:border-zinc-900 has-[:checked]:ring-zinc-200 dark:has-[:checked]:border-white dark:has-[:checked]:ring-zinc-700',
  }[tone]

  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 bg-white p-3 ring-0 transition has-[:checked]:ring-4 dark:border-zinc-800 dark:bg-zinc-950 ${ringTone}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="mt-0.5"
      />
      <span className="block">
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-zinc-500">{description}</span>
      </span>
    </label>
  )
}
