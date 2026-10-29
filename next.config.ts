import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Photo uploads (/profile, /review) go through Server Actions, whose 1 MB
  // default rejects a large phone photo before the action runs — the visitor
  // gets an error page and loses the form. Vercel caps a request at 4.5 MB.
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  async redirects() {
    return [
      // The Hong Kong arrival package was replaced by the Talent Park walk.
      // Old links and shared cards land on the list of experiences rather
      // than a 404.
      {
        source: '/tours/crayfish-night-table',
        destination: '/tours/shekou-sea-world',
        permanent: true,
      },
      {
        source: '/tours/breakfast-shift',
        destination: '/tours/shenzhen-bay-cycling',
        permanent: true,
      },
      {
        source: '/tours/first-four-hours',
        destination: '/tours',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
