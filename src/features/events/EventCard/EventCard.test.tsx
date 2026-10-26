import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EventCard, type EventCardData } from '@/features/events/EventCard';

const event: EventCardData = {
  _id: 'e1',
  title: 'Live: building a Studio plugin',
  slug: 'live-plugin',
  summary: 'One hour, live.',
  startsAt: '2026-11-19T16:00:00.000Z',
  endsAt: '2026-11-19T17:00:00.000Z',
  format: 'online',
  venue: null,
  image: null,
};

describe('EventCard', () => {
  it('links to the event and shows date and format', () => {
    render(<EventCard event={event} />);
    expect(screen.getByRole('link', { name: 'Live: building a Studio plugin' })).toHaveAttribute(
      'href',
      '/events/live-plugin',
    );
    expect(screen.getByText(/Nov 19, 2026, 4:00 PM to 5:00 PM UTC · Online/)).toBeInTheDocument();
  });
});
