import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Demographics } from "./Demographics";

describe("Demographics", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <Demographics label="United States" value={52.6} formattedValue="52.6%" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("renders the label and the formatted share", () => {
    render(<Demographics label="United States" value={52.6} formattedValue="52.6%" />);
    expect(screen.getByText("United States")).toBeInTheDocument();
    expect(screen.getByText("52.6%")).toBeInTheDocument();
  });

  it("names the bar after the row so the value is not announced bare", () => {
    render(<Demographics label="United States" value={52.6} formattedValue="52.6%" />);
    const bar = screen.getByRole("progressbar", { name: "United States" });
    expect(bar).toHaveAttribute("aria-valuenow", "52.6");
  });

  it("renders a leading icon when given one", () => {
    render(
      <Demographics
        label="United States"
        value={52.6}
        formattedValue="52.6%"
        icon={<span data-testid="flag">US</span>}
      />,
    );
    expect(screen.getByTestId("flag")).toBeInTheDocument();
  });

  it("clamps an out-of-range share", () => {
    render(<Demographics label="Everywhere" value={140} formattedValue="140%" />);
    expect(screen.getByRole("progressbar", { name: "Everywhere" })).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
  });
});
