import Link from 'next/link';

import { SanityLink } from '@/features/content/SanityLink';
import { LanguageSwitcher } from '@/features/site/LanguageSwitcher';
import { localizePath, type Lang } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import type { NAVIGATION_QUERYResult } from '@/sanity/types';

type SiteHeaderProps = {
  title: string;
  lang: Lang;
  links: NonNullable<NAVIGATION_QUERYResult>['header'];
};

export function SiteHeader({ title, lang, links }: SiteHeaderProps) {
  return (
    <header className="border-border bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href={localizePath('/', lang)} className="text-headline flex items-center gap-2 font-bold">
          <span aria-hidden="true" className="text-accent font-mono">
            &gt;_
          </span>
          {title}
        </Link>
        <div className="flex flex-wrap items-center gap-6">
          {links?.length ? (
            <nav aria-label="Main">
              <ul className="flex flex-wrap gap-6 font-mono text-sm">
                {links.map((link) => (
                  <li key={link._key}>
                    <SanityLink link={link} lang={lang} className="hover:text-accent transition-colors" />
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          <Link
            href={localizePath('/search', lang)}
            className="hover:text-accent font-mono text-sm transition-colors"
          >
            {getDictionary(lang).search}
          </Link>
          <LanguageSwitcher label={getDictionary(lang).language} />
        </div>
      </div>
    </header>
  );
}
