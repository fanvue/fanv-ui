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

const GRID_STROKE = "var(--color-neutral-alphas-200)";
const ZERO_STROKE = "var(--color-border-strong)";

function horizontalLines(container: HTMLElement) {
  return [...container.querySelectorAll(".recharts-cartesian-grid-horizontal line")];
}

function gridLines(container: HTMLElement) {
  return horizontalLines(container).filter((line) => line.getAttribute("stroke") === GRID_STROKE);
}

function zeroLines(container: HTMLElement) {
  return [...container.querySelectorAll(`.recharts-surface line[stroke="${ZERO_STROKE}"]`)];
}

function zeroTickY(container: HTMLElement) {
  const tick = [...container.querySelectorAll(".recharts-cartesian-axis-tick-value")].find(
    (node) => node.textContent === "0",
  );
  return Number(tick?.getAttribute("y"));
}

describe("ChartGrid", () => {
  describe("grid", () => {
    it("draws solid horizontal lines in neutral-alphas-200 at 40% opacity, and no vertical lines", () => {
      const { container } = renderChart(POSITIVE);
      const lines = gridLines(container);
      expect(lines.length).toBeGreaterThan(1);
      for (const line of lines) {
        expect(line).toHaveAttribute("stroke-opacity", "0.4");
      }
      expect(container.querySelector(".recharts-cartesian-grid-vertical")).toBeNull();
    });

    it("draws no dashed line anywhere in the grid", () => {
      const { container } = renderChart(MIXED);
      expect(horizontalLines(container).length).toBeGreaterThan(1);
      expect(container.querySelector("[stroke-dasharray]")).toBeNull();
    });

    it("lets the consumer add vertical grid lines", () => {
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
      const lines = zeroLines(container);
      expect(lines).toHaveLength(1);
      expect(lines[0]).not.toHaveAttribute("stroke-dasharray");
      expect(Number(lines[0]?.getAttribute("y1"))).toBe(zeroTickY(container));
    });

    it("stays visible when every value is negative", () => {
      const { container } = renderChart(ALL_NEGATIVE);
      const lines = zeroLines(container);
      expect(lines).toHaveLength(1);
      expect(Math.max(...yTicks(container))).toBe(0);
      expect(Number(lines[0]?.getAttribute("y1"))).toBe(zeroTickY(container));
    });

    it("is still drawn at value 0 when there is no data", () => {
      const { container } = renderChart([]);
      const lines = zeroLines(container);
      expect(lines).toHaveLength(1);
      expect(Number(lines[0]?.getAttribute("y1"))).toBe(zeroTickY(container));
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
