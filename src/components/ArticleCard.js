import Image from 'next/image';
import Link from 'next/link';

import { urlFor } from '@/sanity/image';

// Thai date like "29 พฤษภาคม 2026" (Gregorian year, not the Buddhist era).
function formatThaiDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('th-TH-u-ca-gregory', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

export default function ArticleCard({ article }) {
  const { title, slug, excerpt, coverImage, publishedAt, isFeatured, category } =
    article;

  const coverUrl = coverImage
    ? urlFor(coverImage).width(800).height(450).fit('crop').url()
    : null;

  return (
    <Link
      href={`/blog/${slug}`}
      className={`group block overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgba(126,87,194,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(126,87,194,0.18)] ${
        isFeatured ? 'border-2 border-primary' : 'border border-transparent'
      }`}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-primary-50">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={coverImage?.alt || title}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">
            🔮
          </div>
        )}

        {category?.title && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-primary shadow-sm backdrop-blur">
            {category.icon ? `${category.icon} ` : ''}
            {category.title}
          </span>
        )}

        {isFeatured && (
          <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-white shadow-sm">
            ⭐ เด่น
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-dark-purple">
          {title}
        </h3>
        {excerpt && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-purple">
            {excerpt}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <time dateTime={publishedAt} className="text-xs text-muted-purple">
            {formatThaiDate(publishedAt)}
          </time>
          <span className="text-sm font-medium text-primary transition-transform group-hover:translate-x-0.5">
            อ่านต่อ →
          </span>
        </div>
      </div>
    </Link>
  );
}
