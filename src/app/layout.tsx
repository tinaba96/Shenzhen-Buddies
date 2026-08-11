import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@/components/Analytics";
import { Avatar } from "@/components/Avatar";
import { MobileMenu } from "@/components/MobileMenu";
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

const SITE_NAME = "Shenzhen Buddies";
const SITE_DESCRIPTION =
  "Match with a local buddy in Shenzhen who shares your interests. Casual, affordable, personal.";

export const metadata: Metadata = {
  // Resolves every relative metadata URL below to an absolute one, so link
  // previews stop breaking on share. siteUrl() is the single source of truth
  // (NEXT_PUBLIC_SITE_URL, else DEFAULT_SITE_URL) — no domain is hardcoded,
  // so the founder's custom domain is a Vercel env change, not a code change.
  metadataBase: new URL(siteUrl()),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
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
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const base = siteUrl();

  // Organization structured data. `sameAs` is what ties this site to the
  // Instagram account in Google's entity graph, which is the whole reason it
  // is worth emitting while Instagram is the only live traffic source.
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
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
  const supabase = await createSupabaseServerClient();
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
    ? "My schedule"
    : isSingleGuideMode()
      ? "Book a guide"
      : "Browse";

  // Same destinations as the desktop nav, reused by the mobile menu so
  // nothing on the PC header is missing on small screens.
  // The guide/browse pages are a public preview, so the link shows for
  // logged-out visitors too. Messages stays behind login.
  const navLinks = [
    { href: "/explore", label: "Explore" },
    { href: "/gallery", label: "Gallery" },
    { href: "/blog", label: "Blog" },
    { href: browseHref, label: browseLabel },
    ...(user ? [{ href: "/messages", label: "Messages" }] : []),
    ...(user && isAdminEmail(user.email)
      ? [{ href: "/admin", label: "Admin" }]
      : []),
  ];
  const accountLinks = user
    ? [{ href: "/profile", label: profile?.display_name || "Your profile" }]
    : [
        { href: "/login", label: "Log in" },
        { href: "/signup", label: "Sign up" },
      ];

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/80 backdrop-blur-md dark:border-zinc-800/70 dark:bg-black/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span
            aria-hidden
            className="inline-block h-6 w-6 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 shadow-sm"
          />
          <span className="hidden sm:inline">Shenzhen Buddies</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 text-sm md:flex">
          <Link
            href="/explore"
            className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          >
            Explore
          </Link>
          <Link
            href="/gallery"
            className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          >
            Gallery
          </Link>
          <Link
            href="/blog"
            className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          >
            Blog
          </Link>
          <Link
            href={browseHref}
            className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          >
            {browseLabel}
          </Link>
          {user && (
            <Link
              href="/messages"
              className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            >
              Messages
            </Link>
          )}
          {user && isAdminEmail(user.email) && (
            <Link
              href="/admin"
              className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
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
                {profile?.display_name ?? "Profile"}
              </span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm text-zinc-600 transition hover:text-zinc-900 sm:inline dark:text-zinc-300 dark:hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Sign up
              </Link>
            </>
          )}
          <MobileMenu links={navLinks} account={accountLinks} />
        </div>
      </div>
    </header>
  );
}

const SPLITWHOM_FOOTER_URL =
  "https://splitwhom.com/?utm_source=shenzhen-buddies&utm_medium=referral&utm_campaign=og_banner&utm_content=footer";

function SplitWhomNote() {
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
            From a friend
          </span>
          <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            SplitWhom
          </span>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            BBQs, parties &amp; trips — buy together, then track who paid what
            and settle up automatically.
          </span>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition group-hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:group-hover:bg-zinc-200">
          Try it
          <span aria-hidden>→</span>
        </span>
      </a>
    </div>
  );
}

function SiteFooter() {
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
          <p className="mt-3 max-w-xs text-xs text-zinc-500">
            Match with a local buddy in Shenzhen who shares your interests.
          </p>
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
        </div>
        <FooterColumn
          title="Product"
          links={[
            { href: "/welcome", label: "Get 10% off" },
            { href: "/explore", label: "Explore" },
            { href: "/gallery", label: "Gallery" },
            { href: "/blog", label: "Blog" },
            { href: "/browse", label: "Browse buddies" },
          ]}
        />
        <FooterColumn
          title="Account"
          links={[
            { href: "/signup", label: "Sign up" },
            { href: "/login", label: "Log in" },
            { href: "/profile", label: "Your profile" },
          ]}
        />
        <FooterColumn
          title="Company"
          links={[
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
            { href: "/privacy", label: "Privacy" },
            { href: "/terms", label: "Terms" },
            { href: "/cancellation", label: "Cancellation policy" },
          ]}
        />
      </div>
      <div className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-zinc-500 sm:flex-row sm:px-6">
          <p>© {year} Tensai Tech Inc.</p>
          <p>Pilot release · Shenzhen 深圳</p>
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
          <li key={`${title}-${l.label}`}>
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
