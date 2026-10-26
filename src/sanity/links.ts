// Relative import: this file is also loaded by the Sanity CLI through sanity.config.ts, which has no @/ alias.
import { DEFAULT_LANG, localizePath } from '../i18n/config';

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

// Maps a Sanity document type and slug to its public URL, prefixed for non-default languages.
export function resolveHref(target: LinkTarget | null | undefined, lang: string = DEFAULT_LANG): string | null {
  if (!target?._type || !target.slug) return null;
  const route = ROUTES[target._type];
  return route ? localizePath(route(target.slug), lang) : null;
}

export type ResolvedLink = {
  type?: string | null;
  url?: string | null;
  reference?: LinkTarget | null;
};

// Resolves the `link` object to an href. Site paths and references get the locale prefix.
export function linkHref(link: ResolvedLink | null | undefined, lang: string = DEFAULT_LANG): string | null {
  if (!link) return null;
  if (link.type === 'external') return link.url ? localizePath(link.url, lang) : null;
  return resolveHref(link.reference, lang);
}

// Reading time from the plain text length of an article, at roughly 1000 characters per minute.
export function readingMinutes(characters: number | null | undefined): number {
  return Math.max(1, Math.round((characters ?? 0) / 1000));
}
