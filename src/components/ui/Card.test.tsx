import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("renders the title as a heading and the description", () => {
    render(<Card title="Rules" description="Keep code on brand." />);
    expect(screen.getByRole("heading", { name: "Rules" })).toBeInTheDocument();
    expect(screen.getByText("Keep code on brand.")).toBeInTheDocument();
  });

  it("renders the tag only when passed", () => {
    const { rerender } = render(<Card title="Rules" description="Text" />);
    expect(screen.queryByText("Skills")).not.toBeInTheDocument();
    rerender(<Card title="Rules" description="Text" tag="Skills" />);
    expect(screen.getByText("Skills")).toBeInTheDocument();
  });

  it("renders footer content", () => {
    render(<Card title="Rules" description="Text" footer={<a href="/docs">Read more</a>} />);
    expect(screen.getByRole("link", { name: "Read more" })).toHaveAttribute("href", "/docs");
  });
});
