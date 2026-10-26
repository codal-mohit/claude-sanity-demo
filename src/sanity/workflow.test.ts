import { describe, expect, it } from 'vitest';

import { isReviewer, publishBlockReason, reviewStatusOf } from './workflow';

const contributor = [{ name: 'contributor' }];
const editor = [{ name: 'editor' }];

describe('isReviewer', () => {
  it('accepts administrators and editors only', () => {
    expect(isReviewer([{ name: 'administrator' }])).toBe(true);
    expect(isReviewer(editor)).toBe(true);
    expect(isReviewer(contributor)).toBe(false);
    expect(isReviewer(null)).toBe(false);
  });
});

describe('reviewStatusOf', () => {
  it('defaults unknown or missing values to draft', () => {
    expect(reviewStatusOf({ reviewStatus: 'approved' })).toBe('approved');
    expect(reviewStatusOf({ reviewStatus: 'weird' })).toBe('draft');
    expect(reviewStatusOf(null)).toBe('draft');
  });
});

describe('publishBlockReason', () => {
  it('lets reviewers publish at any status', () => {
    expect(publishBlockReason('draft', editor)).toBeNull();
  });

  it('requires approval for contributors', () => {
    expect(publishBlockReason('draft', contributor)).toBe('Request a review before publishing.');
    expect(publishBlockReason('in-review', contributor)).toBe('Waiting for an editor to approve.');
    expect(publishBlockReason('approved', contributor)).toBeNull();
  });
});
