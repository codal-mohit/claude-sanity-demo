import { describe, expect, it } from 'vitest';

import { isLang, localizePath, splitLocale } from './config';

describe('localizePath', () => {
  it('leaves default language paths unprefixed', () => {
    expect(localizePath('/blog/x', 'en')).toBe('/blog/x');
  });

  it('prefixes other languages, including the home page', () => {
    expect(localizePath('/blog/x', 'fr')).toBe('/fr/blog/x');
    expect(localizePath('/', 'de')).toBe('/de');
  });

  it('ignores external URLs and unknown languages', () => {
    expect(localizePath('https://example.com', 'fr')).toBe('https://example.com');
    expect(localizePath('/blog', 'xx')).toBe('/blog');
  });
});

describe('splitLocale', () => {
  it('reads a locale prefix', () => {
    expect(splitLocale('/fr/blog/x')).toEqual({ lang: 'fr', path: '/blog/x', prefixed: true });
    expect(splitLocale('/de')).toEqual({ lang: 'de', path: '/', prefixed: true });
  });

  it('treats unprefixed paths as the default language', () => {
    expect(splitLocale('/blog')).toEqual({ lang: 'en', path: '/blog', prefixed: false });
  });
});

describe('isLang', () => {
  it('accepts supported ids only', () => {
    expect(isLang('fr')).toBe(true);
    expect(isLang('es')).toBe(false);
    expect(isLang(undefined)).toBe(false);
  });
});
