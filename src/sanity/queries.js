import { groq } from 'next-sanity';

// Published articles (real publish + scheduled time already passed),
// newest first. Resolves the category reference to a small object.
export const allArticlesQuery = groq`
  *[_type == "article" && defined(publishedAt) && publishedAt <= now()]
    | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      coverImage,
      publishedAt,
      isFeatured,
      category->{
        title,
        "slug": slug.current,
        icon
      }
    }
`;

// The 3 newest published articles — used by the home "บทความล่าสุด" block.
export const latestArticlesQuery = groq`
  *[_type == "article" && defined(publishedAt) && publishedAt <= now()]
    | order(publishedAt desc) [0...3] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      coverImage,
      publishedAt,
      isFeatured,
      category->{
        title,
        "slug": slug.current,
        icon
      }
  }
`;

// All categories, ordered by their display order.
export const allCategoriesQuery = groq`
  *[_type == "category"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    icon
  }
`;

// Slugs of every published article — used by generateStaticParams.
export const articleSlugsQuery = groq`
  *[_type == "article" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()].slug.current
`;

// A single article by slug, with everything the detail page needs.
export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    body,
    publishedAt,
    author,
    isFeatured,
    seo,
    "categoryId": category._ref,
    category->{
      title,
      "slug": slug.current,
      icon
    },
    relatedProducts[]->{
      _id,
      name,
      "slug": slug.current,
      image,
      price,
      currency,
      shopeeUrl
    },
    relatedCards
  }
`;

// Up to 3 other published articles in the same category (excludes current).
export const relatedArticlesQuery = groq`
  *[_type == "article"
    && defined(publishedAt) && publishedAt <= now()
    && _id != $id
    && category._ref == $categoryId
  ] | order(publishedAt desc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    publishedAt,
    isFeatured,
    category->{
      title,
      "slug": slug.current,
      icon
    }
  }
`;
