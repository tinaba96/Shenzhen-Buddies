'use server'

import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import { getI18n } from '@/i18n/server'
import { isAdminEmail } from '@/lib/config'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function submitReview(formData: FormData) {
  const revieweeId = String(formData.get('reviewee_id') ?? '').trim()
  const starsRaw = String(formData.get('stars') ?? '').trim()
  const bodyRaw = String(formData.get('body') ?? '')

  if (!revieweeId) {
    redirect('/browse?error=missing_user')
  }

  // Errors travel to the page as display text in ?error=, so they are
  // written in the visitor's language here.
  const { t } = await getI18n()

  const stars = Number.parseInt(starsRaw, 10)
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    redirect(`/u/${revieweeId}?error=${encodeURIComponent(t.buddy.errors.stars)}`)
  }

  const trimmed = bodyRaw.trim()
  const body = trimmed.length === 0 ? null : trimmed.slice(0, 5000)

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  // /u/[id] is a public preview for guide profiles — gate the write here.
  if (!user) redirect(`/login?next=${encodeURIComponent(`/u/${revieweeId}`)}`)

  if (user.id === revieweeId) {
    redirect(`/u/${revieweeId}?error=${encodeURIComponent(t.buddy.errors.self)}`)
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
    // 42501 = RLS check failed: the reviewer isn't eligible yet (no confirmed
    // booking and no message history). Show a clear message instead of the
    // raw database error. Anything else is logged and shown generically —
    // Postgres's English is not something to put in front of a visitor.
    const rls =
      error.code === '42501' ||
      error.message.toLowerCase().includes('row-level security')
    if (!rls) console.error('Review upsert failed:', error)
    const friendly = rls ? t.buddy.errors.notYet : t.buddy.errors.generic
    redirect(`/u/${revieweeId}?error=${encodeURIComponent(friendly)}`)
  }

  revalidatePath(`/u/${revieweeId}`)
  redirect(`/u/${revieweeId}?reviewed=1`)
}

// Admin-only "Delete" on a review. Reviews go live without approval (post-tour
// page, the open /review link, this page), so this is how an inappropriate
// one comes down. The reviewer's account is left alone.
export async function deleteReview(formData: FormData) {
  const reviewId = String(formData.get('review_id') ?? '').trim()
  const revieweeId = String(formData.get('reviewee_id') ?? '').trim()

  if (!reviewId || !revieweeId) notFound()

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=${encodeURIComponent(`/u/${revieweeId}`)}`)
  if (!isAdminEmail(user.email)) notFound()

  // Service role: RLS only lets reviewers touch their own rows. Matching on
  // reviewee too keeps a stale form from deleting a review on another page.
  const admin = createSupabaseAdminClient()
  const { data: deleted, error } = await admin
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('reviewee_id', revieweeId)
    .select('id, reviewer_id, thumb, stars')
  if (error) {
    console.error('Review delete failed:', error)
    redirect(`/u/${revieweeId}?error=${encodeURIComponent('Could not delete the review. Check the Vercel logs.')}`)
  }
  // Already gone (deleted in another tab, or the page was stale).
  if (!deleted?.length) {
    redirect(`/u/${revieweeId}?error=${encodeURIComponent('That review was already deleted.')}`)
  }
  // Who removed which review, in the Vercel logs (kept only briefly). The
  // text itself is not copied there.
  console.info('Admin deleted review', { by: user.email, revieweeId, review: deleted[0] })

  revalidatePath('/guide')
  revalidatePath(`/u/${revieweeId}`)
  redirect(`/u/${revieweeId}?review_deleted=1`)
}
