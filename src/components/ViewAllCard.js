import Link from 'next/link';

// A card that mirrors ArticleCard's shell but acts as a "see all articles"
// call-to-action — used to fill the home grid when Sanity has < 3 articles.
export default function ViewAllCard() {
  return (
    <Link
      href="/blog"
      className="group flex flex-col overflow-hidden rounded-2xl border border-transparent bg-white shadow-[0_4px_20px_rgba(126,87,194,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(126,87,194,0.18)]"
    >
      <div className="relative flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-primary-100 to-primary-50">
        <span className="text-5xl transition-transform duration-300 group-hover:scale-110">
          📚
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-center p-5 text-center">
        <h3 className="text-lg font-semibold leading-snug text-dark-purple">
          ดูบทความทั้งหมด
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-purple">
          อ่านเรื่องน่ารู้เกี่ยวกับไพ่ทาโรต์และการดูดวงเพิ่มเติม
        </p>
        <span className="mt-4 text-sm font-medium text-primary transition-transform group-hover:translate-x-0.5">
          ดูทั้งหมด →
        </span>
      </div>
    </Link>
  );
}
