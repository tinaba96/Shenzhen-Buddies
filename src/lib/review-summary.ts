// A guide's review totals, shared by /guide and /u/[id]. Since migration 0021
// a review has a thumb, optional stars, or both: the star average counts only
// reviews that gave stars, and thumbs up are counted on their own.

export type ReviewRating = {
  stars: number | null
  thumb: 'up' | 'down' | null
}

export type ReviewSummary = {
  count: number
  rated: number
  avgStars: number
  thumbsUp: number
}

export function summarizeReviews(rows: ReviewRating[]): ReviewSummary {
  let sum = 0
  let rated = 0
  let thumbsUp = 0
  for (const r of rows) {
    if (r.stars != null) {
      sum += r.stars
      rated += 1
    }
    if (r.thumb === 'up') thumbsUp += 1
  }
  return {
    count: rows.length,
    rated,
    avgStars: rated > 0 ? sum / rated : 0,
    thumbsUp,
  }
}
