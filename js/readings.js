// ============================================
// ALL READINGS PAGE — render, category filter, search
// Renders from READING_ITEMS / READING_CATEGORIES (readings-data.js).
// ============================================
(function () {
  const grid = document.getElementById('readingsGrid');
  const chipsEl = document.getElementById('filterChips');
  const searchEl = document.getElementById('readingsSearch');
  const countEl = document.getElementById('readingsCount');
  const emptyEl = document.getElementById('readingsEmpty');

  if (!grid || typeof READING_ITEMS === 'undefined') return;

  const categoryLabel = {};
  READING_CATEGORIES.forEach(function (c) { categoryLabel[c.key] = c.label; });

  let activeCategory = 'all';
  let query = '';

  function escapeHtml(str) {
    return String(str).replace(/[&<>"]/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch];
    });
  }

  function cardHTML(item) {
    const tag = categoryLabel[item.category] || '';
    const feature = item.featured
      ? '<span class="topic-feature-pill">⭐ แนะนำ</span>'
      : '';
    const title = escapeHtml(item.title);
    return '<a class="topic-card" href="' + item.url + '">' +
      '<div class="topic-media">' +
        '<img src="' + item.image + '" alt="' + title + '" loading="lazy">' +
        '<span class="topic-tag">' + escapeHtml(tag) + '</span>' +
        feature +
      '</div>' +
      '<div class="topic-body">' +
        '<h3 class="topic-title">' + title + '</h3>' +
        '<p class="topic-hook">' + escapeHtml(item.hook) + '</p>' +
        '<span class="topic-cta">เปิดไพ่เลย →</span>' +
      '</div>' +
    '</a>';
  }

  function getFiltered() {
    const q = query.trim().toLowerCase();
    return READING_ITEMS.filter(function (item) {
      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchQuery = !q ||
        item.title.toLowerCase().indexOf(q) !== -1 ||
        item.hook.toLowerCase().indexOf(q) !== -1;
      return matchCategory && matchQuery;
    });
  }

  function render() {
    const items = getFiltered();
    grid.innerHTML = items.map(cardHTML).join('');
    grid.hidden = items.length === 0;
    if (emptyEl) emptyEl.hidden = items.length !== 0;
    if (countEl) {
      countEl.textContent = items.length
        ? 'พบ ' + items.length + ' คำทำนาย'
        : '';
    }
  }

  function renderChips() {
    chipsEl.innerHTML = READING_CATEGORIES.map(function (c) {
      const active = c.key === activeCategory ? ' is-active' : '';
      return '<button type="button" class="filter-chip' + active + '" ' +
        'data-cat="' + c.key + '" aria-pressed="' + (c.key === activeCategory) + '">' +
        c.emoji + ' ' + escapeHtml(c.label) +
        '</button>';
    }).join('');
  }

  chipsEl.addEventListener('click', function (e) {
    const btn = e.target.closest('.filter-chip');
    if (!btn) return;
    activeCategory = btn.dataset.cat;
    renderChips();
    render();
  });

  if (searchEl) {
    searchEl.addEventListener('input', function () {
      query = searchEl.value;
      render();
    });
  }

  renderChips();
  render();
})();
