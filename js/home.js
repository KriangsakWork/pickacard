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
