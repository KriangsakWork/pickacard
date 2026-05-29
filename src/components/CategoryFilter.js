'use client';

import { useRouter } from 'next/navigation';

// Category filter pills. Clicking syncs the choice to the URL (?cat=slug)
// so the server can filter and the selection survives sharing/refresh.
export default function CategoryFilter({ categories = [], activeCat = null }) {
  const router = useRouter();

  const select = (slug) => {
    router.push(slug ? `/blog?cat=${slug}` : '/blog', { scroll: false });
  };

  return (
    <div
      className="flex flex-wrap justify-center gap-2"
      role="group"
      aria-label="กรองตามหมวดหมู่"
    >
      <button
        type="button"
        className={`filter-chip${!activeCat ? ' active' : ''}`}
        onClick={() => select(null)}
      >
        ทั้งหมด
      </button>
      {categories.map((c) => (
        <button
          key={c._id}
          type="button"
          className={`filter-chip${activeCat === c.slug ? ' active' : ''}`}
          onClick={() => select(c.slug)}
        >
          {c.icon ? `${c.icon} ` : ''}
          {c.title}
        </button>
      ))}
    </div>
  );
}
