import { PortableText } from '@portabletext/react';
import Image from 'next/image';

import { urlFor } from '@/sanity/image';

// Brand-styled renderer for Sanity portable text. Styled directly with
// design-system tokens (font Prompt via body default, primary/dark/muted
// purple) instead of the typography plugin so the brand colours stay exact.
const components = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 text-2xl font-semibold text-dark-purple">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-xl font-semibold text-dark-purple">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-6 mb-2 text-lg font-semibold text-dark-purple">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="my-4 text-[15px] leading-[1.9] text-dark-purple">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 rounded-r-xl border-l-4 border-primary bg-primary-50 px-5 py-3 text-dark-purple italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-4 list-disc space-y-2 pl-6 text-[15px] leading-[1.9] text-dark-purple marker:text-primary">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-4 list-decimal space-y-2 pl-6 text-[15px] leading-[1.9] text-dark-purple marker:text-primary">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-dark-purple">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href = value?.href || '#';
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          className="font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          {...(external
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const url = urlFor(value).width(1200).fit('max').url();
      return (
        <figure className="my-8">
          <div className="overflow-hidden rounded-2xl shadow-[0_8px_24px_rgba(126,87,194,0.12)]">
            <Image
              src={url}
              alt={value.alt || ''}
              width={1200}
              height={675}
              sizes="(max-width: 768px) 100vw, 768px"
              className="h-auto w-full object-cover"
            />
          </div>
          {value.alt && (
            <figcaption className="mt-2 text-center text-xs text-muted-purple">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export default function PortableTextRenderer({ value }) {
  if (!value) return null;
  return <PortableText value={value} components={components} />;
}
