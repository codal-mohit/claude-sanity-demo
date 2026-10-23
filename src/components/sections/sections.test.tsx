import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { features, steps } from "@/data/docs";
import { footerColumns } from "@/data/site";
import { categories, perks, products } from "@/data/store";
import {
  CategoryGrid,
  FeatureGrid,
  Newsletter,
  PerksStrip,
  ProductGrid,
  SampleTask,
  SiteFooter,
  SiteHeader,
  StepList,
  StoreHero,
} from "./index";

describe("SiteHeader", () => {
  it("links home from the store name and to each nav target", () => {
    render(<SiteHeader />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).getByRole("link", { name: "Demo Store" })).toHaveAttribute("href", "/");
    expect(within(nav).getByRole("link", { name: "Shop" })).toHaveAttribute("href", "/#products");
    expect(within(nav).getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
  });
});

describe("SiteFooter", () => {
  it("renders a labelled nav for each link column", () => {
    render(<SiteFooter />);
    for (const column of footerColumns) {
      const nav = screen.getByRole("navigation", { name: column.title });
      expect(within(nav).getAllByRole("link")).toHaveLength(column.links.length);
    }
  });

  it("shows the copyright line with the current year", () => {
    render(<SiteFooter />);
    expect(screen.getByText(`© ${new Date().getFullYear()}`, { exact: false })).toBeInTheDocument();
  });
});

describe("StoreHero", () => {
  it("renders the page heading and both CTAs", () => {
    render(<StoreHero />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop best sellers" })).toHaveAttribute("href", "#products");
    expect(screen.getByRole("link", { name: "Browse categories" })).toHaveAttribute("href", "#categories");
  });
});

describe("PerksStrip", () => {
  it("lists every perk", () => {
    render(<PerksStrip />);
    expect(screen.getAllByRole("listitem")).toHaveLength(perks.length);
  });
});

describe("CategoryGrid", () => {
  it("links each category", () => {
    render(<CategoryGrid />);
    expect(screen.getAllByRole("link")).toHaveLength(categories.length);
  });
});

describe("ProductGrid", () => {
  it("renders a card for each product", () => {
    render(<ProductGrid />);
    expect(screen.getAllByRole("article")).toHaveLength(products.length);
  });
});

describe("Newsletter", () => {
  it("confirms the signup after a valid submit", () => {
    render(<Newsletter />);
    fireEvent.change(screen.getByRole("textbox", { name: "Email address" }), {
      target: { value: "sam@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(screen.getByRole("status")).toHaveTextContent("You're on the list");
  });
});

describe("StepList", () => {
  it("renders the steps in order", () => {
    render(<StepList />);
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(steps.length);
    expect(within(items[0]).getByRole("heading", { name: steps[0].title })).toBeInTheDocument();
  });
});

describe("FeatureGrid", () => {
  it("renders a card with its item list for each configured feature", () => {
    render(<FeatureGrid />);
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(features.length);
    expect(within(cards[0]).getAllByRole("listitem")).toHaveLength(features[0].items.length);
  });
});

describe("SampleTask", () => {
  it("renders both alert tones", () => {
    render(<SampleTask />);
    expect(screen.getAllByRole("status")).toHaveLength(2);
  });
});
