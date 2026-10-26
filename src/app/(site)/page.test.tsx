import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const sanityFetch = vi.fn();
vi.mock('@/sanity/live', () => ({ sanityFetch: (...args: unknown[]) => sanityFetch(...args) }));

import Home from '@/app/(site)/page';

describe('Home', () => {
  it('renders the placeholder when there is no home page', async () => {
    sanityFetch.mockResolvedValue({ data: null });
    render(await Home());
    expect(screen.getByRole('heading', { name: 'Sanity Claude Demo' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open Studio' })).toHaveAttribute('href', '/studio');
  });

  it('renders page builder blocks when the home page exists', async () => {
    sanityFetch.mockResolvedValue({
      data: {
        _id: 'home',
        _type: 'page',
        title: 'Home',
        seo: null,
        blocks: [{ _key: 'a', _type: 'hero', heading: 'Into the wild', links: null, image: null }],
      },
    });
    render(await Home());
    expect(screen.getByRole('heading', { name: 'Into the wild' })).toBeInTheDocument();
  });
});
