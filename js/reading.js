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
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.pile').forEach(pile => {
    pile.addEventListener('click', function() {
      showReading(this.getAttribute('data-pile'));
    });
  });
});


let selectedCard = null; // ตัวแปรสำหรับจำว่าตอนนี้เลือกไพ่ใบไหนอยู่

function handleCardClick(cardId, element) {
  // แตะครั้งที่ 2: ถ้ากดใบเดิมซ้ำ ให้พาไปหน้าผลทำนายทันที
  if (selectedCard === cardId) {
    // ปรับลิงก์ด้านล่างนี้ให้ตรงกับระบบเปลี่ยนหน้าของคุณนะครับ
    window.location.href = `?result=${cardId}`; 
  } 
  // แตะครั้งแรก: เลือกล็อกเป้าหมายไว้ก่อน
  else {
    // ล้างคลาส selected จากไพ่ใบอื่นออกให้หมด
    document.querySelectorAll('.pile').forEach(pile => pile.classList.remove('selected'));
    
    // ตั้งค่าไพ่ใบนี้เป็นใบที่ถูกเลือก แล้วใส่คลาส .selected ให้มันเด้งค้างไว้
    selectedCard = cardId;
    element.classList.add('selected');
  }
}