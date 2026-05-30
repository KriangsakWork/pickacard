// Migrate 12 Pick a Card topics from HTML/JS sources into Sanity as
// pickTopic documents. Reads:
//   - js/readings-data.js         (READING_ITEMS catalog)
//   - js/readings-<slug>.js × 12  (READINGS = { 1..4 })
//
// Usage:
//   SANITY_API_TOKEN=<editor-token> node scripts/migrate-pick-topics.mjs
//
// Idempotent via createOrReplace for both pickTopic and category docs,
// and skips cover-image upload if the document already has an image.

import { createClient } from '@sanity/client';
import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { randomUUID } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

// .env.local loader (no dep)
try {
  const envText = await readFile(resolve(projectRoot, '.env.local'), 'utf8');
  for (const line of envText.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    }
  }
} catch {}

const projectId =
  process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  'production';
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.error('Missing SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_PROJECT_ID');
  process.exit(1);
}
if (!token) {
  console.error('Missing SANITY_API_TOKEN (write permission required).');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

// ---------- helpers ----------

async function fileExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

// Execute a legacy browser-style JS file (top-level `const FOO = ...`) and
// return whichever names you ask for. Uses a fresh VM context so top-level
// `const` becomes accessible via the context object.
async function loadLegacyModule(absPath, names) {
  const src = await readFile(absPath, 'utf8');
  const ctx = {};
  vm.createContext(ctx);
  const trailer = '\n;(() => { ' +
    names.map((n) => `globalThis.${n} = (typeof ${n} !== 'undefined') ? ${n} : undefined;`).join(' ') +
    ' })();';
  vm.runInContext(src + trailer, ctx, { filename: absPath });
  const out = {};
  for (const n of names) out[n] = ctx[n];
  return out;
}

// "The Moon" → "moon"; "Two of Cups" → "two-of-cups"; "Wheel of Fortune" → "wheel-of-fortune"
const SLUG_NO_STRIP = new Set([
  'strength', 'justice', 'judgement', 'temperance', 'death', 'wheel-of-fortune',
]);
function mapCardNameToSlug(name) {
  const raw = String(name)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  if (raw.startsWith('the-') && !SLUG_NO_STRIP.has(raw)) {
    return raw.slice(4);
  }
  return raw;
}

function splitTags(s) {
  if (!s) return [];
  return String(s)
    .split(/[,、、·]+|\s+/u)
    .map((t) => t.trim())
    .filter(Boolean);
}

function textToBlocks(text) {
  const paragraphs = String(text || '')
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  if (paragraphs.length === 0) return [];
  return paragraphs.map((p) => ({
    _type: 'block',
    _key: randomUUID().replace(/-/g, '').slice(0, 12),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: randomUUID().replace(/-/g, '').slice(0, 12),
        text: p,
        marks: [],
      },
    ],
  }));
}

// ---------- category seed ----------

const CATEGORY_DEFS = [
  { key: 'love',         title: 'ความรัก',      emoji: '💜' },
  { key: 'relationship', title: 'ความสัมพันธ์', emoji: '🌙' },
  { key: 'work',         title: 'การงาน',       emoji: '💼' },
  { key: 'finance',      title: 'การเงิน',      emoji: '💰' },
  { key: 'future',       title: 'อนาคต',        emoji: '✨' },
  { key: 'healing',      title: 'Healing',      emoji: '🕯️' },
];

async function ensureCategories() {
  // Discover the actual `category` schema fields so we don't fabricate them.
  const existing = await client.fetch(
    '*[_type == "category"]{ _id, "slug": slug.current, title }',
  );
  const bySlug = new Map(existing.map((c) => [c.slug, c]));
  const created = [];
  for (const def of CATEGORY_DEFS) {
    const id = `category-${def.key}`;
    if (bySlug.has(def.key) || existing.some((c) => c._id === id)) {
      continue;
    }
    await client.createIfNotExists({
      _id: id,
      _type: 'category',
      title: def.title,
      slug: { _type: 'slug', current: def.key },
    });
    created.push(def.key);
  }
  return { created, existing: existing.map((c) => c.slug) };
}

// ---------- result mapping ----------

function buildResult(num, raw, missingCards) {
  const cards = (raw.cards || []).map((c) => {
    const slug = mapCardNameToSlug(c.name);
    return {
      _type: 'pickCard',
      _key: randomUUID().replace(/-/g, '').slice(0, 12),
      cardRef: {
        _type: 'reference',
        _ref: `tarotCard-${slug}`,
      },
      position: c.phase || '',
      tags: splitTags(c.meaning),
      meaning: textToBlocks(c.text),
      _cardName: c.name,
      _cardSlug: slug,
    };
  });

  for (const c of cards) {
    missingCards.add(c._cardSlug + '::' + c._cardName);
    delete c._cardName;
    delete c._cardSlug;
  }

  return {
    _type: 'pickResult',
    _key: randomUUID().replace(/-/g, '').slice(0, 12),
    resultTitle: raw.intro || `ผลลัพธ์ที่ ${num}`,
    cards,
    summary: raw.message || '',
  };
}

// ---------- migrate one topic ----------

async function migrateTopic(item, knownCardSlugs, missingCards) {
  const docId = `pickTopic-${item.slug}`;
  const readingsPath = resolve(projectRoot, `js/readings-${item.slug}.js`);
  if (!(await fileExists(readingsPath))) {
    return { status: 'missing-readings', detail: readingsPath };
  }

  const { READINGS } = await loadLegacyModule(readingsPath, ['READINGS']);
  if (!READINGS || typeof READINGS !== 'object') {
    return { status: 'invalid-readings' };
  }

  const results = [];
  for (const num of [1, 2, 3, 4]) {
    const raw = READINGS[num];
    if (!raw) {
      return { status: 'missing-result', detail: `result ${num}` };
    }
    results.push(buildResult(num, raw, missingCards));
  }

  // Cover image
  const existing = await client.fetch(
    '*[_id == $id][0]{ _id, coverImage }',
    { id: docId },
  );
  let coverImage = existing?.coverImage;

  if (!coverImage?.asset?._ref && item.image) {
    const rel = item.image.replace(/^\//, '');
    const tryPaths = [
      resolve(projectRoot, 'public', rel),
      resolve(projectRoot, rel),
    ];
    let imgPath = null;
    for (const p of tryPaths) {
      if (await fileExists(p)) {
        imgPath = p;
        break;
      }
    }
    if (imgPath) {
      const buf = await readFile(imgPath);
      const asset = await client.assets.upload('image', buf, {
        filename: imgPath.split('/').pop(),
      });
      coverImage = {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
      };
    } else {
      return { status: 'missing-cover-image', detail: item.image };
    }
  }

  const doc = {
    _id: docId,
    _type: 'pickTopic',
    title: item.title,
    slug: { _type: 'slug', current: item.slug },
    shortDescription: item.hook || '',
    coverImage,
    category: {
      _type: 'reference',
      _ref: `category-${item.category}`,
    },
    isFeatured: !!item.featured,
    publishedAt: item.publishedAt
      ? new Date(item.publishedAt).toISOString()
      : new Date().toISOString(),
    results,
  };

  await client.createOrReplace(doc);

  // Verify card refs exist
  const unresolved = [];
  for (const r of results) {
    for (const c of r.cards) {
      const slug = c.cardRef._ref.replace(/^tarotCard-/, '');
      if (!knownCardSlugs.has(slug)) unresolved.push(slug);
    }
  }
  return { status: 'migrated', unresolved };
}

// ---------- main ----------

async function main() {
  console.log(`Migrating pick topics → ${projectId}/${dataset}\n`);

  // 1. Categories
  const cat = await ensureCategories();
  if (cat.created.length) {
    console.log('Created categories:', cat.created.join(', '));
  } else {
    console.log('All categories already exist.');
  }

  // 2. Known tarotCard slugs
  const cards = await client.fetch(
    '*[_type == "tarotCard"]{ "slug": slug.current }',
  );
  const knownCardSlugs = new Set(cards.map((c) => c.slug));
  console.log(`Loaded ${knownCardSlugs.size} tarot card slugs from Sanity.\n`);

  // 3. Catalog
  const dataPath = resolve(projectRoot, 'js/readings-data.js');
  const { READING_ITEMS } = await loadLegacyModule(dataPath, ['READING_ITEMS']);
  if (!Array.isArray(READING_ITEMS) || READING_ITEMS.length === 0) {
    console.error('Could not load READING_ITEMS.');
    process.exit(1);
  }
  console.log(`Found ${READING_ITEMS.length} topics in readings-data.js\n`);

  // 4. Migrate
  const counts = { migrated: 0, failed: 0 };
  const failed = [];
  const allUnresolved = new Set();
  for (let i = 0; i < READING_ITEMS.length; i++) {
    const item = READING_ITEMS[i];
    const label = `[${String(i + 1).padStart(2, '0')}/${READING_ITEMS.length}] ${item.slug}`;
    try {
      const res = await migrateTopic(item, knownCardSlugs, new Set());
      if (res.status === 'migrated') {
        counts.migrated++;
        if (res.unresolved.length) {
          console.log(`${label} ✓ migrated (⚠ unresolved cards: ${res.unresolved.join(', ')})`);
          res.unresolved.forEach((s) => allUnresolved.add(s));
        } else {
          console.log(`${label} ✓ migrated`);
        }
      } else {
        counts.failed++;
        failed.push(`${item.slug}: ${res.status}${res.detail ? ' — ' + res.detail : ''}`);
        console.log(`${label} ✗ ${res.status}${res.detail ? ' — ' + res.detail : ''}`);
      }
    } catch (err) {
      counts.failed++;
      failed.push(`${item.slug}: ${err.message}`);
      console.log(`${label} ✗ ${err.message}`);
    }
  }

  console.log('\nDone.');
  console.log(`  migrated: ${counts.migrated}`);
  console.log(`  failed:   ${counts.failed}`);
  if (failed.length) {
    console.log('\nFailures:');
    failed.forEach((f) => console.log('  - ' + f));
  }
  if (allUnresolved.size) {
    console.log('\nCard slugs referenced but NOT found in Sanity:');
    [...allUnresolved].sort().forEach((s) => console.log('  - ' + s));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
