import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tag } from "./Tag";

describe("Tag", () => {
  it("renders its label in the mono font", () => {
    render(<Tag>Rules</Tag>);
    expect(screen.getByText("Rules").className).toContain("font-mono");
  });

  it("merges a custom className", () => {
    render(<Tag className="self-start">Rules</Tag>);
    expect(screen.getByText("Rules").className).toContain("self-start");
  });
});
