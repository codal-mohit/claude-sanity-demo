import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ImagePlaceholder } from "./ImagePlaceholder";

describe("ImagePlaceholder", () => {
  it("is announced as an image with its label", () => {
    render(<ImagePlaceholder label="Linen Throw" />);
    expect(screen.getByRole("img", { name: "Linen Throw" })).toBeInTheDocument();
  });
});
