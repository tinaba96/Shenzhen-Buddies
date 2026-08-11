import { isAdminEmail } from '@/lib/config'
import { createSupabaseServerClient } from '@/lib/supabase/server'

// "Is whoever is asking for this page an admin?" for public pages that only
// need the answer to decide whether to render an admin-only control.
//
// Server-only by construction: it reaches cookies() through the Supabase server
// client. Pages that already hold a client and a user (/admin, /guide) keep
// checking inline as they do — this exists so a page that needs nothing else
// from Supabase does not grow an auth block to hide one button.
//
// Anonymous visitors and signed-in non-admins both get false, which is the
// distinction that matters: the admin control must not reach either.
export async function isAdminViewer(): Promise<boolean> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return isAdminEmail(user?.email)
}
