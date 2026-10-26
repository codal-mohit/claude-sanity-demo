import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ArticleCard, type ArticleCardData } from '@/features/blog/ArticleCard';

const article: ArticleCardData = {
  _id: 'a1',
  title: 'GROQ joins in practice',
  slug: 'groq-joins',
  excerpt: 'How references and projections fit together.',
  publishedAt: '2026-10-20T09:00:00.000Z',
  featured: false,
  tags: ['groq', 'sanity'],
  characters: 5200,
  coverImage: null,
  author: null,
  categories: [{ _id: 'c1', title: 'Backend', slug: 'backend' }],
};

describe('ArticleCard', () => {
  it('links the title to the article', () => {
    render(<ArticleCard article={article} />);
    expect(screen.getByRole('link', { name: 'GROQ joins in practice' })).toHaveAttribute('href', '/blog/groq-joins');
  });

  it('shows tags as filter links and the reading time', () => {
    render(<ArticleCard article={article} />);
    expect(screen.getByRole('link', { name: '#groq' })).toHaveAttribute('href', '/blog?tag=groq');
    expect(screen.getByText(/5 min read/)).toBeInTheDocument();
  });

  it('renders nothing without a slug', () => {
    const { container } = render(<ArticleCard article={{ ...article, slug: null }} />);
    expect(container).toBeEmptyDOMElement();
  });
});
