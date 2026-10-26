type CheckableDocument = {
  _type?: string;
  excerpt?: string;
  summary?: string;
  tags?: string[];
  seo?: { description?: string };
  coverImage?: { alt?: string; decorative?: boolean };
};

export const CHECKED_TYPES = ['post', 'series', 'page', 'event', 'docsArticle'];

// Editorial checks that run on top of schema validation before publishing.
export function editorialIssues(doc: CheckableDocument | null | undefined): string[] {
  if (!doc?._type || !CHECKED_TYPES.includes(doc._type)) return [];

  const issues: string[] = [];
  if (!doc.seo?.description) issues.push('Add an SEO description.');
  if (doc._type === 'post') {
    if (!doc.excerpt) issues.push('Add an excerpt.');
    if (!doc.tags?.length) issues.push('Add at least one tag.');
    if (doc.coverImage && !doc.coverImage.decorative && !doc.coverImage.alt) {
      issues.push('Add alt text to the cover image.');
    }
  }
  if (doc._type === 'event' && !doc.summary) issues.push('Add a summary.');
  return issues;
}

// GROQ filter for documents that fail the checks above, used by the Content health tool.
export const CONTENT_HEALTH_QUERY = `*[_type in $types && !(_id in path("drafts.**")) && (
  !defined(seo.description)
  || (_type == "post" && (!defined(excerpt) || count(coalesce(tags, [])) == 0))
  || (_type == "event" && !defined(summary))
)] | order(_updatedAt desc) [0...100] {
  _id,
  _type,
  "title": coalesce(title, name),
  _updatedAt,
  excerpt,
  summary,
  tags,
  seo,
  coverImage
}`;
