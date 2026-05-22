import Link from 'next/link'
import { Avatar } from '@/components/Avatar'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="flex flex-1 flex-col">
      <Hero loggedIn={!!user} />
      <Audiences />
      <HowItWorks />
      <Testimonials />
      <FinalCTA loggedIn={!!user} />
    </main>
  )
}

function Hero({ loggedIn }: { loggedIn: boolean }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-rose-50 dark:from-zinc-900 dark:via-black dark:to-zinc-900" />
      <div
        className="absolute inset-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(245, 158, 11, 0.25), transparent 40%), radial-gradient(circle at 80% 60%, rgba(244, 63, 94, 0.25), transparent 45%)',
        }}
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center sm:py-32">
        <p className="inline-flex items-center gap-2 rounded-full border border-zinc-900/10 bg-white/70 px-3 py-1 text-xs font-medium tracking-wide text-zinc-700 backdrop-blur dark:border-white/15 dark:bg-white/5 dark:text-zinc-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Now matching in Shenzhen
        </p>

        <h1 className="mt-6 max-w-3xl text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
          See Shenzhen with someone{' '}
          <span className="bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-rose-400">
            who gets you.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-lg text-zinc-600 dark:text-zinc-400">
          Skip the tour bus. Get matched with a local who shares your
          interests — language, food, art, sports — and explore the city like
          a friend would.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {loggedIn ? (
            <>
              <Link
                href="/browse"
                className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Browse buddies
              </Link>
              <Link
                href="/profile"
                className="rounded-full border border-zinc-300 bg-white/80 px-6 py-3 text-sm font-medium text-zinc-900 backdrop-blur transition hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-white dark:hover:bg-zinc-900"
              >
                Your profile
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/signup?as=tourist"
                className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Find a local
              </Link>
              <Link
                href="/signup?as=guide"
                className="rounded-full border border-zinc-300 bg-white/80 px-6 py-3 text-sm font-medium text-zinc-900 backdrop-blur transition hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-white dark:hover:bg-zinc-900"
              >
                Become a guide
              </Link>
            </>
          )}
        </div>

        {!loggedIn && (
          <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-500">
            Free during pilot ·{' '}
            <Link href="/login" className="underline hover:text-zinc-700 dark:hover:text-zinc-300">
              Already have an account?
            </Link>
          </p>
        )}
      </div>
    </section>
  )
}

function Audiences() {
  return (
    <section className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto grid max-w-5xl gap-5 px-6 py-16 md:grid-cols-2">
        <AudienceCard
          tone="amber"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M3 7l9-4 9 4" />
              <path d="M3 7l9 4 9-4" />
              <path d="M3 7v6c0 4 4 7 9 7s9-3 9-7V7" />
            </svg>
          }
          title="For travelers"
          subtitle="Visiting Shenzhen"
          points={[
            'Skip the language barrier — match by shared languages',
            'Discover spots only locals know',
            'Personal, casual, and affordable',
          ]}
        />
        <AudienceCard
          tone="rose"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M12 21s-7-7-7-12a7 7 0 1 1 14 0c0 5-7 12-7 12z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
          }
          title="For locals"
          subtitle="Live in Shenzhen"
          points={[
            'Meet people from around the world',
            'Share your favorite spots and stories',
            'Pick the days, topics, and pace that work for you',
          ]}
        />
      </div>
    </section>
  )
}

function AudienceCard({
  tone,
  icon,
  title,
  subtitle,
  points,
}: {
  tone: 'amber' | 'rose'
  icon: React.ReactNode
  title: string
  subtitle: string
  points: string[]
}) {
  const accent =
    tone === 'amber'
      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
      : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'

  return (
    <article className="group rounded-2xl border border-zinc-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
        {icon}
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
        {subtitle}
      </p>
      <h3 className="mt-1 text-xl font-semibold">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: 'Create your profile',
      body: 'Tell us your hobbies, languages, and what kind of day you’d like.',
    },
    {
      n: '02',
      title: 'Browse buddies',
      body: 'Find locals (or visitors) who share your interests and city.',
    },
    {
      n: '03',
      title: 'Plan and go',
      body: 'Message, meet, and explore. Leave a review afterward.',
    },
  ]

  return (
    <section className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Three small steps.
          </h2>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <li
              key={s.n}
              className="relative rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="text-sm font-semibold tracking-wider text-zinc-400">
                {s.n}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Testimonials() {
  const reviews = [
    {
      stars: 5,
      quote:
        'Lin took me to a tea house in Futian I never would have found. We ended up talking for three hours. Felt like meeting a friend, not booking a tour.',
      name: 'Sarah K.',
      role: 'Tourist, visiting from London',
      photo: 'https://i.pravatar.cc/120?img=47',
    },
    {
      stars: 5,
      quote:
        'I joined as a guide because I love showing people my city. Met a photographer from Mexico who taught me about light. We are still chatting.',
      name: 'Wei H.',
      role: 'Guide, Shenzhen local',
      photo: 'https://i.pravatar.cc/120?img=12',
    },
    {
      stars: 5,
      quote:
        'My Mandarin is awful and I was nervous about the trip. Daniel speaks Italian and took me to the best street food. Game-changer.',
      name: 'Marco R.',
      role: 'Tourist, visiting from Milan',
      photo: 'https://i.pravatar.cc/120?img=33',
    },
  ]

  return (
    <section className="border-t border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950/30">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            From our pilot community
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Real stories from buddies.
          </h2>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {reviews.map((r) => (
            <li
              key={r.name}
              className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <StaticStars value={r.stars} />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                <Avatar src={r.photo} name={r.name} size={40} />
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-zinc-500">{r.role}</p>
                </div>
              </figcaption>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function StaticStars({ value }: { value: number }) {
  return (
    <span aria-label={`${value} out of 5 stars`} className="inline-flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          aria-hidden
          className={
            i < value
              ? 'h-4 w-4 fill-amber-400'
              : 'h-4 w-4 fill-zinc-200 dark:fill-zinc-700'
          }
        >
          <path d="M12 2.5l2.92 6.01 6.58.95-4.76 4.65 1.12 6.55L12 17.77l-5.86 3.09 1.12-6.55L2.5 9.46l6.58-.95L12 2.5z" />
        </svg>
      ))}
    </span>
  )
}

function FinalCTA({ loggedIn }: { loggedIn: boolean }) {
  return (
    <section className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="relative mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-32 max-w-2xl bg-gradient-to-r from-amber-200/40 via-rose-200/40 to-transparent blur-3xl dark:from-amber-500/15 dark:via-rose-500/15" />
        <div className="relative">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {loggedIn ? 'Find your next buddy.' : 'Ready to explore together?'}
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            {loggedIn
              ? 'Browse public profiles and start a conversation.'
              : 'Free to join during the pilot. Takes under a minute.'}
          </p>
          <Link
            href={loggedIn ? '/browse' : '/signup'}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {loggedIn ? 'Browse buddies' : 'Get started'}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
