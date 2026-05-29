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
  async rewrites() {
    return [
      // Legacy blog (static HTML in public/blog/) — serve directory index for /blog
      { source: '/blog', destination: '/blog/index.html' },
    ];
  },
};

export default nextConfig;
