import { describe, expect, it } from 'vitest';

import { buildDocsTree } from './buildDocsTree';

const item = (id: string, parentId: string | null = null) => ({ _id: id, title: id, slug: id, parentId });

describe('buildDocsTree', () => {
  it('nests children under their parent and keeps order', () => {
    const tree = buildDocsTree([item('a'), item('b'), item('a1', 'a'), item('a2', 'a')]);
    expect(tree.map((n) => n._id)).toEqual(['a', 'b']);
    expect(tree[0].children.map((n) => n._id)).toEqual(['a1', 'a2']);
  });

  it('treats items with a missing parent as roots', () => {
    const tree = buildDocsTree([item('x', 'missing')]);
    expect(tree.map((n) => n._id)).toEqual(['x']);
  });
});
