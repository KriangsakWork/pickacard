import Image from 'next/image';
import Link from 'next/link';

import { urlFor } from '@/sanity/image';

export default function PickTopicPromo({ topic }) {
  if (!topic) return null;

  const imgUrl = topic.coverImage
    ? urlFor(topic.coverImage).width(800).height(300).fit('crop').url()
    : null;

  return (
    <section className="mt-10 overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary-50 via-white to-purple-50 shadow-[0_4px_20px_rgba(126,87,194,0.10)]">
      {imgUrl && (
        <div className="relative h-36 w-full">
          <Image
            src={imgUrl}
            alt={topic.title}
            fill
            sizes="(max-width: 768px) 100vw, 672px"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-col gap-2 p-5 sm:p-6">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
          <span aria-hidden="true">🔮</span>
          ลองสุ่มดวงเรื่องที่เกี่ยวข้อง
        </p>
        <h3 className="text-base font-bold leading-snug text-dark-purple sm:text-lg">
          {topic.title}
        </h3>
        {topic.shortDescription && (
          <p className="line-clamp-2 text-sm text-muted-purple">
            {topic.shortDescription}
          </p>
        )}
        <Link
          href={`/reading/${topic.slug}`}
          className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-semibold transition-colors hover:bg-primary/90"
          style={{ color: '#ffffff' }}
        >
          ✨ เลือกไพ่เลย
        </Link>
      </div>
    </section>
  );
}
