import { describe, expect, it } from 'vitest';

import { formatEventDate, isUpcoming } from './formatEventDate';

describe('formatEventDate', () => {
  it('formats a same-day range with times', () => {
    expect(formatEventDate('2026-11-19T16:00:00.000Z', '2026-11-19T17:00:00.000Z')).toBe(
      'Nov 19, 2026, 4:00 PM to 5:00 PM UTC',
    );
  });

  it('formats a multi-day range with dates only', () => {
    expect(formatEventDate('2026-11-19T16:00:00.000Z', '2026-11-21T10:00:00.000Z')).toBe(
      'Nov 19, 2026 to Nov 21, 2026',
    );
  });

  it('handles a missing start', () => {
    expect(formatEventDate(null)).toBe('Date to be announced');
  });
});

describe('isUpcoming', () => {
  const now = new Date('2026-11-01T00:00:00.000Z');

  it('is true for future events and false for past or missing dates', () => {
    expect(isUpcoming('2026-11-19T16:00:00.000Z', now)).toBe(true);
    expect(isUpcoming('2026-10-01T16:00:00.000Z', now)).toBe(false);
    expect(isUpcoming(null, now)).toBe(false);
  });
});
