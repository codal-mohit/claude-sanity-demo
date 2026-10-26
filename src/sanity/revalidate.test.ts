import { describe, expect, it } from 'vitest';

import { revalidateTargets } from './revalidate';

describe('revalidateTargets', () => {
  it('refreshes an article, its lists and pages that show article cards', () => {
    const paths = revalidateTargets({ _type: 'post', slug: 'typed-groq', language: 'fr' }).map((t) => t.path);
    expect(paths).toEqual(
      expect.arrayContaining(['/fr/blog/typed-groq', '/fr/blog', '/fr', '/[lang]/authors/[slug]']),
    );
  });

  it('uses the English locale segment when the language is missing or unknown', () => {
    expect(revalidateTargets({ _type: 'event', slug: 'meetup' })).toEqual([
      { path: '/en/events/meetup' },
      { path: '/en/events' },
    ]);
    expect(revalidateTargets({ _type: 'series', slug: 's', language: 'xx' })[0]).toEqual({ path: '/en/series/s' });
  });

  it('maps the home page to the locale root', () => {
    expect(revalidateTargets({ _type: 'page', slug: 'home', language: 'de' })).toEqual([{ path: '/de' }]);
    expect(revalidateTargets({ _type: 'page', slug: 'about' })).toEqual([{ path: '/en/about' }]);
  });

  it('refreshes everything for shared documents', () => {
    expect(revalidateTargets({ _type: 'navigation' })).toEqual([{ path: '/', type: 'layout' }]);
  });
});
