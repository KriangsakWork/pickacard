import categoryKeywords from '@/data/tarot/category-keywords.json';

const FALLBACK = categoryKeywords.fallbackCategory || 'future';
const CATS = categoryKeywords.categories || {};
const ORDER = Object.keys(CATS).sort(
  (a, b) => (CATS[a].priority || 999) - (CATS[b].priority || 999)
);

function normalize(text) {
  return String(text ?? '').toLowerCase().trim();
}

// Count keyword matches in `text` for one category.
// Longer keywords are checked first so short tokens don't shadow longer ones.
function matchKeywords(text, keywords) {
  const matches = [];
  const sorted = [...keywords].sort((a, b) => b.length - a.length);
  for (const raw of sorted) {
    const kw = normalize(raw);
    if (kw && text.includes(kw) && !matches.includes(kw)) {
      matches.push(kw);
    }
  }
  return matches;
}

export function detect(text) {
  const normalized = normalize(text);
  const results = ORDER.map(id => {
    const matches = matchKeywords(normalized, CATS[id].keywords || []);
    return { id, score: matches.length, matches, priority: CATS[id].priority || 999 };
  });

  results.sort((a, b) => (b.score - a.score) || (a.priority - b.priority));

  const top = results[0];
  const scores = Object.fromEntries(results.map(r => [r.id, r.score]));

  if (!top || top.score === 0) {
    return { category: FALLBACK, score: 0, matches: [], fallback: true, scores };
  }
  return { category: top.id, score: top.score, matches: top.matches, fallback: false, scores };
}

export const CATEGORIES = ORDER;
