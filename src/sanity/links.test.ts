import { describe, expect, it } from 'vitest';

import { linkHref, readingMinutes, resolveHref } from './links';

describe('resolveHref', () => {
  it('maps document types to routes', () => {
    expect(resolveHref({ _type: 'post', slug: 'groq-joins' })).toBe('/blog/groq-joins');
    expect(resolveHref({ _type: 'series', slug: 'sanity-101' })).toBe('/series/sanity-101');
    expect(resolveHref({ _type: 'page', slug: 'about' })).toBe('/about');
  });

  it('maps the home page to /', () => {
    expect(resolveHref({ _type: 'page', slug: 'home' })).toBe('/');
  });

  it('returns null for unknown types or missing slugs', () => {
    expect(resolveHref({ _type: 'faq', slug: 'x' })).toBeNull();
    expect(resolveHref({ _type: 'post', slug: null })).toBeNull();
    expect(resolveHref(null)).toBeNull();
  });
});

describe('linkHref', () => {
  it('returns the URL or path for external links', () => {
    expect(linkHref({ type: 'external', url: 'https://sanity.io' })).toBe('https://sanity.io');
    expect(linkHref({ type: 'external', url: '/blog' })).toBe('/blog');
  });

  it('resolves internal references', () => {
    expect(linkHref({ type: 'internal', reference: { _type: 'event', slug: 'meetup' } })).toBe(
      '/events/meetup',
    );
  });
});

describe('localized links', () => {
  it('prefixes references and site paths for non-default languages', () => {
    expect(resolveHref({ _type: 'post', slug: 'x' }, 'fr')).toBe('/fr/blog/x');
    expect(resolveHref({ _type: 'page', slug: 'home' }, 'de')).toBe('/de');
    expect(linkHref({ type: 'external', url: '/blog' }, 'fr')).toBe('/fr/blog');
  });

  it('never prefixes full URLs', () => {
    expect(linkHref({ type: 'external', url: 'https://sanity.io' }, 'fr')).toBe('https://sanity.io');
  });
});

describe('readingMinutes', () => {
  it('rounds to whole minutes with a minimum of one', () => {
    expect(readingMinutes(0)).toBe(1);
    expect(readingMinutes(null)).toBe(1);
    expect(readingMinutes(4600)).toBe(5);
  });
});
