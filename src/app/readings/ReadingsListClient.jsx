'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import { urlFor } from '@/sanity/image';

const ALL = { _id: '__all', slug: 'all', title: 'ทั้งหมด', icon: '🔮' };

export default function ReadingsListClient({ topics, categories }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');

  const chips = useMemo(() => [ALL, ...categories], [categories]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return topics.filter((t) => {
      const matchCat =
        activeCategory === 'all' || t.category?.slug === activeCategory;
      const matchQ =
        !q ||
        t.title.toLowerCase().includes(q) ||
        (t.shortDescription || '').toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [topics, activeCategory, query]);

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
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="filter-chips" role="group" aria-label="กรองตามหมวดหมู่">
          {chips.map((c) => (
            <button
              key={c._id}
              type="button"
              className={`filter-chip${activeCategory === c.slug ? ' active' : ''}`}
              onClick={() => setActiveCategory(c.slug)}
            >
              {c.icon ? `${c.icon} ` : ''}
              {c.title}
            </button>
          ))}
        </div>
      </div>

      <p className="readings-count" aria-live="polite">
        พบ {filtered.length} หัวข้อ
      </p>

      {filtered.length > 0 ? (
        <div className="topic-grid">
          {filtered.map((t) => {
            const imgUrl = t.coverImage
              ? urlFor(t.coverImage).width(800).format('webp').url()
              : null;
            return (
              <Link
                key={t._id}
                className="topic-card"
                href={`/reading/${t.slug}`}
              >
                <div className="topic-media">
                  {imgUrl ? (
                    <img src={imgUrl} alt={t.title} loading="lazy" />
                  ) : null}
                  {t.category?.title && (
                    <span className="topic-tag">{t.category.title}</span>
                  )}
                  {t.isFeatured && (
                    <span className="topic-feature-pill">⭐ แนะนำ</span>
                  )}
                </div>
                <div className="topic-body">
                  <h3 className="topic-title">{t.title}</h3>
                  <p className="topic-hook">{t.shortDescription}</p>
                  <span className="topic-cta">เปิดไพ่เลย →</span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="readings-empty">
          <p>ไม่พบหัวข้อที่ตรงกับการค้นหา</p>
        </div>
      )}
    </>
  );
}
