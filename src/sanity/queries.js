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

// Pick a Card topic by slug — resolves category and the 4 results, each with
// 3 cards (tarotCard ref expanded for name/image/etc).
export const pickTopicBySlugQuery = groq`
  *[_type == "pickTopic" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    coverImage,
    category->{
      title,
      "slug": slug.current,
      icon
    },
    isFeatured,
    publishedAt,
    results[]{
      resultTitle,
      subtitle,
      summary,
      advice,
      cards[]{
        position,
        tags,
        meaning,
        "card": cardRef->{
          name,
          nameTh,
          "slug": slug.current,
          arcana,
          suit,
          number,
          image
        }
      }
    },
    seo
  }
`;

// All published pick topic slugs — for generateStaticParams.
export const allPickTopicSlugsQuery = groq`
  *[_type == "pickTopic" && defined(slug.current)]{
    "slug": slug.current
  }
`;
