import { render } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ChartMetricTrend } from "./ChartMetricTrend";

/*
 * Scope note: recharts needs a measured container to draw, and jsdom reports zero
 * size, so nothing inside `<AreaChart>` is rendered here — no path, no `<defs>`, no
 * gradient. Asserting on any of that would either fail or, worse, pass vacuously
 * against an empty NodeList. So these cover the wrapper contract only, which is
 * what the DS PR template asks for; the drawn series, its gradient and the
 * per-instance gradient ids are covered by ChartMetricTrend.stories.tsx, which
 * runs in a real browser.
 */
describe("ChartMetricTrend", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<ChartMetricTrend value={69} color="red" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ChartMetricTrend ref={ref} value={69} color="red" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("chains className onto its own classes", () => {
    const { container } = render(<ChartMetricTrend value={69} color="teal" className="mt-2" />);
    const root = container.querySelector("[data-slot='chart']");
    expect(root).toHaveClass("mt-2");
    // Its own height must survive the merge — this is the design's slot height.
    expect(root).toHaveClass("h-[106px]");
  });

  it("spreads additional HTML attributes", () => {
    const { container } = render(<ChartMetricTrend value={69} color="red" data-testid="trend" />);
    expect(container.querySelector("[data-testid='trend']")).not.toBeNull();
  });

  it("renders at the design's 106px slot height", () => {
    const { container } = render(<ChartMetricTrend value={69} color="red" />);
    expect(container.querySelector("[data-slot='chart']")).toHaveClass("h-[106px]");
  });

  it("renders with no series, where the endpoint returns a bare scalar", () => {
    const { container } = render(<ChartMetricTrend value={42} color="teal" />);
    expect(container.querySelector("[data-slot='chart']")).not.toBeNull();
  });

  it("renders with a multi-point series", () => {
    const { container } = render(
      <ChartMetricTrend value={42} color="teal" series={[10, 20, 15, 30]} />,
    );
    expect(container.querySelector("[data-slot='chart']")).not.toBeNull();
  });
});
