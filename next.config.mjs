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
  // Note: the old /blog -> /blog/index.html rewrite was removed so the new
  // Sanity-powered app/blog/page.js serves /blog. The legacy article HTML in
  // public/blog/*.html is still reachable directly and will be migrated in B1.
};

export default nextConfig;
