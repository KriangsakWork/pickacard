import { client } from '@/sanity/client';
import {
  allCategoriesQuery,
  allPickTopicsQuery,
} from '@/sanity/queries';

import ReadingsListClient from './ReadingsListClient';

export const revalidate = 60;

export const metadata = {
  title: 'ดูคำทำนายทั้งหมด | Pick Mystic',
  description:
    'รวมคำทำนายไพ่ทาโรต์ทุกหัวข้อ — ความรัก การงาน การเงิน อนาคต ค้นหาตามหมวดหมู่ได้',
};

export default async function ReadingsPage() {
  let topics = [];
  let categories = [];
  try {
    [topics, categories] = await Promise.all([
      client.fetch(allPickTopicsQuery),
      client.fetch(allCategoriesQuery),
    ]);
  } catch {
    topics = [];
    categories = [];
  }

  // Keep only categories that actually have at least one pick topic.
  const usedSlugs = new Set(
    topics.map((t) => t.category?.slug).filter(Boolean),
  );
  const visibleCategories = categories.filter((c) => usedSlugs.has(c.slug));

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">คลังคำทำนายทั้งหมด</span>
            <h1 className="section-title">ดูคำทำนายทั้งหมด</h1>
            <p className="section-subtitle">
              เลือกหัวข้อที่ตรงกับใจคุณ ค้นหาหรือกรองตามหมวดหมู่ได้ตามต้องการ
            </p>
          </div>
          <ReadingsListClient
            topics={topics}
            categories={visibleCategories}
          />
        </div>
      </section>
    </main>
  );
}
