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
// LUCKY COLORS BY BIRTHDAY — สีถูกโฉลกตามวันเกิด
// Reads user's birth weekday from LocalStorage and shows
// the matching auspicious colors per Thai astrology.
// ============================================
(function () {
  const widget = document.getElementById('luckyWidget');
  if (!widget) return;

  const placeholder = document.getElementById('luckyPlaceholder');
  const result = document.getElementById('luckyResult');
  const grid = document.getElementById('luckyGrid');
  const dayEl = document.getElementById('luckyDay');
  const openBtn = document.getElementById('openBirthdayBtn');
  const changeBtn = document.getElementById('changeBirthdayBtn');
  const modal = document.getElementById('birthdayModal');
  const daysWrap = document.getElementById('birthdayDays');
  const confirmBtn = document.getElementById('confirmBirthdayBtn');

  const STORAGE_KEY = 'user_birthday_day';

  // Dreamy pastel swatches — soft gradient + glow, never harsh flat colors
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

  // Lucky colors by birth weekday — based on Thai astrology tradition
  const BIRTHDAYS = {
    sunday:    { label: 'คนเกิดวันอาทิตย์',   pillBg: '#FF9999', work: 'mint',       money: 'violet',   love: 'rose',     mercy: 'cream',    luck: 'gold',     avoid: 'sky'    },
    monday:    { label: 'คนเกิดวันจันทร์',     pillBg: '#FFEB99', work: 'peach',      money: 'coral',    love: 'sage',     mercy: 'cream',    luck: 'gold',     avoid: 'navy'   },
    tuesday:   { label: 'คนเกิดวันอังคาร',     pillBg: '#FFB3D9', work: 'smoke',      money: 'gold',     love: 'violet',   mercy: 'sky',      luck: 'peach',    avoid: 'cream'  },
    wednesday: { label: 'คนเกิดวันพุธ',        pillBg: '#A8E6A3', work: 'peach',      money: 'sage',     love: 'cream',    mercy: 'coral',    luck: 'navy',     avoid: 'rose'   },
    thursday:  { label: 'คนเกิดวันพฤหัสบดี',   pillBg: '#FFCC99', work: 'coral',      money: 'peach',    love: 'smoke',    mercy: 'lavender', luck: 'mint',     avoid: 'gold'   },
    friday:    { label: 'คนเกิดวันศุกร์',      pillBg: '#A3D5FF', work: 'lavender',   money: 'gold',     love: 'sky',      mercy: 'cream',    luck: 'rose',     avoid: 'navy'   },
    saturday:  { label: 'คนเกิดวันเสาร์',      pillBg: '#C9A3FF', work: 'sky',        money: 'cream',    love: 'smoke',    mercy: 'gold',     luck: 'mint',     avoid: 'violet' }
  };

  const DAY_ORDER = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  const DAY_SHORT = {
    monday: 'จ.', tuesday: 'อ.', wednesday: 'พ.', thursday: 'พฤ.',
    friday: 'ศ.', saturday: 'ส.', sunday: 'อา.'
  };
  const DAY_FULL = {
    monday: 'จันทร์', tuesday: 'อังคาร', wednesday: 'พุธ', thursday: 'พฤหัสบดี',
    friday: 'ศุกร์', saturday: 'เสาร์', sunday: 'อาทิตย์'
  };

  const CATEGORIES = [
    { key: 'work',  label: 'การงาน',          icon: '💼' },
    { key: 'money', label: 'การเงิน',         icon: '💰' },
    { key: 'love',  label: 'ความรัก',         icon: '💗' },
    { key: 'mercy', label: 'เมตตา',           icon: '🕊️' },
    { key: 'luck',  label: 'โชคลาภ',          icon: '🍀' },
    { key: 'avoid', label: 'สีที่ควรเลี่ยง',  icon: '🚫' }
  ];

  function readStored() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return BIRTHDAYS[v] ? v : null;
    } catch (e) { return null; }
  }

  function saveStored(day) {
    try { localStorage.setItem(STORAGE_KEY, day); } catch (e) {}
  }

  function render(day) {
    if (!day || !BIRTHDAYS[day]) {
      placeholder.hidden = false;
      result.hidden = true;
      return;
    }
    placeholder.hidden = true;
    result.hidden = false;

    const info = BIRTHDAYS[day];
    dayEl.textContent = info.label;

    grid.innerHTML = CATEGORIES.map(function (cat) {
      const color = PALETTE[info[cat.key]];
      const isAvoid = cat.key === 'avoid';
      return '<div class="lucky-card' + (isAvoid ? ' is-avoid' : '') + '">' +
        '<span class="lucky-swatch" style="--from:' + color.from +
          ';--to:' + color.to + ';--glow:' + color.glow + '"></span>' +
        '<span class="lucky-cat">' + cat.icon + ' ' + cat.label + '</span>' +
        '<span class="lucky-color-name">' + color.name + '</span>' +
      '</div>';
    }).join('');
  }

  // Build day buttons inside modal
  let pendingDay = null;
  function buildDayButtons() {
    daysWrap.innerHTML = DAY_ORDER.map(function (d) {
      const info = BIRTHDAYS[d];
      return '<button type="button" class="birthday-day" data-day="' + d + '"' +
        ' style="--day-bg:' + info.pillBg + '">' +
        '<span class="birthday-day-short">' + DAY_SHORT[d] + '</span>' +
        '<span class="birthday-day-full">' + DAY_FULL[d] + '</span>' +
      '</button>';
    }).join('');
  }

  function openModal() {
    pendingDay = readStored();
    buildDayButtons();
    if (pendingDay) {
      const sel = daysWrap.querySelector('[data-day="' + pendingDay + '"]');
      if (sel) sel.classList.add('is-selected');
    }
    confirmBtn.disabled = !pendingDay;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Wire up
  if (openBtn) openBtn.addEventListener('click', openModal);
  if (changeBtn) changeBtn.addEventListener('click', openModal);

  modal.addEventListener('click', function (e) {
    const target = e.target;
    if (target.matches('[data-birthday-close]')) {
      closeModal();
      return;
    }
    const btn = target.closest('.birthday-day');
    if (btn) {
      pendingDay = btn.getAttribute('data-day');
      daysWrap.querySelectorAll('.birthday-day').forEach(function (b) {
        b.classList.toggle('is-selected', b === btn);
      });
      confirmBtn.disabled = false;
    }
  });

  confirmBtn.addEventListener('click', function () {
    if (!pendingDay) return;
    saveStored(pendingDay);
    render(pendingDay);
    closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  render(readStored());
})();
