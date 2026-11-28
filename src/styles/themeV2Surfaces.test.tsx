import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChartCard } from "../components/Chart/ChartCard";
import { ChartLoadingOverlay } from "../components/Chart/ChartLoadingOverlay";
import { Slider } from "../components/Slider/Slider";
import { Snackbar } from "../components/Snackbar/Snackbar";
import { Switch } from "../components/Switch/Switch";

// Under theme-v2 the page colour is a step darker than cards in light mode, so a
// component painted with the page colour turns grey. Each of these keeps the page
// colour in the current palette and takes its own surface under theme-v2.
const withClass = (container: HTMLElement, className: string) =>
  container.querySelector(`[class~="${className.replace(":", "\\:")}"]`);

describe("theme-v2 surfaces", () => {
  it("puts ChartCard on the card surface", () => {
    const { container } = render(<ChartCard title="Revenue" />);
    const card = withClass(container, "theme-v2:bg-surface-primary");
    expect(card).toHaveClass("bg-background-primary", "theme-v2:bg-surface-primary");
  });

  it("puts the chart loading skeleton on the card surface", () => {
    const { container } = render(
      <ChartLoadingOverlay loading variant="area">
        <div>chart</div>
      </ChartLoadingOverlay>,
    );
    expect(screen.getByText("chart")).toBeInTheDocument();
    expect(withClass(container, "theme-v2:bg-surface-primary")).toHaveClass(
      "bg-background-primary",
    );
  });

  it("puts the welcome Snackbar on the card surface", () => {
    const { container } = render(
      <Snackbar variant="welcome" title="Welcome!" description="Get started" />,
    );
    const toast = withClass(container, "theme-v2:bg-surface-primary");
    expect(toast).toHaveClass("bg-background-primary");
    expect(toast).toContainElement(screen.getByText("Welcome!"));
  });

  it("keeps the Switch thumb on the card surface", () => {
    const { container } = render(<Switch aria-label="Toggle" />);
    expect(screen.getByRole("switch", { name: "Toggle" })).toBeInTheDocument();
    expect(withClass(container, "theme-v2:bg-surface-primary")).toHaveClass("rounded-full");
  });

  it("keeps the Slider thumb on the card surface", () => {
    const { container } = render(<Slider defaultValue={[50]} />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
    expect(withClass(container, "theme-v2:bg-surface-primary")).toHaveClass("rounded-full");
  });
});
