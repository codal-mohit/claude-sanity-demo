import type { Metadata } from 'next';
import Link from 'next/link';

import { localizePath } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { assertLang } from '@/i18n/server';
import { sanityFetch } from '@/sanity/live';
import { SERIES_LIST_QUERY } from '@/sanity/queries';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = assertLang((await params).lang);
  return { title: getDictionary(lang).series, alternates: { canonical: localizePath('/series', lang) } };
}

export default async function SeriesListPage({ params }: Props) {
  const lang = assertLang((await params).lang);
  const t = getDictionary(lang);
  const { data: seriesList } = await sanityFetch({ query: SERIES_LIST_QUERY, params: { lang } });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-accent font-mono text-sm">~/series</p>
      <h1 className="text-headline mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">{t.series}</h1>
      {seriesList.length ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {seriesList.map((series) => (
            <Link
              key={series._id}
              href={localizePath(`/series/${series.slug}`, lang)}
              className="border-border bg-surface hover:border-accent/60 flex flex-col gap-3 rounded-2xl border p-6 transition-colors"
            >
              <p className="text-accent font-mono text-xs">{t.parts(series.count ?? 0)}</p>
              <h2 className="text-headline text-xl font-bold">{series.title}</h2>
              {series.summary ? <p className="text-sm leading-6">{series.summary}</p> : null}
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-12 font-mono">{t.noSeries}</p>
      )}
    </div>
  );
}
