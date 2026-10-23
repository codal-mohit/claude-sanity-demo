import { ProductCard } from "@/components/ui";
import { products } from "@/data/store";
import { SectionHeading } from "./SectionHeading";

export function ProductGrid() {
  return (
    <section id="products" aria-labelledby="products-heading" className="flex scroll-mt-8 flex-col gap-6">
      <SectionHeading id="products-heading" title="Best sellers" description="Our most loved pieces this month." />
      <ul className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
