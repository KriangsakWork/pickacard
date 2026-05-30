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

// Clean "inset cover" card: white card with even padding, the cover image
// sits inside with its own rounded corners (not full-bleed), category label
// above it, then title / excerpt / date. Hover lifts the whole card.
export default function ArticleCard({ article }) {
  const { title, slug, excerpt, coverImage, publishedAt, isFeatured, category } =
    article;

  const coverUrl = coverImage
    ? urlFor(coverImage).width(800).height(450).fit('crop').url()
    : null;

  return (
    <Link
      href={`/blog/${slug}`}
      className={`group flex flex-col rounded-[20px] bg-white p-4 shadow-[0_2px_14px_rgba(46,33,71,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(46,33,71,0.14)] ${
        isFeatured ? 'ring-2 ring-primary' : ''
      }`}
    >
      {category?.title && (
        <span className="mb-2 text-xs font-semibold tracking-wide text-primary">
          {category.title}
        </span>
      )}

      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-primary-50">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={coverImage?.alt || title}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">
            🔮
          </div>
        )}
      </div>

      <h3 className="mt-3.5 line-clamp-2 text-[17px] font-bold leading-snug text-dark-purple">
        {title}
      </h3>
      {excerpt && (
        <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-muted-purple">
          {excerpt}
        </p>
      )}
      <time
        dateTime={publishedAt}
        className="mt-3 text-xs font-medium text-[#9B8FB4]"
      >
        {formatThaiDate(publishedAt)}
      </time>
    </Link>
  );
}
