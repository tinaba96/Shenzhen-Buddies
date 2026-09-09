'use server'

import { redirect } from 'next/navigation'
import {
  createSupportCheckout,
  parseSupportAmountCents,
  supportConfigured,
} from '@/lib/support'
import { createSupabaseServerClient } from '@/lib/supabase/server'

// Donations to the pilot — open to anyone, signed in or not, any time (not
// tied to a booking). One-off Stripe Checkout; the Stripe dashboard is the
// ledger, nothing is written to the database.
export async function startDonationCheckout(formData: FormData) {
  if (!supportConfigured()) {
    redirect(
      `/donate?error=${encodeURIComponent('Donations are not set up yet — thank you for the thought!')}`,
    )
  }

  const raw = String(
    formData.get('custom_amount') || formData.get('amount') || '',
  ).trim()
  const amountCents = parseSupportAmountCents(raw)
  if (amountCents == null) {
    redirect(
      `/donate?error=${encodeURIComponent('Pick an amount between CA$1 and CA$500 (whole dollars).')}`,
    )
  }

  // Prefill the email on the Stripe page when we know it; donating while
  // signed out is fine too.
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let checkoutUrl: string
  try {
    checkoutUrl = await createSupportCheckout({
      kind: 'donation',
      amountCents,
      productName: 'Donation — Shenzhen Buddies pilot',
      successPath: '/donate?thanks=1',
      cancelPath: '/donate',
      customerEmail: user?.email ?? undefined,
      metadata: user ? { user_id: user.id } : undefined,
    })
  } catch (err) {
    console.error('Donation checkout creation failed:', err)
    redirect(
      `/donate?error=${encodeURIComponent('Could not start the payment — please try again.')}`,
    )
  }
  redirect(checkoutUrl)
}
