// ============================================
// TAROT ENGINE — reusable interpretation engine
// ไม่ยุ่งกับ DOM / ไม่ผูกกับหน้าใดหน้าหนึ่ง
// หน้าที่: โหลดข้อมูล → ตรวจจับเจตนา → สุ่มไพ่ → ประกอบคำทำนาย
//
// ขยายในอนาคตได้: ไพ่ครบ 78 ใบ, ไพ่กลับหัว (reversed),
// หมวดหมู่ใหม่, สเปรดแบบอื่น, หลายภาษา — โดยแก้แค่ไฟล์ JSON
// ============================================

(function (global) {
  'use strict';

  var DATA_PATHS = {
    cards: '/data/tarot-meanings.json',
    intents: '/data/intent-keywords.json',
    cardsV2: '/data/tarot-meanings-v2.json'
  };

  var v2State = {
    data: null,
    loadingPromise: null
  };

  var state = {
    cards: null,
    positions: null,
    intents: null,
    loaded: false,
    loadingPromise: null
  };

  function loadJSON(path) {
    return fetch(path, { cache: 'no-cache' }).then(function (res) {
      if (!res.ok) {
        throw new Error('โหลดข้อมูลไม่สำเร็จ (' + res.status + '): ' + path);
      }
      return res.json();
    });
  }

  // โหลดข้อมูลครั้งเดียว แล้ว cache ไว้ (เรียกซ้ำได้ปลอดภัย)
  function load() {
    if (state.loaded) return Promise.resolve(state);
    if (state.loadingPromise) return state.loadingPromise;

    state.loadingPromise = Promise
      .all([loadJSON(DATA_PATHS.cards), loadJSON(DATA_PATHS.intents)])
      .then(function (results) {
        var cardData = results[0];
        var intentData = results[1];
        state.cards = cardData.cards || [];
        state.positions = cardData.positions || [];
        state.intents = intentData.categories || [];
        state.loaded = true;
        return state;
      })
      .catch(function (err) {
        state.loadingPromise = null; // ให้ลองใหม่ได้
        throw err;
      });

    return state.loadingPromise;
  }

  function normalize(text) {
    return (text || '').toString().toLowerCase().trim();
  }

  // ----- Intent Detection: จับคู่คีย์เวิร์ดแบบง่าย (ยังไม่ใช้ AI) -----
  function detectIntent(question) {
    var q = normalize(question);
    var best = null;
    var bestScore = 0;
    var fallback = null;
    var matchedWords = [];

    (state.intents || []).forEach(function (cat) {
      // หมวดที่ไม่มีคีย์เวิร์ด = ค่าเริ่มต้น (general)
      if (!cat.keywords || cat.keywords.length === 0) {
        if (!fallback) fallback = cat;
        return;
      }
      var score = 0;
      var hits = [];
      cat.keywords.forEach(function (kw) {
        if (kw && q.indexOf(normalize(kw)) !== -1) {
          score++;
          hits.push(kw);
        }
      });
      // คะแนนสูงกว่าเท่านั้นจึงชนะ — เสมอกันให้หมวดที่มาก่อนใน JSON ชนะ
      if (score > bestScore) {
        bestScore = score;
        best = cat;
        matchedWords = hits;
      }
    });

    var category = best || fallback || (state.intents && state.intents[0]) || null;

    return {
      category: category,
      score: bestScore,
      matched: bestScore > 0,
      matchedWords: matchedWords
    };
  }

  // ----- สุ่มไพ่ (Fisher–Yates) -----
  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function drawCards(count) {
    count = count || 3;
    return shuffle(state.cards || []).slice(0, count);
  }

  // ดึงความหมายตามหมวด — เผื่อ reversed ในอนาคต (ตอนนี้ใช้ upright)
  function meaningFor(card, categoryId, orientation) {
    orientation = orientation || 'upright';
    var byCategory = card && card.meanings
      ? (card.meanings[categoryId] || card.meanings.general)
      : null;
    if (!byCategory) return '';
    return byCategory[orientation] || byCategory.upright || '';
  }

  // ประโยคนำของบทสรุป — อ้างถึงไพ่ 3 ใบที่ผู้ใช้เปิดได้จริง
  function buildSummaryLead(blocks) {
    var names = blocks.map(function (b) {
      return b.card.nameTh || b.card.name;
    });
    if (names.length === 3) {
      return 'ไพ่ทั้งสามใบของคุณ — ' + names[0] + ', ' + names[1] +
             ' และ ' + names[2] + ' — มาบรรจบกันเพื่อสะท้อนภาพช่วงเวลานี้ให้คุณเห็นชัดขึ้น';
    }
    return 'ไพ่ที่คุณเปิดได้กำลังสะท้อนภาพช่วงเวลานี้ให้คุณเห็นชัดขึ้น';
  }

  // ----- ประกอบคำทำนายฉบับสมบูรณ์ -----
  // คืนค่าเป็น "structured object" — หน้าเว็บค่อยนำไป render เอง
  function createReading(question, options) {
    options = options || {};
    if (!state.loaded) {
      throw new Error('TarotEngine: ต้องเรียก load() ให้เสร็จก่อนใช้ createReading()');
    }

    var positions = state.positions || [];
    var count = options.cardCount || positions.length || 3;

    var intent = detectIntent(question);
    var category = intent.category || {};
    var cards = drawCards(count);

    var blocks = cards.map(function (card, i) {
      var position = positions[i] || { num: i + 1, label: '', hint: '' };
      return {
        position: position,
        card: card,
        orientation: 'upright',
        keywords: (card.keywords || []).slice(),
        meaning: meaningFor(card, category.id, 'upright')
      };
    });

    return {
      question: (question || '').trim(),
      intent: intent,
      category: category,
      headline: category.headline || 'คำทำนายสำหรับคุณ',
      cards: blocks,
      summary: buildSummaryLead(blocks) + ' ' + (category.summary || ''),
      advice: category.advice || ''
    };
  }

  // ----- v2 meanings dataset (MVP-merged) -----
  function loadV2() {
    if (v2State.data) return Promise.resolve(v2State.data);
    if (v2State.loadingPromise) return v2State.loadingPromise;
    v2State.loadingPromise = loadJSON(DATA_PATHS.cardsV2)
      .then(function (data) {
        v2State.data = (data && typeof data === 'object') ? data : { cards: {} };
        if (!v2State.data.cards || typeof v2State.data.cards !== 'object') {
          v2State.data.cards = {};
        }
        return v2State.data;
      })
      .catch(function (err) {
        v2State.loadingPromise = null;
        throw err;
      });
    return v2State.loadingPromise;
  }

  // Safe lookup: returns { keywords:[], interpretation:'' } and never throws.
  // Falls back from requested category → 'future' → first available category → empty entry.
  function getV2Meaning(cardName, category, orientation) {
    orientation = orientation || 'upright';
    var empty = { keywords: [], interpretation: '' };
    if (!v2State.data || !v2State.data.cards) return empty;
    var card = v2State.data.cards[cardName];
    if (!card) return empty;

    function pick(cat) {
      var slot = cat && card[cat];
      if (!slot) return null;
      var entry = slot[orientation] || slot.upright;
      if (!entry) return null;
      return {
        keywords: Array.isArray(entry.keywords) ? entry.keywords.slice() : [],
        interpretation: typeof entry.interpretation === 'string' ? entry.interpretation : ''
      };
    }

    var result = pick(category) || pick('future');
    if (result) return result;

    // last-resort: first available category on this card
    var keys = Object.keys(card);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (k === 'arcana' || k === 'image') continue;
      var r = pick(k);
      if (r) return r;
    }
    return empty;
  }

  global.TarotEngine = {
    load: load,
    detectIntent: detectIntent,
    drawCards: drawCards,
    createReading: createReading,
    isLoaded: function () { return state.loaded; },
    loadV2: loadV2,
    getV2Meaning: getV2Meaning,
    isV2Loaded: function () { return !!v2State.data; }
  };
})(window);
