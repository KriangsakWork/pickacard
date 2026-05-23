// ============================================
// SPREAD GENERATOR — Phase 3
// สุ่มไพ่ตามเทมเพลตสเปรด (1 ใบ, 3 ใบ, Celtic Cross, custom)
// ไม่ยุ่งกับ DOM / ไม่ผูกกับความหมายไพ่ / ไม่สุ่มซ้ำในสเปรดเดียว
//
// API:
//   SpreadGenerator.load()                          -> Promise<spreadsObject>
//   SpreadGenerator.loadFrom(spreadsObject)         -> spreadsObject
//   SpreadGenerator.setCardPool(cardNames[])        -> string[]
//   SpreadGenerator.getSpread(spreadId)             -> SpreadTemplate
//   SpreadGenerator.listSpreads()                   -> SpreadTemplate[]
//   SpreadGenerator.generate(spreadId, options?)    -> SpreadResult
//
// options:
//   { rng?: () => number,   // (0..1) — inject for deterministic tests
//     pool?: string[] }     // override default pool for this call
//
// SpreadResult:
//   { spread: "quick3", name: "...", count: 3,
//     cards: [ { position, label, hint?, card }, ... ] }
// ============================================

(function (global) {
  'use strict';

  var DATA_PATH = '/data/spreads.json';

  var state = {
    spreads: null,        // raw object { spreads: {...}, default: '...' }
    cardPool: [],         // array of card name strings
    loadingPromise: null
  };

  function loadFrom(spreadsObject) {
    if (!spreadsObject || !spreadsObject.spreads) {
      throw new Error('SpreadGenerator: invalid spreads file (missing "spreads")');
    }
    // ตรวจสอบ schema ขั้นต่ำ: count == positions.length, position id ห้ามซ้ำ
    var ids = Object.keys(spreadsObject.spreads);
    for (var i = 0; i < ids.length; i++) {
      var s = spreadsObject.spreads[ids[i]];
      if (!Array.isArray(s.positions) || s.positions.length === 0) {
        throw new Error('SpreadGenerator: spread "' + ids[i] + '" has no positions');
      }
      if (typeof s.count === 'number' && s.count !== s.positions.length) {
        throw new Error('SpreadGenerator: spread "' + ids[i] + '" count != positions.length');
      }
      var seen = {};
      for (var j = 0; j < s.positions.length; j++) {
        var pid = s.positions[j].id;
        if (seen[pid]) {
          throw new Error('SpreadGenerator: duplicate position id "' + pid + '" in spread "' + ids[i] + '"');
        }
        seen[pid] = true;
      }
    }
    state.spreads = spreadsObject;
    return state.spreads;
  }

  function load() {
    if (state.spreads) return Promise.resolve(state.spreads);
    if (state.loadingPromise) return state.loadingPromise;

    state.loadingPromise = fetch(DATA_PATH, { cache: 'no-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('โหลดสเปรดไม่สำเร็จ (' + res.status + ')');
        return res.json();
      })
      .then(function (json) { loadFrom(json); return state.spreads; });

    return state.loadingPromise;
  }

  function setCardPool(cardNames) {
    if (!Array.isArray(cardNames)) {
      throw new Error('SpreadGenerator: setCardPool ต้องการ array ของชื่อไพ่');
    }
    // dedupe ชื่อไพ่กันเผลอ
    var seen = {};
    var unique = [];
    for (var i = 0; i < cardNames.length; i++) {
      var name = cardNames[i];
      if (typeof name === 'string' && name && !seen[name]) {
        seen[name] = true;
        unique.push(name);
      }
    }
    state.cardPool = unique;
    return state.cardPool.slice();
  }

  function getSpread(spreadId) {
    if (!state.spreads) {
      throw new Error('SpreadGenerator: ยังไม่ได้โหลดสเปรด — เรียก load() หรือ loadFrom()');
    }
    var id = spreadId || state.spreads['default'];
    var spread = state.spreads.spreads[id];
    if (!spread) {
      throw new Error('SpreadGenerator: ไม่พบสเปรด "' + id + '"');
    }
    return spread;
  }

  function listSpreads() {
    if (!state.spreads) return [];
    var out = [];
    var ids = Object.keys(state.spreads.spreads);
    for (var i = 0; i < ids.length; i++) out.push(state.spreads.spreads[ids[i]]);
    return out;
  }

  // Fisher–Yates shuffle (non-mutating) ด้วย rng ที่ inject ได้
  function shuffle(arr, rng) {
    var a = arr.slice();
    var rand = typeof rng === 'function' ? rng : Math.random;
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rand() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function generate(spreadId, options) {
    options = options || {};
    var spread = getSpread(spreadId);
    var pool = Array.isArray(options.pool) ? options.pool : state.cardPool;

    if (!pool || pool.length === 0) {
      throw new Error('SpreadGenerator: card pool ว่างเปล่า — เรียก setCardPool() ก่อน');
    }
    if (pool.length < spread.positions.length) {
      throw new Error(
        'SpreadGenerator: pool มี ' + pool.length + ' ใบ ไม่พอสำหรับสเปรด "' +
        spread.id + '" ที่ต้องการ ' + spread.positions.length + ' ใบ'
      );
    }

    var shuffled = shuffle(pool, options.rng);
    var picks = shuffled.slice(0, spread.positions.length);

    var cards = spread.positions.map(function (pos, idx) {
      var entry = { position: pos.id, label: pos.label, card: picks[idx] };
      if (pos.hint) entry.hint = pos.hint;
      return entry;
    });

    return {
      spread: spread.id,
      name: spread.name,
      count: spread.positions.length,
      cards: cards
    };
  }

  var api = {
    DATA_PATH: DATA_PATH,
    load: load,
    loadFrom: loadFrom,
    setCardPool: setCardPool,
    getSpread: getSpread,
    listSpreads: listSpreads,
    generate: generate,
    get cardPool() { return state.cardPool.slice(); }
  };

  global.SpreadGenerator = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
