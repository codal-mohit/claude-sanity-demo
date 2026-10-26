'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LANGUAGES, localizePath, splitLocale } from '@/i18n/config';
import { cn } from '@/utils';

// Keeps the current path and swaps the locale. Translations share slugs, and the
// detail queries fall back to English when a translation is missing.
export function LanguageSwitcher({ label }: { label: string }) {
  const pathname = usePathname() ?? '/';
  const { lang: current, path } = splitLocale(pathname);

  return (
    <nav aria-label={label}>
      <ul className="border-border flex rounded-lg border p-0.5 font-mono text-xs">
        {LANGUAGES.map(({ id, title }) => (
          <li key={id}>
            <Link
              href={localizePath(path, id)}
              hrefLang={id}
              lang={id}
              title={title}
              aria-current={id === current ? 'true' : undefined}
              className={cn(
                'block rounded-md px-2 py-1 uppercase transition-colors',
                id === current ? 'bg-accent text-background' : 'hover:text-accent',
              )}
            >
              {id}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
