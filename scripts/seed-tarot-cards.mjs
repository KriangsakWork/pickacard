// Seed 78 tarot cards into Sanity as a master list.
//
// Usage:
//   SANITY_API_TOKEN=<write-token> node scripts/seed-tarot-cards.mjs
//
// Idempotent: re-running skips cards that already exist with an image attached.

import { createClient } from '@sanity/client';
import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

// Load .env.local if present (lightweight, no dependency).
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
  console.error('Missing SANITY_API_TOKEN (needs write permission).');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

// ---------- 78 cards ----------

const MAJOR = [
  ['fool', 'The Fool', 'เดอะ ฟูล', 0, 'the-fool'],
  ['magician', 'The Magician', 'เดอะ เมจิเชี่ยน', 1, 'the-magician'],
  ['high-priestess', 'The High Priestess', 'เดอะ ไฮ พรีสเทส', 2, 'the-high-priestess'],
  ['empress', 'The Empress', 'เดอะ เอ็มเพรส', 3, 'the-empress'],
  ['emperor', 'The Emperor', 'เดอะ เอ็มเพอเรอร์', 4, 'the-emperor'],
  ['hierophant', 'The Hierophant', 'เดอะ ไฮโรแฟนต์', 5, 'the-hierophant'],
  ['lovers', 'The Lovers', 'เดอะ เลิฟเวอร์ส', 6, 'the-lovers'],
  ['chariot', 'The Chariot', 'เดอะ แชริออท', 7, 'the-chariot'],
  ['strength', 'Strength', 'สเตรงท์', 8, 'strength'],
  ['hermit', 'The Hermit', 'เดอะ เฮอร์มิต', 9, 'the-hermit'],
  ['wheel-of-fortune', 'Wheel of Fortune', 'วีล ออฟ ฟอร์จูน', 10, 'wheel-of-fortune'],
  ['justice', 'Justice', 'จัสติส', 11, 'justice'],
  ['hanged-man', 'The Hanged Man', 'เดอะ แฮงด์แมน', 12, 'the-hanged-man'],
  ['death', 'Death', 'เดธ', 13, 'death'],
  ['temperance', 'Temperance', 'เทมเพอแรนซ์', 14, 'temperance'],
  ['devil', 'The Devil', 'เดอะ เดวิล', 15, 'the-devil'],
  ['tower', 'The Tower', 'เดอะ ทาวเวอร์', 16, 'the-tower'],
  ['star', 'The Star', 'เดอะ สตาร์', 17, 'the-star'],
  ['moon', 'The Moon', 'เดอะ มูน', 18, 'the-moon'],
  ['sun', 'The Sun', 'เดอะ ซัน', 19, 'the-sun'],
  ['judgement', 'Judgement', 'จัดจ์เมนต์', 20, 'judgement'],
  ['world', 'The World', 'เดอะ เวิลด์', 21, 'the-world'],
];

const SUITS = [
  ['cups', 'Cups', 'ถ้วย'],
  ['wands', 'Wands', 'ไม้เท้า'],
  ['swords', 'Swords', 'ดาบ'],
  ['pentacles', 'Pentacles', 'เหรียญ'],
];

const RANKS = [
  ['ace', 'Ace', 'เอซ', 1],
  ['two', 'Two', 'สอง', 2],
  ['three', 'Three', 'สาม', 3],
  ['four', 'Four', 'สี่', 4],
  ['five', 'Five', 'ห้า', 5],
  ['six', 'Six', 'หก', 6],
  ['seven', 'Seven', 'เจ็ด', 7],
  ['eight', 'Eight', 'แปด', 8],
  ['nine', 'Nine', 'เก้า', 9],
  ['ten', 'Ten', 'สิบ', 10],
  ['page', 'Page', 'เพจ', 11],
  ['knight', 'Knight', 'อัศวิน', 12],
  ['queen', 'Queen', 'ราชินี', 13],
  ['king', 'King', 'ราชา', 14],
];

const TAROT_CARDS = [];

for (const [slug, name, nameTh, number, file] of MAJOR) {
  TAROT_CARDS.push({
    slug,
    name,
    nameTh,
    arcana: 'major',
    suit: 'none',
    number,
    imagePath: `public/images/tarot/${file}.webp`,
  });
}

for (const [suitSlug, suitEn, suitTh] of SUITS) {
  for (const [rankSlug, rankEn, rankTh, number] of RANKS) {
    const slug = `${rankSlug}-of-${suitSlug}`;
    TAROT_CARDS.push({
      slug,
      name: `${rankEn} of ${suitEn}`,
      nameTh: `${rankTh}${suitTh}`,
      arcana: 'minor',
      suit: suitSlug,
      number,
      imagePath: `public/images/tarot/${slug}.webp`,
    });
  }
}

// ---------- Seed ----------

async function fileExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function seedCard(card, index, total) {
  const docId = `tarotCard-${card.slug}`;
  const label = `[${String(index + 1).padStart(2, '0')}/${total}] ${card.slug}`;

  const existing = await client.fetch(
    '*[_id == $id][0]{_id, image}',
    { id: docId },
  );
  if (existing?.image?.asset?._ref) {
    console.log(`${label} ⏭  already exists, skip`);
    return { status: 'skipped' };
  }

  const absImagePath = resolve(projectRoot, card.imagePath);
  if (!(await fileExists(absImagePath))) {
    console.log(`${label} ⚠  image missing: ${card.imagePath}`);
    return { status: 'missing-image' };
  }

  const buf = await readFile(absImagePath);
  const asset = await client.assets.upload('image', buf, {
    filename: `${card.slug}.webp`,
    contentType: 'image/webp',
  });

  await client.createOrReplace({
    _id: docId,
    _type: 'tarotCard',
    name: card.name,
    nameTh: card.nameTh,
    slug: { _type: 'slug', current: card.slug },
    arcana: card.arcana,
    suit: card.suit,
    number: card.number,
    image: {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
    },
  });

  console.log(`${label} ✓ uploaded`);
  return { status: 'uploaded' };
}

async function main() {
  console.log(
    `Seeding ${TAROT_CARDS.length} tarot cards → ${projectId}/${dataset}\n`,
  );
  const counts = { uploaded: 0, skipped: 0, 'missing-image': 0 };
  for (let i = 0; i < TAROT_CARDS.length; i++) {
    try {
      const { status } = await seedCard(TAROT_CARDS[i], i, TAROT_CARDS.length);
      counts[status]++;
    } catch (err) {
      console.error(`✗ ${TAROT_CARDS[i].slug}:`, err.message);
    }
  }
  console.log('\nDone.');
  console.log(`  uploaded: ${counts.uploaded}`);
  console.log(`  skipped:  ${counts.skipped}`);
  console.log(`  missing:  ${counts['missing-image']}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
