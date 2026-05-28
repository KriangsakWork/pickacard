/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Legacy blog (static HTML in public/blog/) — serve directory index for /blog
      { source: '/blog', destination: '/blog/index.html' },
    ];
  },
};

export default nextConfig;
