export type Perk = {
  title: string;
  description: string;
};

export type Category = {
  name: string;
  count: number;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAt?: number;
  badge?: string;
};

export const storeHero = {
  eyebrow: "New season",
  title: "Everyday goods, made to last",
  description: "Thoughtfully designed pieces for home, kitchen and travel. Free shipping on orders over $50.",
};

export const perks: Perk[] = [
  { title: "Free shipping", description: "On orders over $50" },
  { title: "30-day returns", description: "No questions asked" },
  { title: "Secure checkout", description: "Encrypted payments" },
  { title: "Real support", description: "Reply within a day" },
];

export const categories: Category[] = [
  { name: "Home", count: 42 },
  { name: "Kitchen", count: 36 },
  { name: "Lighting", count: 18 },
  { name: "Bags", count: 24 },
  { name: "Outdoor", count: 15 },
  { name: "Gifts", count: 30 },
];

export const products: Product[] = [
  { id: "linen-throw", name: "Linen Throw", category: "Home", price: 68, badge: "New" },
  { id: "stoneware-mug", name: "Stoneware Mug Set", category: "Kitchen", price: 32, compareAt: 40, badge: "Sale" },
  { id: "desk-lamp", name: "Arc Desk Lamp", category: "Lighting", price: 89 },
  { id: "weekender", name: "Canvas Weekender", category: "Bags", price: 120 },
  { id: "pour-over", name: "Pour-Over Kit", category: "Kitchen", price: 45 },
  { id: "camp-blanket", name: "Camp Blanket", category: "Outdoor", price: 54, compareAt: 72, badge: "Sale" },
  { id: "candle", name: "Cedar Candle", category: "Gifts", price: 24 },
  { id: "tote", name: "Market Tote", category: "Bags", price: 38, badge: "Best seller" },
];
