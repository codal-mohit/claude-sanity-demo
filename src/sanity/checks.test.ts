import { describe, expect, it } from 'vitest';

import { editorialIssues } from './checks';

describe('editorialIssues', () => {
  it('ignores types that are not checked', () => {
    expect(editorialIssues({ _type: 'author' })).toEqual([]);
    expect(editorialIssues(null)).toEqual([]);
  });

  it('flags an article missing SEO description, excerpt, tags and alt text', () => {
    expect(editorialIssues({ _type: 'post', coverImage: {} })).toEqual([
      'Add an SEO description.',
      'Add an excerpt.',
      'Add at least one tag.',
      'Add alt text to the cover image.',
    ]);
  });

  it('accepts a complete article with a decorative cover image', () => {
    expect(
      editorialIssues({
        _type: 'post',
        excerpt: 'x',
        tags: ['nextjs'],
        seo: { description: 'y' },
        coverImage: { decorative: true },
      }),
    ).toEqual([]);
  });

  it('requires a summary on events', () => {
    expect(editorialIssues({ _type: 'event', seo: { description: 'y' } })).toEqual(['Add a summary.']);
    expect(editorialIssues({ _type: 'event', seo: { description: 'y' }, summary: 's' })).toEqual([]);
  });
});
