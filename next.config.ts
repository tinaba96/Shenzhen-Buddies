import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The Hong Kong arrival package was replaced by the Talent Park walk.
      // Old links and shared cards land on the list of experiences rather
      // than a 404.
      {
        source: '/tours/first-four-hours',
        destination: '/tours',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
