export type NavLink = {
  label: string;
  href: string;
};

export const siteName = "Demo Store";

export const navLinks: NavLink[] = [
  { label: "Shop", href: "/#products" },
  { label: "Categories", href: "/#categories" },
  { label: "Docs", href: "/docs" },
];

export const siteTagline = "Everyday goods for home, kitchen and travel, made to last.";

export type FooterColumn = {
  title: string;
  links: NavLink[];
};

export const footerColumns: FooterColumn[] = [
  {
    title: "Shop",
    links: [
      { label: "Best sellers", href: "/#products" },
      { label: "Categories", href: "/#categories" },
      { label: "New season", href: "/#hero" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Shipping and returns", href: "/#perks" },
      { label: "Contact us", href: "mailto:hello@example.com" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "How this demo was built", href: "/docs" },
      { label: "Sample task", href: "/docs#sample" },
    ],
  },
];

