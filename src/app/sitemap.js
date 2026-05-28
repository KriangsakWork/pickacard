import { READING_ITEMS } from '@/data/readings-list';
import { ALL_CARDS } from '@/lib/cards';

const BASE = 'https://pickmystic.com';

const BLOG_POSTS = [
  'how-to-pick-a-card',
  'tarot-fool-meaning',
  'tarot-death-meaning',
  'tarot-moon-meaning',
  'tarot-love-meaning',
];

export default function sitemap() {
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

  const topics = READING_ITEMS.map(item => ({
    url: `${BASE}/reading/${item.slug}`,
    priority: 0.8,
    changeFrequency: 'weekly',
  }));

  const cards = ALL_CARDS.map(card => ({
    url: `${BASE}/cards/${card.slug}`,
    priority: 0.6,
    changeFrequency: 'monthly',
  }));

  const blogIndex = { url: `${BASE}/blog/`, priority: 0.7, changeFrequency: 'weekly' };
  const blogPosts = BLOG_POSTS.map(slug => ({
    url: `${BASE}/blog/${slug}.html`,
    priority: 0.6,
    changeFrequency: 'monthly',
  }));

  return [...core, ...topics, ...cards, blogIndex, ...blogPosts].map(e => ({
    ...e,
    lastModified: now,
  }));
}
