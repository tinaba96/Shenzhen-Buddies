// The single entry point for GA4 events. Everything funnels through here
// rather than calling gtag() directly, so there is exactly one place to gate
// if legal-compliance later requires a consent banner for EU/UK visitors.
//
// Consent today: GA4 only loads when NEXT_PUBLIC_GA_ID is set (see
// components/Analytics.tsx), so the environment is the gate — there is no
// cookie banner in the app yet.
//
// Never pass PII. No email, no user id, no free text, no message content:
// params are enum-ish strings and counts only. The value type below is
// deliberately narrow to make a stray object or array a type error.

type TrackParams = Record<string, string | number | boolean>

declare global {
  interface Window {
    gtag?: (
      command: 'event',
      eventName: string,
      params?: TrackParams,
    ) => void
  }
}

export function track(event: string, params?: TrackParams): void {
  // No-op rather than throw, in every case where GA isn't really there:
  // during SSR, with the env var unset (dev/preview), and in the window
  // between the page rendering and the gtag script finishing loading.
  if (typeof window === 'undefined') return
  if (!process.env.NEXT_PUBLIC_GA_ID) return
  if (typeof window.gtag !== 'function') return

  window.gtag('event', event, params)
}
