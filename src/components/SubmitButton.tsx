'use client'

import type { ReactNode } from 'react'
import { useFormStatus } from 'react-dom'

type Props = {
  children: ReactNode
  pendingLabel: ReactNode
  className?: string
  // Optional submitter name/value, for forms where WHICH button was pressed
  // is part of the data (e.g. thumbs up vs down on the review page).
  name?: string
  value?: string
}

export function SubmitButton({ children, pendingLabel, className, name, value }: Props) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      name={name}
      value={value}
      disabled={pending}
      aria-busy={pending}
      className={`${className ?? ''} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {pending ? pendingLabel : children}
    </button>
  )
}
