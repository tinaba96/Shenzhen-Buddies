import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@/components/Analytics";
import { Avatar } from "@/components/Avatar";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileMenu } from "@/components/MobileMenu";
import { getI18n } from "@/i18n/server";
import { avatarPublicUrl } from "@/lib/avatars";
import {
  INSTAGRAM_HANDLE,
  instagramUrl,
  isAdminEmail,
  isSingleGuideMode,
  officialGuideId,
  siteUrl,
} from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// The editorial display face for headlines. One weight, Latin only — CJK
// locales are switched back to the sans in globals.css, because this family
// has no Chinese or Japanese glyphs and would fall back to a mismatched
// system serif mid-headline.
const displaySerif = Instrument_Serif({
  variable: "--font-display-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const SITE_NAME = "Shenzhen Buddies";
const SITE_DESCRIPTION =
  "Match with a local buddy in Shenzhen who shares your interests. Casual, affordable, personal.";

// Localised per the visitor's cookie. The canonical, OG url and JSON-LD below
// stay English on purpose — see the `seo` note in i18n/dictionaries/en.ts.
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();

  return {
    // Resolves every relative metadata URL below to an absolute one, so link
    // previews stop breaking on share. siteUrl() is the single source of truth
    // (NEXT_PUBLIC_SITE_URL, else DEFAULT_SITE_URL) — no domain is hardcoded,
    // so the founder's custom domain is a Vercel env change, not a code change.
    metadataBase: new URL(siteUrl()),
    title: t.seo.siteTitle,
    description: t.seo.siteDescription,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      title: t.seo.siteTitle,
      description: t.seo.siteDescription,
      url: "/",
    },
    // Deliberately no `openGraph.images` / `twitter.images` here. The card image
    // ships as the `opengraph-image` file convention, which takes priority over
    // this object and fills in type/width/height automatically. Drop the
    // 1200x630 file at src/app/opengraph-image.png (art-director, PRD R4) and
    // og:image + twitter:image start rendering with no code change — until then
    // no image tag is emitted at all, rather than one pointing at a 404.
    twitter: {
      card: "summary_large_image",
      title: t.seo.siteTitle,
      description: t.seo.siteDescription,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const base = siteUrl();
  const { meta } = await getI18n();

  // Organization structured data. `sameAs` is what ties this site to the
  // Instagram account in Google's entity graph, which is the whole reason it
  // is worth emitting while Instagram is the only live traffic source.
  //
  // Kept in English regardless of the reader's locale: it describes the
  // organisation to a crawler, and the crawler sees the English page.
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: base,
    logo: `${base}/icon.png`,
    description: SITE_DESCRIPTION,
    sameAs: [instagramUrl()],
  };

  return (
    <html
      lang={meta.htmlLang}
      dir={meta.dir}
      className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 dark:bg-black dark:text-zinc-100">
        {/* JSON.stringify does not escape HTML, so `<` is scrubbed to its
            unicode form to close the XSS vector. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Analytics />
        <SiteHeader />
        <div className="flex flex-1 flex-col">{children}</div>
        <SplitWhomNote />
        <SiteFooter />
      </body>
    </html>
  );
}

async function SiteHeader() {
  const [{ locale, t }, supabase] = await Promise.all([
    getI18n(),
    createSupabaseServerClient(),
  ]);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: {
    display_name: string | null;
    avatar_path: string | null;
    updated_at: string | null;
  } | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, avatar_path, updated_at")
      .eq("id", user.id)
      .maybeSingle();
    profile = data;
  }

  // The /guide tab reads "Book a guide" for visitors, but for the official
  // guide it's their own dashboard, so label it accordingly.
  const isOfficialGuide =
    !!user && isSingleGuideMode() && user.id === officialGuideId();
  const browseHref = isSingleGuideMode() ? "/guide" : "/browse";
  const browseLabel = isOfficialGuide
    ? t.nav.mySchedule
    : isSingleGuideMode()
      ? t.nav.bookAGuide
      : t.nav.browse;

  // Same destinations as the desktop nav, reused by the mobile menu so
  // nothing on the PC header is missing on small screens.
  // The guide/browse pages are a public preview, so the link shows for
  // logged-out visitors too. Messages stays behind login.
  const navLinks = [
    { href: "/tours", label: t.nav.tours },
    { href: "/explore", label: t.nav.explore },
    { href: "/gallery", label: t.nav.gallery },
    { href: "/blog", label: t.nav.blog },
    { href: browseHref, label: browseLabel },
    ...(user ? [{ href: "/messages", label: t.nav.messages }] : []),
    ...(user && isAdminEmail(user.email)
      ? [{ href: "/admin", label: t.nav.admin }]
      : []),
  ];
  const accountLinks = user
    ? [{ href: "/profile", label: profile?.display_name || t.common.yourProfile }]
    : [
        { href: "/login", label: t.common.logIn },
        { href: "/signup", label: t.common.signUp },
      ];

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/80 backdrop-blur-md dark:border-zinc-800/70 dark:bg-black/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2 font-semibold tracking-tight"
        >
          <span
            aria-hidden
            className="inline-block h-6 w-6 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 shadow-sm transition duration-500 group-hover:rotate-180 group-hover:shadow-rose-500/40"
          />
          <span className="hidden sm:inline">Shenzhen Buddies</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 text-sm md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative text-zinc-600 transition after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gradient-to-r after:from-amber-400 after:to-rose-500 after:transition-all after:duration-300 hover:text-zinc-900 hover:after:w-full dark:text-zinc-300 dark:hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher
            current={locale}
            labels={{
              label: t.language.label,
              choose: t.language.choose,
              switchTo: t.language.switchTo,
              note: t.language.note,
            }}
          />
          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white py-1 pl-1 pr-3 text-sm shadow-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <Avatar
                src={avatarPublicUrl(
                  profile?.avatar_path,
                  profile?.updated_at,
                )}
                name={profile?.display_name}
                size={28}
              />
              <span className="hidden max-w-[10ch] truncate sm:inline">
                {profile?.display_name ?? t.nav.account}
              </span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm text-zinc-600 transition hover:text-zinc-900 sm:inline dark:text-zinc-300 dark:hover:text-white"
              >
                {t.common.logIn}
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {t.common.signUp}
              </Link>
            </>
          )}
          <MobileMenu
            links={navLinks}
            account={accountLinks}
            labels={{ open: t.nav.openMenu, close: t.nav.closeMenu }}
          />
        </div>
      </div>
    </header>
  );
}

const SPLITWHOM_FOOTER_URL =
  "https://splitwhom.com/?utm_source=shenzhen-buddies&utm_medium=referral&utm_campaign=og_banner&utm_content=footer";

async function SplitWhomNote() {
  const { t } = await getI18n();
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6 sm:px-6">
      <a
        href={SPLITWHOM_FOOTER_URL}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="group mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-3xl border border-zinc-200 bg-gradient-to-br from-indigo-50/70 to-violet-50/50 px-8 py-8 text-center transition hover:border-indigo-200 hover:shadow-md sm:flex-row sm:gap-6 sm:text-left dark:border-zinc-800 dark:from-indigo-950/20 dark:to-violet-950/10 dark:hover:border-indigo-900/50"
      >
        <span
          aria-hidden
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500 text-2xl font-bold leading-none text-white shadow-sm"
        >
          ÷
        </span>
        <div className="flex flex-1 flex-col gap-1">
          <span className="inline-flex items-center justify-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-zinc-400 sm:justify-start">
            {t.partner.kicker}
          </span>
          <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {t.partner.title}
          </span>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {t.partner.body}
          </span>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition group-hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:group-hover:bg-zinc-200">
          {t.partner.cta}
          <span aria-hidden>→</span>
        </span>
      </a>
    </div>
  );
}

async function SiteFooter() {
  const { locale, t } = await getI18n();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <span
              aria-hidden
              className="inline-block h-6 w-6 rounded-full bg-gradient-to-br from-amber-400 to-rose-500"
            />
            Shenzhen Buddies
          </Link>
          <p className="mt-3 max-w-xs text-xs text-zinc-500">{t.footer.tagline}</p>
          {/* The one "seen on Instagram" surface (PRD R9) — site-wide via the
              footer rather than a per-page treatment. */}
          <a
            href={instagramUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-white"
          >
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
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
            @{INSTAGRAM_HANDLE}
          </a>

          {/* The switcher again, spelled out rather than behind a globe icon.
              Someone who lands mid-page in a language they cannot read looks
              for this at the bottom, not in a collapsed header control. */}
          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
              {t.footer.languageNote}
            </p>
            <div className="mt-2">
              <LanguageSwitcher
                current={locale}
                variant="inline"
                labels={{
                  label: t.language.label,
                  choose: t.language.choose,
                  switchTo: t.language.switchTo,
                  note: t.language.note,
                }}
              />
            </div>
          </div>
        </div>
        <FooterColumn
          title={t.footer.product}
          links={[
            { href: "/tours", label: t.nav.tours },
            { href: "/welcome", label: t.footer.discount },
            { href: "/explore", label: t.nav.explore },
            { href: "/gallery", label: t.nav.gallery },
            { href: "/blog", label: t.nav.blog },
            { href: "/browse", label: t.common.browseBuddies },
          ]}
        />
        <FooterColumn
          title={t.footer.account}
          links={[
            { href: "/signup", label: t.common.signUp },
            { href: "/login", label: t.common.logIn },
            { href: "/profile", label: t.common.yourProfile },
          ]}
        />
        <FooterColumn
          title={t.footer.company}
          links={[
            { href: "/about", label: t.footer.about },
            { href: "/contact", label: t.footer.contact },
            { href: "/pricing", label: "Premium" },
            { href: "/privacy", label: t.footer.privacy },
            { href: "/terms", label: t.footer.terms },
            { href: "/cancellation", label: t.footer.cancellation },
          ]}
        />
      </div>
      <div className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-zinc-500 sm:flex-row sm:px-6">
          <p>{t.footer.rights.replace("{year}", String(year))}</p>
          <p>{t.footer.pilot}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
        {title}
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={`${title}-${l.href}`}>
            <Link
              href={l.href}
              className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
