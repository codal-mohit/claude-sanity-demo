import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductCard } from "./ProductCard";

const product = { id: "tote", name: "Market Tote", category: "Bags", price: 38, badge: "Best seller" };

describe("ProductCard", () => {
  it("renders the name, image, category and price", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByRole("heading", { name: "Market Tote" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Market Tote" })).toBeInTheDocument();
    expect(screen.getByText("Bags")).toBeInTheDocument();
    expect(screen.getByText("$38.00")).toBeInTheDocument();
  });

  it("shows the badge only when set", () => {
    const { rerender } = render(<ProductCard product={product} />);
    expect(screen.getByText("Best seller")).toBeInTheDocument();
    rerender(<ProductCard product={{ ...product, badge: undefined }} />);
    expect(screen.queryByText("Best seller")).not.toBeInTheDocument();
  });
});
