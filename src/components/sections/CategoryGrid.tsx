import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui";
import { categories } from "@/data/store";
import { SectionHeading } from "./SectionHeading";

export function CategoryGrid() {
  return (
    <section id="categories" aria-labelledby="categories-heading" className="flex scroll-mt-8 flex-col gap-6">
      <SectionHeading id="categories-heading" title="Shop by category" />
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <li key={category.name}>
            <Link
              href="#products"
              className="group flex flex-col gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <ImagePlaceholder label={category.name} />
              <span className="font-sans text-sm font-semibold text-heading group-hover:text-accent">
                {category.name}
              </span>
              <span className="font-mono text-xs text-body">{category.count} items</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
