import { DEFAULT_LANG, isLang } from '../i18n/config';

// Payload sent by the Sanity webhook. Set this projection on the webhook:
// { _type, "slug": slug.current, language }
export type WebhookPayload = {
  _type?: string;
  slug?: string | null;
  language?: string | null;
};

// A path for next/cache revalidatePath. Internal paths include the locale segment,
// because middleware rewrites /blog to /en/blog before routing.
export type RevalidateTarget = { path: string; type?: 'page' | 'layout' };

const EVERYTHING: RevalidateTarget[] = [{ path: '/', type: 'layout' }];

export function revalidateTargets(payload: WebhookPayload): RevalidateTarget[] {
  const lang = isLang(payload.language) ? payload.language : DEFAULT_LANG;
  const base = `/${lang}`;
  const slug = payload.slug;

  switch (payload._type) {
    case 'post':
      return [
        ...(slug ? [{ path: `${base}/blog/${slug}` }] : []),
        { path: `${base}/blog` },
        { path: base },
        // Article cards also appear on author, series and builder pages.
        { path: '/[lang]/authors/[slug]', type: 'page' },
        { path: '/[lang]/series/[slug]', type: 'page' },
        { path: '/[lang]/[slug]', type: 'page' },
      ];
    case 'page':
      return slug && slug !== 'home' ? [{ path: `${base}/${slug}` }] : [{ path: base }];
    case 'series':
      return [...(slug ? [{ path: `${base}/series/${slug}` }] : []), { path: `${base}/series` }];
    case 'event':
      return [...(slug ? [{ path: `${base}/events/${slug}` }] : []), { path: `${base}/events` }];
    case 'docsArticle':
      // The docs sidebar lists every article, so refresh all docs pages.
      return [{ path: '/[lang]/docs/[slug]', type: 'page' }];
    default:
      // Shared documents (navigation, settings, authors, categories, FAQs) appear everywhere.
      return EVERYTHING;
  }
}
