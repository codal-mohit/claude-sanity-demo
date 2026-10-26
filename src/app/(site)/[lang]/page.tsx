import type { Metadata } from 'next';
import Link from 'next/link';

import { buttonVariants } from '@/app/ui/Button';
import { Card, CardContent, CardDescription, CardTitle } from '@/app/ui/Card';
import { PageBuilder } from '@/features/pages/PageBuilder';
import { buildAlternates } from '@/i18n/alternates';
import { assertLang } from '@/i18n/server';
import { sanityFetch } from '@/sanity/live';
import { PAGE_QUERY } from '@/sanity/queries';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = assertLang((await params).lang);
  const { data: page } = await sanityFetch({ query: PAGE_QUERY, params: { slug: 'home', lang }, stega: false });
  return {
    title: page?.seo?.title ?? undefined,
    description: page?.seo?.description ?? undefined,
    alternates: buildAlternates('page', page?.translations, { lang, slug: 'home' }),
  };
}

export default async function Home({ params }: Props) {
  const lang = assertLang((await params).lang);
  const { data: page } = await sanityFetch({ query: PAGE_QUERY, params: { slug: 'home', lang } });

  if (page?.blocks?.length) return <PageBuilder blocks={page.blocks} lang={lang} />;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-24">
      <h1 className="text-headline text-3xl font-semibold">Sanity Claude Demo</h1>
      <Card>
        <CardTitle>Coming soon</CardTitle>
        <CardDescription>
          Create a page with the slug &quot;home&quot; in the Studio to replace this placeholder.
        </CardDescription>
        <CardContent>
          <Link href="/studio" className={buttonVariants()}>
            Open Studio
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
