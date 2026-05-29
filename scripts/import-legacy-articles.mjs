// One-off migration: take the legacy HTML blog posts under public/blog and
// import them as published Article documents in Sanity. Safe to re-run — it
// skips slugs that already exist.
//
// Run:
//   NEXT_PUBLIC_SANITY_PROJECT_ID=... \
//   NEXT_PUBLIC_SANITY_DATASET=production \
//   NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01 \
//   SANITY_API_TOKEN=sk... \
//   node scripts/import-legacy-articles.mjs

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createClient } from '@sanity/client';
import { htmlToBlocks } from '@sanity/block-tools';
import { Schema } from '@sanity/schema';
import { JSDOM } from 'jsdom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const ARTICLES = [
  'tarot-fool-meaning.html',
  'tarot-moon-meaning.html',
  'tarot-death-meaning.html',
  'tarot-love-meaning.html',
  'how-to-pick-a-card.html',
];

const CATEGORY_SEED = [
  { slug: 'love', title: 'ความรัก', icon: '💕', order: 1 },
  { slug: 'work', title: 'การงาน', icon: '💼', order: 2 },
  { slug: 'luck', title: 'โชคลาภ', icon: '🍀', order: 3 },
];

const KEYWORDS = {
  love: ['ความรัก', 'แฟน', 'คนรัก', 'soulmate', 'คู่รัก', 'หัวใจ', 'รักใหม่'],
  work: ['งาน', 'อาชีพ', 'เงินเดือน', 'หัวหน้า', 'เพื่อนร่วมงาน', 'การงาน'],
  luck: ['โชค', 'หวย', 'การเงิน', 'ลาภ', 'รวย', 'เงินทอง'],
};

// Score categories with the title weighted heavily (×10) so a general tarot
// article that mentions "ความรัก/การงาน/การเงิน" once each in its section
// headers doesn't get misclassified. Require a clear winner (>= 2× runner-up
// AND title score > 0) to count as confident; otherwise default to love and
// flag for manual review.
function pickCategorySlug({ title, body }) {
  const scores = { love: 0, work: 0, luck: 0 };
  const titleScores = { love: 0, work: 0, luck: 0 };
  for (const [cat, words] of Object.entries(KEYWORDS)) {
    for (const w of words) {
      const re = new RegExp(w, 'gi');
      const t = (title.match(re) || []).length;
      const b = (body.match(re) || []).length;
      titleScores[cat] += t;
      scores[cat] += t * 10 + b;
    }
  }
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [topCat, topScore] = ranked[0];
  const runnerUp = ranked[1][1];
  const confident = topScore > 0 && titleScores[topCat] > 0 && topScore >= runnerUp * 2;
  return {
    slug: confident ? topCat : 'love',
    confident,
    scores,
    titleScores,
  };
}

function makeClient() {
  const required = [
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    'NEXT_PUBLIC_SANITY_DATASET',
    'SANITY_API_TOKEN',
  ];
  for (const k of required) {
    if (!process.env[k]) {
      console.error(`Missing env: ${k}`);
      process.exit(1);
    }
  }
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID.trim(),
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET.trim(),
    apiVersion: (process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01').trim(),
    token: process.env.SANITY_API_TOKEN.trim(),
    useCdn: false,
  });
}

// Minimal schema for block-tools to know the article body's block type.
const blockContentSchema = Schema.compile({
  name: 'tmp',
  types: [
    {
      name: 'article',
      type: 'document',
      fields: [
        {
          name: 'body',
          type: 'array',
          of: [{ type: 'block' }, { type: 'image' }],
        },
      ],
    },
  ],
})
  .get('article')
  .fields.find((f) => f.name === 'body').type;

async function ensureCategories(client) {
  const existing = await client.fetch(
    `*[_type=="category"]{_id,"slug":slug.current}`
  );
  const bySlug = new Map(existing.map((c) => [c.slug, c._id]));
  for (const seed of CATEGORY_SEED) {
    if (!bySlug.has(seed.slug)) {
      const created = await client.create({
        _type: 'category',
        title: seed.title,
        slug: { _type: 'slug', current: seed.slug },
        icon: seed.icon,
        order: seed.order,
      });
      bySlug.set(seed.slug, created._id);
      console.log(`  created category ${seed.slug} -> ${created._id}`);
    }
  }
  return bySlug;
}

async function uploadCover(client, srcPath, filename) {
  const buf = await readFile(srcPath);
  const asset = await client.assets.upload('image', buf, { filename });
  return asset._id;
}

function extractArticle(html) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const titleEl = doc.querySelector('article h1');
  const title = (titleEl?.textContent || doc.querySelector('title')?.textContent || '').trim();

  const article = doc.querySelector('article.article-content') || doc.querySelector('article');
  if (!article) throw new Error('No <article> element found');

  // Strip nav/meta noise that shouldn't be in body
  article.querySelector('.back-link')?.remove();
  article.querySelector('.article-cover')?.remove();
  article.querySelector('h1')?.remove();
  article.querySelector('.meta')?.remove();

  const firstP = article.querySelector('p');
  const excerptSrc = (firstP?.textContent || '').trim().replace(/\s+/g, ' ');
  const excerpt =
    excerptSrc.length > 180
      ? excerptSrc.slice(0, 177).trimEnd() + '…'
      : excerptSrc;

  const bodyHtml = article.innerHTML;
  const fullText = article.textContent || '';

  return { title, excerpt, bodyHtml, fullText };
}

function htmlToPortableText(html) {
  const blocks = htmlToBlocks(html, blockContentSchema, {
    parseHtml: (h) => new JSDOM(h).window.document,
  });
  return blocks;
}

async function main() {
  const client = makeClient();
  console.log('Connecting to Sanity…');
  const categoryIds = await ensureCategories(client);

  const existingArticles = await client.fetch(
    `*[_type=="article"]{"slug":slug.current}`
  );
  const existingSlugs = new Set(existingArticles.map((a) => a.slug));

  const results = [];
  for (const filename of ARTICLES) {
    const filePath = path.join(ROOT, 'public', 'blog', filename);
    const slug = filename.replace(/\.html$/, '');
    try {
      if (existingSlugs.has(slug)) {
        console.log(`[skip] ${slug} already exists`);
        results.push({ file: filename, slug, status: 'skipped (exists)' });
        continue;
      }

      const html = await readFile(filePath, 'utf8');
      const { title, excerpt, bodyHtml, fullText } = extractArticle(html);

      const cat = pickCategorySlug({ title, body: fullText });
      const categoryId = categoryIds.get(cat.slug);
      if (!categoryId) throw new Error(`category ${cat.slug} not found`);

      const blocks = htmlToPortableText(bodyHtml).map((b) => ({
        ...b,
        _key: b._key || Math.random().toString(36).slice(2, 14),
      }));

      // Upload cover image: convention is public/images/blog/<slug>.webp,
      // with one exception (tarot-fool-meaning → the-fool.webp).
      const coverCandidates = [
        path.join(ROOT, 'public', 'images', 'blog', `${slug}.webp`),
        slug === 'tarot-fool-meaning'
          ? path.join(ROOT, 'public', 'images', 'blog', 'the-fool.webp')
          : null,
      ].filter(Boolean);

      let coverImage = null;
      let coverPath = null;
      for (const candidate of coverCandidates) {
        try {
          await readFile(candidate);
          coverPath = candidate;
          break;
        } catch {
          /* not found */
        }
      }
      if (coverPath) {
        const assetId = await uploadCover(
          client,
          coverPath,
          path.basename(coverPath)
        );
        coverImage = {
          _type: 'image',
          asset: { _type: 'reference', _ref: assetId },
          alt: title,
        };
      }

      const doc = {
        _type: 'article',
        title,
        slug: { _type: 'slug', current: slug },
        excerpt,
        body: blocks,
        category: { _type: 'reference', _ref: categoryId },
        publishedAt: new Date().toISOString(),
        author: 'Pick Mystic',
        ...(coverImage ? { coverImage } : {}),
      };

      const created = await client.create(doc);
      console.log(
        `[ok] ${slug} -> ${created._id} (category=${cat.slug}${
          cat.confident ? '' : ' DEFAULT, please review'
        }, cover=${coverImage ? 'yes' : 'no'})`
      );
      results.push({
        file: filename,
        slug,
        title,
        category: cat.slug,
        categoryConfident: cat.confident,
        coverImage: !!coverImage,
        status: 'success',
        id: created._id,
      });
    } catch (err) {
      console.error(`[fail] ${slug}: ${err.message}`);
      results.push({
        file: filename,
        slug,
        status: 'failed',
        error: err.message,
      });
    }
  }

  console.log('\n=== Migration report ===');
  console.table(
    results.map((r) => ({
      title: (r.title || r.file).slice(0, 50),
      slug: r.slug,
      category: r.category || '-',
      cover: r.coverImage === undefined ? '-' : r.coverImage ? 'yes' : 'no',
      status: r.status,
    }))
  );

  const needsReview = results.filter(
    (r) => r.status === 'success' && r.categoryConfident === false
  );
  if (needsReview.length) {
    console.log('\nCategories to review manually:');
    for (const r of needsReview) console.log(`  - ${r.slug} (defaulted to love)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
