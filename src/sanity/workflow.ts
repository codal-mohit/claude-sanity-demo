// Editorial review workflow: draft -> in review -> approved -> published.
// Pure helpers so the rules are unit tested; the Studio actions in ./actions use them.

export type ReviewStatus = 'draft' | 'in-review' | 'approved';

export const REVIEW_STATUSES: { title: string; value: ReviewStatus }[] = [
  { title: 'Draft', value: 'draft' },
  { title: 'In review', value: 'in-review' },
  { title: 'Approved', value: 'approved' },
];

// Sanity project roles that may approve and publish without review.
const REVIEWER_ROLES = ['administrator', 'editor'];

type Role = { name: string };

export function isReviewer(roles: Role[] | null | undefined): boolean {
  return Boolean(roles?.some((role) => REVIEWER_ROLES.includes(role.name)));
}

export function reviewStatusOf(doc: unknown): ReviewStatus {
  const status = doc && typeof doc === 'object' && 'reviewStatus' in doc ? doc.reviewStatus : undefined;
  return status === 'in-review' || status === 'approved' ? status : 'draft';
}

// Returns why publishing is blocked, or null when it is allowed.
// Reviewers may publish directly; everyone else needs an approved document.
export function publishBlockReason(status: ReviewStatus, roles: Role[] | null | undefined): string | null {
  if (isReviewer(roles) || status === 'approved') return null;
  return status === 'in-review' ? 'Waiting for an editor to approve.' : 'Request a review before publishing.';
}
