import { StarRating } from '@/components/StarRating'
import type { ReviewSummary as Summary } from '@/lib/review-summary'

// "★★★★☆ 4.5 · 👍 12 · 14 reviews" — the star part only when someone gave
// stars, the thumbs part only when someone gave a thumb up. Labels arrive
// already translated and filled by the server parent.
export function ReviewSummary({
  summary,
  starsLabel,
  thumbsLabel,
  countLabel,
  sep,
  size = 16,
  className,
}: {
  summary: Summary
  starsLabel: string
  thumbsLabel: string
  countLabel: string
  sep: string
  size?: number
  className?: string
}) {
  const parts: React.ReactNode[] = []
  if (summary.rated > 0) {
    parts.push(
      <span key="stars" className="inline-flex items-center gap-1.5">
        <StarRating value={summary.avgStars} size={size} label={starsLabel} />
        {summary.avgStars.toFixed(1)}
      </span>,
    )
  }
  if (summary.thumbsUp > 0) {
    parts.push(
      <span key="thumbs" role="img" aria-label={thumbsLabel}>
        👍 {summary.thumbsUp}
      </span>,
    )
  }
  parts.push(<span key="count">{countLabel}</span>)
  return (
    <span className={`inline-flex flex-wrap items-center ${className ?? ''}`}>
      {parts.map((p, i) => (
        <span key={i} className="inline-flex items-center">
          {/* Its own pre-wrapped span: as bare text in a flex row, the
              spaces around " · " would collapse. */}
          {i > 0 && <span className="whitespace-pre">{sep}</span>}
          {p}
        </span>
      ))}
    </span>
  )
}
