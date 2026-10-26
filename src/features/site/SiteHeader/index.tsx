import Link from 'next/link';

import { SanityLink } from '@/features/content/SanityLink';
import type { NAVIGATION_QUERYResult } from '@/sanity/types';

type SiteHeaderProps = {
  title: string;
  links: NonNullable<NAVIGATION_QUERYResult>['header'];
};

export function SiteHeader({ title, links }: SiteHeaderProps) {
  return (
    <header className="border-border bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="text-headline flex items-center gap-2 font-bold">
          <span aria-hidden="true" className="text-accent font-mono">
            &gt;_
          </span>
          {title}
        </Link>
        {links?.length ? (
          <nav aria-label="Main">
            <ul className="flex flex-wrap gap-6 font-mono text-sm">
              {links.map((link) => (
                <li key={link._key}>
                  <SanityLink link={link} className="hover:text-accent transition-colors" />
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
