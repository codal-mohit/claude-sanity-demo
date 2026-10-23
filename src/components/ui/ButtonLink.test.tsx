import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ButtonLink } from "./ButtonLink";

describe("ButtonLink", () => {
  it("renders a primary link by default", () => {
    render(<ButtonLink href="/docs">Read the docs</ButtonLink>);
    const link = screen.getByRole("link", { name: "Read the docs" });
    expect(link).toHaveAttribute("href", "/docs");
    expect(link.className).toContain("bg-accent");
  });

  it("applies the secondary variant", () => {
    render(
      <ButtonLink href="#steps" variant="secondary">
        How it works
      </ButtonLink>,
    );
    expect(screen.getByRole("link", { name: "How it works" }).className).toContain("border-accent");
  });
});
