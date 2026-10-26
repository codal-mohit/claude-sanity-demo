import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/app/ui/Breadcrumb';
import { PortableTextBody } from '@/features/content/PortableTextBody';
import { SanityImage } from '@/features/content/SanityImage';
import { formatEventDate, isUpcoming } from '@/features/events/formatEventDate';
import { TranslationNotice } from '@/features/site/TranslationNotice';
import { buildAlternates } from '@/i18n/alternates';
import { localizePath } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { assertLang } from '@/i18n/server';
import { sanityFetch } from '@/sanity/live';
import { EVENT_QUERY } from '@/sanity/queries';

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = assertLang(raw);
  const { data: event } = await sanityFetch({ query: EVENT_QUERY, params: { slug, lang }, stega: false });
  return {
    title: event?.seo?.title ?? event?.title ?? undefined,
    description: event?.seo?.description ?? event?.summary ?? undefined,
    alternates: buildAlternates('event', event?.translations, { lang, slug }),
  };
}

export default async function EventPage({ params }: Props) {
  const { lang: raw, slug } = await params;
  const lang = assertLang(raw);
  const t = getDictionary(lang);
  const { data: event } = await sanityFetch({ query: EVENT_QUERY, params: { slug, lang } });
  if (!event) notFound();

  const upcoming = isUpcoming(event.startsAt);
  const mapUrl = event.location?.lat
    ? `https://www.openstreetmap.org/?mlat=${event.location.lat}&mlon=${event.location.lng}#map=15/${event.location.lat}/${event.location.lng}`
    : null;

  return (
    <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <TranslationNotice lang={lang} contentLang={event.language} />
      <Breadcrumbs
        className="font-mono"
        items={[
          { label: t.home, href: localizePath('/', lang) },
          { label: t.events, href: localizePath('/events', lang) },
          { label: event.title },
        ]}
      />
      <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <p className="text-accent font-mono text-xs tracking-wider uppercase">{upcoming ? t.upcoming : t.pastEvent}</p>
          <h1 className="text-headline mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">{event.title}</h1>
          {event.summary ? <p className="mt-4 text-lg leading-8">{event.summary}</p> : null}
          {event.image ? (
            <div className="border-border bg-surface mt-8 rounded-3xl border p-2">
              <SanityImage image={event.image} width={1200} height={630} priority className="rounded-2xl" />
            </div>
          ) : null}
          <div className="mt-8 max-w-3xl">
            <PortableTextBody value={event.body} lang={lang} />
          </div>
        </div>

        <aside className="border-border bg-surface flex flex-col gap-4 self-start rounded-2xl border p-6 lg:sticky lg:top-24">
          <div>
            <p className="font-mono text-xs tracking-wider uppercase">{t.when}</p>
            <p className="text-headline mt-1 font-semibold">{formatEventDate(event.startsAt, event.endsAt)}</p>
          </div>
          <div>
            <p className="font-mono text-xs tracking-wider uppercase">{t.where}</p>
            <p className="text-headline mt-1 font-semibold">
              {event.format === 'online' ? t.online : (event.venue ?? t.toBeAnnounced)}
            </p>
            {mapUrl ? (
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="text-accent text-sm underline underline-offset-4">
                {t.openMap}
              </a>
            ) : null}
          </div>
          {upcoming && (event.ticketUrl || event.onlineUrl) ? (
            <a
              href={(event.ticketUrl ?? event.onlineUrl) as string}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-background rounded-xl px-5 py-3 text-center text-sm font-semibold hover:opacity-90"
            >
              {event.ticketUrl ? t.getTicket : t.joinOnline}
            </a>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
