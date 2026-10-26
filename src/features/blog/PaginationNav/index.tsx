import Link from 'next/link';

import { cn } from '@/utils';

type PaginationNavProps = {
  page: number;
  totalPages: number;
  // Builds the href for a page number, keeping the other query params.
  hrefFor: (page: number) => string;
  labels: { previous: string; next: string; page: (page: number, total: number) => string };
};

export function PaginationNav({ page, totalPages, hrefFor, labels }: PaginationNavProps) {
  if (totalPages <= 1) return null;
  const linkClass = 'border-border hover:border-accent rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors';
  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-between gap-4">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} rel="prev" className={linkClass}>
          ← {labels.previous}
        </Link>
      ) : (
        <span />
      )}
      <p className="font-mono text-xs" aria-current="page">
        {labels.page(page, totalPages)}
      </p>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} rel="next" className={cn(linkClass)}>
          {labels.next} →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
