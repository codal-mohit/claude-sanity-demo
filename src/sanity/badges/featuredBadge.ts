import type { DocumentBadgeComponent } from 'sanity';

import { reviewStatusOf } from '../workflow';

export const featuredBadge: DocumentBadgeComponent = ({ draft, published }) => {
  const doc = (draft ?? published) as { featured?: boolean } | null;
  if (!doc?.featured) return null;
  return { label: 'Featured', title: 'Shown in featured slots', color: 'primary' };
};

export const reviewBadge: DocumentBadgeComponent = ({ draft, published }) => {
  const status = reviewStatusOf(draft ?? published);
  if (status === 'in-review') return { label: 'In review', color: 'warning' };
  if (status === 'approved') return { label: 'Approved', color: 'success' };
  return null;
};
