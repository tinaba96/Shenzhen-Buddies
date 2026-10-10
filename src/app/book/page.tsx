import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { GuestRequestForm } from '@/components/GuestRequestForm'
import { focusFor } from '@/content/gallery'
import { packageHoursLabel } from '@/content/packages'
import { localizedPackage, localizedPackages } from '@/content/packages-i18n'
import { getI18n } from '@/i18n/server'
import { DEFAULT_FREE_TOUR_LENGTH, FREE_TOUR_LENGTHS, GUEST_REQUESTS } from '@/lib/booking'
import { WECHAT_ID, isWhatsAppConfigured } from '@/lib/config'

type Props = { searchParams: Promise<{ package?: string; sent?: string }> }

export const metadata: Metadata = {
  title: 'Request a tour — Shenzhen Buddies',
  // A form with a package in the query string: nothing for search engines.
  robots: { index: false, follow: true },
}

// Guest request: the no-account way to ask for a tour while GUEST_REQUESTS
// is on. The account-based flow on /guide is untouched; this page just
// comes first in "Reserve your spot".
export default async function BookPage({ searchParams }: Props) {
  const sp = await searchParams
  if (!GUEST_REQUESTS) {
    redirect(sp.package ? `/guide?package=${encodeURIComponent(sp.package)}` : '/guide')
  }

  const { locale, t } = await getI18n()
  const r = t.request
  const pkg = sp.package ? localizedPackage(sp.package, locale) : undefined

  if (!pkg) {
    // No (or unknown) package: a short chooser rather than a dead end.
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="sb-display text-3xl">{r.title}</h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">{r.errors.package}</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {localizedPackages(locale).map((p) => (
            <li key={p.slug}>
              <Link
                href={`/book?package=${p.slug}`}
                className="block rounded-2xl border border-zinc-200 bg-white p-4 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                {p.title}
                <span className="mt-1 block text-xs font-normal text-zinc-500">
                  {p.cn} · {packageHoursLabel(p, t.common)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    )
  }

  const focus = focusFor(pkg.photo)
  const lengths = pkg.hours ? [pkg.hours] : FREE_TOUR_LENGTHS
  const defaultLength = pkg.hours ?? DEFAULT_FREE_TOUR_LENGTH

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            {r.kicker}
          </p>
          <h1 className="sb-display mt-2 text-3xl sm:text-4xl">
            {sp.sent ? r.thanksTitle : r.title}
          </h1>

          {sp.sent ? (
            <div className="mt-6 space-y-6">
              <p className="text-lg text-zinc-700 dark:text-zinc-300">{r.thanksBody}</p>
              <div>
                <p className="text-sm font-medium">{r.thanksFaster}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {isWhatsAppConfigured() && (
                    <a
                      href="/whatsapp"
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-center rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                    >
                      WhatsApp
                    </a>
                  )}
                  <Link
                    href="/contact#wechat"
                    className="inline-flex items-center rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  >
                    WeChat · {WECHAT_ID}
                  </Link>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href={`/tours/${pkg.slug}`}
                  className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  {r.thanksBack}
                </Link>
                <Link
                  href="/tours"
                  className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  {r.thanksMore}
                </Link>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">{r.intro}</p>
              <div className="mt-8">
                <GuestRequestForm
                  packageSlug={pkg.slug}
                  lengths={lengths}
                  defaultLength={defaultLength}
                  labels={r}
                />
              </div>
            </>
          )}
        </div>

        <aside className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:sticky lg:top-24">
          <div className="relative aspect-[4/3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pkg.photo}
              alt={pkg.alt}
              style={focus ? { objectPosition: focus } : undefined}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              {pkg.kicker}
            </p>
            <h2 className="mt-1 text-lg font-semibold">{pkg.title}</h2>
            <p className="text-sm text-zinc-500">{pkg.cn}</p>
            <dl className="mt-4 space-y-2 border-t border-zinc-100 pt-4 text-sm dark:border-zinc-800">
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">{t.tours.detail.duration}</dt>
                <dd className="text-right font-medium">{packageHoursLabel(pkg, t.common)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">{t.tours.detail.district}</dt>
                <dd className="text-right font-medium">{pkg.district}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">{t.tours.detail.meetingPoint}</dt>
                <dd className="text-right font-medium">{pkg.meetingPoint}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-zinc-500">{t.tours.detail.priceNote}</p>
            <Link
              href={`/tours/${pkg.slug}`}
              className="mt-3 inline-block text-xs underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              {t.tours.detail.readMore}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  )
}
