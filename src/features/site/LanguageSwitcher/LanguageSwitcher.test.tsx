import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const pathname = vi.fn();
vi.mock('next/navigation', () => ({ usePathname: () => pathname() }));

import { LanguageSwitcher } from '@/features/site/LanguageSwitcher';

describe('LanguageSwitcher', () => {
  it('keeps the path and swaps the locale from an English page', () => {
    pathname.mockReturnValue('/blog/typed-groq');
    render(<LanguageSwitcher label="Language" />);
    expect(screen.getByRole('link', { name: 'fr' })).toHaveAttribute('href', '/fr/blog/typed-groq');
    expect(screen.getByRole('link', { name: 'en' })).toHaveAttribute('aria-current', 'true');
  });

  it('links back to the unprefixed English path', () => {
    pathname.mockReturnValue('/de/series');
    render(<LanguageSwitcher label="Sprache" />);
    expect(screen.getByRole('link', { name: 'en' })).toHaveAttribute('href', '/series');
    expect(screen.getByRole('link', { name: 'de' })).toHaveAttribute('aria-current', 'true');
  });
});
