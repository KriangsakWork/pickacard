export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://pickmystic.com/sitemap.xml',
    host: 'https://pickmystic.com',
  };
}
