// ============================================
// MAIN.JS - ควบคุมการทำงานของเว็บ
// ============================================

// เลื่อนไปยังส่วนเลือกไพ่
function scrollToPick() {
  document.getElementById('pick-section').scrollIntoView({ behavior: 'smooth' });
}

// เปิด/ปิด เมนูมือถือ
function toggleMenu() {
  document.querySelector('.nav-menu').classList.toggle('open');
}

// แสดงคำทำนาย
function showReading(pile) {
  const reading = READINGS[pile];
  if (!reading) return;

  let html = '';
  
  // ส่วน intro
  html += '<div class="reading-intro">';
  html += '  <div class="label">✦ คำทำนายสำหรับคุณ ✦</div>';
  html += '  <h2>' + reading.intro + '</h2>';
  html += '</div>';
  
  // แสดงไพ่ 3 ใบ
  html += '<div class="tarot-cards">';
  reading.cards.forEach((card, i) => {
    html += '<div class="tarot-card" style="animation-delay: ' + (i * 0.3) + 's;">';
    html += '  <div class="phase">' + card.phase + '</div>';
    html += '  <div class="emoji">' + card.emoji + '</div>';
    html += '  <div>';
    html += '    <div class="name-thai">' + card.thai + '</div>';
    html += '    <div class="name-en">' + card.name + '</div>';
    html += '  </div>';
    html += '</div>';
  });
  html += '</div>';
  
  // ช่องโฆษณากลาง reading
  html += '<div class="ad-slot ad-728x90" style="margin-bottom: 24px; animation: fadeUp 0.6s ease-out 0.9s backwards;">';
  html += '  <span>📢 พื้นที่โฆษณา 728 × 90</span>';
  html += '</div>';
  
  // คำทำนายของแต่ละใบ
  reading.cards.forEach((card, i) => {
    html += '<div class="reading-card" style="animation-delay: ' + (1.2 + i * 0.3) + 's;">';
    html += '  <div class="header">';
    html += '    <span class="badge">' + card.phase + '</span>';
    html += '    <span class="name-thai">' + card.thai + '</span>';
    html += '    <span class="name-en">' + card.name + '</span>';
    html += '  </div>';
    html += '  <p class="meaning">' + card.meaning + '</p>';
    html += '  <p class="text">' + card.text + '</p>';
    html += '</div>';
  });
  
  // ข้อความจากจักรวาล
  html += '<div class="universe-message" style="animation: fadeUp 0.6s ease-out ' + (1.2 + reading.cards.length * 0.3) + 's backwards;">';
  html += '  <div class="label">✦ ข้อความจากจักรวาล ✦</div>';
  html += '  <p>"' + reading.message + '"</p>';
  html += '</div>';
  
  // ปุ่มเปิดไพ่ใหม่
  html += '<div class="reset-btn-container">';
  html += '  <button class="btn-reset" onclick="resetReading()">↺ เปิดไพ่ใหม่อีกครั้ง</button>';
  html += '</div>';
  
  // แสดงผล
  document.getElementById('reading-content').innerHTML = html;
  document.getElementById('reading-section').style.display = 'block';
  document.getElementById('pick-section').style.display = 'none';
  
  // เลื่อนขึ้นบน reading
  setTimeout(() => {
    document.getElementById('reading-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// รีเซ็ตกลับไปเลือกไพ่ใหม่
function resetReading() {
  document.getElementById('reading-section').style.display = 'none';
  document.getElementById('reading-content').innerHTML = '';
  document.getElementById('pick-section').style.display = 'block';
  document.getElementById('pick-section').scrollIntoView({ behavior: 'smooth' });
}

// ผูก event ให้กับกองไพ่
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.pile').forEach(pile => {
    pile.addEventListener('click', function() {
      const pileNum = this.getAttribute('data-pile');
      showReading(pileNum);
    });
  });
});
