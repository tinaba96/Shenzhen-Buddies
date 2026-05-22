import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Shenzhen Buddies',
  description:
    'How to get in touch with the Shenzhen Buddies team — partnerships, press, support, or just hello.',
}

const CONTACT_EMAIL = 'hello@shenzhen-buddies.com'

export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-rose-50 dark:from-zinc-900 dark:via-black dark:to-zinc-900" />
        <div
          className="absolute inset-0 opacity-50 dark:opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 70% 30%, rgba(244,63,94,0.2), transparent 50%), radial-gradient(circle at 30% 70%, rgba(245,158,11,0.2), transparent 50%)',
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Contact
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            Say hi.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-zinc-600 dark:text-zinc-400">
            Feedback, ideas, partnerships, press, or you just want to talk
            Shenzhen — we&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-2xl px-6 py-16">
        <div className="grid gap-4 sm:grid-cols-2">
          <ContactCard
            title="General"
            description="Anything else — feedback, ideas, partnership pitches, press inquiries."
            ctaLabel="Email us"
            href={`mailto:${CONTACT_EMAIL}`}
            email={CONTACT_EMAIL}
          />
          <ContactCard
            title="Be a guide"
            description="Living in Shenzhen and curious about hosting visitors? Apply and we&rsquo;ll fast-track your profile review."
            ctaLabel="Apply"
            href="/signup?as=guide"
          />
        </div>

        <div className="mt-10 grid gap-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:grid-cols-2">
          <Detail label="Company" value="Tensai Tech Inc." />
          <Detail label="Where we are" value="Shenzhen, China · Toronto, Canada" />
          <Detail label="Founders" value="Brian (CEO) · Taka (CTO)" />
          <Detail label="Stage" value="Pilot — Shenzhen first" />
        </div>

        <p className="mt-8 text-center text-xs text-zinc-500">
          We try to reply within two business days. If it&apos;s about a
          safety concern with another user, please flag it from their profile
          page or email us directly.
        </p>
      </section>
    </main>
  )
}

function ContactCard({
  title,
  description,
  ctaLabel,
  href,
  email,
}: {
  title: string
  description: string
  ctaLabel: string
  href: string
  email?: string
}) {
  return (
    <article className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-zinc-900 hover:underline dark:text-white"
      >
        {ctaLabel}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </Link>
      {email && (
        <p className="mt-2 text-xs text-zinc-500">{email}</p>
      )}
    </article>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  )
}
