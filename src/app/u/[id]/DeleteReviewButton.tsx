'use client'

import { SubmitButton } from '@/components/SubmitButton'
import { deleteReview } from './actions'

// Shown to admins only (the page decides). English like the rest of the admin
// controls. The confirm is the only guard against a slip: a deleted review
// cannot be brought back.
export function DeleteReviewButton({
  reviewId,
  revieweeId,
}: {
  reviewId: string
  revieweeId: string
}) {
  return (
    <form
      action={deleteReview}
      onSubmit={(e) => {
        if (!window.confirm('Delete this review? This cannot be undone.')) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name="review_id" value={reviewId} />
      <input type="hidden" name="reviewee_id" value={revieweeId} />
      <SubmitButton
        pendingLabel="Deleting…"
        className="rounded-md border border-red-300 px-2 py-0.5 text-xs font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
      >
        Delete
      </SubmitButton>
    </form>
  )
}
