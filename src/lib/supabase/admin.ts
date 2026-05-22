import { createClient } from '@supabase/supabase-js'

// Service-role client. NEVER expose this client (or the key) to the browser.
// Use only in trusted server contexts (e.g. Stripe webhook handler) where you
// need to write rows that bypass RLS.
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
