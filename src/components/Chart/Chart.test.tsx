import { render } from "@testing-library/react";
import { Bar, BarChart } from "recharts";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./Chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
];

describe("ChartContainer", () => {
  describe("API", () => {
    it("applies custom className", () => {
      const { container } = render(
        <ChartContainer config={chartConfig} className="custom-class">
          <BarChart data={chartData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );
      const wrapper = container.firstElementChild;
      expect(wrapper).toHaveClass("custom-class");
    });

    it("sets data-chart attribute", () => {
      const { container } = render(
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );
      const wrapper = container.firstElementChild;
      expect(wrapper).toHaveAttribute("data-chart");
      expect(wrapper?.getAttribute("data-chart")).toMatch(/^chart-/);
    });

    it("injects CSS variables via style element", () => {
      const { container } = render(
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );
      const style = container.querySelector("style");
      expect(style).toBeInTheDocument();
      expect(style?.textContent).toContain("--color-desktop");
      expect(style?.textContent).toContain("--color-mobile");
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(
        <ChartContainer ref={ref} config={chartConfig}>
          <BarChart data={chartData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <Bar dataKey="desktop" fill="var(--color-desktop)" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
