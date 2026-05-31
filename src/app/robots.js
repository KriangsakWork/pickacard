export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio/', '/studio', '/api/', '/api'],
      },
    ],
    sitemap: 'https://pickmystic.com/sitemap.xml',
    host: 'https://pickmystic.com',
  };
}
