// ============================================
// QUICK READING — page controller (Phase 5: wiring)
// CategoryDetector + SpreadGenerator + TarotEngine.getV2Meaning
// ============================================

(function () {
  'use strict';

  function toggleMenu() {
    document.querySelector('.nav-menu').classList.toggle('open');
  }
  window.toggleMenu = toggleMenu;

  // ---- category metadata for UI (label/emoji/headline/summary) ----
  // Static map keeps wiring deterministic — no AI / no LLM.
  var CATEGORY_META = {
    love:           { label: 'ความรัก',         emoji: '💜', headline: 'คำตอบเรื่องหัวใจที่คุณตามหา',
      summary: 'เรื่องของหัวใจไม่เคยมีสูตรสำเร็จ ทุกความรู้สึกที่เกิดขึ้นล้วนมีความหมาย ลองฟังเสียงข้างในอย่างอ่อนโยนแล้วให้เวลาเป็นเครื่องเปิดเผยคำตอบ',
      advice: 'รักตัวเองให้พอ ก่อนรอใครให้เต็มหัวใจของคุณ' },
    reconciliation: { label: 'การคืนดี',         emoji: '🕊️', headline: 'สัญญาณจากใจอีกฝ่าย',
      summary: 'การคืนดีต้องการเวลาและจังหวะที่เหมาะสม สิ่งที่คุณทำได้ในตอนนี้คือดูแลใจตัวเองให้พร้อม ไม่ว่าคำตอบจะเป็นอย่างไร',
      advice: 'อย่ารีบเร่งความสัมพันธ์ — ให้ใจทั้งสองได้มีพื้นที่หายใจ' },
    crush:          { label: 'คนที่แอบชอบ',     emoji: '💫', headline: 'ใจของอีกฝ่ายกำลังบอกอะไร',
      summary: 'ความรู้สึกแรกเริ่มมักเปราะบาง ค่อย ๆ ทำความรู้จักกันให้ลึกขึ้น ก่อนปั้นภาพในใจล่วงหน้า',
      advice: 'เปิดบทสนทนาเล็ก ๆ ด้วยความจริงใจ มันเดินทางได้ไกลกว่าที่คิด' },
    healing:        { label: 'การเยียวยาใจ',     emoji: '🌿', headline: 'แสงที่นำคุณกลับคืนสู่ตัวเอง',
      summary: 'ทุกบาดแผลต้องการเวลาและพื้นที่ในการรักษา อนุญาตให้ตัวเองได้รู้สึกโดยไม่ต้องตัดสิน',
      advice: 'ดูแลใจตัวเองวันนี้ เหมือนที่คุณเคยดูแลคนที่คุณรัก' },
    luck:           { label: 'โชคลาภ',          emoji: '🍀', headline: 'จังหวะโชคที่กำลังไหลมาหาคุณ',
      summary: 'โชคไม่ได้มาแบบหวือหวาเสมอ บางครั้งซ่อนอยู่ในรายละเอียดเล็ก ๆ ที่คุณเลือกจะใส่ใจ',
      advice: 'เปิดใจรับโอกาสที่ไม่อยู่ในแผน — บางครั้งมันคือคำตอบที่ใช่' },
    money:          { label: 'การเงิน',          emoji: '💰', headline: 'พลังงานทางการเงินของคุณตอนนี้',
      summary: 'เรื่องเงินสะท้อนทั้งการตัดสินใจและความเชื่อในตัวเอง วางแผนอย่างใจเย็นและตรวจสอบรายละเอียดให้ครบ',
      advice: 'อย่าให้ความกลัวตัดสินแทนคุณ — ลงมือทีละก้าวอย่างมีสติ' },
    career:         { label: 'การงาน',           emoji: '💼', headline: 'ทิศทางการงานที่จักรวาลกระซิบให้คุณฟัง',
      summary: 'งานที่ใช่คืองานที่ทำให้คุณยังเป็นตัวเอง ฟังเสียงข้างในให้บ่อยพอ ๆ กับฟังความเห็นคนอื่น',
      advice: 'ลงมือกับสิ่งที่ทำได้วันนี้ — เส้นทางจะค่อย ๆ ปรากฏเอง' },
    future:         { label: 'อนาคต',            emoji: '🌙', headline: 'ภาพข้างหน้าที่ไพ่อยากบอกคุณ',
      summary: 'อนาคตไม่ใช่สิ่งที่ถูกขีดไว้ตายตัว แต่คือผลของก้าวที่คุณเลือกในวันนี้ ค่อย ๆ เดินไปด้วยความเชื่อมั่นในตัวเอง',
      advice: 'ให้เวลาทำงานของมัน — สิ่งที่ใช่จะมาในจังหวะที่ใช่' }
  };

  function getCategoryMeta(id) {
    return CATEGORY_META[id] || CATEGORY_META.future;
  }

  // ----- XSS-safe text -----
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
  }

  function createOverlay() {
    var overlay = document.createElement('div');
    overlay.className = 'reveal-overlay';
    overlay.innerHTML =
      '<div class="reveal-overlay-icon">🔮</div>' +
      '<div class="reveal-overlay-text">กำลังเปิดไพ่ของคุณ...</div>' +
      '<img class="reveal-overlay-mascot" src="/images/fortune-rabbit-loading-mascot.png" alt="" aria-hidden="true">';
    document.body.appendChild(overlay);
    return overlay;
  }

  // ----- card block render (unchanged UI structure) -----
  function renderCardBlock(block, index) {
    var card = block.card || {};
    var pos = block.position || {};
    var html = '';

    html += '<article class="reveal-card" style="animation-delay:' + (index * 0.12) + 's;">';
    html += '  <div class="rc-media">';
    html += '    <span class="rc-num">' + (index + 1) + '</span>';
    html += '    <img src="' + escapeHtml(card.image || '/images/card-back.png') + '" alt="ไพ่' +
            escapeHtml(card.nameTh || card.name || '') + '" loading="lazy">';
    html += '  </div>';
    html += '  <div class="rc-info">';
    html += '    <div class="rc-heading">';
    html += '      <span class="rc-phase">ใบที่ ' + (pos.num || index + 1) +
            ' · ' + escapeHtml(pos.label || '') + '</span>';
    html += '      <h3 class="rc-name">' + escapeHtml(card.name || '') + '</h3>';
    if (card.nameTh) {
      html += '      <span class="rc-thai">' + escapeHtml(card.nameTh) + '</span>';
    }
    html += '    </div>';
    html += '    <ul class="rc-keywords">';
    (block.keywords || []).forEach(function (kw) {
      html += '<li>' + escapeHtml(kw) + '</li>';
    });
    html += '    </ul>';
    html += '  </div>';
    html += '  <p class="rc-text">' + escapeHtml(block.meaning || '') + '</p>';
    html += '</article>';
    return html;
  }

  function renderReading(reading) {
    var cat = reading.category || {};
    var html = '';

    html += '<header class="reveal-head">';
    html += '  <div class="reveal-eyebrow">✦ คำทำนายจากคำถามของคุณ ✦</div>';
    html += '  <h2 class="reveal-title">' + escapeHtml(reading.headline || '') + '</h2>';
    html += '  <div class="quick-result-meta">';
    html += '    <span class="quick-qbubble">“' + escapeHtml(reading.question) + '”</span>';
    html += '    <span class="quick-cat-pill">' +
            escapeHtml((cat.emoji ? cat.emoji + ' ' : '') + (cat.label || '')) + '</span>';
    html += '  </div>';
    html += '</header>';

    html += '<div class="reveal-cards">';
    reading.cards.forEach(function (block, i) {
      html += renderCardBlock(block, i);
    });
    html += '</div>';

    var summaryDelay = reading.cards.length * 0.12 + 0.05;
    html += '<section class="reveal-summary" style="animation-delay:' + summaryDelay + 's;">';
    html += '  <div class="reveal-summary-icon">🌙</div>';
    html += '  <div class="reveal-summary-body">';
    html += '    <h3 class="reveal-summary-title">สรุปคำทำนาย</h3>';
    html += '    <p>' + escapeHtml(reading.summary || '') + '</p>';
    html += '  </div>';
    html += '</section>';

    if (reading.advice) {
      html += '<section class="reveal-summary" style="animation-delay:' +
              (summaryDelay + 0.05) + 's;">';
      html += '  <div class="reveal-summary-icon">🕯️</div>';
      html += '  <div class="reveal-summary-body">';
      html += '    <h3 class="reveal-summary-title">คำแนะนำจากจักรวาล</h3>';
      html += '    <p>' + escapeHtml(reading.advice) + '</p>';
      html += '  </div>';
      html += '</section>';
    }

    html += '<p class="reveal-disclaimer">* คำทำนายนี้เป็นแนวทางเพื่อการพิจารณา ไม่สามารถยืนยันผลลัพธ์ได้แน่นอน</p>';

    html += '<div class="reveal-actions">';
    html += '  <button class="btn-reset" type="button" id="askAgainBtn">↺ ถามคำถามใหม่</button>';
    html += '  <a href="/" class="btn-back-home">← กลับหน้าแรก</a>';
    html += '</div>';

    document.getElementById('reading-content').innerHTML = html;

    var againBtn = document.getElementById('askAgainBtn');
    if (againBtn) againBtn.addEventListener('click', resetReading);
  }

  function showReadingSection() {
    document.getElementById('ask-section').style.display = 'none';
    var section = document.getElementById('reading-section');
    section.style.display = 'block';
    setTimeout(function () {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  function resetReading() {
    document.getElementById('reading-section').style.display = 'none';
    document.getElementById('reading-content').innerHTML = '';
    document.getElementById('ask-section').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    var input = document.getElementById('questionInput');
    if (input) { input.value = ''; input.focus(); }
  }

  // ----- de-Englishify card key into a friendly display name -----
  function buildCardObject(cardName, v2Data) {
    var meta = (v2Data && v2Data.cards && v2Data.cards[cardName]) || {};
    return {
      name: cardName,
      nameTh: meta.nameTh || '',
      image: meta.image || '/images/card-back.png',
      arcana: meta.arcana || ''
    };
  }

  // ----- THE WIRING: question → category → spread → meanings → reading object -----
  function buildReading(question) {
    var v2 = TarotEngine.isV2Loaded() ? null : null; // accessed via getV2Meaning
    var v2Data = window.__v2Data || null;

    // 1) detect category (with graceful fallback)
    var detected;
    try {
      detected = CategoryDetector.detect(question);
    } catch (err) {
      console.warn('[wiring] category detect failed, using future fallback:', err);
      detected = { category: 'future', score: 0, matches: [], fallback: true, scores: {} };
    }
    var categoryId = detected.category || 'future';
    var catMeta = getCategoryMeta(categoryId);
    console.log('[wiring] detected category:', categoryId, 'score:', detected.score, 'matches:', detected.matches);

    // 2) generate quick3 spread (no duplicates — guaranteed by SpreadGenerator)
    var spreadResult;
    try {
      spreadResult = SpreadGenerator.generate('quick3');
    } catch (err) {
      console.warn('[wiring] spread generation failed:', err);
      // fallback: try to build a minimal 3-card structure manually from pool
      var pool = (v2Data && v2Data.cards) ? Object.keys(v2Data.cards) : [];
      var picks = pool.slice(0, 3);
      spreadResult = {
        spread: 'quick3', name: 'สเปรด 3 ใบ', count: picks.length,
        cards: picks.map(function (n, i) {
          var labels = ['สถานการณ์ปัจจุบัน', 'สิ่งที่ซ่อนอยู่', 'แนวโน้มและคำแนะนำ'];
          var ids = ['current', 'hidden', 'guidance'];
          return { position: ids[i], label: labels[i], card: n };
        })
      };
    }
    console.log('[wiring] generated cards:', spreadResult.cards.map(function (c) { return c.card; }));

    // 3) pull meanings (fallback chain handled by getV2Meaning)
    var blocks = spreadResult.cards.map(function (slot, idx) {
      var entry = TarotEngine.getV2Meaning(slot.card, categoryId, 'upright');
      console.log('[wiring] meaning lookup:', slot.card, '→', categoryId,
                  'keywords:', entry.keywords.length, 'len:', entry.interpretation.length);
      var cardObj = buildCardObject(slot.card, v2Data);
      return {
        position: { num: idx + 1, label: slot.label, id: slot.position },
        card: cardObj,
        orientation: 'upright',
        keywords: entry.keywords,
        meaning: entry.interpretation
      };
    });

    // 4) build summary lead from card names (deterministic, no LLM)
    var names = blocks.map(function (b) { return b.card.nameTh || b.card.name; });
    var lead = names.length === 3
      ? 'ไพ่ทั้งสามใบของคุณ — ' + names[0] + ', ' + names[1] + ' และ ' + names[2] +
        ' — มาบรรจบกันเพื่อสะท้อนภาพช่วงเวลานี้ให้คุณเห็นชัดขึ้น'
      : 'ไพ่ที่คุณเปิดได้กำลังสะท้อนภาพช่วงเวลานี้ให้คุณเห็นชัดขึ้น';

    return {
      question: (question || '').trim(),
      category: { id: categoryId, label: catMeta.label, emoji: catMeta.emoji },
      spread: spreadResult.spread,
      headline: catMeta.headline,
      cards: blocks,
      summary: lead + ' ' + (catMeta.summary || ''),
      advice: catMeta.advice || ''
    };
  }

  // ----- submit handler -----
  var isTransitioning = false;

  function handleSubmit(question) {
    if (isTransitioning) return;
    isTransitioning = true;

    var overlay = createOverlay();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { overlay.classList.add('visible'); });
    });

    setTimeout(function () {
      try {
        var reading = buildReading(question);
        renderReading(reading);
        showReadingSection();
      } catch (err) {
        console.error('[wiring] reading failed:', err);
        showError('ขออภัย เปิดคำทำนายไม่สำเร็จ ลองใหม่อีกครั้งนะ');
      }
      overlay.classList.remove('visible');
      setTimeout(function () {
        overlay.remove();
        isTransitioning = false;
      }, 400);
    }, 650);
  }

  function showError(message) {
    var box = document.getElementById('askError');
    if (!box) return;
    box.textContent = message;
    box.hidden = false;
  }

  function clearError() {
    var box = document.getElementById('askError');
    if (box) box.hidden = true;
  }

  // ----- preload all data sources in parallel -----
  function preloadAll() {
    return Promise.all([
      CategoryDetector.load(),
      SpreadGenerator.load(),
      TarotEngine.loadV2()
    ]).then(function (results) {
      var v2 = results[2];
      window.__v2Data = v2;
      var pool = (v2 && v2.cards) ? Object.keys(v2.cards) : [];
      if (pool.length === 0) {
        throw new Error('ไม่มีไพ่ในชุดข้อมูล v2');
      }
      SpreadGenerator.setCardPool(pool);
      console.log('[wiring] preloaded — pool size:', pool.length,
                  'categories:', CategoryDetector.CATEGORIES);
      return v2;
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('askForm');
    var input = document.getElementById('questionInput');
    var submitBtn = document.getElementById('askSubmit');

    submitBtn.disabled = true;
    preloadAll()
      .then(function () { submitBtn.disabled = false; })
      .catch(function (err) {
        console.error(err);
        showError('โหลดข้อมูลไพ่ไม่สำเร็จ กรุณารีเฟรชหน้านี้อีกครั้ง');
      });

    document.querySelectorAll('.quick-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        input.value = chip.getAttribute('data-question') || chip.textContent.trim();
        clearError();
        input.focus();
      });
    });

    input.addEventListener('input', clearError);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var question = input.value.trim();

      if (question.length < 2) {
        showError('พิมพ์คำถามที่อยู่ในใจคุณก่อนนะ แล้วค่อยเปิดไพ่');
        input.classList.add('quick-input-shake');
        setTimeout(function () { input.classList.remove('quick-input-shake'); }, 500);
        input.focus();
        return;
      }
      if (submitBtn.disabled) {
        showError('ระบบกำลังเตรียมไพ่ รอสักครู่แล้วลองอีกครั้งนะ');
        return;
      }

      clearError();
      handleSubmit(question);
    });
  });
})();
