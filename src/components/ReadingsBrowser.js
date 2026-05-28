'use client';
import { useMemo, useState } from 'react';
import { READING_CATEGORIES, READING_ITEMS } from '@/data/readings-list';

export default function ReadingsBrowser() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return READING_ITEMS.filter(item => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchQ = !q ||
        item.title.toLowerCase().includes(q) ||
        (item.hook || '').toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [activeCategory, query]);

  const categoryLabel = Object.fromEntries(READING_CATEGORIES.map(c => [c.key, c.label]));

  return (
    <>
      <div className="readings-toolbar">
        <div className="readings-search">
          <span className="readings-search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            placeholder="ค้นหาคำทำนาย..."
            aria-label="ค้นหาคำทำนาย"
            autoComplete="off"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="filter-chips" role="group" aria-label="กรองตามหมวดหมู่">
          {READING_CATEGORIES.map(c => (
            <button
              key={c.key}
              type="button"
              className={`filter-chip${activeCategory === c.key ? ' active' : ''}`}
              onClick={() => setActiveCategory(c.key)}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      <p className="readings-count" aria-live="polite">
        พบ {filtered.length} หัวข้อ
      </p>

      {filtered.length > 0 ? (
        <div className="topic-grid">
          {filtered.map(item => (
            <a key={item.slug} className="topic-card" href={item.url.replace('.html', '')}>
              <div className="topic-media">
                <img src={item.image} alt={item.title} loading="lazy" />
                <span className="topic-tag">{categoryLabel[item.category] || ''}</span>
                {item.featured && <span className="topic-feature-pill">⭐ แนะนำ</span>}
              </div>
              <div className="topic-body">
                <h3 className="topic-title">{item.title}</h3>
                <p className="topic-hook">{item.hook}</p>
                <span className="topic-cta">เปิดไพ่เลย →</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="readings-empty">
          <p>ไม่พบหัวข้อที่ตรงกับการค้นหา</p>
        </div>
      )}
    </>
  );
}
