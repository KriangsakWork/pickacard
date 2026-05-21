// ============================================
// HOME PAGE JS — navigation + category filtering
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

// Category chip filtering for the popular readings rail
document.addEventListener('DOMContentLoaded', function () {
  const chips = document.querySelectorAll('.chip');
  const cards = document.querySelectorAll('.reading-card');
  const rail = document.getElementById('reading-rail');
  const empty = document.getElementById('reading-empty');

  if (!chips.length) return;

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('is-active'); });
      chip.classList.add('is-active');

      const cat = chip.getAttribute('data-cat');
      let visible = 0;

      cards.forEach(function (card) {
        const match = cat === 'all' || card.getAttribute('data-cat') === cat;
        card.classList.toggle('is-hidden', !match);
        if (match) visible++;
      });

      if (empty) empty.hidden = visible > 0;
      if (rail) rail.scrollTo({ left: 0, behavior: 'smooth' });
    });
  });
});
