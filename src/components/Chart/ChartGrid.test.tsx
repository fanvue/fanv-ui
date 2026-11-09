import { render } from "@testing-library/react";
import { Line, LineChart, YAxis } from "recharts";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ChartGrid } from "./ChartGrid";

const POSITIVE = [120, 145, 130, 160];
const MIXED = [40, -12, 25, 60];
const ALL_NEGATIVE = [-120, -145, -130, -160];

function renderChart(values: number[]) {
  return render(
    <LineChart width={400} height={200} data={values.map((value, i) => ({ i, value }))}>
      <ChartGrid />
      <YAxis />
      <Line dataKey="value" isAnimationActive={false} />
    </LineChart>,
  );
}

function yTicks(container: HTMLElement) {
  return [...container.querySelectorAll(".recharts-cartesian-axis-tick-value")].map((tick) =>
    Number(tick.textContent),
  );
}

function zeroLine(container: HTMLElement) {
  return container.querySelector(".recharts-reference-line line");
}

describe("ChartGrid", () => {
  describe("grid", () => {
    it("draws dotted horizontal lines in the ChartContainer grid colour, and no vertical lines", () => {
      const { container } = renderChart(POSITIVE);
      const lines = container.querySelectorAll(".recharts-cartesian-grid-horizontal line");
      expect(lines.length).toBeGreaterThan(1);
      for (const line of lines) {
        expect(line).toHaveAttribute("stroke", "var(--color-neutral-alphas-200)");
        expect(line).toHaveAttribute("stroke-dasharray", "2 4");
      }
      expect(container.querySelector(".recharts-cartesian-grid-vertical")).toBeNull();
    });

    it("lets the consumer override the grid's defaults", () => {
      const { container } = render(
        <LineChart width={400} height={200} data={POSITIVE.map((value, i) => ({ i, value }))}>
          <ChartGrid vertical />
          <YAxis />
          <Line dataKey="value" isAnimationActive={false} />
        </LineChart>,
      );
      expect(container.querySelector(".recharts-cartesian-grid-vertical")).not.toBeNull();
    });
  });

  describe("zero baseline", () => {
    it("draws one solid baseline in border-strong at value 0", () => {
      const { container } = renderChart(MIXED);
      const lines = container.querySelectorAll(".recharts-reference-line line");
      expect(lines).toHaveLength(1);
      expect(lines[0]).toHaveAttribute("stroke", "var(--color-border-strong)");
      expect(lines[0]).not.toHaveAttribute("stroke-dasharray");
      expect(yTicks(container)).toContain(0);
    });

    it("stays visible when every value is negative", () => {
      const { container } = renderChart(ALL_NEGATIVE);
      expect(zeroLine(container)).not.toBeNull();
      expect(Math.max(...yTicks(container))).toBe(0);
    });

    it("is not drawn when there is no data", () => {
      const { container } = renderChart([]);
      expect(zeroLine(container)).toBeNull();
    });
  });

  describe("y-axis", () => {
    it("starts the axis at zero when every value is positive", () => {
      const { container } = renderChart(POSITIVE);
      expect(Math.min(...yTicks(container))).toBe(0);
    });

    it("adds no negative ticks beyond the lowest value", () => {
      const { container } = renderChart(MIXED);
      const lowest = Math.min(...yTicks(container));
      expect(lowest).toBeLessThanOrEqual(-12);
      expect(lowest).toBeGreaterThan(-40);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = renderChart(MIXED);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
