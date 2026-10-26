export type LinkTarget = {
  _type?: string | null;
  slug?: string | null;
};

const ROUTES: Record<string, (slug: string) => string> = {
  page: (slug) => (slug === 'home' ? '/' : `/${slug}`),
  post: (slug) => `/blog/${slug}`,
  series: (slug) => `/series/${slug}`,
  event: (slug) => `/events/${slug}`,
  docsArticle: (slug) => `/docs/${slug}`,
  author: (slug) => `/authors/${slug}`,
  category: (slug) => `/blog?category=${slug}`,
};

// Maps a Sanity document type and slug to its public URL.
export function resolveHref(target: LinkTarget | null | undefined): string | null {
  if (!target?._type || !target.slug) return null;
  const route = ROUTES[target._type];
  return route ? route(target.slug) : null;
}

export type ResolvedLink = {
  type?: string | null;
  url?: string | null;
  reference?: LinkTarget | null;
};

// Resolves the `link` object to an href for internal or external targets.
export function linkHref(link: ResolvedLink | null | undefined): string | null {
  if (!link) return null;
  if (link.type === 'external') return link.url ?? null;
  return resolveHref(link.reference);
}

// Reading time from the plain text length of an article, at roughly 1000 characters per minute.
export function readingMinutes(characters: number | null | undefined): number {
  return Math.max(1, Math.round((characters ?? 0) / 1000));
}
