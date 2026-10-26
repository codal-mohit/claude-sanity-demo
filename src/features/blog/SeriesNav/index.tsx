import Link from 'next/link';

import type { POST_QUERYResult } from '@/sanity/types';
import { cn } from '@/utils';

type Series = NonNullable<NonNullable<POST_QUERYResult>['series']>;

export function SeriesNav({ series, currentId }: { series: Series | null | undefined; currentId: string }) {
  if (!series?.articles?.length) return null;
  const position = series.articles.findIndex((article) => article._id === currentId) + 1;

  return (
    <nav aria-label="Series" className="border-border bg-surface rounded-2xl border p-5">
      <p className="text-accent font-mono text-xs uppercase tracking-wider">
        Series · part {position} of {series.articles.length}
      </p>
      <p className="text-headline mt-1 font-bold">
        {series.slug ? <Link href={`/series/${series.slug}`}>{series.title}</Link> : series.title}
      </p>
      <ol className="mt-4 space-y-2 text-sm">
        {series.articles.map((article, index) => {
          const current = article._id === currentId;
          return (
            <li key={article._id} className="flex gap-3">
              <span className="text-foreground/60 w-5 shrink-0 font-mono">{String(index + 1).padStart(2, '0')}</span>
              {current || !article.slug ? (
                <span aria-current={current ? 'page' : undefined} className={cn(current && 'text-headline font-semibold')}>
                  {article.title}
                </span>
              ) : (
                <Link href={`/blog/${article.slug}`} className="hover:text-accent transition-colors">
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
