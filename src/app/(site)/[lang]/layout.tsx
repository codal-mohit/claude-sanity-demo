import { VisualEditing } from 'next-sanity/visual-editing';
import { draftMode } from 'next/headers';
import Link from 'next/link';

import { SiteFooter } from '@/features/site/SiteFooter';
import { SiteHeader } from '@/features/site/SiteHeader';
import { LANG_IDS } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { assertLang } from '@/i18n/server';
import { SanityLive, sanityFetch } from '@/sanity/live';
import { NAVIGATION_QUERY, SETTINGS_QUERY } from '@/sanity/queries';

const FALLBACK_TITLE = 'Sanity Claude Demo';

export function generateStaticParams() {
  return LANG_IDS.map((lang) => ({ lang }));
}

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

export default async function SiteLayout({ children, params }: Props) {
  const lang = assertLang((await params).lang);
  const [{ data: settings }, { data: navigation }, { isEnabled: isDraftMode }] = await Promise.all([
    sanityFetch({ query: SETTINGS_QUERY }),
    sanityFetch({ query: NAVIGATION_QUERY }),
    draftMode(),
  ]);
  const title = settings?.title ?? FALLBACK_TITLE;

  return (
    // The root layout owns <html>, so the page language is set on this wrapper.
    <div lang={lang}>
      <a
        href="#content"
        className="bg-accent text-background sr-only z-50 rounded-lg px-4 py-2 font-mono text-sm focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        {getDictionary(lang).skipToContent}
      </a>
      <SiteHeader title={title} lang={lang} links={navigation?.header ?? null} />
      <main id="content">{children}</main>
      <SiteFooter
        title={title}
        lang={lang}
        description={settings?.description}
        columns={navigation?.footerColumns ?? null}
      />
      <SanityLive />
      {isDraftMode ? (
        <>
          <Link
            href="/api/draft-mode/disable"
            prefetch={false}
            className="bg-secondary-900 fixed right-4 bottom-4 z-50 rounded-full px-4 py-2 font-mono text-xs text-white"
          >
            {getDictionary(lang).exitPreview}
          </Link>
          <VisualEditing />
        </>
      ) : null}
    </div>
  );
}
