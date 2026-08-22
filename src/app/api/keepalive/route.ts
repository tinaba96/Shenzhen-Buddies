import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Supabase's free tier pauses a project after ~7 days without database
// activity, and ordinary anonymous page views don't count: the root layout's
// auth check short-circuits locally when there is no session cookie, so a
// week of logged-out traffic still looks like silence to Supabase.
//
// This endpoint exists solely to be hit by the daily Vercel cron declared in
// vercel.json. One trivial read per day is activity enough to keep the
// project awake, with a 7x margin before the pause threshold.
export async function GET(request: NextRequest) {
  // Vercel sends `Authorization: Bearer ${CRON_SECRET}` with cron requests
  // when that env var is set. Enforce it if configured; the endpoint is a
  // harmless read either way, so an unset secret just means it is public.
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
  }

  const admin = createSupabaseAdminClient()
  // head:true fetches only the count — no rows leave the database.
  const { error } = await admin
    .from('profiles')
    .select('id', { count: 'exact', head: true })

  if (error) {
    // Surface the failure so the cron log shows red instead of a false green.
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
