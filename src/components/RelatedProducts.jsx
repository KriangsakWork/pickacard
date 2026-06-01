import Image from 'next/image';

import { urlFor } from '@/sanity/image';

const DEFAULT_HEADING = 'ของแนะนำสำหรับคุณ';

export default function RelatedProducts({ products, heading, mobileIdx = 0 }) {
  if (!products?.length) return null;

  const items = products.slice(0, 3);
  const picked = ((mobileIdx % items.length) + items.length) % items.length;

  return (
    <section className="mt-12 rounded-2xl bg-primary-50 p-6">
      <h2 className="mb-4 text-xl font-semibold text-dark-purple">
        {heading || DEFAULT_HEADING}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map((p, i) => {
          const img = p.image
            ? urlFor(p.image).width(400).height(400).fit('crop').url()
            : null;
          const visibility = i === picked ? 'block' : 'hidden sm:block';
          return (
            <a
              key={p._id}
              href={p.shopeeUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className={`${visibility} group overflow-hidden rounded-xl bg-white shadow-sm transition-transform hover:-translate-y-0.5`}
            >
              <div className="relative aspect-square bg-white">
                {img && (
                  <Image
                    src={img}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-3">
                <p className="line-clamp-2 text-sm font-medium text-dark-purple">
                  {p.name}
                </p>
                {p.price != null && (
                  <p className="mt-1 text-sm font-semibold text-primary">
                    {p.price} {p.currency || 'THB'}
                  </p>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
