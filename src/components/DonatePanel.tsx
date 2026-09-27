'use client'

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { SubmitButton } from '@/components/SubmitButton'
import { startDonationCheckout } from '@/app/donate/actions'

// Amount picker + the two ways to give. One chosen amount feeds both: the card
// button posts it to the existing Stripe server action (unchanged), and the
// PayPal buttons send it to /api/paypal/create-donation. Both processors
// re-validate the amount server-side; this component only keeps the UI honest.
//
// The PayPal SDK captures its callbacks when the buttons render, so the amount
// is read from a ref at click time rather than re-rendering (and reloading)
// the buttons on every keystroke.

const PRESETS = [5, 10, 20]
const MIN_DOLLARS = 1
const MAX_DOLLARS = 500

function parseDollars(raw: string): number | null {
  const trimmed = raw.trim()
  if (!/^\d+$/.test(trimmed)) return null
  const dollars = Number(trimmed)
  if (dollars < MIN_DOLLARS || dollars > MAX_DOLLARS) return null
  return dollars
}

export function DonatePanel({
  cardEnabled,
  paypalClientId,
  currency,
}: {
  // Stripe is configured — show the card button.
  cardEnabled: boolean
  // PayPal is configured — show its buttons. null hides them.
  paypalClientId: string | null
  currency: string
}) {
  const router = useRouter()
  const [preset, setPreset] = useState<number | null>(PRESETS[1])
  const [custom, setCustom] = useState('')
  const [paypalError, setPaypalError] = useState<string | null>(null)
  const [capturing, setCapturing] = useState(false)

  // Custom text wins while it has anything in it; otherwise the chip.
  const dollars = custom.trim() ? parseDollars(custom) : preset
  const valid = dollars != null
  const amountRef = useRef<number | null>(dollars)
  useEffect(() => {
    amountRef.current = dollars
  }, [dollars])

  if (!cardEnabled && !paypalClientId) {
    return (
      <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
        Donations are not set up yet — thank you for the thought!
      </p>
    )
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm font-semibold">Choose an amount</p>
      <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Preset amounts">
        {PRESETS.map((d) => {
          const selected = preset === d && !custom.trim()
          return (
            <button
              key={d}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                setPreset(d)
                setCustom('')
              }}
              className={`rounded-xl border px-2 py-3.5 text-base font-semibold transition ${
                selected
                  ? 'border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-950/40'
                  : 'border-zinc-300 bg-white hover:border-amber-400 hover:bg-amber-50 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-amber-600 dark:hover:bg-amber-950/40'
              }`}
            >
              CA${d}
            </button>
          )
        })}
      </div>
      <input
        type="number"
        inputMode="numeric"
        min={MIN_DOLLARS}
        max={MAX_DOLLARS}
        step={1}
        value={custom}
        onChange={(e) => setCustom(e.target.value)}
        placeholder="Custom amount (CA$)"
        aria-label="Custom amount in Canadian dollars"
        className="mt-3 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
      />
      {custom.trim() && !valid && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
          Pick a whole amount between CA${MIN_DOLLARS} and CA${MAX_DOLLARS}.
        </p>
      )}

      {cardEnabled && (
        <form action={startDonationCheckout} className="mt-5">
          <input type="hidden" name="amount" value={dollars ?? ''} />
          <SubmitButton
            pendingLabel="Opening…"
            className="w-full rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            disabled={!valid}
          >
            {valid ? `Donate CA$${dollars} by card` : 'Donate by card'}
          </SubmitButton>
        </form>
      )}

      {paypalClientId && (
        <>
          {cardEnabled && (
            <div className="my-5 flex items-center gap-3 text-xs text-zinc-400">
              <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
              or
              <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
            </div>
          )}
          {paypalError && (
            <p className="mb-2 text-sm text-red-600 dark:text-red-400">{paypalError}</p>
          )}
          {capturing && (
            <p className="mb-2 text-sm text-zinc-500">Confirming your donation…</p>
          )}
          <div className={cardEnabled ? '' : 'mt-5'}>
            <PayPalScriptProvider
              options={{
                clientId: paypalClientId,
                currency: currency.toUpperCase(),
                intent: 'capture',
              }}
            >
              <PayPalButtons
                disabled={!valid || capturing}
                style={{ layout: 'vertical', label: 'paypal' }}
                createOrder={async () => {
                  setPaypalError(null)
                  const amount = amountRef.current
                  if (amount == null) {
                    throw new Error('Pick an amount first')
                  }
                  const res = await fetch('/api/paypal/create-donation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: String(amount) }),
                  })
                  const data = (await res.json().catch(() => ({}))) as {
                    orderId?: string
                    error?: string
                  }
                  if (!res.ok || !data.orderId) {
                    throw new Error(data.error ?? 'Could not start PayPal payment')
                  }
                  return data.orderId
                }}
                onApprove={async (data) => {
                  setCapturing(true)
                  try {
                    const res = await fetch('/api/paypal/capture-donation', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ orderId: data.orderID }),
                    })
                    if (!res.ok) {
                      setPaypalError(
                        'Your donation could not be completed. Nothing was charged — please try again.',
                      )
                      return
                    }
                    router.push('/donate?thanks=1')
                  } catch {
                    setPaypalError(
                      'Your donation could not be completed. Nothing was charged — please try again.',
                    )
                  } finally {
                    setCapturing(false)
                  }
                }}
                onError={() => {
                  setPaypalError('Something went wrong with PayPal. Please try again.')
                }}
              />
            </PayPalScriptProvider>
          </div>
        </>
      )}

      <p className="mt-4 text-xs text-zinc-500">
        {cardEnabled && paypalClientId
          ? 'Paid securely by card via Stripe, or with PayPal. '
          : cardEnabled
            ? 'Paid securely by card via Stripe. '
            : 'Paid securely with PayPal. '}
        One-off, no account needed, and no perks attached — this is a
        thank-you, not a purchase.
      </p>
    </div>
  )
}
