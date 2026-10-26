import { describe, expect, it } from 'vitest';

import { paginate } from './paginate';

describe('paginate', () => {
  it('returns slice bounds for the requested page', () => {
    expect(paginate('2', 20, 9)).toEqual({ page: 2, totalPages: 3, start: 9, end: 18 });
  });

  it('clamps out of range and invalid pages', () => {
    expect(paginate('99', 20, 9).page).toBe(3);
    expect(paginate('0', 20, 9).page).toBe(1);
    expect(paginate('abc', 20, 9).page).toBe(1);
    expect(paginate(undefined, 20, 9).page).toBe(1);
  });

  it('always has at least one page', () => {
    expect(paginate('1', 0, 9)).toEqual({ page: 1, totalPages: 1, start: 0, end: 9 });
  });
});
