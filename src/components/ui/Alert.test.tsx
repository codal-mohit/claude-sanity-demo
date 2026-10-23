import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders the title in a status region with the info tone by default", () => {
    render(<Alert title="Saved" />);
    const alert = screen.getByRole("status");
    expect(alert).toHaveTextContent("Saved");
    expect(alert.className).toContain("border-border");
  });

  it("applies the emphasis tone", () => {
    render(<Alert title="Heads up" tone="emphasis" />);
    expect(screen.getByRole("status").className).toContain("border-accent");
  });

  it("renders body content when children are passed", () => {
    render(<Alert title="Update">Your profile was updated.</Alert>);
    expect(screen.getByText("Your profile was updated.")).toBeInTheDocument();
  });
});
