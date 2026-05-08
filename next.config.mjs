import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      {protocol: 'https', hostname: 'replicate.delivery'},
      {protocol: 'https', hostname: '*.r2.cloudflarestorage.com'},
    ],
  },
};

export default withNextIntl(nextConfig);
