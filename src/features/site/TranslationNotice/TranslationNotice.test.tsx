import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TranslationNotice } from '@/features/site/TranslationNotice';

describe('TranslationNotice', () => {
  it('explains the English fallback in the visitor language', () => {
    render(<TranslationNotice lang="fr" contentLang="en" />);
    expect(screen.getByRole('status')).toHaveTextContent('Cette page n’est pas encore traduite');
  });

  it('renders nothing when the content matches the language', () => {
    const { container } = render(<TranslationNotice lang="de" contentLang="de" />);
    expect(container).toBeEmptyDOMElement();
  });
});
