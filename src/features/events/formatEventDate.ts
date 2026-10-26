const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' });
const timeFormat = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });

// Formats an event range in UTC so server and client render the same text.
export function formatEventDate(startsAt: string | null | undefined, endsAt?: string | null): string {
  if (!startsAt) return 'Date to be announced';
  const start = new Date(startsAt);
  const date = dateFormat.format(start);
  if (!endsAt) return `${date}, ${timeFormat.format(start)} UTC`;

  const end = new Date(endsAt);
  const sameDay = dateFormat.format(end) === date;
  return sameDay
    ? `${date}, ${timeFormat.format(start)} to ${timeFormat.format(end)} UTC`
    : `${date} to ${dateFormat.format(end)}`;
}

export function isUpcoming(startsAt: string | null | undefined, now: Date = new Date()): boolean {
  return Boolean(startsAt) && new Date(startsAt as string) >= now;
}
