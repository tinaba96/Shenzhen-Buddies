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

  const role = String(formData.get('role') ?? '')
  if (role !== 'guide' && role !== 'tourist') {
    redirect('/profile?error=invalid_role')
  }

  const visibility = String(formData.get('visibility') ?? 'public')
  if (visibility !== 'public' && visibility !== 'private') {
    redirect('/profile?error=invalid_visibility')
  }

  let uploadedAvatarPath: string | null = null
  const avatar = formData.get('avatar')
  if (avatar instanceof File && avatar.size > 0) {
    if (avatar.size > MAX_AVATAR_BYTES) {
      redirect('/profile?error=avatar_too_large')
    }
    const ext = MIME_TO_EXT[avatar.type]
    if (!ext) {
      redirect('/profile?error=avatar_type_unsupported')
    }
    const path = `${user.id}/avatar.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, avatar, {
        contentType: avatar.type,
        upsert: true,
      })
    if (uploadError) {
      redirect(`/profile?error=${encodeURIComponent(uploadError.message)}`)
    }
    uploadedAvatarPath = path
  }

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
