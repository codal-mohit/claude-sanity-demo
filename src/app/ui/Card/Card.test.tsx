import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card, CardContent, CardDescription, CardTitle } from "@/app/ui/Card";

describe("Card", () => {
  it("renders title, description and content", () => {
    render(
      <Card>
        <CardTitle>Summary</CardTitle>
        <CardDescription>Short text</CardDescription>
        <CardContent>Body</CardContent>
      </Card>,
    );
    expect(screen.getByRole("heading", { name: "Summary" })).toBeInTheDocument();
    expect(screen.getByText("Short text")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("merges a custom className", () => {
    render(<Card data-testid="card" className="extra" />);
    expect(screen.getByTestId("card")).toHaveClass("extra");
  });
});
