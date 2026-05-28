import spreadsData from '@/data/tarot/spreads.json';

const SPREADS = spreadsData.spreads || {};
const DEFAULT_ID = spreadsData.default || 'quick3';

function fisherYates(arr, rng) {
  const a = arr.slice();
  const rand = typeof rng === 'function' ? rng : Math.random;
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getSpread(id) {
  const spreadId = id || DEFAULT_ID;
  const spread = SPREADS[spreadId];
  if (!spread) throw new Error(`unknown spread "${spreadId}"`);
  return spread;
}

export function generate(spreadId, pool, options = {}) {
  const spread = getSpread(spreadId);
  if (!Array.isArray(pool) || pool.length < spread.positions.length) {
    throw new Error(`pool has ${pool?.length || 0} cards, spread needs ${spread.positions.length}`);
  }
  const picks = fisherYates(pool, options.rng).slice(0, spread.positions.length);

  return {
    spread: spread.id,
    name: spread.name,
    count: spread.positions.length,
    cards: spread.positions.map((pos, i) => ({
      position: pos.id,
      label: pos.label,
      hint: pos.hint,
      card: picks[i],
    })),
  };
}
