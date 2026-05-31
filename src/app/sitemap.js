import { ALL_CARDS } from '@/lib/cards';
import { client } from '@/sanity/client';

const BASE = 'https://pickmystic.com';

// Build-time stamp for static routes. Updates when the site is redeployed.
const BUILD_TIME = new Date();

async function fetchBlogPosts() {
  try {
    const posts = await client.fetch(
      `*[_type=="article" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`
    );
    return posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      priority: 0.6,
      changeFrequency: 'monthly',
      lastModified: p._updatedAt ? new Date(p._updatedAt) : BUILD_TIME,
    }));
  } catch {
    return [];
  }
}

async function fetchPickTopics() {
  try {
    return await client.fetch(
      `*[_type=="pickTopic" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`
    );
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const core = [
    { url: `${BASE}/`,              priority: 1.0, changeFrequency: 'weekly' },
    { url: `${BASE}/readings`,      priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE}/quick-reading`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${BASE}/cards`,         priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE}/about`,         priority: 0.5, changeFrequency: 'monthly' },
    { url: `${BASE}/how-to`,        priority: 0.5, changeFrequency: 'monthly' },
    { url: `${BASE}/faq`,           priority: 0.5, changeFrequency: 'monthly' },
    { url: `${BASE}/blog`,          priority: 0.7, changeFrequency: 'weekly' },
  ];

  const topics = (await fetchPickTopics()).map((t) => ({
    url: `${BASE}/reading/${t.slug}`,
    priority: 0.8,
    changeFrequency: 'weekly',
    lastModified: t._updatedAt ? new Date(t._updatedAt) : BUILD_TIME,
  }));

  const cards = ALL_CARDS.map((card) => ({
    url: `${BASE}/cards/${card.slug}`,
    priority: 0.6,
    changeFrequency: 'monthly',
    lastModified: BUILD_TIME,
  }));

  const blogPosts = await fetchBlogPosts();

  const staticEntries = core.map((e) => ({ ...e, lastModified: BUILD_TIME }));

  return [...staticEntries, ...topics, ...cards, ...blogPosts];
}
