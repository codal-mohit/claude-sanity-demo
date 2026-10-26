import Link from 'next/link';

import { DEFAULT_LANG, localizePath, type Lang } from '@/i18n/config';
import type { EVENTS_QUERYResult } from '@/sanity/types';

import { formatEventDate } from '../formatEventDate';

export type EventCardData = EVENTS_QUERYResult[number];

const FORMAT_LABEL: Record<string, string> = { 'in-person': 'In person', online: 'Online', hybrid: 'Hybrid' };

export function EventCard({ event, lang = DEFAULT_LANG }: { event: EventCardData; lang?: Lang }) {
  if (!event.slug) return null;
  return (
    <article className="border-border bg-surface hover:border-accent/60 flex flex-col gap-3 rounded-2xl border p-6 transition-colors">
      <p className="text-accent font-mono text-xs">
        {formatEventDate(event.startsAt, event.endsAt)}
        {event.format ? ` · ${FORMAT_LABEL[event.format] ?? event.format}` : null}
      </p>
      <h3 className="text-headline text-xl font-bold">
        <Link href={localizePath(`/events/${event.slug}`, lang)} className="hover:text-accent transition-colors">
          {event.title}
        </Link>
      </h3>
      {event.summary ? <p className="text-sm leading-6">{event.summary}</p> : null}
      {event.venue && event.format !== 'online' ? <p className="font-mono text-xs">{event.venue}</p> : null}
    </article>
  );
}
