import type { Metadata } from 'next';

import { resolveHref } from '@/sanity/links';

import { DEFAULT_LANG, isLang } from './config';

type Translation = { lang: string | null; slug: string | null };

// Builds hreflang alternates from a document's translation metadata.
export function buildAlternates(
  type: string,
  translations: Translation[] | null | undefined,
  current: { lang: string; slug: string | null },
): Metadata['alternates'] {
  const entries = (translations?.length ? translations : [current])
    .filter((t): t is { lang: string; slug: string } => isLang(t.lang) && Boolean(t.slug))
    .map((t) => [t.lang, resolveHref({ _type: type, slug: t.slug }, t.lang)] as const)
    .filter((entry): entry is readonly [string, string] => Boolean(entry[1]));

  const languages = Object.fromEntries(entries);
  const canonical = languages[current.lang] ?? resolveHref({ _type: type, slug: current.slug }, current.lang) ?? undefined;
  if (languages[DEFAULT_LANG]) languages['x-default'] = languages[DEFAULT_LANG];
  return { canonical, languages };
}
