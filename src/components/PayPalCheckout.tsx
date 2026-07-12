'use client'

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// PayPal buttons for a held booking. createOrder/onApprove call our server
// routes, which own pricing and finalisation; the browser only relays ids.
export function PayPalCheckout({
  bookingId,
  clientId,
  currency,
  promoCode,
}: {
  bookingId: string
  clientId: string
  currency: string
  promoCode?: string
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  return (
    <div>
      {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
      <PayPalScriptProvider
        options={{
          clientId,
          currency: currency.toUpperCase(),
          intent: 'capture',
        }}
      >
        <PayPalButtons
          // Re-init the buttons when the applied code changes so the order is
          // created for the current (possibly discounted) amount.
          forceReRender={[promoCode ?? '']}
          style={{ layout: 'vertical', label: 'pay' }}
          createOrder={async () => {
            setError(null)
            const res = await fetch('/api/paypal/create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ bookingId, promoCode }),
            })
            const data = (await res.json()) as { orderId?: string; error?: string }
            if (!res.ok || !data.orderId) {
              throw new Error(data.error ?? 'Could not start PayPal payment')
            }
            return data.orderId
          }}
          onApprove={async (data) => {
            const res = await fetch('/api/paypal/capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ bookingId, orderId: data.orderID }),
            })
            if (!res.ok) {
              setError('Payment could not be completed. Please try again.')
              return
            }
            router.push('/guide?paid=1')
          }}
          onError={() => {
            setError('Something went wrong with PayPal. Please try again.')
          }}
        />
      </PayPalScriptProvider>
    </div>
  )
}
