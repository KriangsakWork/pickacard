import v2 from '@/data/tarot/tarot-meanings-v2.json';

const CARDS = v2.cards || {};
export const ALL_V2_CARD_NAMES = Object.keys(CARDS);

function pickSlot(cardEntry, category, orientation = 'upright') {
  const slot = cardEntry?.[category];
  if (!slot) return null;
  const entry = slot[orientation] || slot.upright;
  if (!entry) return null;
  return {
    keywords: Array.isArray(entry.keywords) ? entry.keywords.slice() : [],
    interpretation: typeof entry.interpretation === 'string' ? entry.interpretation : '',
  };
}

// Same fallback chain as the legacy TarotEngine.getV2Meaning:
// requested category → 'future' → first available category → empty entry.
export function getV2Meaning(cardName, category, orientation = 'upright') {
  const empty = { keywords: [], interpretation: '' };
  const cardEntry = CARDS[cardName];
  if (!cardEntry) return empty;

  const hit = pickSlot(cardEntry, category, orientation)
    || pickSlot(cardEntry, 'future', orientation);
  if (hit) return hit;

  for (const k of Object.keys(cardEntry)) {
    if (k === 'arcana' || k === 'image' || k === 'nameTh') continue;
    const r = pickSlot(cardEntry, k, orientation);
    if (r) return r;
  }
  return empty;
}

export function getCardMeta(cardName) {
  const entry = CARDS[cardName] || {};
  return {
    name: cardName,
    nameTh: entry.nameTh || '',
    image: entry.image || '/images/card-back.webp',
    arcana: entry.arcana || '',
  };
}
