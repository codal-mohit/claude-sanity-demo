import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PaginationNav } from '@/features/blog/PaginationNav';

const labels = { previous: 'Previous', next: 'Next', page: (p: number, t: number) => `Page ${p} of ${t}` };
const hrefFor = (p: number) => `/blog?page=${p}`;

describe('PaginationNav', () => {
  it('links to the previous and next pages', () => {
    render(<PaginationNav page={2} totalPages={3} hrefFor={hrefFor} labels={labels} />);
    expect(screen.getByRole('link', { name: '← Previous' })).toHaveAttribute('href', '/blog?page=1');
    expect(screen.getByRole('link', { name: 'Next →' })).toHaveAttribute('href', '/blog?page=3');
    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
  });

  it('hides the previous link on the first page', () => {
    render(<PaginationNav page={1} totalPages={2} hrefFor={hrefFor} labels={labels} />);
    expect(screen.queryByRole('link', { name: '← Previous' })).not.toBeInTheDocument();
  });

  it('renders nothing for a single page', () => {
    const { container } = render(<PaginationNav page={1} totalPages={1} hrefFor={hrefFor} labels={labels} />);
    expect(container).toBeEmptyDOMElement();
  });
});
