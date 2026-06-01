import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import ArticleShareButtons from '@/components/ArticleShareButtons';
import JsonLd from '@/components/JsonLd';
import PickTopicPromo from '@/components/PickTopicPromo';
import PortableTextRenderer from '@/components/PortableTextRenderer';
import RelatedArticles from '@/components/RelatedArticles';
import RelatedProducts from '@/components/RelatedProducts';
import {
  breadcrumbLd,
  extractFaqFromBody,
  faqPageLd,
  META_DESC_MAX,
  META_TITLE_MAX,
  SITE_URL,
  truncate, alternatesFor } from '@/lib/seo';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import {
  anyFeaturedPickTopicQuery,
  articleBySlugQuery,
  articleSlugsQuery,
  pickTopicByCategoryQuery,
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

// Rough reading-time estimate from Portable Text. Thai has no word spaces,
// so we count characters and assume ~350 chars/min (≈ comfortable Thai pace).
function readingMinutes(blocks) {
  if (!Array.isArray(blocks)) return 1;
  const chars = blocks
    .filter((b) => b._type === 'block' && Array.isArray(b.children))
    .reduce(
      (sum, b) =>
        sum + b.children.reduce((s, c) => s + (c.text ? c.text.length : 0), 0),
      0
    );
  return Math.max(1, Math.round(chars / 350));
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

  const rawTitle = article.seo?.metaTitle || article.title;
  const rawDescription = article.seo?.metaDescription || article.excerpt || '';
  const title = truncate(rawTitle, META_TITLE_MAX);
  const description = truncate(rawDescription, META_DESC_MAX);
  const ogSource = article.seo?.ogImage || article.coverImage;
  const ogImage = ogSource
    ? urlFor(ogSource).width(1200).height(630).fit('crop').url()
    : undefined;
  const images = ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [];

  return {
    title,
    description,
    alternates: alternatesFor(`/blog/${slug}`),
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
    productsHeading,
    relatedPickTopic,
  } = article;

  const [related, pickTopicByCategory] = await Promise.all([
    categoryId
      ? client.fetch(relatedArticlesQuery, { id: article._id, categoryId }, fetchOpts)
      : [],
    !relatedPickTopic && categoryId
      ? client.fetch(pickTopicByCategoryQuery, { categoryId }, fetchOpts)
      : null,
  ]);

  const pickTopic =
    relatedPickTopic ||
    pickTopicByCategory ||
    (await client.fetch(anyFeaturedPickTopicQuery, {}, fetchOpts));

  const coverUrl = coverImage
    ? urlFor(coverImage).width(1600).height(800).fit('crop').url()
    : null;

  const ogImageUrl = coverImage
    ? urlFor(coverImage).width(1200).height(630).fit('crop').url()
    : null;

  const minutes = readingMinutes(body);

  const canonicalPath = `/blog/${article.slug}`;

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt || undefined,
    image: ogImageUrl ? [ogImageUrl] : undefined,
    datePublished: publishedAt,
    dateModified: article._updatedAt || publishedAt,
    author: { '@type': 'Person', name: author || 'Pick Mystic' },
    publisher: {
      '@type': 'Organization',
      name: 'Pick Mystic',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.webp` },
    },
    mainEntityOfPage: `${SITE_URL}${canonicalPath}`,
    articleSection: category?.title || undefined,
  };

  const breadcrumbs = breadcrumbLd([
    { name: 'หน้าแรก', url: '/' },
    { name: 'บทความ', url: '/blog' },
    { name: title, url: canonicalPath },
  ]);

  const faqs = extractFaqFromBody(body);
  const faqLd = faqs.length > 0 ? faqPageLd(faqs) : null;

  return (
    <main>
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbs} />
      {faqLd && <JsonLd data={faqLd} />}
      <article className="section">
        <div className="container max-w-3xl">
          {/* Back to list — ghost button */}
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white/70 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
          >
            ← กลับไปดูบทความทั้งหมด
          </Link>

          {/* Article card */}
          <div className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(126,87,194,0.10)] md:p-12">
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
              <span aria-hidden="true">·</span>
              <span>อ่าน {minutes} นาที</span>
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

          <RelatedProducts
            products={relatedProducts}
            heading={productsHeading}
            mobileIdx={Math.floor(
              Math.random() * Math.max(relatedProducts?.length || 1, 1),
            )}
          />

          {/* Share */}
          <div className="mt-12 border-t border-primary/10 pt-6">
            <ArticleShareButtons title={title} />
          </div>

          {/* Pick a Card promo */}
          <PickTopicPromo topic={pickTopic} />
          </div>
          {/* /Article card */}

          {/* Related articles */}
          <RelatedArticles articles={related} />
        </div>
      </article>
    </main>
  );
}
