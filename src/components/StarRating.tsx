'use client'

import { useId, useState } from 'react'

type DisplayProps = {
  value: number
  size?: number
  className?: string
  // Already-translated accessible label (t.stars.outOf filled by the server
  // parent). Falls back to English for callers that have not been localized.
  label?: string
}

type InputProps = {
  name: string
  defaultValue?: number
  size?: number
  className?: string
  // Per-star button labels with an {n} placeholder (t.stars.starOne /
  // t.stars.starOther). Filled here rather than imported, so no dictionary
  // lands in the client bundle.
  labels?: { one: string; other: string }
}

const STAR_PATH =
  'M12 2.5l2.92 6.01 6.58.95-4.76 4.65 1.12 6.55L12 17.77l-5.86 3.09 1.12-6.55L2.5 9.46l6.58-.95L12 2.5z'

export function StarRating({ value, size = 16, className, label }: DisplayProps) {
  const clamped = Math.max(0, Math.min(5, value))
  const stars = [0, 1, 2, 3, 4]
  return (
    <span
      role="img"
      aria-label={label ?? `${clamped.toFixed(1)} out of 5`}
      className={`inline-flex items-center gap-0.5 ${className ?? ''}`}
    >
      {stars.map((i) => {
        const fill = Math.max(0, Math.min(1, clamped - i))
        return <StaticStar key={i} fillRatio={fill} size={size} />
      })}
    </span>
  )
}

function StaticStar({ fillRatio, size }: { fillRatio: number; size: number }) {
  const clipId = useId()
  const pct = Math.round(fillRatio * 100)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      className="flex-shrink-0"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={(pct / 100) * 24} height="24" />
        </clipPath>
      </defs>
      <path
        d={STAR_PATH}
        className="fill-zinc-200 dark:fill-zinc-700"
      />
      <path
        d={STAR_PATH}
        clipPath={`url(#${clipId})`}
        className="fill-amber-400"
      />
    </svg>
  )
}

export function StarRatingInput({
  name,
  defaultValue = 0,
  size = 28,
  className,
  labels,
}: InputProps) {
  const [value, setValue] = useState<number>(defaultValue)
  const [hover, setHover] = useState<number>(0)
  const shown = hover || value
  return (
    <span
      className={`inline-flex items-center gap-1 ${className ?? ''}`}
      onMouseLeave={() => setHover(0)}
    >
      <input type="hidden" name={name} value={value} />
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= shown
        return (
          <button
            key={n}
            type="button"
            aria-label={
              labels
                ? (n === 1 ? labels.one : labels.other).replace('{n}', String(n))
                : `${n} star${n === 1 ? '' : 's'}`
            }
            aria-pressed={value === n}
            onMouseEnter={() => setHover(n)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            onClick={() => setValue(n)}
            className="rounded-md p-0.5 transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              aria-hidden
              className={
                filled
                  ? 'fill-amber-400'
                  : 'fill-zinc-200 dark:fill-zinc-700'
              }
            >
              <path d={STAR_PATH} />
            </svg>
          </button>
        )
      })}
    </span>
  )
}
