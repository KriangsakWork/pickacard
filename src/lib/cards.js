import meaningsV1 from '@/data/tarot/tarot-meanings.json';
import meaningsV2 from '@/data/tarot/tarot-meanings-v2.json';

function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

const nameTh = Object.fromEntries(
  meaningsV1.cards.map(c => [c.name, c.nameTh])
);

const arcanaMap = Object.fromEntries(
  meaningsV1.cards.map(c => [c.name, c.arcana])
);

export const CATEGORY_LABELS = {
  love: 'ความรัก',
  reconciliation: 'การคืนดี',
  crush: 'คนที่แอบชอบ',
  career: 'การงาน',
  money: 'การเงิน',
  luck: 'โชคลาภ',
  future: 'อนาคต',
  healing: 'การเยียวยาใจ',
};

export const ALL_CARDS = Object.entries(meaningsV2.cards).map(([name, byCategory]) => {
  const slug = slugify(name);
  const categories = Object.entries(byCategory).map(([cat, byOri]) => ({
    key: cat,
    label: CATEGORY_LABELS[cat] || cat,
    upright: byOri.upright || null,
  }));
  return {
    slug,
    name,
    nameTh: nameTh[name] || name,
    arcana: arcanaMap[name] || 'unknown',
    image: `/images/tarot/${slug}.webp`,
    categories,
  };
});

export function getCardBySlug(slug) {
  return ALL_CARDS.find(c => c.slug === slug);
}
