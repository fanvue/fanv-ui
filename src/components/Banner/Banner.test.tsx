import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "../Button/Button";
import { Banner } from "./Banner";

describe("Banner", () => {
  it("renders region with title as label", () => {
    render(<Banner tone="inverse" title="Promo title" description="Body" />);
    const region = screen.getByRole("region", { name: "Promo title" });
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute("data-testid", "banner");
  });

  it("applies className", () => {
    render(<Banner tone="inverse" title="T" className="extra" />);
    expect(screen.getByTestId("banner")).toHaveClass("extra");
  });

  it("fires onDismiss for inverse tone", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Banner tone="inverse" title="T" onDismiss={onDismiss} />);
    await user.click(screen.getByRole("button", { name: "Dismiss banner" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("does not render dismiss for subtle when onDismiss passed", () => {
    render(<Banner tone="subtle" title="T" onDismiss={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "Dismiss banner" })).not.toBeInTheDocument();
  });

  it("has no serious axe violations (inverse)", async () => {
    const { container } = render(
      <Banner
        tone="inverse"
        layout="horizontal"
        title="Heading"
        description="Copy"
        primaryAction={<Button variant="brand">Go</Button>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no serious axe violations (subtle)", async () => {
    const { container } = render(
      <Banner
        tone="subtle"
        title="Heading"
        description="Copy"
        primaryAction={<Button variant="secondary">More</Button>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
