'use client'

import { useState } from 'react'
import { SubmitButton } from '@/components/SubmitButton'
import { startStripeCheckout } from '@/app/guide/actions'
import { PayPalCheckout } from '@/components/PayPalCheckout'

function money(cents: number, currency: string): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100)
}

type Applied = { code: string; discountedCents: number; label: string }

// One shared promo field drives both payment methods: the code is validated
// against Stripe and applied to whichever processor the tourist picks. A code
// that zeroes the total hides PayPal (it can't charge 0) and routes to the
// card path, where Stripe handles the $0 Checkout.
export function PaymentPanel({
  bookingId,
  baseAmountCents,
  currency,
  paypalClientId,
}: {
  bookingId: string
  baseAmountCents: number
  currency: string
  paypalClientId: string | null
}) {
  const [code, setCode] = useState('')
  const [applied, setApplied] = useState<Applied | null>(null)
  const [checking, setChecking] = useState(false)
  const [promoError, setPromoError] = useState<string | null>(null)

  const effectiveCents = applied ? applied.discountedCents : baseAmountCents
  const isFree = effectiveCents <= 0

  async function applyCode() {
    const trimmed = code.trim()
    if (!trimmed) return
    setChecking(true)
    setPromoError(null)
    try {
      const res = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, code: trimmed }),
      })
      const data = (await res.json()) as {
        valid: boolean
        discountedCents?: number
        label?: string
      }
      if (!data.valid || data.discountedCents == null) {
        setPromoError('That code is not valid.')
        return
      }
      setApplied({
        code: trimmed,
        discountedCents: data.discountedCents,
        label: data.label ?? 'Discount applied',
      })
    } catch {
      setPromoError('Could not check that code. Try again.')
    } finally {
      setChecking(false)
    }
  }

  function removeCode() {
    setApplied(null)
    setPromoError(null)
    setCode('')
  }

  return (
    <div>
      {/* Promo code */}
      <div className="mb-4">
        <label className="text-sm font-medium">Promo code</label>
        <div className="mt-1 flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={!!applied}
            placeholder="Enter a code"
            className="min-w-0 flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950"
          />
          {applied ? (
            <button
              type="button"
              onClick={removeCode}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Remove
            </button>
          ) : (
            <button
              type="button"
              onClick={applyCode}
              disabled={checking || !code.trim()}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {checking ? 'Checking…' : 'Apply'}
            </button>
          )}
        </div>
        {promoError && <p className="mt-1 text-sm text-red-600">{promoError}</p>}
        {applied && (
          <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
            {applied.label} applied.
          </p>
        )}
      </div>

      {/* Total */}
      <div className="mb-5 flex items-baseline justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <span className="text-sm text-zinc-500">Total</span>
        <span className="text-lg font-semibold">
          {applied && (
            <span className="mr-2 text-sm font-normal text-zinc-400 line-through">
              {money(baseAmountCents, currency)}
            </span>
          )}
          {money(effectiveCents, currency)}
        </span>
      </div>

      {/* Card (Stripe) — also handles the $0 free-code case */}
      <form action={startStripeCheckout}>
        <input type="hidden" name="booking_id" value={bookingId} />
        {applied && (
          <input type="hidden" name="promo_code" value={applied.code} />
        )}
        <SubmitButton
          pendingLabel={isFree ? 'Confirming…' : 'Going to payment…'}
          className="w-full rounded-full bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isFree ? 'Confirm free booking' : 'Pay by card'}
        </SubmitButton>
      </form>

      {/* PayPal — hidden when the total is 0 (PayPal can't charge nothing) */}
      {paypalClientId && !isFree && (
        <>
          <div className="my-5 flex items-center gap-3 text-xs text-zinc-400">
            <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
            or
            <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <PayPalCheckout
            bookingId={bookingId}
            clientId={paypalClientId}
            currency={currency}
            promoCode={applied?.code}
          />
        </>
      )}
    </div>
  )
}
