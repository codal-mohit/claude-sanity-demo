import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const sanityFetch = vi.fn();
vi.mock('@/sanity/live', () => ({ sanityFetch: (...args: unknown[]) => sanityFetch(...args) }));

import Home from '@/app/(site)/[lang]/page';

const params = (lang: string) => ({ params: Promise.resolve({ lang }) });

describe('Home', () => {
  it('renders the placeholder when there is no home page', async () => {
    sanityFetch.mockResolvedValue({ data: null });
    render(await Home(params('en')));
    expect(screen.getByRole('heading', { name: 'Sanity Claude Demo' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open Studio' })).toHaveAttribute('href', '/studio');
  });

  it('fetches the home page in the requested language and renders its blocks', async () => {
    sanityFetch.mockResolvedValue({
      data: {
        _id: 'home-fr',
        _type: 'page',
        title: 'Accueil',
        language: 'fr',
        seo: null,
        translations: null,
        blocks: [{ _key: 'a', _type: 'hero', heading: 'Bonjour', links: null, image: null }],
      },
    });
    render(await Home(params('fr')));
    expect(sanityFetch).toHaveBeenLastCalledWith(expect.objectContaining({ params: { slug: 'home', lang: 'fr' } }));
    expect(screen.getByRole('heading', { name: 'Bonjour' })).toBeInTheDocument();
  });
});
