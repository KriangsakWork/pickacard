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

// All categories, ordered by their display order.
export const allCategoriesQuery = groq`
  *[_type == "category"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    icon
  }
`;
