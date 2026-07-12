// Server-side PayPal REST client (Orders v2). Sandbox vs live is chosen by
// PAYPAL_ENV. Only the secret-bearing calls live here; the browser only ever
// sees NEXT_PUBLIC_PAYPAL_CLIENT_ID. Used for booking payments as an
// alternative to Stripe (WeChat/PayPal aren't available on our Stripe account).

const LIVE_BASE = 'https://api-m.paypal.com'
const SANDBOX_BASE = 'https://api-m.sandbox.paypal.com'

export function paypalConfigured(): boolean {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET)
}

function paypalBase(): string {
  return process.env.PAYPAL_ENV === 'live' ? LIVE_BASE : SANDBOX_BASE
}

async function accessToken(): Promise<string> {
  const id = process.env.PAYPAL_CLIENT_ID
  const secret = process.env.PAYPAL_CLIENT_SECRET
  if (!id || !secret) throw new Error('PayPal is not configured')

  const auth = Buffer.from(`${id}:${secret}`).toString('base64')
  const res = await fetch(`${paypalBase()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  if (!res.ok) {
    throw new Error(`PayPal auth failed: ${res.status} ${await res.text()}`)
  }
  const data = (await res.json()) as { access_token: string }
  return data.access_token
}

// PayPal amounts are decimal strings in the major unit (e.g. "40.00").
function toAmount(cents: number): string {
  return (cents / 100).toFixed(2)
}

export type PaypalOrder = { id: string; status: string }

// Create a CAPTURE order. reference_id ties the order to our booking so the
// capture webhook / capture call can reconcile it.
export async function createPaypalOrder(params: {
  amountCents: number
  currency: string
  referenceId: string
  description: string
}): Promise<PaypalOrder> {
  const token = await accessToken()
  const res = await fetch(`${paypalBase()}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: params.referenceId,
          description: params.description.slice(0, 127),
          amount: {
            currency_code: params.currency.toUpperCase(),
            value: toAmount(params.amountCents),
          },
        },
      ],
    }),
  })
  if (!res.ok) {
    throw new Error(`PayPal create order failed: ${res.status} ${await res.text()}`)
  }
  return (await res.json()) as PaypalOrder
}

export type PaypalCapture = {
  captureId: string
  status: string
  amountCents: number
  currency: string
  referenceId: string | null
}

// Capture an approved order. Returns the capture id (needed later for refunds)
// and the amount actually charged.
export async function capturePaypalOrder(orderId: string): Promise<PaypalCapture> {
  const token = await accessToken()
  const res = await fetch(
    `${paypalBase()}/v2/checkout/orders/${orderId}/capture`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  )
  if (!res.ok) {
    throw new Error(`PayPal capture failed: ${res.status} ${await res.text()}`)
  }
  const data = (await res.json()) as {
    purchase_units?: Array<{
      reference_id?: string
      payments?: {
        captures?: Array<{
          id: string
          status: string
          amount?: { value: string; currency_code: string }
        }>
      }
    }>
  }
  const unit = data.purchase_units?.[0]
  const capture = unit?.payments?.captures?.[0]
  if (!capture) {
    throw new Error('PayPal capture returned no capture record')
  }
  return {
    captureId: capture.id,
    status: capture.status,
    amountCents: capture.amount
      ? Math.round(parseFloat(capture.amount.value) * 100)
      : 0,
    currency: capture.amount?.currency_code?.toLowerCase() ?? 'cad',
    referenceId: unit?.reference_id ?? null,
  }
}

// Refund a capture. Omit amountCents for a full refund; pass it for a partial.
export async function refundPaypalCapture(params: {
  captureId: string
  amountCents?: number
  currency?: string
}): Promise<void> {
  const token = await accessToken()
  const body =
    params.amountCents != null && params.currency
      ? JSON.stringify({
          amount: {
            value: toAmount(params.amountCents),
            currency_code: params.currency.toUpperCase(),
          },
        })
      : undefined
  const res = await fetch(
    `${paypalBase()}/v2/payments/captures/${params.captureId}/refund`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      ...(body ? { body } : {}),
    },
  )
  if (!res.ok) {
    throw new Error(`PayPal refund failed: ${res.status} ${await res.text()}`)
  }
}
