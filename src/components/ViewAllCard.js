import Link from 'next/link';

// Mirrors ArticleCard's .topic-card shell but acts as a "see all articles"
// call-to-action — used to fill the home grid when Sanity has < 3 articles.
export default function ViewAllCard() {
  return (
    <Link href="/blog" className="topic-card">
      <div className="topic-media flex items-center justify-center">
        <span className="relative z-[1] text-5xl">📚</span>
      </div>
      <div className="topic-body">
        <h3 className="topic-title">ดูบทความทั้งหมด</h3>
        <p className="topic-hook">
          อ่านเรื่องน่ารู้เกี่ยวกับไพ่ทาโรต์และการดูดวงเพิ่มเติม
        </p>
        <span className="mt-auto pt-2.5 text-[13px] font-bold text-primary">
          ดูทั้งหมด →
        </span>
      </div>
    </Link>
  );
}
