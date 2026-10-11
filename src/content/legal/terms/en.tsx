import Link from 'next/link'

import { COMPANY, MailLink, accentLinkClass, linkClass } from '../shared'
import type { TermsCopy } from '.'

const GOVERNING_LAW = 'the Province of Ontario, Canada'

export const termsEn: TermsCopy = {
  seo: {
    title: 'Terms of Service — Shenzhen Buddies',
    description:
      'The terms that govern your use of Shenzhen Buddies, operated by Tensai Tech Inc.',
  },
  title: <>Terms of Service</>,
  effective: (date) => <>Effective {date}</>,
  intro: (
    <>
      These terms are a binding agreement between you and {COMPANY}{' '}
      Please read them before using Shenzhen Buddies.
    </>
  ),
  agreement: (
    <>
      By creating an account, booking a guide, or otherwise using the
      Shenzhen Buddies website and services (the &ldquo;Service&rdquo;), you
      agree to these Terms of Service (&ldquo;Terms&rdquo;) and to our{' '}
      <Link href="/privacy" className={linkClass}>
        Privacy Policy
      </Link>{' '}
      and{' '}
      <Link href="/cancellation" className={linkClass}>
        Cancellation &amp; Refund Policy
      </Link>
      . If you do not agree, do not use the Service.
    </>
  ),
  sections: [
    {
      title: '1. Who we are',
      body: (
        <p>
          The Service is operated by {COMPANY} (&ldquo;{COMPANY}&rdquo;,
          &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). Shenzhen
          Buddies connects visitors (&ldquo;Tourists&rdquo;) with local
          hosts (&ldquo;Guides&rdquo;) in Shenzhen for in-person day
          experiences.
        </p>
      ),
    },
    {
      title: '2. Eligibility',
      body: (
        <p>
          You must be at least 18 years old and able to form a legally
          binding contract to use the Service. By using it, you represent
          that you meet these requirements and that the information you
          provide is accurate and complete.
        </p>
      ),
    },
    {
      title: '3. The Service, and our beta',
      body: (
        <>
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
            {COMPANY}{' '}
            We are not a tour operator, travel agency, or employer
            of Guides, and we do not supervise, direct, or control the
            experiences that take place.
          </p>
        </>
      ),
    },
    {
      title: '4. Accounts',
      body: (
        <p>
          You are responsible for the activity on your account and for
          keeping your login credentials secure. Provide one account per
          person, keep your details current, and notify us promptly of any
          unauthorized use. We may suspend or close accounts that violate
          these Terms.
        </p>
      ),
    },
    {
      title: '5. Bookings and payments',
      body: (
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong>Free pilot:</strong> during our pilot period, tours are
            offered at no charge and no payment is collected at booking.
            The payment terms below apply only when a price is shown and
            charged.
          </li>
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
      ),
    },
    {
      title: '6. Cancellations and refunds',
      body: (
        <p>
          Cancellations and refunds are governed by our{' '}
          <Link href="/cancellation" className={accentLinkClass}>
            Cancellation &amp; Refund Policy
          </Link>
          , which forms part of these Terms. In summary: before a booking is
          confirmed you may cancel for a full refund; after confirmation,
          refunds are 100% with 72+ hours&apos; notice, 90% between 72 and
          24 hours, and 20% within 24 hours of the tour.
        </p>
      ),
    },
    {
      title: '7. Conduct',
      body: (
        <>
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
        </>
      ),
    },
    {
      title: '8. Meeting in person — safety and assumption of risk',
      body: (
        <>
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
        </>
      ),
    },
    {
      title: '9. Reviews and content',
      body: (
        <p>
          You retain ownership of the content you submit (such as profile
          text, photos, and reviews), and you grant {COMPANY}{' '}
          a
          non-exclusive, worldwide, royalty-free license to host, display,
          and use that content to operate and promote the Service. Don&apos;t
          post content that is unlawful, infringing, deceptive, or that you
          don&apos;t have the right to share. We may remove content that
          violates these Terms.
        </p>
      ),
    },
    {
      title: '10. Intellectual property',
      body: (
        <p>
          The Service, including its design, text, logos, and software, is
          owned by {COMPANY} or its licensors and is protected by
          intellectual-property laws. We grant you a limited, personal,
          non-transferable license to use the Service for its intended
          purpose. All rights not expressly granted are reserved.
        </p>
      ),
    },
    {
      title: '11. Third-party services',
      body: (
        <p>
          We rely on third parties — including Stripe (payments), Supabase
          (data and authentication), and email providers — to operate the
          Service. Your use of those features may be subject to the third
          party&apos;s own terms and privacy practices. We are not
          responsible for third-party services.
        </p>
      ),
    },
    {
      title: '12. Disclaimers',
      body: (
        <p>
          The Service is provided <strong>&ldquo;as is&rdquo;</strong> and{' '}
          <strong>&ldquo;as available&rdquo;</strong>, without warranties of
          any kind, whether express or implied, including merchantability,
          fitness for a particular purpose, and non-infringement. We do not
          warrant that the Service will be uninterrupted, error-free, or
          secure, or that any experience will meet your expectations.
        </p>
      ),
    },
    {
      title: '13. Limitation of liability',
      body: (
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
      ),
    },
    {
      title: '14. Indemnification',
      body: (
        <p>
          You agree to indemnify and hold harmless {COMPANY} from any claims,
          damages, losses, and expenses (including reasonable legal fees)
          arising out of your use of the Service, your content, your conduct
          during an experience, or your breach of these Terms or of any law
          or third-party right.
        </p>
      ),
    },
    {
      title: '15. Suspension and termination',
      body: (
        <p>
          You may stop using the Service at any time. We may suspend or
          terminate your access, with or without notice, if you violate
          these Terms, create risk for others, or if we discontinue the
          Service. Provisions that by their nature should survive
          termination (such as payment obligations, disclaimers, limitation
          of liability, and indemnification) will survive.
        </p>
      ),
    },
    {
      title: '16. Changes to these Terms',
      body: (
        <p>
          We may update these Terms from time to time. When we do, we will
          revise the &ldquo;Effective&rdquo; date above and, where
          appropriate, notify you. Your continued use of the Service after
          changes take effect means you accept the updated Terms.
        </p>
      ),
    },
    {
      title: '17. Governing law and disputes',
      body: (
        <p>
          These Terms are governed by the laws of {GOVERNING_LAW}, without
          regard to its conflict-of-laws rules. You agree that the courts
          located in {GOVERNING_LAW} have exclusive jurisdiction over any
          dispute that is not otherwise resolved, except where applicable law
          gives you the right to bring a claim in your local jurisdiction.
        </p>
      ),
    },
    {
      title: '18. General',
      body: (
        <p>
          If any provision of these Terms is found unenforceable, the rest
          remain in effect. Our failure to enforce a provision is not a
          waiver. You may not assign these Terms without our consent; we may
          assign them in connection with a merger, acquisition, or sale of
          assets. These Terms, together with the Privacy Policy and
          Cancellation &amp; Refund Policy, are the entire agreement between
          you and {COMPANY} regarding the Service.
        </p>
      ),
    },
    {
      title: '19. Contact',
      body: (
        <p>
          Questions about these Terms? Email us at{' '}
          <MailLink />
          .
        </p>
      ),
    },
  ],
  copyright: <>© {COMPANY} All rights reserved.</>,
}
