import type { DocumentBadgeComponent } from 'sanity';

export const featuredBadge: DocumentBadgeComponent = ({ draft, published }) => {
  const doc = (draft ?? published) as { featured?: boolean } | null;
  if (!doc?.featured) return null;
  return { label: 'Featured', title: 'Shown in featured slots', color: 'primary' };
};
