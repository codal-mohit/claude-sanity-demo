import { describe, expect, it } from 'vitest';

import { pageBlockTypes } from './documents/page';
import { schemaTypes } from './index';

const names = schemaTypes.map((type) => type.name);

describe('schemaTypes', () => {
  it('has unique type names', () => {
    expect(new Set(names).size).toBe(names.length);
  });

  it('registers every page builder block', () => {
    for (const block of pageBlockTypes) {
      expect(names).toContain(block);
    }
  });

  it('registers the singletons', () => {
    expect(names).toEqual(expect.arrayContaining(['siteSettings', 'navigation']));
  });
});
