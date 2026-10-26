import type { Metadata } from 'next';
import Link from 'next/link';

import { buttonVariants } from '@/app/ui/Button';
import { Card, CardContent, CardDescription, CardTitle } from '@/app/ui/Card';
import { PageBuilder } from '@/features/pages/PageBuilder';
import { sanityFetch } from '@/sanity/live';
import { PAGE_QUERY } from '@/sanity/queries';

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({ query: PAGE_QUERY, params: { slug: 'home' }, stega: false });
  return {
    title: page?.seo?.title ?? page?.title ?? undefined,
    description: page?.seo?.description ?? undefined,
  };
}

export default async function Home() {
  const { data: page } = await sanityFetch({ query: PAGE_QUERY, params: { slug: 'home' } });

  if (page?.blocks?.length) return <PageBuilder blocks={page.blocks} />;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-24">
      <h1 className="text-secondary-900 text-3xl font-semibold dark:text-white">Sanity Claude Demo</h1>
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
