import { describe, expect, it } from "vitest";
import { formatPrice } from "./format";

describe("formatPrice", () => {
  it("formats whole and fractional amounts as USD", () => {
    expect(formatPrice(48)).toBe("$48.00");
    expect(formatPrice(19.5)).toBe("$19.50");
  });

  it("adds thousands separators", () => {
    expect(formatPrice(1250)).toBe("$1,250.00");
  });
});
