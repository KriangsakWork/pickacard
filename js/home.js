// ============================================
// HOME PAGE JS — navigation
// ============================================

// Mobile menu toggle
function toggleMenu() {
  const menu = document.querySelector('.nav-menu');
  const toggle = document.querySelector('.nav-toggle');
  if (!menu) return;
  const open = menu.classList.toggle('open');
  if (toggle) toggle.setAttribute('aria-expanded', String(open));
}

// Fade the transparent hero navbar to solid white once the user scrolls
window.addEventListener('scroll', function () {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  nav.classList.toggle('navbar-scrolled', window.scrollY > 50);
});

// ============================================
// LUCKY COLOR OF THE DAY — daily utility widget
// Picks soft, glowing colors based on the real weekday.
// ============================================
(function () {
  const grid = document.getElementById('luckyGrid');
  const dayEl = document.getElementById('luckyDay');
  if (!grid || !dayEl) return;

  // dreamy pastel swatches — soft gradient + glow, never harsh flat colors
  const PALETTE = {
    rose:       { name: 'ชมพูกุหลาบ',     from: '#FFD1E3', to: '#FF9EC4', glow: '#FFB6D2' },
    peach:      { name: 'พีชอบอุ่น',       from: '#FFE0C2', to: '#FFB98A', glow: '#FFCBA0' },
    gold:       { name: 'ทองมงคล',        from: '#FFE7A6', to: '#FFD76A', glow: '#FFDF8C' },
    cream:      { name: 'ครีมนวล',         from: '#FFF3CF', to: '#FFE3A0', glow: '#FFEBBC' },
    mint:       { name: 'เขียวมิ้นต์',     from: '#C8F2DD', to: '#8FE0BC', glow: '#A9E9CC' },
    sage:       { name: 'เขียวเสจ',        from: '#DCEBC8', to: '#B5D98F', glow: '#C8E2AB' },
    sky:        { name: 'ฟ้าใส',           from: '#CBE6FF', to: '#97C7FB', glow: '#B1D6FD' },
    aqua:       { name: 'ฟ้าอความารีน',    from: '#C6F0EE', to: '#8FE0DC', glow: '#AAE8E5' },
    lavender:   { name: 'ม่วงลาเวนเดอร์',  from: '#DED3FF', to: '#B9A5FF', glow: '#CBBCFF' },
    violet:     { name: 'ม่วงมงคล',        from: '#C9B3FF', to: '#8E6BFF', glow: '#B49BFF' },
    periwinkle: { name: 'ม่วงพีริวิงเคิล', from: '#D2D8FF', to: '#A5B0FF', glow: '#BBC4FF' },
    coral:      { name: 'ปะการังอ่อน',     from: '#FFCEC4', to: '#FF9E8F', glow: '#FFB6A9' },
    smoke:      { name: 'เทาควันหมอก',     from: '#D6D1E0', to: '#A89FBF', glow: '#C2BAD2' },
    navy:       { name: 'น้ำเงินสนธยา',    from: '#B9C3E6', to: '#8190C4', glow: '#A3AFD6' }
  };

  // index 0–6 maps to Date.getDay() (0 = Sunday)
  const DAYS = [
    { name: 'วันอาทิตย์',   work: 'peach',  money: 'gold', love: 'rose',       mercy: 'cream',    luck: 'coral',  avoid: 'navy'  },
    { name: 'วันจันทร์',     work: 'sky',    money: 'mint', love: 'lavender',   mercy: 'cream',    luck: 'gold',   avoid: 'coral' },
    { name: 'วันอังคาร',     work: 'violet', money: 'sage', love: 'rose',       mercy: 'sky',      luck: 'gold',   avoid: 'smoke' },
    { name: 'วันพุธ',        work: 'sage',   money: 'mint', love: 'peach',      mercy: 'cream',    luck: 'gold',   avoid: 'navy'  },
    { name: 'วันพฤหัสบดี',   work: 'gold',   money: 'peach', love: 'rose',      mercy: 'lavender', luck: 'cream',  avoid: 'smoke' },
    { name: 'วันศุกร์',      work: 'sky',    money: 'aqua', love: 'rose',       mercy: 'mint',     luck: 'lavender', avoid: 'coral' },
    { name: 'วันเสาร์',      work: 'violet', money: 'mint', love: 'periwinkle', mercy: 'lavender', luck: 'gold',   avoid: 'navy'  }
  ];

  const CATEGORIES = [
    { key: 'work',  label: 'การงาน',          icon: '💼' },
    { key: 'money', label: 'การเงิน',         icon: '💰' },
    { key: 'love',  label: 'ความรัก',         icon: '💗' },
    { key: 'mercy', label: 'เมตตา',           icon: '🕊️' },
    { key: 'luck',  label: 'โชคลาภ',          icon: '🍀' },
    { key: 'avoid', label: 'สีที่ควรเลี่ยง',  icon: '🚫' }
  ];

  const today = DAYS[new Date().getDay()];
  dayEl.textContent = today.name;

  grid.innerHTML = CATEGORIES.map(function (cat) {
    const color = PALETTE[today[cat.key]];
    const isAvoid = cat.key === 'avoid';
    return '<div class="lucky-card' + (isAvoid ? ' is-avoid' : '') + '">' +
      '<span class="lucky-swatch" style="--from:' + color.from +
        ';--to:' + color.to + ';--glow:' + color.glow + '"></span>' +
      '<span class="lucky-cat">' + cat.icon + ' ' + cat.label + '</span>' +
      '<span class="lucky-color-name">' + color.name + '</span>' +
    '</div>';
  }).join('');
})();
