import { initialsFor } from '@/lib/avatars'

type Props = {
  src?: string | null
  name?: string | null
  size?: number
  className?: string
}

export function Avatar({ src, name, size = 40, className }: Props) {
  const dim = { width: size, height: size }
  const base =
    'inline-flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-amber-200 to-rose-200 text-sm font-semibold text-zinc-700 dark:from-amber-900/40 dark:to-rose-900/40 dark:text-zinc-200'

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name ?? 'avatar'}
        style={dim}
        className={`${base} ${className ?? ''}`}
      />
    )
  }

  return (
    <span
      aria-label={name ?? 'avatar'}
      role="img"
      style={dim}
      className={`${base} ${className ?? ''}`}
    >
      {initialsFor(name)}
    </span>
  )
}
