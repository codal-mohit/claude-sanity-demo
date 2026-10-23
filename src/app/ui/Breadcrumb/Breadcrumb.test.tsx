import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Breadcrumbs } from "@/app/ui/Breadcrumb";

describe("Breadcrumbs", () => {
  it("renders links and marks the last item as current", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Journal", href: "/journal" },
          { label: "Story" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByText("Story").closest("[aria-current]")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("collapses middle items behind a button", () => {
    render(
      <Breadcrumbs
        maxItems={3}
        items={[
          { label: "A", href: "/a" },
          { label: "B", href: "/b" },
          { label: "C", href: "/c" },
          { label: "D" },
        ]}
      />,
    );
    expect(screen.queryByText("B")).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Show collapsed breadcrumbs"));
    expect(screen.getByText("B")).toBeInTheDocument();
  });
});
