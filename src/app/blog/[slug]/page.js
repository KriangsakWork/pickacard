import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import ArticleShareButtons from '@/components/ArticleShareButtons';
import PortableTextRenderer from '@/components/PortableTextRenderer';
import RelatedArticles from '@/components/RelatedArticles';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import {
  articleBySlugQuery,
  articleSlugsQuery,
  relatedArticlesQuery,
} from '@/sanity/queries';

export const revalidate = 60; // ISR

const fetchOpts = { next: { revalidate: 60 } };

function formatThaiDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('th-TH-u-ca-gregory', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch(articleSlugsQuery, {}, fetchOpts);
    return (slugs || []).map((slug) => ({ slug }));
  } catch {
    // Sanity unreachable at build time — fall back to on-demand ISR.
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await client.fetch(articleBySlugQuery, { slug }, fetchOpts);

  if (!article) {
    return { title: 'ไม่พบบทความ' };
  }

  const title = article.seo?.metaTitle || article.title;
  const description = article.seo?.metaDescription || article.excerpt || '';
  const ogSource = article.seo?.ogImage || article.coverImage;
  const ogImage = ogSource
    ? urlFor(ogSource).width(1200).height(630).fit('crop').url()
    : undefined;
  const images = ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: article.publishedAt,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await client.fetch(articleBySlugQuery, { slug }, fetchOpts);

  if (!article) notFound();

  const {
    title,
    excerpt,
    coverImage,
    body,
    publishedAt,
    author,
    category,
    categoryId,
    relatedProducts,
  } = article;

  const related = categoryId
    ? await client.fetch(
        relatedArticlesQuery,
        { id: article._id, categoryId },
        fetchOpts
      )
    : [];

  const coverUrl = coverImage
    ? urlFor(coverImage).width(1600).height(800).fit('crop').url()
    : null;

  return (
    <main>
      <article className="section">
        <div className="container max-w-3xl">
          {/* Breadcrumb */}
          <nav
            aria-label="breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-purple"
          >
            <Link href="/" className="hover:text-primary">
              หน้าแรก
            </Link>
            <span aria-hidden="true">›</span>
            <Link href="/blog" className="hover:text-primary">
              บทความ
            </Link>
            {category?.slug && (
              <>
                <span aria-hidden="true">›</span>
                <Link
                  href={`/blog?cat=${category.slug}`}
                  className="hover:text-primary"
                >
                  {category.icon ? `${category.icon} ` : ''}
                  {category.title}
                </Link>
              </>
            )}
            <span aria-hidden="true">›</span>
            <span className="line-clamp-1 text-dark-purple">{title}</span>
          </nav>

          {/* Header */}
          <header>
            {category?.title && (
              <span className="inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary">
                {category.icon ? `${category.icon} ` : ''}
                {category.title}
              </span>
            )}
            <h1 className="mt-3 text-3xl font-bold leading-tight text-dark-purple md:text-4xl">
              {title}
            </h1>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-purple">
              <span>โดย {author || 'Pick Mystic'}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={publishedAt}>{formatThaiDate(publishedAt)}</time>
            </div>
          </header>

          {/* Cover image */}
          {coverUrl && (
            <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-primary-50 shadow-[0_8px_28px_rgba(126,87,194,0.14)] md:aspect-[2/1]">
              <Image
                src={coverUrl}
                alt={coverImage?.alt || title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}

          {/* Lead / excerpt */}
          {excerpt && (
            <p className="mt-6 text-lg leading-relaxed text-muted-purple">
              {excerpt}
            </p>
          )}

          {/* Body */}
          <div className="mt-2">
            <PortableTextRenderer value={body} />
          </div>

          {/* Related products (shown only when present) */}
          {relatedProducts?.length > 0 && (
            <section className="mt-12 rounded-2xl bg-primary-50 p-6">
              <h2 className="mb-4 text-xl font-semibold text-dark-purple">
                ของแนะนำสำหรับคุณ
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {relatedProducts.map((p) => {
                  const img = p.image
                    ? urlFor(p.image).width(300).height(300).fit('crop').url()
                    : null;
                  return (
                    <a
                      key={p._id}
                      href={p.shopeeUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="group block overflow-hidden rounded-xl bg-white shadow-sm transition-transform hover:-translate-y-0.5"
                    >
                      <div className="relative aspect-square bg-white">
                        {img && (
                          <Image
                            src={img}
                            alt={p.name}
                            fill
                            sizes="(max-width: 640px) 50vw, 200px"
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
          )}

          {/* Share */}
          <div className="mt-12 border-t border-primary/10 pt-6">
            <ArticleShareButtons title={title} />
          </div>

          {/* Related articles */}
          <RelatedArticles articles={related} />
        </div>
      </article>
    </main>
  );
}
