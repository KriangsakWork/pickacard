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
    _updatedAt,
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
    productsHeading,
    relatedCards,
    relatedPickTopic->{
      _id,
      title,
      "slug": slug.current,
      shortDescription,
      coverImage,
      category->{
        title,
        "slug": slug.current,
        icon
      }
    }
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
      productsHeading,
      relatedProducts[]->{
        _id,
        name,
        "slug": slug.current,
        image,
        price,
        currency,
        shopeeUrl
      },
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
    seo,
    "relatedArticles": select(
      count(relatedArticles) > 0 => relatedArticles[]->{
        _id,
        title,
        "slug": slug.current,
        excerpt,
        coverImage,
        publishedAt,
        category->{
          title,
          "slug": slug.current,
          icon
        }
      },
      *[_type == "article"
        && defined(publishedAt) && publishedAt <= now()
        && (
          relatedPickTopic._ref == ^._id
          || (!defined(relatedPickTopic) && category._ref == ^.category._ref)
        )
      ] | order(publishedAt desc) [0...3] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        coverImage,
        publishedAt,
        category->{
          title,
          "slug": slug.current,
          icon
        }
      }
    )
  }
`;

// Auto-match fallback: newest pickTopic in the same category (used when
// an article has no explicit relatedPickTopic set).
export const pickTopicByCategoryQuery = groq`
  *[_type == "pickTopic"
    && defined(slug.current)
    && category._ref == $categoryId
  ] | order(publishedAt desc) [0] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    coverImage,
    category->{
      title,
      "slug": slug.current,
      icon
    }
  }
`;

// Ultimate fallback: newest featured pickTopic regardless of category.
// Used when an article's category has no matching pickTopic at all.
export const anyFeaturedPickTopicQuery = groq`
  *[_type == "pickTopic" && defined(slug.current) && isFeatured == true]
    | order(publishedAt desc) [0] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    coverImage,
    category->{
      title,
      "slug": slug.current,
      icon
    }
  }
`;

// All published pick topic slugs — for generateStaticParams.
export const allPickTopicSlugsQuery = groq`
  *[_type == "pickTopic" && defined(slug.current)]{
    "slug": slug.current
  }
`;

// All pick topics — newest first. Used by /readings list page.
export const allPickTopicsQuery = groq`
  *[_type == "pickTopic" && defined(slug.current)] | order(publishedAt desc){
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
    publishedAt
  }
`;

// Featured pick topics for the homepage topic grid.
export const featuredPickTopicsQuery = groq`
  *[_type == "pickTopic" && isFeatured == true && defined(slug.current)]
    | order(publishedAt desc)[0...6]{
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
    isFeatured
  }
`;
