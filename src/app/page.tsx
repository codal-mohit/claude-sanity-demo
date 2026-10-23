import { CategoryGrid, Newsletter, PerksStrip, ProductGrid, StoreHero } from "@/components/sections";

export default function Home() {
  return (
    <>
      <StoreHero />
      <PerksStrip />
      <CategoryGrid />
      <ProductGrid />
      <Newsletter />
    </>
  );
}
