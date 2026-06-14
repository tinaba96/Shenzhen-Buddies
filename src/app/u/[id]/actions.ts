'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function submitReview(formData: FormData) {
  const revieweeId = String(formData.get('reviewee_id') ?? '').trim()
  const starsRaw = String(formData.get('stars') ?? '').trim()
  const bodyRaw = String(formData.get('body') ?? '')

  if (!revieweeId) {
    redirect('/browse?error=missing_user')
  }

  const stars = Number.parseInt(starsRaw, 10)
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    redirect(`/u/${revieweeId}?error=${encodeURIComponent('Pick between 1 and 5 stars.')}`)
  }

  const trimmed = bodyRaw.trim()
  const body = trimmed.length === 0 ? null : trimmed.slice(0, 5000)

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  if (user.id === revieweeId) {
    redirect(`/u/${revieweeId}?error=${encodeURIComponent("You can't review yourself.")}`)
  }

  const { error } = await supabase
    .from('reviews')
    .upsert(
      {
        reviewer_id: user.id,
        reviewee_id: revieweeId,
        stars,
        body,
      },
      { onConflict: 'reviewer_id,reviewee_id' },
    )

  if (error) {
    redirect(`/u/${revieweeId}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath(`/u/${revieweeId}`)
  redirect(`/u/${revieweeId}?reviewed=1`)
}
