import type { Metadata } from 'next';
import Link from 'next/link';

import { ArticleCard } from '@/features/blog/ArticleCard';
import { sanityFetch } from '@/sanity/live';
import { CATEGORIES_QUERY, POSTS_QUERY, TAGS_QUERY } from '@/sanity/queries';
import { cn } from '@/utils';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Articles on Next.js, Sanity, GROQ and working with Claude Code.',
};

type Props = { searchParams: Promise<{ category?: string; tag?: string }> };

const chip = (active: boolean) =>
  cn(
    'rounded-lg border px-3 py-1 font-mono text-xs transition-colors',
    active ? 'border-accent bg-accent text-background' : 'border-border hover:border-accent',
  );

export default async function BlogPage({ searchParams }: Props) {
  const { category, tag } = await searchParams;
  const [{ data: posts }, { data: categories }, { data: tags }] = await Promise.all([
    sanityFetch({ query: POSTS_QUERY, params: { category: category ?? null, topic: tag ?? null } }),
    sanityFetch({ query: CATEGORIES_QUERY }),
    sanityFetch({ query: TAGS_QUERY }),
  ]);
  const sortedTags = (tags ?? []).filter((t): t is string => Boolean(t)).sort();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-accent font-mono text-sm">~/blog</p>
      <h1 className="text-headline mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
        {tag ? `#${tag}` : 'All articles'}
      </h1>

      <div className="mt-8 flex flex-col gap-4">
        {categories.length ? (
          <nav aria-label="Categories" className="flex flex-wrap gap-2">
            <Link href="/blog" className={chip(!category && !tag)}>
              all
            </Link>
            {categories.map((item) => (
              <Link key={item._id} href={`/blog?category=${item.slug}`} className={chip(category === item.slug)}>
                {item.title?.toLowerCase()}
              </Link>
            ))}
          </nav>
        ) : null}
        {sortedTags.length ? (
          <nav aria-label="Tags" className="flex flex-wrap gap-2">
            {sortedTags.map((item) => (
              <Link key={item} href={`/blog?tag=${item}`} className={chip(tag === item)}>
                #{item}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>

      {posts.length ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post._id} article={post} />
          ))}
        </div>
      ) : (
        <p className="mt-12 font-mono">No articles match this filter.</p>
      )}
    </div>
  );
}
