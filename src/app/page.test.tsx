import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home", () => {
  it("renders the default Next.js page", () => {
    render(<Home />);
    expect(screen.getByAltText("Next.js logo")).toBeInTheDocument();
  });
});
