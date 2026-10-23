import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins class names with a single space", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("returns an empty string when called with no arguments", () => {
    expect(cn()).toBe("");
  });

  it("skips false, null and undefined", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("skips empty strings", () => {
    expect(cn("a", "", "b")).toBe("a b");
  });

  it("returns an empty string when every value is falsy", () => {
    expect(cn(false, null, undefined, "")).toBe("");
  });

  it("supports conditional classes via boolean expressions", () => {
    const active = true;
    const disabled = false;
    expect(cn("base", active && "on", disabled && "off")).toBe("base on");
  });

  it("does not dedupe or merge conflicting classes", () => {
    expect(cn("p-2", "p-4", "p-2")).toBe("p-2 p-4 p-2");
  });
});
