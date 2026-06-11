import Link from 'next/link'
import type { Metadata } from 'next'
import { POLICY_EFFECTIVE } from '@/lib/policy'

export const metadata: Metadata = {
  title: 'Terms of Service — Shenzhen Buddies',
  description:
    'The terms that govern your use of Shenzhen Buddies, operated by Tensai Tech Inc.',
}

const EFFECTIVE = POLICY_EFFECTIVE
const COMPANY = 'Tensai Tech Inc.'
const CONTACT_EMAIL = 'hello@shenzhen-buddies.com'
const GOVERNING_LAW = 'the Province of Ontario, Canada'

export default function TermsPage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-rose-50 dark:from-zinc-900 dark:via-black dark:to-zinc-900" />
        <div
          className="absolute inset-0 opacity-50 dark:opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 25%, rgba(245,158,11,0.25), transparent 50%), radial-gradient(circle at 85% 75%, rgba(244,63,94,0.25), transparent 50%)',
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-zinc-500">Effective {EFFECTIVE}</p>
          <p className="mx-auto mt-4 max-w-xl text-zinc-600 dark:text-zinc-400">
            These terms are a binding agreement between you and {COMPANY}.
            Please read them before using Shenzhen Buddies.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-3xl px-6 py-14 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        <p className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          By creating an account, booking a guide, or otherwise using the
          Shenzhen Buddies website and services (the &ldquo;Service&rdquo;), you
          agree to these Terms of Service (&ldquo;Terms&rdquo;) and to our{' '}
          <Link href="/privacy" className="underline underline-offset-2">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link href="/cancellation" className="underline underline-offset-2">
            Cancellation &amp; Refund Policy
          </Link>
          . If you do not agree, do not use the Service.
        </p>

        <div className="mt-10 space-y-9">
          <Section title="1. Who we are">
            <p>
              The Service is operated by {COMPANY} (&ldquo;{COMPANY}&rdquo;,
              &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). Shenzhen
              Buddies connects visitors (&ldquo;Tourists&rdquo;) with local
              hosts (&ldquo;Guides&rdquo;) in Shenzhen for in-person day
              experiences.
            </p>
          </Section>

          <Section title="2. Eligibility">
            <p>
              You must be at least 18 years old and able to form a legally
              binding contract to use the Service. By using it, you represent
              that you meet these requirements and that the information you
              provide is accurate and complete.
            </p>
          </Section>

          <Section title="3. The Service, and our beta">
            <p>
              Shenzhen Buddies is a platform that helps Tourists discover and
              book time with Guides. We are currently operating an early
              &ldquo;beta&rdquo; release. During the beta, bookings may be
              fulfilled by a single operator-managed Guide, features may change,
              and availability is limited. We may add, change, suspend, or
              remove features at any time.
            </p>
            <p>
              We are a <strong>platform and intermediary</strong>. The actual
              guiding experience is provided by independent Guides, not by{' '}
              {COMPANY}. We are not a tour operator, travel agency, or employer
              of Guides, and we do not supervise, direct, or control the
              experiences that take place.
            </p>
          </Section>

          <Section title="4. Accounts">
            <p>
              You are responsible for the activity on your account and for
              keeping your login credentials secure. Provide one account per
              person, keep your details current, and notify us promptly of any
              unauthorized use. We may suspend or close accounts that violate
              these Terms.
            </p>
          </Section>

          <Section title="5. Bookings and payments">
            <ul className="ml-5 list-disc space-y-1">
              <li>
                Tours are priced at a flat hourly rate, shown at checkout, in{' '}
                <strong>Canadian dollars (CAD)</strong>. A booking covers a
                whole-day block within the duration limits shown in the app.
              </li>
              <li>
                Payment is collected at the time you book, which reserves the
                day. Your booking is a <strong>request</strong> until it is
                confirmed by us or the Guide.
              </li>
              <li>
                Payments are processed by <strong>Stripe</strong>. By paying,
                you agree to Stripe&apos;s terms. We do not store full card
                details.
              </li>
              <li>
                Promotional codes, where offered, are applied at checkout and
                are subject to any limits we set. Discounts have no cash value.
              </li>
              <li>
                You are responsible for any taxes, currency-conversion charges,
                or fees imposed by your bank or card issuer.
              </li>
            </ul>
          </Section>

          <Section title="6. Cancellations and refunds">
            <p>
              Cancellations and refunds are governed by our{' '}
              <Link
                href="/cancellation"
                className="font-medium text-amber-700 underline underline-offset-2 dark:text-amber-400"
              >
                Cancellation &amp; Refund Policy
              </Link>
              , which forms part of these Terms. In summary: before a booking is
              confirmed you may cancel for a full refund; after confirmation,
              refunds are 100% with 72+ hours&apos; notice, 70% between 72 and
              24 hours, and 0% within 24 hours of the tour.
            </p>
          </Section>

          <Section title="7. Conduct">
            <p>You agree that you and your guests will:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li>treat Guides, Tourists, and our team with respect;</li>
              <li>obey all applicable laws during an experience;</li>
              <li>
                provide honest information and honest reviews based on real
                experiences; and
              </li>
              <li>
                not harass, threaten, defraud, discriminate against, or harm any
                other person.
              </li>
            </ul>
            <p>You agree that you and your guests will not:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li>
                use the Service for anything illegal, dangerous, or sexual, or
                to solicit prostitution or trafficking;
              </li>
              <li>
                arrange payment off-platform to avoid fees, or use another
                person&apos;s payment method without authorization;
              </li>
              <li>
                impersonate others, scrape data, or interfere with the security
                or operation of the Service.
              </li>
            </ul>
          </Section>

          <Section title="8. Meeting in person — safety and assumption of risk">
            <p>
              The Service involves meeting and spending time with people you may
              not know. <strong>You use the Service at your own risk.</strong>{' '}
              We do not conduct background checks on every user, do not guarantee
              the conduct, identity, or qualifications of any Guide or Tourist,
              and are not responsible for what happens during an experience.
            </p>
            <p>
              Use your judgment: meet in public where possible, share your plans
              with someone you trust, keep your belongings safe, and stop any
              experience that feels unsafe. In an emergency, contact local
              authorities first, then report the issue to us.
            </p>
          </Section>

          <Section title="9. Reviews and content">
            <p>
              You retain ownership of the content you submit (such as profile
              text, photos, and reviews), and you grant {COMPANY} a
              non-exclusive, worldwide, royalty-free license to host, display,
              and use that content to operate and promote the Service. Don&apos;t
              post content that is unlawful, infringing, deceptive, or that you
              don&apos;t have the right to share. We may remove content that
              violates these Terms.
            </p>
          </Section>

          <Section title="10. Intellectual property">
            <p>
              The Service, including its design, text, logos, and software, is
              owned by {COMPANY} or its licensors and is protected by
              intellectual-property laws. We grant you a limited, personal,
              non-transferable license to use the Service for its intended
              purpose. All rights not expressly granted are reserved.
            </p>
          </Section>

          <Section title="11. Third-party services">
            <p>
              We rely on third parties — including Stripe (payments), Supabase
              (data and authentication), and email providers — to operate the
              Service. Your use of those features may be subject to the third
              party&apos;s own terms and privacy practices. We are not
              responsible for third-party services.
            </p>
          </Section>

          <Section title="12. Disclaimers">
            <p>
              The Service is provided <strong>&ldquo;as is&rdquo;</strong> and{' '}
              <strong>&ldquo;as available&rdquo;</strong>, without warranties of
              any kind, whether express or implied, including merchantability,
              fitness for a particular purpose, and non-infringement. We do not
              warrant that the Service will be uninterrupted, error-free, or
              secure, or that any experience will meet your expectations.
            </p>
          </Section>

          <Section title="13. Limitation of liability">
            <p>
              To the maximum extent permitted by law, {COMPANY} and its
              directors, employees, and agents will not be liable for any
              indirect, incidental, special, consequential, or punitive damages,
              or for any loss of profits, data, or goodwill, arising out of or
              relating to your use of the Service or any experience. To the
              maximum extent permitted by law, our total liability for any claim
              relating to the Service is limited to the amount you paid to us for
              the booking giving rise to the claim. Some jurisdictions do not
              allow certain limitations, so some of the above may not apply to
              you.
            </p>
          </Section>

          <Section title="14. Indemnification">
            <p>
              You agree to indemnify and hold harmless {COMPANY} from any claims,
              damages, losses, and expenses (including reasonable legal fees)
              arising out of your use of the Service, your content, your conduct
              during an experience, or your breach of these Terms or of any law
              or third-party right.
            </p>
          </Section>

          <Section title="15. Suspension and termination">
            <p>
              You may stop using the Service at any time. We may suspend or
              terminate your access, with or without notice, if you violate
              these Terms, create risk for others, or if we discontinue the
              Service. Provisions that by their nature should survive
              termination (such as payment obligations, disclaimers, limitation
              of liability, and indemnification) will survive.
            </p>
          </Section>

          <Section title="16. Changes to these Terms">
            <p>
              We may update these Terms from time to time. When we do, we will
              revise the &ldquo;Effective&rdquo; date above and, where
              appropriate, notify you. Your continued use of the Service after
              changes take effect means you accept the updated Terms.
            </p>
          </Section>

          <Section title="17. Governing law and disputes">
            <p>
              These Terms are governed by the laws of {GOVERNING_LAW}, without
              regard to its conflict-of-laws rules. You agree that the courts
              located in {GOVERNING_LAW} have exclusive jurisdiction over any
              dispute that is not otherwise resolved, except where applicable law
              gives you the right to bring a claim in your local jurisdiction.
            </p>
          </Section>

          <Section title="18. General">
            <p>
              If any provision of these Terms is found unenforceable, the rest
              remain in effect. Our failure to enforce a provision is not a
              waiver. You may not assign these Terms without our consent; we may
              assign them in connection with a merger, acquisition, or sale of
              assets. These Terms, together with the Privacy Policy and
              Cancellation &amp; Refund Policy, are the entire agreement between
              you and {COMPANY} regarding the Service.
            </p>
          </Section>

          <Section title="19. Contact">
            <p>
              Questions about these Terms? Email us at{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-amber-700 underline underline-offset-2 dark:text-amber-400"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </Section>
        </div>

        <p className="mt-12 border-t border-zinc-200 pt-6 text-xs text-zinc-500 dark:border-zinc-800">
          © {COMPANY}. All rights reserved.
        </p>
      </div>
    </main>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h2>
      {children}
    </section>
  )
}
