import { defineQuery } from 'next-sanity';

// Shared projections. Typegen resolves these template literals.
const image = /* groq */ `{
  ...,
  "lqip": asset->metadata.lqip,
  "dimensions": asset->metadata.dimensions
}`;

const link = /* groq */ `{
  _key,
  label,
  type,
  url,
  openInNewTab,
  "reference": reference->{ _type, "slug": slug.current }
}`;

const portableText = /* groq */ `[]{
  ...,
  _type == "imageWithAlt" => ${image},
  markDefs[]{
    ...,
    _type == "internalLink" => { ..., "reference": reference->{ _type, "slug": slug.current } }
  }
}`;

const articleCard = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  featured,
  tags,
  "characters": length(pt::text(body)),
  coverImage${image},
  "author": author->{ name, role, "slug": slug.current, avatar${image} },
  "categories": categories[]->{ _id, title, "slug": slug.current }
}`;

export const SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]{ title, description }`);

export const NAVIGATION_QUERY = defineQuery(`*[_type == "navigation"][0]{
  header[]${link},
  footerColumns[]{ _key, title, links[]${link} }
}`);

export const PAGE_QUERY = defineQuery(`*[_type == "page" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  seo,
  blocks[]{
    ...,
    _type == "hero" => { ..., image${image}, links[]${link} },
    _type == "cta" => { ..., link${link} },
    _type == "gallery" => { ..., images[]${image} },
    _type == "faqBlock" => { ..., "items": items[]->{ _id, question, answer } },
    _type == "storyGrid" => {
      ...,
      "posts": select(
        mode == "manual" => posts[]->${articleCard},
        mode == "category" => *[_type == "post" && references(^.category._ref)] | order(publishedAt desc) [0...12] ${articleCard},
        *[_type == "post"] | order(publishedAt desc) [0...12] ${articleCard}
      )
    }
  }
}`);

export const PAGE_SLUGS_QUERY = defineQuery(
  `*[_type == "page" && defined(slug.current) && slug.current != "home"].slug.current`,
);

export const POSTS_QUERY = defineQuery(`*[
  _type == "post"
  && defined(slug.current)
  && (!defined($category) || $category in categories[]->slug.current)
  && (!defined($topic) || $topic in tags)
] | order(publishedAt desc) [0...24] ${articleCard}`);

export const CATEGORIES_QUERY = defineQuery(
  `*[_type == "category" && count(*[_type == "post" && references(^._id)]) > 0] | order(title asc){ _id, title, "slug": slug.current }`,
);

export const TAGS_QUERY = defineQuery(`array::unique(*[_type == "post" && defined(tags)].tags[])`);

export const POST_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  ...${articleCard},
  seo,
  repoUrl,
  body${portableText},
  "series": *[_type == "series" && references(^._id)][0]{
    title,
    "slug": slug.current,
    "articles": articles[]->{ _id, title, "slug": slug.current }
  },
  "related": *[
    _type == "post"
    && _id != ^._id
    && count(coalesce(tags, [])[@ in coalesce(^.tags, [])]) > 0
  ] | order(publishedAt desc) [0...3] ${articleCard}
}`);

export const POST_SLUGS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)].slug.current`);

export const SERIES_LIST_QUERY = defineQuery(`*[_type == "series" && defined(slug.current)] | order(title asc){
  _id,
  title,
  "slug": slug.current,
  summary,
  "count": count(articles)
}`);

export const SERIES_QUERY = defineQuery(`*[_type == "series" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  summary,
  seo,
  coverImage${image},
  "articles": articles[]->${articleCard}
}`);

export const SERIES_SLUGS_QUERY = defineQuery(`*[_type == "series" && defined(slug.current)].slug.current`);

export const SITEMAP_QUERY = defineQuery(`*[
  _type in ["page", "post", "series", "event", "docsArticle"]
  && defined(slug.current)
  && coalesce(seo.noIndex, false) == false
]{ _type, "slug": slug.current, _updatedAt }`);
