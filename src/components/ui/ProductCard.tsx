import type { Product } from "@/data/store";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { Price } from "./Price";
import { Tag } from "./Tag";

export type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="flex flex-col gap-3">
      <div className="relative">
        <ImagePlaceholder label={product.name} />
        {product.badge && <Tag className="absolute left-3 top-3 bg-surface">{product.badge}</Tag>}
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-wide text-body">{product.category}</p>
        <h3 className="font-sans text-base font-semibold text-heading">{product.name}</h3>
        <Price amount={product.price} compareAt={product.compareAt} />
      </div>
    </article>
  );
}
