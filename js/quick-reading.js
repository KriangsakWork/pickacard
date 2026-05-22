// ============================================
// QUICK READING — page controller
// เชื่อม TarotEngine เข้ากับ DOM ของหน้า quick-reading.html
// (ตรรกะการตีความอยู่ใน tarot-engine.js — ไฟล์นี้ดูแลแค่ UI)
// ============================================

(function () {
  'use strict';

  function toggleMenu() {
    document.querySelector('.nav-menu').classList.toggle('open');
  }
  window.toggleMenu = toggleMenu;

  // ----- ป้องกัน XSS: escape ข้อความจากผู้ใช้ก่อนใส่ลง innerHTML -----
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
  }

  // ----- overlay ม่วงเข้มระหว่างเปิดคำทำนาย (โทนพิธีกรรม) -----
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

  // ----- สร้าง HTML ของบล็อกไพ่ 1 ใบ -----
  function renderCardBlock(block, index) {
    var card = block.card;
    var pos = block.position;
    var html = '';

    html += '<article class="reveal-card" style="animation-delay:' + (index * 0.12) + 's;">';
    html += '  <div class="rc-media">';
    html += '    <span class="rc-num">' + (index + 1) + '</span>';
    html += '    <img src="' + escapeHtml(card.image) + '" alt="ไพ่' +
            escapeHtml(card.nameTh || card.name) + '" loading="lazy">';
    html += '  </div>';
    html += '  <div class="rc-info">';
    html += '    <div class="rc-heading">';
    html += '      <span class="rc-phase">ใบที่ ' + (pos.num || index + 1) +
            ' · ' + escapeHtml(pos.label) + '</span>';
    html += '      <h3 class="rc-name">' + escapeHtml(card.name) + '</h3>';
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
    html += '  <p class="rc-text">' + escapeHtml(block.meaning) + '</p>';
    html += '</article>';
    return html;
  }

  // ----- render คำทำนายทั้งหมดลงหน้าจอ -----
  function renderReading(reading) {
    var cat = reading.category || {};
    var html = '';

    // header
    html += '<header class="reveal-head">';
    html += '  <div class="reveal-eyebrow">✦ คำทำนายจากคำถามของคุณ ✦</div>';
    html += '  <h2 class="reveal-title">' + escapeHtml(reading.headline) + '</h2>';
    html += '  <div class="quick-result-meta">';
    html += '    <span class="quick-qbubble">“' + escapeHtml(reading.question) + '”</span>';
    html += '    <span class="quick-cat-pill">' +
            escapeHtml((cat.emoji ? cat.emoji + ' ' : '') + (cat.label || '')) + '</span>';
    html += '  </div>';
    html += '</header>';

    // ไพ่ 3 ใบ
    html += '<div class="reveal-cards">';
    reading.cards.forEach(function (block, i) {
      html += renderCardBlock(block, i);
    });
    html += '</div>';

    // สรุปคำทำนาย
    var summaryDelay = reading.cards.length * 0.12 + 0.05;
    html += '<section class="reveal-summary" style="animation-delay:' + summaryDelay + 's;">';
    html += '  <div class="reveal-summary-icon">🌙</div>';
    html += '  <div class="reveal-summary-body">';
    html += '    <h3 class="reveal-summary-title">สรุปคำทำนาย</h3>';
    html += '    <p>' + escapeHtml(reading.summary) + '</p>';
    html += '  </div>';
    html += '</section>';

    // คำแนะนำจากจักรวาล
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
    if (input) {
      input.value = '';
      input.focus();
    }
  }

  // ----- จัดการ submit คำถาม -----
  var isTransitioning = false;

  function handleSubmit(question) {
    if (isTransitioning) return;
    isTransitioning = true;

    var overlay = createOverlay();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { overlay.classList.add('visible'); });
    });

    // รอ overlay ทึบเต็มที่ แล้วค่อยสลับหน้าใต้ overlay
    setTimeout(function () {
      try {
        var reading = TarotEngine.createReading(question);
        renderReading(reading);
        showReadingSection();
      } catch (err) {
        showError('ขออภัย เปิดคำทำนายไม่สำเร็จ ลองใหม่อีกครั้งนะ');
        console.error(err);
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

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('askForm');
    var input = document.getElementById('questionInput');
    var submitBtn = document.getElementById('askSubmit');

    // โหลดฐานข้อมูลไพ่ล่วงหน้า
    submitBtn.disabled = true;
    TarotEngine.load()
      .then(function () {
        submitBtn.disabled = false;
      })
      .catch(function (err) {
        console.error(err);
        showError('โหลดข้อมูลไพ่ไม่สำเร็จ กรุณารีเฟรชหน้านี้อีกครั้ง');
      });

    // ตัวอย่างคำถาม — คลิกแล้วเติมลงช่อง
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
        setTimeout(function () {
          input.classList.remove('quick-input-shake');
        }, 500);
        input.focus();
        return;
      }
      if (!TarotEngine.isLoaded()) {
        showError('ระบบกำลังเตรียมไพ่ รอสักครู่แล้วลองอีกครั้งนะ');
        return;
      }

      clearError();
      handleSubmit(question);
    });
  });
})();
