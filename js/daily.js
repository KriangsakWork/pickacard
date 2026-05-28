/* ============================================================
   PICK MYSTIC — DAILY TAROT
   หน้า /daily — สุ่มไพ่ 1 ใบต่อวัน (deterministic ตามวันที่ Asia/Bangkok)
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'daily_tarot_lastVisit';
  var DATA_URL = '/data/daily-tarot.json';

  /* ---------- DATE HELPERS (Asia/Bangkok) ---------- */
  function getBangkokDateString(d) {
    // YYYY-MM-DD in Asia/Bangkok (UTC+7), no DST.
    var t = (d || new Date()).getTime();
    var bkk = new Date(t + 7 * 60 * 60 * 1000);
    var y = bkk.getUTCFullYear();
    var m = String(bkk.getUTCMonth() + 1).padStart(2, '0');
    var day = String(bkk.getUTCDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function getBangkokParts(d) {
    var t = (d || new Date()).getTime();
    var bkk = new Date(t + 7 * 60 * 60 * 1000);
    return {
      year: bkk.getUTCFullYear(),
      month: bkk.getUTCMonth(),
      date: bkk.getUTCDate(),
      day: bkk.getUTCDay(),
      h: bkk.getUTCHours(),
      m: bkk.getUTCMinutes(),
      s: bkk.getUTCSeconds()
    };
  }

  var THAI_DAYS = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'];
  var THAI_MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

  function formatThaiDate(p) {
    return 'วัน' + THAI_DAYS[p.day] + 'ที่ ' + p.date + ' ' + THAI_MONTHS[p.month] + ' ' + (p.year + 543);
  }

  /* ---------- SEEDED RANDOM (mulberry32) ---------- */
  function seedFromString(s) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = a;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function pickDailyCard(cards, dateStr) {
    var rand = mulberry32(seedFromString(dateStr));
    var idx = Math.floor(rand() * cards.length);
    return cards[idx];
  }

  /* ---------- COUNTDOWN ---------- */
  function startCountdown(el) {
    function tick() {
      var p = getBangkokParts();
      var remaining = (23 - p.h) * 3600 + (59 - p.m) * 60 + (60 - p.s);
      if (remaining >= 86400) remaining = 0;
      var hh = String(Math.floor(remaining / 3600)).padStart(2, '0');
      var mm = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
      var ss = String(remaining % 60).padStart(2, '0');
      el.textContent = hh + ':' + mm + ':' + ss;
      if (remaining <= 0) {
        // New day rolled over while user was on the page — reload to get the new card.
        window.location.reload();
      }
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- RENDER ---------- */
  function renderCard(card, dateStr, isFirstTime) {
    var p = getBangkokParts();
    var thaiDateText = formatThaiDate(p);

    document.getElementById('dailyDate').textContent = thaiDateText;

    // SEO updates
    var title = 'ไพ่ทาโรต์ประจำวัน ' + thaiDateText + ' | Pick Mystic';
    document.title = title;
    var t = document.getElementById('pageTitle');  if (t) t.textContent = title;
    var d = document.getElementById('metaDesc');
    if (d) d.setAttribute('content', 'ไพ่ทาโรต์ประจำวัน ' + thaiDateText + ' — ' + card.nameTh + ' (' + card.name + ') พร้อมคำทำนาย คำแนะนำ และสิ่งที่ควรระวัง ดูดวงรายวันฟรีจาก Pick Mystic');

    // Card art
    var img = document.getElementById('dailyCardImg');
    img.src = card.image;
    img.alt = 'ไพ่ ' + card.nameTh + ' (' + card.name + ')';
    document.getElementById('dailyCardNum').textContent = card.number || '';
    document.getElementById('dailyCardLabelTh').textContent = card.name;

    document.getElementById('dailyCardName').textContent = card.name;
    document.getElementById('dailyCardNameTh').textContent = card.nameTh;
    document.getElementById('dailyKeyword').textContent = card.keyword || '—';
    document.getElementById('dailyFocus').textContent = card.focus || '—';
    document.getElementById('dailyColor').textContent = card.luckyColor || '—';
    document.getElementById('dailyNumber').textContent = card.luckyNumber != null ? card.luckyNumber : '—';
    document.getElementById('dailyMeaning').textContent = card.meaning || '';
    document.getElementById('dailyAdvice').textContent = card.advice || '';
    document.getElementById('dailyWarning').textContent = card.warning || '';

    // Reveal flow
    var prereveal = document.getElementById('prereveal');
    var result = document.getElementById('dailyResult');
    var reading = document.getElementById('dailyReading');
    var countdown = document.getElementById('dailyCountdown');
    var cta = document.getElementById('dailyCta');
    var flipper = document.getElementById('cardFlipper');

    function reveal(withAnimation) {
      prereveal.hidden = true;
      result.hidden = false;
      reading.hidden = false;
      countdown.hidden = false;
      cta.hidden = false;
      if (withAnimation) {
        flipper.classList.remove('is-flipped');
        // next tick for animation
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            flipper.classList.add('is-flipped');
          });
        });
      } else {
        flipper.classList.add('is-flipped', 'no-anim');
      }
      try { localStorage.setItem(STORAGE_KEY, dateStr); } catch (e) {}
      try { if (typeof gtag === 'function') gtag('event', 'daily_card_revealed', { card_id: card.id, date: dateStr }); } catch (e) {}
    }

    if (!isFirstTime) {
      reveal(false);
    } else {
      document.getElementById('revealBtn').addEventListener('click', function () { reveal(true); });
      document.getElementById('flipBtn').addEventListener('click', function () { reveal(true); });
    }

    startCountdown(document.getElementById('countdownTimer'));

    // Share
    var shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', function () {
        var shareText = 'ไพ่ประจำวันของฉันคือ ' + card.nameTh + ' (' + card.name + ') — ' + (card.keyword || '') + ' ✨';
        var shareUrl = window.location.origin + '/daily/';
        if (navigator.share) {
          navigator.share({ title: 'ไพ่ทาโรต์ประจำวัน | Pick Mystic', text: shareText, url: shareUrl }).catch(function () {});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(shareText + ' ' + shareUrl);
          shareBtn.textContent = '✓ คัดลอกลิงก์แล้ว';
          setTimeout(function () { shareBtn.textContent = '🔗 แชร์ไพ่นี้'; }, 2000);
        }
      });
    }
  }

  function renderError() {
    var stage = document.getElementById('dailyStage');
    stage.innerHTML = '<p style="text-align:center;color:var(--c-ink-soft);padding:32px 0;">ขออภัย ไม่สามารถโหลดไพ่ประจำวันได้ กรุณาลองใหม่อีกครั้ง</p>';
  }

  /* ---------- BOOT ---------- */
  function init() {
    var today = getBangkokDateString();
    var last = null;
    try { last = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    var isFirstTime = last !== today;

    fetch(DATA_URL, { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (json) {
        if (!json || !Array.isArray(json.cards) || !json.cards.length) throw new Error('bad data');
        var card = pickDailyCard(json.cards, today);
        renderCard(card, today, isFirstTime);
      })
      .catch(renderError);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
