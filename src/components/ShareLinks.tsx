'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { track } from '@/lib/analytics'

// The two share buttons that sit on blog posts and on gallery photos.
//
// They are two buttons rather than one because the link a visitor copies and
// the link the founder copies must not be the same string. A UTM-tagged URL
// passed around by readers credits Instagram for traffic Instagram never sent,
// and the tagged link is the one the founder needs on the clipboard fastest —
// Instagram makes caption links unclickable, so the workflow is "link in bio"
// and story stickers, both of which are paste targets.

type Tone = 'default' | 'onDark'

type ShareVariant = 'public' | 'instagram'

// Carries the url it belongs to. The lightbox keeps this component mounted
// while the visitor arrows between photos, and a confirmation is about one
// specific link — tagging it is what stops "Link copied" from sitting under
// the next photo. Derived at render rather than reset in an effect.
//
// The native share sheet has no entry here on purpose: the OS draws its own
// confirmation, and a second one from us would be noise.
type Status = {
  url: string
  variant: ShareVariant
  kind: 'copied' | 'copy-failed' | 'share-failed'
} | null

const RESET_MS = 2500

// Capability detection, read once. There is no shim behind either of these:
// where the API is absent the button is not rendered, because a button that
// cannot do its job is worse than no button.
//
// useSyncExternalStore rather than an effect, because `navigator` does not
// exist during the server render. It makes the two snapshots explicitly
// different — false on the server, the real answer on the client — instead of
// producing a hydration mismatch. Nothing to subscribe to: the answer cannot
// change after load, so `subscribe` returns an unsubscribe and does nothing.
const neverChanges = () => () => {}
const absentOnServer = () => false
const readHasClipboard = () => typeof navigator.clipboard?.writeText === 'function'
const readHasShare = () => typeof navigator.share === 'function'

export function ShareLinks({
  url,
  title,
  campaign,
  surface,
  isAdmin,
  tone = 'default',
  className = '',
}: {
  // Absolute and clean — no UTM, no tracking params. Built from siteUrl() on
  // the server so what lands on the clipboard is the production domain rather
  // than whatever host the founder happens to be browsing.
  url: string
  // Offered to the native share sheet as the sheet's headline.
  title: string
  // Becomes utm_campaign on the admin link, and content_id on the GA4 event
  // below: a post slug or a photo id.
  //
  // The no-PII contract in src/lib/analytics.ts holds for content_id, but it
  // holds by INHERITANCE, not by anything visible here. Photo ids come from
  // source filenames via scripts/img.mjs, and those filenames are only
  // guaranteed name-free because rule 4 of marketing/assets/README.md forbids
  // names in them. Loosen that rule and a real person's name reaches analytics
  // without anyone editing analytics.ts or this file. Flagged by
  // trust-safety, 2026-08-10.
  campaign: string
  surface: 'blog' | 'gallery'
  // Resolved on the server with isAdminEmail(). Never computed here: ADMIN_EMAILS
  // is not a NEXT_PUBLIC_ variable, so isAdminEmail() on the client would read an
  // empty list and silently return false for everyone.
  isAdmin: boolean
  tone?: Tone
  className?: string
}) {
  const [status, setStatus] = useState<Status>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasClipboard = useSyncExternalStore(
    neverChanges,
    readHasClipboard,
    absentOnServer,
  )
  const hasShare = useSyncExternalStore(neverChanges, readHasShare, absentOnServer)

  // A confirmation left over from the previous photo is not this photo's, so it
  // does not exist as far as the render is concerned.
  const current = status?.url === url ? status : null

  // The lightbox unmounts this on close, which can land mid-timeout.
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const flash = useCallback((next: NonNullable<Status>) => {
    setStatus(next)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus(null), RESET_MS)
  }, [])

  const share = useCallback(
    async (variant: ShareVariant) => {
      const target =
        variant === 'instagram' ? withInstagramUtm(url, campaign) : url

      // Two paths for two platforms, chosen once by capability rather than
      // chained: a phone with a share sheet gets the sheet, everything else
      // copies. The admin link always copies — it exists to be pasted into the
      // bio field, and a share sheet does not serve that.
      if (variant === 'public' && hasShare) {
        try {
          await navigator.share({ title, url: target })
          track('content_share', {
            surface,
            variant,
            method: 'native',
            content_id: campaign,
          })
        } catch (error) {
          // Dismissing the sheet is a decision, not a failure, so it says
          // nothing. Any other rejection is reported rather than quietly
          // retried down a different route.
          if (!(error instanceof DOMException && error.name === 'AbortError')) {
            flash({ url, variant, kind: 'share-failed' })
          }
        }
        return
      }

      if (await copyToClipboard(target)) {
        flash({ url, variant, kind: 'copied' })
        track('content_share', {
          surface,
          variant,
          method: 'clipboard',
          content_id: campaign,
        })
      } else {
        flash({ url, variant, kind: 'copy-failed' })
      }
    },
    [campaign, flash, hasShare, surface, title, url],
  )

  // Nothing to offer, so nothing is drawn. This is also what renders with
  // JavaScript disabled, which is the right answer there too — neither button
  // could work without it.
  if (!hasClipboard && !hasShare) return null

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <ShareButton
        tone={tone}
        onClick={() => share('public')}
        done={current?.variant === 'public' && current.kind === 'copied'}
      >
        Copy link
      </ShareButton>

      {/* The admin button needs the clipboard specifically: its whole job is to
          put a tagged link in a paste target, which the share sheet cannot do.
          So it is gated on the clipboard rather than on either capability. */}
      {isAdmin && hasClipboard && (
        <ShareButton
          tone={tone}
          onClick={() => share('instagram')}
          done={current?.variant === 'instagram' && current.kind === 'copied'}
        >
          Copy Instagram link
        </ShareButton>
      )}

      {/* One live region for both buttons, so a screen reader hears the result
          once and hears which link it was. Always mounted — a region inserted
          at the same moment as its text is unreliably announced. */}
      <span
        role="status"
        aria-live="polite"
        className={`text-xs ${
          tone === 'onDark' ? 'text-white/70' : 'text-zinc-500'
        }`}
      >
        {statusMessage(current)}
      </span>
    </div>
  )
}

function statusMessage(status: Status): string {
  if (!status) return ''
  const what = status.variant === 'instagram' ? 'Instagram link' : 'Link'
  if (status.kind === 'copied') return `${what} copied`
  // Naming the failed action rather than a generic "something went wrong", and
  // pointing at the address bar, because that is the recovery.
  const verb = status.kind === 'share-failed' ? 'share' : 'copy'
  return `Could not ${verb} the ${what.toLowerCase()} — it is in the address bar`
}

function ShareButton({
  onClick,
  done,
  tone,
  children,
}: {
  onClick: () => void
  done: boolean
  tone: Tone
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
        tone === 'onDark'
          ? 'border-white/20 text-white hover:bg-white/10'
          : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-white'
      }`}
    >
      {/* The label stays put and only the icon swaps: a button whose text
          changes under a screen reader's cursor re-announces itself and
          competes with the live region below. */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
        aria-hidden
      >
        {done ? (
          <polyline points="20 6 9 17 4 12" />
        ) : (
          <>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </>
        )}
      </svg>
      {children}
    </button>
  )
}

// Matches the convention in README, "Campaign links". Built here rather than on
// the server because the gallery's URL changes with every arrow press.
function withInstagramUtm(url: string, campaign: string): string {
  const tagged = new URL(url)
  tagged.searchParams.set('utm_source', 'instagram')
  tagged.searchParams.set('utm_medium', 'social')
  // Slugs and photo ids are already kebab-case; this is the backstop that keeps
  // a stray capital or space out of a campaign name, because GA4 groups on the
  // exact string and two spellings become two campaigns.
  tagged.searchParams.set(
    'utm_campaign',
    campaign.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, ''),
  )
  return tagged.toString()
}

// No execCommand shim behind this. The Clipboard API exists in every context
// this app runs in — production is https, and browsers treat http://localhost
// as a secure context — so a legacy path would be a deprecated workaround for a
// case that does not occur. Where the API is genuinely missing the button is
// never rendered, which is what lets this assume it is there.
//
// It can still reject with the API present: denied permission, or a document
// that does not have focus. That is reported rather than swallowed — silently
// doing nothing is the failure mode worth avoiding. It never throws, because a
// button that raises on click is worse than one that says it could not copy.
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
