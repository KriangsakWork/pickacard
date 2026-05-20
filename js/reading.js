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

  html += '<div class="reading-intro">';
  html += '  <img src="/images/mascot-reveal.png" alt="Pick a Card mascot" class="intro-mascot">';
  html += '  <div class="intro-text">';
  html += '    <div class="label">✦ คำทำนายสำหรับคุณ ✦</div>';
  html += '    <h2>' + reading.intro + '</h2>';
  html += '  </div>';
  html += '</div>';

  html += '<div class="tarot-cards">';
  reading.cards.forEach((card, i) => {
    const imgSlug = card.name.toLowerCase().replace(/\s+/g, '-');
    html += '<div class="tarot-card" style="animation-delay: ' + (i * 0.3) + 's;">';
    html += '  <div class="phase">' + card.phase + '</div>';
    html += '  <img src="/images/tarot/' + imgSlug + '.png" alt="' + card.name + '" loading="lazy">';
    html += '  <div class="name-en">' + card.name + '</div>';
    html += '</div>';
  });
  html += '</div>';

  reading.cards.forEach((card, i) => {
    html += '<div class="reading-card" style="animation-delay: ' + (1 + i * 0.3) + 's;">';
    html += '  <div class="header">';
    html += '    <span class="badge">' + card.phase + '</span>';
    html += '    <span class="name-en">' + card.name + '</span>';
    html += '  </div>';
    html += '  <p class="meaning">' + card.meaning + '</p>';
    html += '  <p class="text">' + card.text + '</p>';
    html += '</div>';
  });

  html += '<div class="universe-message" style="animation: fadeUp 0.6s ease-out ' + (1 + reading.cards.length * 0.3) + 's backwards;">';
  html += '  <div class="label">✦ ข้อความจากจักรวาล ✦</div>';
  html += '  <p>"' + reading.message + '"</p>';
  html += '</div>';

  html += '<div class="reset-btn-container">';
  html += '  <button class="btn-reset" onclick="resetReading()">↺ เปิดไพ่ใหม่</button>';
  html += '  <a href="/" class="btn-back-home" style="text-decoration:none; display:inline-flex; align-items:center;">← กลับหน้าแรก</a>';
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
