'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const MAX_AVATAR_BYTES = 5 * 1024 * 1024
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

function parseList(input: FormDataEntryValue | null): string[] {
  if (!input) return []
  return String(input)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export async function saveProfile(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Role is not user-selectable during the single-guide beta. Preserve an
  // existing role (so the official guide stays a guide) and default everyone
  // else to tourist.
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle<{ role: string }>()
  const role = existingProfile?.role === 'guide' ? 'guide' : 'tourist'

  const visibility = String(formData.get('visibility') ?? 'public')
  if (visibility !== 'public' && visibility !== 'private') {
    redirect('/profile?error=invalid_visibility')
  }

  // Upload avatar and/or cover image (both live in the public "avatars"
  // bucket, namespaced by user id so the per-folder storage policy applies).
  async function uploadImage(
    kind: 'avatar' | 'cover',
  ): Promise<string | null> {
    const file = formData.get(kind)
    if (!(file instanceof File) || file.size === 0) return null
    if (file.size > MAX_AVATAR_BYTES) {
      redirect(`/profile?error=${kind}_too_large`)
    }
    const ext = MIME_TO_EXT[file.type]
    if (!ext) {
      redirect(`/profile?error=${kind}_type_unsupported`)
    }
    const path = `${user!.id}/${kind}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { contentType: file.type, upsert: true })
    if (uploadError) {
      redirect(`/profile?error=${encodeURIComponent(uploadError.message)}`)
    }
    return path
  }

  const uploadedAvatarPath = await uploadImage('avatar')
  const uploadedCoverPath = await uploadImage('cover')

  const profile: Record<string, unknown> = {
    id: user.id,
    role,
    display_name: String(formData.get('display_name') ?? '').trim(),
    bio: String(formData.get('bio') ?? '').trim() || null,
    city: String(formData.get('city') ?? 'Shenzhen').trim() || 'Shenzhen',
    hobbies: parseList(formData.get('hobbies')),
    languages: parseList(formData.get('languages')),
    personality_traits: parseList(formData.get('personality_traits')),
    visibility,
  }
  if (uploadedAvatarPath) {
    profile.avatar_path = uploadedAvatarPath
  }
  if (uploadedCoverPath) {
    profile.cover_path = uploadedCoverPath
  }

  if (!profile.display_name) {
    redirect('/profile?error=display_name_required')
  }

  const { error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' })

  if (error) {
    redirect(`/profile?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/profile')
  redirect('/profile?saved=1')
}

export async function signOut() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
