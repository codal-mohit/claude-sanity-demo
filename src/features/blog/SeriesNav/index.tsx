import Link from 'next/link';

import { DEFAULT_LANG, localizePath, type Lang } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import type { POST_QUERYResult } from '@/sanity/types';
import { cn } from '@/utils';

type Series = NonNullable<NonNullable<POST_QUERYResult>['series']>;

export function SeriesNav({
  series,
  currentId,
  lang = DEFAULT_LANG,
}: {
  series: Series | null | undefined;
  currentId: string;
  lang?: Lang;
}) {
  if (!series?.articles?.length) return null;
  const position = series.articles.findIndex((article) => article._id === currentId) + 1;

  return (
    <nav aria-label="Series" className="border-border bg-surface rounded-2xl border p-5">
      <p className="text-accent font-mono text-xs uppercase tracking-wider">
        {getDictionary(lang).seriesPart(position, series.articles.length)}
      </p>
      <p className="text-headline mt-1 font-bold">
        {series.slug ? <Link href={localizePath(`/series/${series.slug}`, lang)}>{series.title}</Link> : series.title}
      </p>
      <ol className="mt-4 space-y-2 text-sm">
        {series.articles.map((article, index) => {
          const current = article._id === currentId;
          return (
            <li key={article._id} className="flex gap-3">
              <span className="text-foreground w-5 shrink-0 font-mono">{String(index + 1).padStart(2, '0')}</span>
              {current || !article.slug ? (
                <span aria-current={current ? 'page' : undefined} className={cn(current && 'text-headline font-semibold')}>
                  {article.title}
                </span>
              ) : (
                <Link href={localizePath(`/blog/${article.slug}`, lang)} className="hover:text-accent transition-colors">
                  {article.title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
