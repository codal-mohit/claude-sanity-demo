import { SanityLink } from '@/features/content/SanityLink';
import type { NAVIGATION_QUERYResult } from '@/sanity/types';

type SiteFooterProps = {
  title: string;
  description?: string | null;
  columns: NonNullable<NAVIGATION_QUERYResult>['footerColumns'];
};

export function SiteFooter({ title, description, columns }: SiteFooterProps) {
  return (
    <footer className="border-border mt-24 border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="text-headline font-bold">
            <span aria-hidden="true" className="text-accent font-mono">
              &gt;_{' '}
            </span>
            {title}
          </p>
          {description ? <p className="mt-2 max-w-sm text-sm leading-6">{description}</p> : null}
        </div>
        {columns?.map((column) => (
          <div key={column._key}>
            <p className="text-headline font-mono text-xs uppercase tracking-wider">{column.title}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {column.links?.map((link) => (
                <li key={link._key}>
                  <SanityLink link={link} className="hover:text-accent transition-colors" />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-8 font-mono text-xs sm:px-6">
        © {new Date().getFullYear()} {title}. Built with Next.js, Sanity and Claude Code.
      </p>
    </footer>
  );
}
