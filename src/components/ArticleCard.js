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

// Reuses the home page's .topic-card look (legacy.css) so article cards match
// the rest of the site: 22px radius, dark glassy category tag, 24px body
// padding, image scrim + hover lift.
export default function ArticleCard({ article }) {
  const { title, slug, excerpt, coverImage, publishedAt, isFeatured, category } =
    article;

  const coverUrl = coverImage
    ? urlFor(coverImage).width(800).height(450).fit('crop').url()
    : null;

  return (
    <Link
      href={`/blog/${slug}`}
      className={`topic-card article-card${isFeatured ? ' is-featured' : ''}`}
    >
      <div className="topic-media">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={coverImage?.alt || title}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">
            🔮
          </div>
        )}

        {category?.title && (
          <span className="topic-tag">{category.title}</span>
        )}

        {isFeatured && (
          <span className="topic-soon-pill">⭐ เด่น</span>
        )}
      </div>

      <div className="topic-body">
        <h3 className="topic-title line-clamp-2">{title}</h3>
        {excerpt && <p className="topic-hook line-clamp-2">{excerpt}</p>}

        <div className="mt-auto flex items-center justify-between pt-2.5">
          <time
            dateTime={publishedAt}
            className="text-xs font-medium text-[#9B8FB4]"
          >
            {formatThaiDate(publishedAt)}
          </time>
          <span className="text-[13px] font-bold text-primary">อ่านต่อ →</span>
        </div>
      </div>
    </Link>
  );
}
