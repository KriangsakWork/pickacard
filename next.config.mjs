/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow rendering images served from the Sanity CDN.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/readings.html',
        destination: '/readings',
        permanent: true,
      },
      {
        source: '/reading/:slug.html',
        destination: '/reading/:slug',
        permanent: true,
      },
      {
        source: '/blog/index.html',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/:slug.html',
        destination: '/blog/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
