// ============================================
// READING PAGE JS - Pick a Card functionality
// ============================================

function toggleMenu() {
  document.querySelector('.nav-menu').classList.toggle('open');
}

window.handleCardImageError = function(imgEl) {
  var name = imgEl.getAttribute('data-card-name') || '';
  var div = document.createElement('div');
  div.className = 'rc-placeholder';
  var span = document.createElement('span');
  span.textContent = name;
  div.appendChild(span);
  imgEl.replaceWith(div);
};

// เก็บคำทำนายปัจจุบันไว้ใช้ตอนแชร์เป็นรูป
let currentReading = null;
let currentPile = null;

function showReading(pile) {
  const reading = READINGS[pile];
  if (!reading) return;

  currentReading = reading;
  currentPile = pile;

  let html = '';

  html += '<header class="reveal-head">';
  html += '  <div class="reveal-eyebrow">✦ คำทำนายสำหรับคุณ ✦</div>';
  html += '  <h2 class="reveal-title">' + reading.intro + '</h2>';
  html += '  <p class="reveal-sub">' + (reading.sub || 'ไพ่ทั้ง 3 ใบนี้คือคำแนะนำและคำตอบที่คุณกำลังมองหา') + '</p>';
  html += '</header>';

  html += '<div class="reveal-cards">';
  reading.cards.forEach((card, i) => {
    const imgSlug = card.name.toLowerCase().replace(/\s+/g, '-');
    const keywords = card.meaning.trim().split(/\s+/);
    html += '<article class="reveal-card" style="animation-delay: ' + (i * 0.12) + 's;">';
    html += '  <div class="rc-media">';
    html += '    <span class="rc-num">' + (i + 1) + '</span>';
    html += '    <img src="/images/tarot/' + imgSlug + '.png" alt="' + card.name + '" loading="lazy" ' +
            'data-card-name="' + card.name + '" onerror="window.handleCardImageError(this)">';
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

  if (reading.advice) {
    html += '<section class="reveal-summary" style="animation-delay: ' + (reading.cards.length * 0.12 + 0.1) + 's;">';
    html += '  <div class="reveal-summary-icon">🕯️</div>';
    html += '  <div class="reveal-summary-body">';
    html += '    <h3 class="reveal-summary-title">คำแนะนำจากจักรวาล</h3>';
    html += '    <p>' + reading.advice + '</p>';
    html += '  </div>';
    html += '</section>';
  }

  html += '<p class="reveal-disclaimer">* คำทำนายนี้เป็นแนวทางเพื่อการพิจารณา ไม่สามารถยืนยันผลลัพธ์ได้แน่นอน</p>';

  html += '<div class="reveal-actions">';
  html += '  <button id="share-btn" class="share-btn" onclick="shareReading()"><span>✨</span> แชร์ผลทำนาย</button>';
  html += '</div>';

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

// ============================================
// SHARE AS IMAGE — html2canvas-based feature
// Generates 1080x1920 (IG Story) share image using the middle card (ปัจจุบัน)
// as the main card. Falls back to download if Web Share API unsupported.
// Assets: /images/share/share-bg.png, /images/share/mascot.png
// ============================================

function cardSlug(cardName) {
  return (cardName || '').toLowerCase().replace(/\s+/g, '-');
}

function ensureShareCardDOM() {
  if (document.getElementById('share-card')) return;

  // เช็คว่ามีไฟล์ template หรือยัง (เตือนใน console เฉพาะตอน build ครั้งแรกที่ขาดไฟล์)
  // ไฟล์ที่ต้องอัพโหลด: /images/share/share-bg.png และ /images/share/mascot.png
  const wrap = document.createElement('div');
  wrap.id = 'share-card';
  wrap.innerHTML =
    '<img src="/images/share/share-bg.png" class="share-bg" crossorigin="anonymous"' +
    '     onerror="console.warn(\'[share] ต้องอัพโหลด /images/share/share-bg.png\')">' +
    '<img id="share-main-card" src="" class="share-main-card" crossorigin="anonymous">' +
    '<div class="share-prediction"><p id="share-prediction-text"></p></div>' +
    '<img src="/images/share/mascot.png" class="share-mascot" crossorigin="anonymous"' +
    '     onerror="console.warn(\'[share] ต้องอัพโหลด /images/share/mascot.png\')">';
  document.body.appendChild(wrap);
}

function loadHtml2Canvas() {
  if (window.html2canvas) return Promise.resolve(window.html2canvas);
  if (window.__h2cPromise) return window.__h2cPromise;
  window.__h2cPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    s.onload = () => resolve(window.html2canvas);
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return window.__h2cPromise;
}

function waitImg(img) {
  return new Promise(resolve => {
    if (!img || (img.complete && img.naturalWidth > 0)) return resolve();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // ปล่อยให้ render ต่อแม้รูปโหลดไม่สำเร็จ
  });
}

async function shareReading() {
  if (!currentReading) return;
  const shareBtn = document.getElementById('share-btn');
  if (!shareBtn) return;

  const originalHTML = shareBtn.innerHTML;
  shareBtn.disabled = true;
  shareBtn.textContent = 'กำลังสร้างภาพ...';

  try {
    ensureShareCardDOM();
    await loadHtml2Canvas();

    // ใบกลาง = ปัจจุบัน (index 1 ของ cards)
    const middleCard = currentReading.cards[1] || currentReading.cards[0];
    const slug = cardSlug(middleCard.name);
    const predictionText = (middleCard.text || currentReading.message || '').trim();

    const mainImg = document.getElementById('share-main-card');
    mainImg.src = '/images/tarot/' + slug + '.png';

    let text = predictionText;
    if (text.length > 100) text = text.substring(0, 97) + '...';
    document.getElementById('share-prediction-text').textContent = text;

    // รอรูปทุกใบใน share-card โหลดเสร็จ
    const imgs = document.querySelectorAll('#share-card img');
    await Promise.all(Array.from(imgs).map(waitImg));

    const canvas = await window.html2canvas(document.getElementById('share-card'), {
      scale: 1,
      useCORS: true,
      backgroundColor: null,
      width: 1080,
      height: 1920,
      logging: false
    });

    await new Promise(resolve => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert('เกิดข้อผิดพลาดในการสร้างภาพ ลองใหม่อีกครั้ง');
          return resolve();
        }
        const fileName = 'pickmystic-' + slug + '.png';
        const file = new File([blob], fileName, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'คำทำนายของฉันจาก Pick Mystic',
              text: 'ดูคำทำนายไพ่ทาโรต์ของฉันที่ pickmystic.com'
            });
          } catch (err) {
            if (err.name !== 'AbortError') console.error(err);
          }
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }

        if (typeof gtag === 'function') {
          try { gtag('event', 'share_clicked', { card: slug }); } catch (_) {}
        }
        console.log('share_clicked', slug);
        resolve();
      }, 'image/png');
    });
  } catch (err) {
    console.error('Share failed:', err);
    alert('เกิดข้อผิดพลาดในการสร้างภาพ ลองใหม่อีกครั้ง');
  } finally {
    shareBtn.disabled = false;
    shareBtn.innerHTML = originalHTML;
  }
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
    '<div class="reveal-overlay-text">กำลังเปิดคำทำนาย...</div>' +
    '<img class="reveal-overlay-mascot" src="/images/fortune-rabbit-loading-mascot.png" alt="" aria-hidden="true">';
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
