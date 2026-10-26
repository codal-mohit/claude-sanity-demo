import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/app/ui/Breadcrumb';
import { ArticleCard, ArticleMeta, TagList } from '@/features/blog/ArticleCard';
import { SeriesNav } from '@/features/blog/SeriesNav';
import { PortableTextBody } from '@/features/content/PortableTextBody';
import { SanityImage } from '@/features/content/SanityImage';
import { client } from '@/sanity/client';
import { sanityFetch } from '@/sanity/live';
import { POST_QUERY, POST_SLUGS_QUERY } from '@/sanity/queries';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await client.fetch(POST_SLUGS_QUERY, {}, { perspective: 'published', stega: false });
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: post } = await sanityFetch({ query: POST_QUERY, params, stega: false });
  return {
    title: post?.seo?.title ?? post?.title ?? undefined,
    description: post?.seo?.description ?? post?.excerpt ?? undefined,
    robots: post?.seo?.noIndex ? { index: false } : undefined,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { data: post } = await sanityFetch({ query: POST_QUERY, params });
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        className="font-mono"
        items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.title }]}
      />
      <header className="mt-8 max-w-3xl">
        {post.categories?.length ? (
          <p className="text-accent font-mono text-xs uppercase tracking-wider">
            {post.categories.map((category) => category.title).join(' / ')}
          </p>
        ) : null}
        <h1 className="text-headline mt-3 text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">{post.title}</h1>
        {post.excerpt ? <p className="mt-4 text-lg leading-8">{post.excerpt}</p> : null}
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          {post.author ? (
            <div className="flex items-center gap-3">
              <div className="border-border size-10 overflow-hidden rounded-full border">
                <SanityImage image={post.author.avatar} width={80} height={80} />
              </div>
              <div>
                <p className="text-headline text-sm font-semibold">{post.author.name}</p>
                {post.author.role ? <p className="font-mono text-xs">{post.author.role}</p> : null}
              </div>
            </div>
          ) : null}
          <ArticleMeta article={post} />
        </div>
      </header>

      <div className="border-border bg-surface mt-10 overflow-hidden rounded-3xl border p-2">
        <SanityImage
          image={post.coverImage}
          width={1440}
          height={680}
          priority
          sizes="(min-width: 1152px) 1152px, 100vw"
          className="rounded-2xl"
        />
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="max-w-3xl">
          <PortableTextBody value={post.body} />
          <div className="border-border mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
            <TagList tags={post.tags} />
            {post.repoUrl ? (
              <a
                href={post.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent font-mono text-sm underline underline-offset-4"
              >
                View the example repo
              </a>
            ) : null}
          </div>
        </div>
        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <SeriesNav series={post.series} currentId={post._id} />
        </aside>
      </div>

      {post.related?.length ? (
        <section className="mt-20">
          <h2 className="text-headline mb-6 flex items-center gap-3 text-2xl font-bold">
            <span aria-hidden="true" className="text-accent font-mono text-base">
              {'//'}
            </span>
            Related articles
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {post.related.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
