import type { Metadata } from 'next';
import Link from 'next/link';

import { buildSearchTerm } from '@/features/search/searchTerm';
import { localizePath } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { assertLang } from '@/i18n/server';
import { resolveHref } from '@/sanity/links';
import { sanityFetch } from '@/sanity/live';
import { SEARCH_QUERY } from '@/sanity/queries';

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = assertLang((await params).lang);
  // Result pages are thin and vary per query, so keep them out of the index.
  return { title: getDictionary(lang).search, robots: { index: false } };
}

export default async function SearchPage({ params, searchParams }: Props) {
  const lang = assertLang((await params).lang);
  const t = getDictionary(lang);
  const query = ((await searchParams).q ?? '').trim();
  const term = buildSearchTerm(query);
  const results = term ? (await sanityFetch({ query: SEARCH_QUERY, params: { lang, q: term } })).data : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-accent font-mono text-sm">~/search</p>
      <h1 className="text-headline mt-2 text-4xl font-extrabold tracking-tight">{t.search}</h1>

      <form action={localizePath('/search', lang)} role="search" className="mt-8 flex gap-2">
        <label htmlFor="q" className="sr-only">
          {t.search}
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={query}
          placeholder={t.searchPlaceholder}
          maxLength={80}
          className="border-border bg-surface text-headline focus:border-accent w-full rounded-xl border px-4 py-3 font-mono text-sm outline-none"
        />
        <button type="submit" className="bg-accent text-background rounded-xl px-5 text-sm font-semibold hover:opacity-90">
          {t.search}
        </button>
      </form>

      {term ? (
        <section className="mt-10" aria-live="polite">
          <p className="font-mono text-xs">{t.searchResults(results.length, query)}</p>
          {results.length ? (
            <ul className="divide-border border-border bg-surface mt-4 divide-y rounded-2xl border">
              {results.map((result) => {
                const href = resolveHref(result, lang);
                if (!href) return null;
                return (
                  <li key={result._id} className="p-5">
                    <p className="text-accent font-mono text-xs uppercase tracking-wider">
                      {t.typeLabels[result._type] ?? result._type}
                    </p>
                    <Link href={href} className="text-headline hover:text-accent mt-1 block text-lg font-bold transition-colors">
                      {result.title}
                    </Link>
                    {result.snippet ? <p className="mt-1 line-clamp-2 text-sm leading-6">{result.snippet}</p> : null}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-4">{t.noResults}</p>
          )}
        </section>
      ) : null}
    </div>
  );
}
