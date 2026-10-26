import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { buildDocsTree } from '@/features/docs/buildDocsTree';
import { DocsSidebar } from '@/features/docs/DocsSidebar';

const tree = buildDocsTree([
  { _id: 'a', title: 'Getting started', slug: 'getting-started', parentId: null },
  { _id: 'b', title: 'Install', slug: 'install', parentId: 'a' },
]);

describe('DocsSidebar', () => {
  it('links every article and marks the current one', () => {
    render(<DocsSidebar tree={tree} currentSlug="install" />);
    expect(screen.getByRole('link', { name: 'Getting started' })).toHaveAttribute('href', '/docs/getting-started');
    expect(screen.getByRole('link', { name: 'Install' })).toHaveAttribute('aria-current', 'page');
  });

  it('renders nothing for an empty tree', () => {
    const { container } = render(<DocsSidebar tree={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
