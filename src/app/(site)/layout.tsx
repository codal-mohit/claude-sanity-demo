import { VisualEditing } from 'next-sanity/visual-editing';
import { draftMode } from 'next/headers';
import Link from 'next/link';

import { SiteFooter } from '@/features/site/SiteFooter';
import { SiteHeader } from '@/features/site/SiteHeader';
import { SanityLive, sanityFetch } from '@/sanity/live';
import { NAVIGATION_QUERY, SETTINGS_QUERY } from '@/sanity/queries';

const FALLBACK_TITLE = 'Sanity Claude Demo';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [{ data: settings }, { data: navigation }, { isEnabled: isDraftMode }] = await Promise.all([
    sanityFetch({ query: SETTINGS_QUERY }),
    sanityFetch({ query: NAVIGATION_QUERY }),
    draftMode(),
  ]);
  const title = settings?.title ?? FALLBACK_TITLE;

  return (
    <>
      <SiteHeader title={title} links={navigation?.header ?? null} />
      <main>{children}</main>
      <SiteFooter title={title} description={settings?.description} columns={navigation?.footerColumns ?? null} />
      <SanityLive />
      {isDraftMode ? (
        <>
          <Link
            href="/api/draft-mode/disable"
            prefetch={false}
            className="bg-secondary-900 fixed right-4 bottom-4 z-50 rounded-full px-4 py-2 font-mono text-xs text-white"
          >
            Exit preview
          </Link>
          <VisualEditing />
        </>
      ) : null}
    </>
  );
}
