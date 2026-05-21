// ============================================
// READING PAGE JS - Pick a Card functionality
// ============================================

function toggleMenu() {
  document.querySelector('.nav-menu').classList.toggle('open');
}

function showReading(pile) {
  const reading = READINGS[pile];
  if (!reading) return;

  let html = '';

  html += '<header class="reveal-head">';
  html += '  <div class="reveal-eyebrow">✦ คำทำนายสำหรับคุณ ✦</div>';
  html += '  <h2 class="reveal-title">' + reading.intro + '</h2>';
  html += '  <p class="reveal-sub">ไพ่ทั้ง 3 ใบนี้คือคำแนะนำและคำตอบที่คุณกำลังมองหา</p>';
  html += '</header>';

  html += '<div class="reveal-cards">';
  reading.cards.forEach((card, i) => {
    const imgSlug = card.name.toLowerCase().replace(/\s+/g, '-');
    const keywords = card.meaning.trim().split(/\s+/);
    html += '<article class="reveal-card" style="animation-delay: ' + (i * 0.12) + 's;">';
    html += '  <div class="rc-media">';
    html += '    <span class="rc-num">' + (i + 1) + '</span>';
    if (card.hasImage === false) {
      html += '    <div class="rc-placeholder"><span>' + card.name + '</span></div>';
    } else {
      html += '    <img src="/images/tarot/' + imgSlug + '.png" alt="' + card.name + '" loading="lazy">';
    }
    html += '  </div>';
    html += '  <div class="rc-info">';
    html += '    <div class="rc-heading">';
    html += '      <span class="rc-phase">' + card.phase + '</span>';
    html += '      <h3 class="rc-name">' + card.name + '</h3>';
    if (card.thai) { html += '      <span class="rc-thai">' + card.thai + '</span>'; }
    html += '    </div>';
    html += '    <ul class="rc-keywords">';
    keywords.forEach(kw => { html += '<li>' + kw + '</li>'; });
    html += '    </ul>';
    html += '  </div>';
    html += '  <p class="rc-text">' + card.text + '</p>';
    html += '</article>';
  });
  html += '</div>';

  html += '<section class="reveal-summary" style="animation-delay: ' + (reading.cards.length * 0.12 + 0.05) + 's;">';
  html += '  <div class="reveal-summary-icon">🌙</div>';
  html += '  <div class="reveal-summary-body">';
  html += '    <h3 class="reveal-summary-title">สรุปคำทำนาย</h3>';
  html += '    <p>' + reading.message + '</p>';
  html += '  </div>';
  html += '</section>';

  html += '<p class="reveal-disclaimer">* คำทำนายนี้เป็นแนวทางเพื่อการพิจารณา ไม่สามารถยืนยันผลลัพธ์ได้แน่นอน</p>';

  html += '<div class="reveal-actions">';
  html += '  <button class="btn-reset" onclick="resetReading()">↺ เปิดไพ่ใหม่</button>';
  html += '  <a href="/" class="btn-back-home">← กลับหน้าแรก</a>';
  html += '</div>';

  document.getElementById('reading-content').innerHTML = html;
  document.getElementById('reading-section').style.display = 'block';
  document.getElementById('pick-section').style.display = 'none';

  setTimeout(() => {
    document.getElementById('reading-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function resetReading() {
  document.getElementById('reading-section').style.display = 'none';
  document.getElementById('reading-content').innerHTML = '';
  document.getElementById('pick-section').style.display = 'block';
  document.getElementById('pick-section').scrollIntoView({ behavior: 'smooth' });

  // รีเซ็ตสถานะไพ่ทั้งหมดให้พร้อมเลือกใหม่
  selectedCard = null;
  isTransitioning = false;
  document.querySelectorAll('.pile').forEach(p => p.classList.remove('selected', 'dimmed'));
  const grid = document.querySelector('.cards-grid');
  if (grid) grid.classList.remove('locked');
}

let selectedCard = null;      // ไพ่ที่เลือก
let isTransitioning = false;  // กันแตะซ้ำระหว่างช่วงเปลี่ยนหน้า

// สร้าง overlay สีม่วงเข้มก่อนเข้าหน้าคำทำนาย
function createOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'reveal-overlay';
  overlay.innerHTML =
    '<div class="reveal-overlay-icon">🔮</div>' +
    '<div class="reveal-overlay-text">กำลังเปิดคำทำนาย...</div>';
  document.body.appendChild(overlay);
  return overlay;
}

document.addEventListener('DOMContentLoaded', function() {
  const piles = document.querySelectorAll('.pile');
  const grid = document.querySelector('.cards-grid');

  // ใส่ badge ให้ทุกใบ (ซ่อนไว้ด้วย CSS จนกว่าจะถูกเลือก)
  piles.forEach(pile => {
    const badge = document.createElement('div');
    badge.className = 'pile-badge';
    badge.textContent = '✨ ไพ่ของคุณ';
    pile.appendChild(badge);
  });

  piles.forEach(pile => {
    pile.addEventListener('click', function() {
      if (isTransitioning) return;
      isTransitioning = true;

      const cardId = this.getAttribute('data-pile');
      selectedCard = cardId;

      // ไพ่ที่เลือก: เด้ง+glow+badge / ไพ่ใบอื่น: จางลง
      piles.forEach(p => {
        p.classList.remove('selected', 'dimmed');
        p.classList.add(p === this ? 'selected' : 'dimmed');
      });
      if (grid) grid.classList.add('locked');

      // หน่วง 700ms ให้แอนิเมชันเลือกไพ่เล่นจบ แล้วค่อยขึ้น overlay
      setTimeout(() => {
        const overlay = createOverlay();
        requestAnimationFrame(() => {
          requestAnimationFrame(() => overlay.classList.add('visible'));
        });

        // รอ overlay ทึบเต็มที่ แล้วสลับไปหน้าคำทำนายใต้ overlay
        setTimeout(() => {
          showReading(cardId);
          overlay.classList.remove('visible');
          setTimeout(() => overlay.remove(), 400);
        }, 450);
      }, 700);
    });
  });
});
