import Image from 'next/image';

import ArticleCard from '@/components/ArticleCard';
import CategoryFilter from '@/components/CategoryFilter';
import JsonLd from '@/components/JsonLd';
import { breadcrumbLd } from '@/lib/seo';
import { client } from '@/sanity/client';
import { allArticlesQuery, allCategoriesQuery } from '@/sanity/queries';

export const revalidate = 60; // ISR

export const metadata = {
  title: 'บทความทั้งหมด',
  description:
    'ความรู้สายมู ไพ่ทาโรต์ และเรื่องน่ารู้เกี่ยวกับการดูดวง รวมบทความจาก Pick Mystic',
};

export default async function BlogPage({ searchParams }) {
  const sp = await searchParams;
  const activeCat = typeof sp?.cat === 'string' ? sp.cat : null;

  const [articles, categories] = await Promise.all([
    client.fetch(allArticlesQuery, {}, { next: { revalidate: 60 } }),
    client.fetch(allCategoriesQuery, {}, { next: { revalidate: 60 } }),
  ]);

  const filtered = activeCat
    ? articles.filter((a) => a.category?.slug === activeCat)
    : articles;

  const breadcrumbs = breadcrumbLd([
    { name: 'หน้าแรก', url: '/' },
    { name: 'บทความ', url: '/blog' },
  ]);

  return (
    <main>
      <JsonLd data={breadcrumbs} />
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">บทความ</span>
            <h1 className="section-title">บทความทั้งหมด</h1>
            <p className="section-subtitle">
              ความรู้สายมู ไพ่ทาโรต์ และเรื่องน่ารู้เกี่ยวกับการดูดวง
            </p>
          </div>

          <CategoryFilter categories={categories} activeCat={activeCat} />

          {filtered.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-12 flex max-w-md flex-col items-center text-center">
              <Image
                src="/images/mascot-pick.webp"
                width={140}
                height={140}
                alt="กระต่าย Pick Mystic"
                className="opacity-90"
              />
              <p className="mt-4 text-base text-muted-purple">
                ยังไม่มีบทความ ติดตามเร็วๆ นี้
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
