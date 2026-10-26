import { describe, expect, it } from 'vitest';

import { buildAlternates } from './alternates';

describe('buildAlternates', () => {
  it('lists every translation plus x-default', () => {
    const result = buildAlternates(
      'post',
      [
        { lang: 'en', slug: 'typed-groq' },
        { lang: 'fr', slug: 'groq-type' },
      ],
      { lang: 'fr', slug: 'groq-type' },
    );
    expect(result).toEqual({
      canonical: '/fr/blog/groq-type',
      languages: { en: '/blog/typed-groq', fr: '/fr/blog/groq-type', 'x-default': '/blog/typed-groq' },
    });
  });

  it('falls back to the current document without translation metadata', () => {
    expect(buildAlternates('series', null, { lang: 'en', slug: 's' })).toEqual({
      canonical: '/series/s',
      languages: { en: '/series/s', 'x-default': '/series/s' },
    });
  });
});
