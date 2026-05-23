// ============================================
// CATEGORY DETECTOR — Phase 2
// ตรวจจับหมวดคำถามด้วยการจับคู่คีย์เวิร์ดแบบ deterministic
// ไม่ใช้ AI / ไม่เรียก API / ไม่ยุ่งกับ DOM
//
// API:
//   CategoryDetector.load()                    -> Promise<map>
//   CategoryDetector.loadFrom(mapObject)       -> map (sync)
//   CategoryDetector.detect(text)              -> { category, score, matches, scores }
//   CategoryDetector.detectAll(text)           -> [ { id, score, matches }, ... ]
//   CategoryDetector.CATEGORIES                -> string[]  (ids ตามลำดับ priority)
// ============================================

(function (global) {
  'use strict';

  var DATA_PATH = '/data/category-keywords.json';

  var state = {
    map: null,            // raw JSON object
    categoryOrder: null,  // ids sorted by priority asc
    fallback: 'future',
    loadingPromise: null
  };

  function normalize(text) {
    if (text == null) return '';
    return String(text).toLowerCase().trim();
  }

  function loadFrom(mapObject) {
    if (!mapObject || !mapObject.categories) {
      throw new Error('CategoryDetector: invalid map (missing "categories")');
    }
    state.map = mapObject;
    state.fallback = mapObject.fallbackCategory || 'future';
    state.categoryOrder = Object.keys(mapObject.categories).sort(function (a, b) {
      var pa = mapObject.categories[a].priority || 999;
      var pb = mapObject.categories[b].priority || 999;
      return pa - pb;
    });
    return state.map;
  }

  function load() {
    if (state.map) return Promise.resolve(state.map);
    if (state.loadingPromise) return state.loadingPromise;

    state.loadingPromise = fetch(DATA_PATH, { cache: 'no-cache' })
      .then(function (res) {
        if (!res.ok) {
          throw new Error('โหลดข้อมูลหมวดไม่สำเร็จ (' + res.status + ')');
        }
        return res.json();
      })
      .then(function (json) {
        loadFrom(json);
        return state.map;
      });

    return state.loadingPromise;
  }

  // นับจำนวนคีย์เวิร์ดที่พบในข้อความ
  // - คีย์เวิร์ดยาวกว่าจะถูกตรวจก่อน เพื่อไม่ให้คำสั้นกินคำยาว
  // - หนึ่งคีย์เวิร์ดนับแค่ครั้งเดียวต่อหมวด
  function scoreCategory(text, keywords) {
    var matches = [];
    var sorted = keywords.slice().sort(function (a, b) {
      return b.length - a.length;
    });
    for (var i = 0; i < sorted.length; i++) {
      var kw = normalize(sorted[i]);
      if (kw && text.indexOf(kw) !== -1 && matches.indexOf(kw) === -1) {
        matches.push(kw);
      }
    }
    return matches;
  }

  function detectAll(text) {
    if (!state.map) {
      throw new Error('CategoryDetector: ยังไม่ได้โหลดข้อมูล เรียก load() หรือ loadFrom() ก่อน');
    }
    var normalized = normalize(text);
    var cats = state.map.categories;
    var results = [];

    for (var i = 0; i < state.categoryOrder.length; i++) {
      var id = state.categoryOrder[i];
      var matches = scoreCategory(normalized, cats[id].keywords || []);
      results.push({
        id: id,
        score: matches.length,
        matches: matches,
        priority: cats[id].priority || 999
      });
    }

    // จัดเรียง: คะแนนมากก่อน, ถ้าเท่ากันใช้ priority น้อยกว่า
    results.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.priority - b.priority;
    });

    return results;
  }

  function detect(text) {
    var all = detectAll(text);
    var top = all[0];
    var scores = {};
    for (var i = 0; i < all.length; i++) {
      scores[all[i].id] = all[i].score;
    }

    if (!top || top.score === 0) {
      return {
        category: state.fallback,
        score: 0,
        matches: [],
        fallback: true,
        scores: scores
      };
    }

    return {
      category: top.id,
      score: top.score,
      matches: top.matches,
      fallback: false,
      scores: scores
    };
  }

  var api = {
    DATA_PATH: DATA_PATH,
    load: load,
    loadFrom: loadFrom,
    detect: detect,
    detectAll: detectAll,
    get CATEGORIES() {
      return state.categoryOrder ? state.categoryOrder.slice() : [];
    },
    get fallback() {
      return state.fallback;
    }
  };

  // Browser global
  global.CategoryDetector = api;

  // CommonJS (สำหรับเทสต์ด้วย node)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
