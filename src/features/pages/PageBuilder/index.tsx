import { Button } from '@/app/ui/Button';
import { ArticleCard } from '@/features/blog/ArticleCard';
import { PortableTextBody } from '@/features/content/PortableTextBody';
import { SanityImage } from '@/features/content/SanityImage';
import { SanityLink } from '@/features/content/SanityLink';
import type { PAGE_QUERYResult } from '@/sanity/types';
import { cn } from '@/utils';

type Blocks = NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>;
type Block = Blocks[number];
type BlockOf<T extends Block['_type']> = Extract<Block, { _type: T }>;

function Section({ heading, children, className }: { heading?: string | null; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn('mx-auto max-w-6xl px-4 py-12 sm:px-6', className)}>
      {heading ? (
        <h2 className="text-headline mb-8 flex items-center gap-3 text-2xl font-bold">
          <span aria-hidden="true" className="text-accent font-mono text-base">
            {'//'}
          </span>
          {heading}
        </h2>
      ) : null}
      {children}
    </section>
  );
}

function Hero({ block }: { block: BlockOf<'hero'> }) {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col gap-5">
        {block.eyebrow ? (
          <p className="border-border text-accent self-start rounded-full border px-3 py-1 font-mono text-xs">
            {block.eyebrow}
          </p>
        ) : null}
        <h1 className="text-headline text-4xl leading-tight font-extrabold tracking-tight sm:text-6xl">{block.heading}</h1>
        {block.text ? <p className="max-w-xl text-lg leading-8">{block.text}</p> : null}
        {block.links?.length ? (
          <div className="mt-2 flex flex-wrap gap-3">
            {block.links.map((link, index) => (
              <SanityLink
                key={link._key}
                link={link}
                className={cn(
                  'rounded-xl px-5 py-3 text-sm font-semibold transition-colors',
                  index === 0
                    ? 'bg-accent text-background hover:opacity-90'
                    : 'border-border text-headline hover:border-accent border',
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
      {block.image ? (
        <div className="border-border bg-surface relative rounded-3xl border p-2">
          <SanityImage image={block.image} width={960} height={720} priority sizes="(min-width: 1024px) 45vw, 100vw" className="rounded-2xl" />
        </div>
      ) : null}
    </section>
  );
}

function ArticleGrid({ block }: { block: BlockOf<'storyGrid'> }) {
  const posts = (block.posts ?? []).slice(0, block.mode === 'manual' ? undefined : (block.limit ?? 6));
  if (!posts.length) return null;
  return (
    <Section heading={block.heading}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <ArticleCard key={post._id} article={post} />
        ))}
      </div>
    </Section>
  );
}

const ctaTone = {
  light: 'bg-surface border-border border',
  dark: 'bg-secondary-900 border-border border',
  accent: 'bg-primary text-white',
};

function Cta({ block }: { block: BlockOf<'cta'> }) {
  return (
    <Section>
      <div className={cn('flex flex-col items-start gap-4 rounded-3xl p-10 sm:p-12', ctaTone[block.tone ?? 'accent'])}>
        <h2 className="text-3xl font-bold text-inherit">{block.heading}</h2>
        {block.text ? <p className="max-w-xl">{block.text}</p> : null}
        <SanityLink link={block.link} className="text-secondary-900 rounded-xl bg-white px-5 py-3 text-sm font-semibold" />
      </div>
    </Section>
  );
}

function Faq({ block }: { block: BlockOf<'faqBlock'> }) {
  if (!block.items?.length) return null;
  return (
    <Section heading={block.heading}>
      <div className="divide-border border-border bg-surface divide-y rounded-2xl border">
        {block.items.map((item) => (
          <details key={item._id} className="group px-5 py-4">
            <summary className="text-headline flex cursor-pointer list-none items-center justify-between font-semibold">
              {item.question}
              <span aria-hidden="true" className="text-accent font-mono transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <PortableTextBody value={item.answer} />
          </details>
        ))}
      </div>
    </Section>
  );
}

function Gallery({ block }: { block: BlockOf<'gallery'> }) {
  if (!block.images?.length) return null;
  return (
    <Section heading={block.heading}>
      <div
        className={cn(
          block.layout === 'carousel'
            ? 'flex snap-x gap-4 overflow-x-auto *:w-80 *:shrink-0 *:snap-start'
            : block.layout === 'masonry'
              ? 'columns-2 gap-4 lg:columns-3 *:mb-4'
              : 'grid grid-cols-2 gap-4 lg:grid-cols-3',
        )}
      >
        {block.images.map((image) => (
          <SanityImage
            key={image._key}
            image={image}
            width={640}
            height={block.layout === 'masonry' ? undefined : 480}
            sizes="(min-width: 1024px) 33vw, 50vw"
            className="border-border rounded-2xl border"
          />
        ))}
      </div>
    </Section>
  );
}

function FormBlock({ block }: { block: BlockOf<'formBlock'> }) {
  const inputClass = 'border-border bg-background text-headline w-full rounded-xl border p-3 font-mono text-sm';
  return (
    <Section heading={block.heading}>
      {/* Submission handling lands with the forms backend; the form renders but does not post yet. */}
      <form className="border-border bg-surface flex max-w-xl flex-col gap-4 rounded-2xl border p-6" aria-label={block.heading ?? 'Form'}>
        <label className="flex flex-col gap-2 text-sm">
          Email
          <input type="email" name="email" required placeholder="you@example.dev" className={inputClass} />
        </label>
        {block.kind === 'contact'
          ? block.fields?.map((field) => (
              <label key={field._key} className="flex flex-col gap-2 text-sm">
                {field.label}
                {field.inputType === 'textarea' ? (
                  <textarea name={field.label} required={field.required} rows={4} className={inputClass} />
                ) : (
                  <input type={field.inputType ?? 'text'} name={field.label} required={field.required} className={inputClass} />
                )}
              </label>
            ))
          : null}
        <Button type="submit" className="self-start">
          {block.submitLabel ?? 'Submit'}
        </Button>
      </form>
    </Section>
  );
}

export function PageBuilder({ blocks }: { blocks: Blocks | null | undefined }) {
  if (!blocks?.length) return null;
  return (
    <>
      {blocks.map((block) => {
        switch (block._type) {
          case 'hero':
            return <Hero key={block._key} block={block} />;
          case 'storyGrid':
            return <ArticleGrid key={block._key} block={block} />;
          case 'cta':
            return <Cta key={block._key} block={block} />;
          case 'faqBlock':
            return <Faq key={block._key} block={block} />;
          case 'gallery':
            return <Gallery key={block._key} block={block} />;
          case 'formBlock':
            return <FormBlock key={block._key} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
