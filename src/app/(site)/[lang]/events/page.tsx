import type { Metadata } from 'next';

import { EventCard } from '@/features/events/EventCard';
import { isUpcoming } from '@/features/events/formatEventDate';
import { localizePath } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { assertLang } from '@/i18n/server';
import { sanityFetch } from '@/sanity/live';
import { EVENTS_QUERY } from '@/sanity/queries';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = assertLang((await params).lang);
  return { title: getDictionary(lang).events, alternates: { canonical: localizePath('/events', lang) } };
}

export default async function EventsPage({ params }: Props) {
  const lang = assertLang((await params).lang);
  const t = getDictionary(lang);
  const { data: events } = await sanityFetch({ query: EVENTS_QUERY, params: { lang } });
  const upcoming = events.filter((event) => isUpcoming(event.startsAt)).reverse();
  const past = events.filter((event) => !isUpcoming(event.startsAt));

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-accent font-mono text-sm">~/events</p>
      <h1 className="text-headline mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">{t.events}</h1>

      <section className="mt-12">
        <h2 className="text-headline mb-6 text-2xl font-bold">{t.upcoming}</h2>
        {upcoming.length ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {upcoming.map((event) => (
              <EventCard key={event._id} event={event} lang={lang} />
            ))}
          </div>
        ) : (
          <p className="font-mono">{t.nothingScheduled}</p>
        )}
      </section>

      {past.length ? (
        <section className="mt-16">
          <h2 className="text-headline mb-6 text-2xl font-bold">{t.past}</h2>
          <div className="grid gap-6 opacity-80 sm:grid-cols-2">
            {past.map((event) => (
              <EventCard key={event._id} event={event} lang={lang} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
