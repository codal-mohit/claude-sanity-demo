import { describe, expect, it } from 'vitest';

import { buildSearchTerm } from './searchTerm';

describe('buildSearchTerm', () => {
  it('turns each word into a prefix match', () => {
    expect(buildSearchTerm('Next GROQ')).toBe('next* groq*');
  });

  it('strips GROQ wildcards and punctuation from input', () => {
    expect(buildSearchTerm('typed* "queries"!')).toBe('typed* queries*');
  });

  it('keeps accented letters and dashes', () => {
    expect(buildSearchTerm('requêtes claude-code')).toBe('requêtes* claude-code*');
  });

  it('returns null for empty or one-letter input', () => {
    expect(buildSearchTerm('   ')).toBeNull();
    expect(buildSearchTerm('a')).toBeNull();
    expect(buildSearchTerm(undefined)).toBeNull();
  });
});
