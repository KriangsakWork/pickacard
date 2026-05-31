import { notFound } from 'next/navigation';

import JsonLd from '@/components/JsonLd';
import {
  breadcrumbLd,
  META_DESC_MAX,
  META_TITLE_MAX,
  truncate, alternatesFor } from '@/lib/seo';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import {
  allPickTopicSlugsQuery,
  pickTopicBySlugQuery,
} from '@/sanity/queries';

import ReadingClient from './ReadingClient';

export const revalidate = 60;

async function getTopic(slug) {
  return client.fetch(pickTopicBySlugQuery, { slug });
}

export async function generateStaticParams() {
  const slugs = await client.fetch(allPickTopicSlugsQuery);
  return slugs.map(({ slug }) => ({ topic: slug }));
}

export async function generateMetadata({ params }) {
  const { topic: slug } = await params;
  const data = await getTopic(slug);
  if (!data) return {};
  const rawTitle =
    data.seo?.metaTitle || `${data.title} - Pick a Card ${data.title}`;
  const rawDescription =
    data.seo?.metaDescription || data.shortDescription || data.excerpt || '';
  const metaTitle = truncate(rawTitle, META_TITLE_MAX);
  const metaDescription = truncate(rawDescription, META_DESC_MAX);
  const ogImage =
    (data.seo?.ogImage && urlFor(data.seo.ogImage).width(1200).url()) ||
    (data.coverImage && urlFor(data.coverImage).width(1200).url()) ||
    undefined;
  return {
    title: metaTitle,
    description: metaDescription,
    alternates: alternatesFor(`/reading/${slug}`),
    openGraph: {
      title: data.title,
      description: metaDescription,
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: metaDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ReadingTopicPage({ params }) {
  const { topic: slug } = await params;
  const data = await getTopic(slug);
  if (!data) notFound();

  const topic = {
    title: data.title,
    slug: data.slug,
    shortDescription: data.shortDescription,
  };
  const results = Array.isArray(data.results) ? data.results : [];
  const relatedArticles = Array.isArray(data.relatedArticles) ? data.relatedArticles : [];

  const breadcrumbs = breadcrumbLd([
    { name: 'หน้าแรก', url: '/' },
    { name: 'ดูคำทำนายทั้งหมด', url: '/readings' },
    { name: data.title, url: `/reading/${slug}` },
  ]);

  return (
    <main className="container">
      <JsonLd data={breadcrumbs} />
      <ReadingClient topic={topic} results={results} relatedArticles={relatedArticles} />
    </main>
  );
}
