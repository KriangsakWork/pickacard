import { ALL_CARDS } from '@/lib/cards';
import { client } from '@/sanity/client';

const BASE = 'https://pickmystic.com';

async function fetchBlogPosts() {
  try {
    const posts = await client.fetch(
      `*[_type=="article" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`
    );
    return posts.map(p => ({
      url: `${BASE}/blog/${p.slug}`,
      priority: 0.6,
      changeFrequency: 'monthly',
      lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
    }));
  } catch {
    return [];
  }
}

async function fetchPickTopicSlugs() {
  try {
    const items = await client.fetch(
      `*[_type=="pickTopic" && defined(slug.current)]{ "slug": slug.current }`
    );
    return items.map(i => i.slug);
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const now = new Date();

  const core = [
    { url: `${BASE}/`,             priority: 1.0, changeFrequency: 'weekly' },
    { url: `${BASE}/readings`,     priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE}/quick-reading`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${BASE}/cards`,        priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE}/about`,        priority: 0.5, changeFrequency: 'monthly' },
    { url: `${BASE}/how-to`,       priority: 0.5, changeFrequency: 'monthly' },
    { url: `${BASE}/faq`,          priority: 0.5, changeFrequency: 'monthly' },
  ];

  const topicSlugs = await fetchPickTopicSlugs();
  const topics = topicSlugs.map(slug => ({
    url: `${BASE}/reading/${slug}`,
    priority: 0.8,
    changeFrequency: 'weekly',
  }));

  const cards = ALL_CARDS.map(card => ({
    url: `${BASE}/cards/${card.slug}`,
    priority: 0.6,
    changeFrequency: 'monthly',
  }));

  const blogIndex = { url: `${BASE}/blog`, priority: 0.7, changeFrequency: 'weekly' };
  const blogPosts = await fetchBlogPosts();

  const staticEntries = [...core, ...topics, ...cards, blogIndex].map(e => ({
    ...e,
    lastModified: now,
  }));

  return [...staticEntries, ...blogPosts];
}
