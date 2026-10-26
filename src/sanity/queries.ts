import { defineQuery } from 'next-sanity';

// Shared projections and filters. Typegen resolves these template literals.
// Documents without a language field predate i18n and count as English.

// In a list: documents in $lang, plus English documents that have no $lang translation.
const inLang = /* groq */ `(
  coalesce(language, "en") == $lang
  || (
    coalesce(language, "en") == "en"
    && count(*[_type == "translation.metadata" && references(^._id)].translations[_key == $lang]) == 0
  )
)`;

const translations = /* groq */ `"translations": *[_type == "translation.metadata" && references(^._id)][0].translations[]{
  "lang": _key,
  "slug": value->slug.current
}`;

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
  "language": coalesce(language, "en"),
  excerpt,
  publishedAt,
  featured,
  tags,
  "characters": length(pt::text(body)),
  coverImage${image},
  "author": author->{ name, role, "slug": slug.current, avatar${image} },
  "categories": categories[]->{ _id, title, "slug": slug.current }
}`;

const eventCard = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  summary,
  startsAt,
  endsAt,
  format,
  venue,
  image${image}
}`;

export const SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]{ title, description }`);

export const NAVIGATION_QUERY = defineQuery(`*[_type == "navigation"][0]{
  header[]${link},
  footerColumns[]{ _key, title, links[]${link} }
}`);

export const PAGE_QUERY = defineQuery(`coalesce(
  *[_type == "page" && slug.current == $slug && coalesce(language, "en") == $lang][0],
  *[_type == "page" && slug.current == $slug && coalesce(language, "en") == "en"][0]
){
  _id,
  _type,
  title,
  "language": coalesce(language, "en"),
  seo,
  ${translations},
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
        mode == "category" => *[_type == "post" && references(^.category._ref) && ${inLang}] | order(publishedAt desc) [0...12] ${articleCard},
        *[_type == "post" && ${inLang}] | order(publishedAt desc) [0...12] ${articleCard}
      )
    }
  }
}`);

const postsFilter = /* groq */ `
  _type == "post"
  && defined(slug.current)
  && ${inLang}
  && (!defined($category) || $category in categories[]->slug.current)
  && (!defined($topic) || $topic in tags)
`;

export const POSTS_QUERY = defineQuery(
  `*[${postsFilter}] | order(publishedAt desc) [$start...$end] ${articleCard}`,
);

export const POSTS_COUNT_QUERY = defineQuery(`count(*[${postsFilter}])`);

// Weighted full-text search across content types in the current language.
export const SEARCH_QUERY = defineQuery(`*[
  _type in ["post", "series", "event", "docsArticle"]
  && defined(slug.current)
  && ${inLang}
  && [title, excerpt, summary, tags, pt::text(body)] match $q
]
| score(
    boost(title match $q, 4),
    boost(tags match $q, 2),
    boost(excerpt match $q, 2),
    boost(summary match $q, 2),
    pt::text(body) match $q
  )
| order(_score desc, _updatedAt desc) [0...20] {
  _id,
  _type,
  title,
  "slug": slug.current,
  "snippet": coalesce(excerpt, summary),
  tags
}`);

export const CATEGORIES_QUERY = defineQuery(
  `*[_type == "category" && count(*[_type == "post" && references(^._id)]) > 0] | order(title asc){ _id, title, "slug": slug.current }`,
);

export const TAGS_QUERY = defineQuery(`array::unique(*[_type == "post" && defined(tags)].tags[])`);

export const POST_QUERY = defineQuery(`coalesce(
  *[_type == "post" && slug.current == $slug && coalesce(language, "en") == $lang][0],
  *[_type == "post" && slug.current == $slug && coalesce(language, "en") == "en"][0]
){
  ...${articleCard},
  seo,
  repoUrl,
  ${translations},
  body${portableText},
  "series": *[_type == "series" && references(^._id)][0]{
    title,
    "slug": slug.current,
    "articles": articles[]->{ _id, title, "slug": slug.current }
  },
  "related": *[
    _type == "post"
    && _id != ^._id
    && coalesce(language, "en") == coalesce(^.language, "en")
    && count(coalesce(tags, [])[@ in coalesce(^.tags, [])]) > 0
  ] | order(publishedAt desc) [0...3] ${articleCard}
}`);

export const SERIES_LIST_QUERY = defineQuery(`*[_type == "series" && defined(slug.current) && ${inLang}] | order(title asc){
  _id,
  title,
  "slug": slug.current,
  summary,
  "count": count(articles)
}`);

export const SERIES_QUERY = defineQuery(`coalesce(
  *[_type == "series" && slug.current == $slug && coalesce(language, "en") == $lang][0],
  *[_type == "series" && slug.current == $slug && coalesce(language, "en") == "en"][0]
){
  _id,
  title,
  "slug": slug.current,
  "language": coalesce(language, "en"),
  summary,
  seo,
  ${translations},
  coverImage${image},
  "articles": articles[]->${articleCard}
}`);

export const EVENTS_QUERY = defineQuery(
  `*[_type == "event" && defined(slug.current) && ${inLang}] | order(startsAt desc) ${eventCard}`,
);

export const EVENT_QUERY = defineQuery(`coalesce(
  *[_type == "event" && slug.current == $slug && coalesce(language, "en") == $lang][0],
  *[_type == "event" && slug.current == $slug && coalesce(language, "en") == "en"][0]
){
  ...${eventCard},
  "language": coalesce(language, "en"),
  seo,
  ${translations},
  location,
  onlineUrl,
  ticketUrl,
  body${portableText}
}`);

export const DOCS_NAV_QUERY = defineQuery(`*[_type == "docsArticle" && defined(slug.current) && ${inLang}] | order(order asc, title asc){
  _id,
  title,
  "slug": slug.current,
  "parentId": parent._ref
}`);

export const DOCS_ARTICLE_QUERY = defineQuery(`coalesce(
  *[_type == "docsArticle" && slug.current == $slug && coalesce(language, "en") == $lang][0],
  *[_type == "docsArticle" && slug.current == $slug && coalesce(language, "en") == "en"][0]
){
  _id,
  title,
  "slug": slug.current,
  "language": coalesce(language, "en"),
  summary,
  version,
  seo,
  _updatedAt,
  ${translations},
  "parent": parent->{ title, "slug": slug.current },
  body${portableText}
}`);

export const AUTHOR_QUERY = defineQuery(`*[_type == "author" && slug.current == $slug][0]{
  _id,
  name,
  role,
  bio,
  socials,
  avatar${image},
  "articles": *[_type == "post" && references(^._id) && ${inLang}] | order(publishedAt desc) ${articleCard}
}`);

export const SITEMAP_QUERY = defineQuery(`*[
  _type in ["page", "post", "series", "event", "docsArticle", "author"]
  && defined(slug.current)
  && coalesce(seo.noIndex, false) == false
]{ _type, "slug": slug.current, "language": coalesce(language, "en"), _updatedAt }`);
