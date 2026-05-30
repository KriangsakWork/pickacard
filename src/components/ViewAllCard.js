import Link from 'next/link';

// Mirrors ArticleCard's inset-cover shell but acts as a "see all articles"
// call-to-action — used to fill the home grid when Sanity has < 3 articles.
export default function ViewAllCard() {
  return (
    <Link
      href="/blog"
      className="group flex flex-col rounded-[20px] bg-white p-4 shadow-[0_2px_14px_rgba(46,33,71,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(46,33,71,0.14)]"
    >
      <span className="mb-2 text-xs font-semibold tracking-wide text-primary">
        บทความ
      </span>
      <div className="flex aspect-[16/10] items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50">
        <span className="text-5xl transition-transform duration-500 group-hover:scale-110">
          📚
        </span>
      </div>
      <h3 className="mt-3.5 text-[17px] font-bold leading-snug text-dark-purple">
        ดูบทความทั้งหมด
      </h3>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-purple">
        อ่านเรื่องน่ารู้เกี่ยวกับไพ่ทาโรต์และการดูดวงเพิ่มเติม
      </p>
      <span className="mt-3 text-[13px] font-bold text-primary">
        ดูทั้งหมด →
      </span>
    </Link>
  );
}
