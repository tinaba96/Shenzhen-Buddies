'use server'

import { redirect } from 'next/navigation'

// Builds the /browse URL from a FormData payload and redirects.
// Used by the filter drawer so the existing <SubmitButton> can show
// useFormStatus pending state (GET forms don't pair with useFormStatus).
export async function applyFilters(formData: FormData) {
  const params = new URLSearchParams()

  for (const value of formData.getAll('lang')) {
    if (typeof value === 'string' && value) params.append('lang', value)
  }
  for (const value of formData.getAll('hobby')) {
    if (typeof value === 'string' && value) params.append('hobby', value)
  }
  for (const value of formData.getAll('trait')) {
    if (typeof value === 'string' && value) params.append('trait', value)
  }

  if (formData.get('great') === '1') params.set('great', '1')
  if (formData.get('with_photo') === '1') params.set('with_photo', '1')
  if (formData.get('active') === '1') params.set('active', '1')

  const minStars = formData.get('min_stars')
  if (typeof minStars === 'string' && minStars !== '' && minStars !== '0') {
    params.set('min_stars', minStars)
  }

  const minReviews = formData.get('min_reviews')
  if (typeof minReviews === 'string' && minReviews !== '' && minReviews !== '0') {
    params.set('min_reviews', minReviews)
  }

  const sort = formData.get('sort')
  if (typeof sort === 'string' && sort && sort !== 'match') {
    params.set('sort', sort)
  }

  // Preserve free-text search across filter applies.
  const q = formData.get('q')
  if (typeof q === 'string' && q.trim()) {
    params.set('q', q.trim())
  }

  const qs = params.toString()
  redirect(qs ? `/browse?${qs}` : '/browse')
}
