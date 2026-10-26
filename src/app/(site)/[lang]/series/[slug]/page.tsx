import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/app/ui/Breadcrumb';
import { ArticleMeta } from '@/features/blog/ArticleCard';
import { TranslationNotice } from '@/features/site/TranslationNotice';
import { buildAlternates } from '@/i18n/alternates';
import { localizePath } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { assertLang } from '@/i18n/server';
import { sanityFetch } from '@/sanity/live';
import { SERIES_QUERY } from '@/sanity/queries';

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = assertLang(raw);
  const { data: series } = await sanityFetch({ query: SERIES_QUERY, params: { slug, lang }, stega: false });
  return {
    title: series?.seo?.title ?? series?.title ?? undefined,
    description: series?.seo?.description ?? series?.summary ?? undefined,
    alternates: buildAlternates('series', series?.translations, { lang, slug }),
  };
}

export default async function SeriesPage({ params }: Props) {
  const { lang: raw, slug } = await params;
  const lang = assertLang(raw);
  const t = getDictionary(lang);
  const { data: series } = await sanityFetch({ query: SERIES_QUERY, params: { slug, lang } });
  if (!series) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <TranslationNotice lang={lang} contentLang={series.language} />
      <Breadcrumbs
        className="font-mono"
        items={[
          { label: t.home, href: localizePath('/', lang) },
          { label: t.series, href: localizePath('/series', lang) },
          { label: series.title },
        ]}
      />
      <p className="text-accent mt-8 font-mono text-xs tracking-wider uppercase">
        {t.series} · {t.parts(series.articles?.length ?? 0)}
      </p>
      <h1 className="text-headline mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">{series.title}</h1>
      {series.summary ? <p className="mt-4 text-lg leading-8">{series.summary}</p> : null}

      <ol className="border-border mt-12 border-l">
        {series.articles?.map((article, index) =>
          article.slug ? (
            <li key={article._id} className="relative pb-10 pl-8 last:pb-0">
              <span
                aria-hidden="true"
                className="border-accent bg-background text-accent absolute top-0 -left-4 flex size-8 items-center justify-center rounded-full border font-mono text-xs"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <h2 className="text-headline text-xl font-bold">
                <Link href={localizePath(`/blog/${article.slug}`, lang)} className="hover:text-accent transition-colors">
                  {article.title}
                </Link>
              </h2>
              {article.excerpt ? <p className="mt-2 leading-7">{article.excerpt}</p> : null}
              <ArticleMeta article={article} lang={lang} className="mt-2" />
            </li>
          ) : null,
        )}
      </ol>
    </div>
  );
}
