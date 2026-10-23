import { ButtonLink, ImagePlaceholder, Tag } from "@/components/ui";
import { storeHero } from "@/data/store";

export function StoreHero() {
  return (
    <section id="hero" aria-labelledby="hero-heading" className="grid scroll-mt-8 items-center gap-10 md:grid-cols-2">
      <div className="flex flex-col gap-6">
        <Tag className="self-start">{storeHero.eyebrow}</Tag>
        <h1 id="hero-heading" className="font-sans text-4xl font-bold tracking-tight text-heading sm:text-5xl">
          {storeHero.title}
        </h1>
        <p className="max-w-xl font-sans text-lg leading-8 text-body">{storeHero.description}</p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#products">Shop best sellers</ButtonLink>
          <ButtonLink href="#categories" variant="secondary">
            Browse categories
          </ButtonLink>
        </div>
      </div>
      <ImagePlaceholder label="New season collection" className="aspect-[4/3]" />
    </section>
  );
}
