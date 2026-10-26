import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/app/ui/Breadcrumb';
import { ArticleMeta } from '@/features/blog/ArticleCard';
import { client } from '@/sanity/client';
import { sanityFetch } from '@/sanity/live';
import { SERIES_QUERY, SERIES_SLUGS_QUERY } from '@/sanity/queries';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await client.fetch(SERIES_SLUGS_QUERY, {}, { perspective: 'published', stega: false });
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: series } = await sanityFetch({ query: SERIES_QUERY, params, stega: false });
  return {
    title: series?.seo?.title ?? series?.title ?? undefined,
    description: series?.seo?.description ?? series?.summary ?? undefined,
  };
}

export default async function SeriesPage({ params }: Props) {
  const { data: series } = await sanityFetch({ query: SERIES_QUERY, params });
  if (!series) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        className="font-mono"
        items={[{ label: 'Home', href: '/' }, { label: 'Series', href: '/series' }, { label: series.title }]}
      />
      <p className="text-accent mt-8 font-mono text-xs uppercase tracking-wider">
        Series · {series.articles?.length ?? 0} parts
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
                <Link href={`/blog/${article.slug}`} className="hover:text-accent transition-colors">
                  {article.title}
                </Link>
              </h2>
              {article.excerpt ? <p className="mt-2 leading-7">{article.excerpt}</p> : null}
              <ArticleMeta article={article} className="mt-2" />
            </li>
          ) : null,
        )}
      </ol>
    </div>
  );
}
