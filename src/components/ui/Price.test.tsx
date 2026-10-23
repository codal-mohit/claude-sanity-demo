import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Price } from "./Price";

describe("Price", () => {
  it("renders the formatted amount", () => {
    render(<Price amount={48} />);
    expect(screen.getByText("$48.00")).toBeInTheDocument();
    expect(screen.queryByText("Original price")).not.toBeInTheDocument();
  });

  it("strikes through the original price when on sale", () => {
    render(<Price amount={32} compareAt={40} />);
    expect(screen.getByText("Sale price", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("$40.00").closest("s")).toBeInTheDocument();
  });

  it("ignores a compareAt that is not higher", () => {
    render(<Price amount={40} compareAt={40} />);
    expect(screen.queryByText("Original price", { exact: false })).not.toBeInTheDocument();
  });
});
