import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Breadcrumb } from "./Breadcrumb";

const items = [
  { label: "Home", href: "/" },
  { label: "Docs", href: "/docs" },
  { label: "Demo" },
];

describe("Breadcrumb", () => {
  it("renders a labelled navigation landmark", () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });

  it("links every item except the last", () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
    expect(screen.queryByRole("link", { name: "Demo" })).not.toBeInTheDocument();
  });

  it("marks the last item as the current page", () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText("Demo")).toHaveAttribute("aria-current", "page");
  });
});
