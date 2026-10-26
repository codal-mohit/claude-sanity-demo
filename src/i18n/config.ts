export const LANGUAGES = [
  { id: 'en', title: 'English' },
  { id: 'fr', title: 'Français' },
  { id: 'de', title: 'Deutsch' },
] as const;

export type Lang = (typeof LANGUAGES)[number]['id'];

export const DEFAULT_LANG: Lang = 'en';

export const LANG_IDS: Lang[] = LANGUAGES.map((language) => language.id);

// Document types that have one document per language.
export const I18N_TYPES = ['post', 'page', 'series', 'event', 'docsArticle'];

export function isLang(value: string | null | undefined): value is Lang {
  return LANG_IDS.includes(value as Lang);
}

// Adds the locale prefix for non-default languages. Leaves external URLs untouched.
export function localizePath(path: string, lang: Lang | string = DEFAULT_LANG): string {
  if (!path.startsWith('/') || !isLang(lang) || lang === DEFAULT_LANG) return path;
  return path === '/' ? `/${lang}` : `/${lang}${path}`;
}

// Splits a pathname into its locale and the rest. Unprefixed paths use the default language.
export function splitLocale(pathname: string): { lang: Lang; path: string; prefixed: boolean } {
  const [, first, ...rest] = pathname.split('/');
  if (isLang(first)) {
    return { lang: first, path: `/${rest.join('/')}`, prefixed: true };
  }
  return { lang: DEFAULT_LANG, path: pathname, prefixed: false };
}
