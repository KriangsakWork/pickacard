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
    html += '<article class="reveal-card" style="animation-delay: ' + (i * 0.15) + 's;">';
    html += '  <div class="rc-media">';
    html += '    <span class="rc-num">' + (i + 1) + '</span>';
    html += '    <img src="/images/tarot/' + imgSlug + '.png" alt="' + card.name + '" loading="lazy">';
    html += '  </div>';
    html += '  <div class="rc-info">';
    html += '    <div class="rc-heading">';
    html += '      <span class="rc-phase">' + card.phase + '</span>';
    html += '      <h3 class="rc-name">' + card.name + '</h3>';
    html += '    </div>';
    html += '    <ul class="rc-keywords">';
    keywords.forEach(kw => { html += '<li>' + kw + '</li>'; });
    html += '    </ul>';
    html += '  </div>';
    html += '  <p class="rc-text">' + card.text + '</p>';
    html += '</article>';
  });
  html += '</div>';

  html += '<section class="reveal-summary" style="animation-delay: ' + (reading.cards.length * 0.15 + 0.1) + 's;">';
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
  
  // เพิ่ม 2 บรรทัดนี้: เพื่อรีเซ็ตไพ่ให้กลับมาปกติ เตรียมพร้อมสำหรับเลือกใหม่
  selectedCard = null; 
  document.querySelectorAll('.pile').forEach(p => p.classList.remove('selected'));
}

let selectedCard = null; // ตัวแปรสำหรับจำไพ่ที่เลือก

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.pile').forEach(pile => {
    pile.addEventListener('click', function() {
      const cardId = this.getAttribute('data-pile');

      // แตะครั้งที่ 2: ถ้าไพ่ที่กดคือไพ่ใบเดิมที่ล็อกเป้าไว้แล้ว ให้แสดงคำทำนาย
      if (selectedCard === cardId) {
        showReading(cardId); 
      } 
      // แตะครั้งแรก: เลือกล็อกเป้าหมายไพ่ใบนี้
      else {
        // ล้างสถานะไพ่ใบอื่นที่เคยเลือกไว้
        document.querySelectorAll('.pile').forEach(p => p.classList.remove('selected'));
        
        // จำใบที่เพิ่งกด และใส่คลาส selected ให้มันเด้งค้างไว้
        selectedCard = cardId;
        this.classList.add('selected');
      }
    });
  });
});
