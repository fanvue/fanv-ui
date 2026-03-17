import { render, screen } from "@testing-library/react";
import * as React from "react";
import { Bar, BarChart } from "recharts";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ChartCard } from "./ChartCard";
import { ChartCenterLabel } from "./ChartCenterLabel";
import { ChartContainer } from "./ChartContainer";
import { ChartLegendContent } from "./ChartLegend";
import { ChartLoadingOverlay } from "./ChartLoadingOverlay";
import { ChartPieLegend } from "./ChartPieLegend";
import { ChartSeriesToggle } from "./ChartSeriesToggle";
import { ChartStyle } from "./ChartStyle";
import { ChartTooltipContent } from "./ChartTooltip";
import type { ChartConfig } from "./types";
import { ChartContext, useChart } from "./useChart";

const SAMPLE_CONFIG: ChartConfig = {
  revenue: { label: "Revenue", color: "#28ba8e" },
  subscribers: { label: "Subscribers", color: "#4fb2f9" },
};

const SAMPLE_DATA = [
  { month: "Jan", revenue: 100, subscribers: 50 },
  { month: "Feb", revenue: 200, subscribers: 75 },
];

const TOOLTIP_ITEM = {
  name: "revenue" as const,
  value: 100,
  dataKey: "revenue",
  color: "#28ba8e",
  type: undefined,
  graphicalItemId: "test",
};

const LEGEND_ITEM_REVENUE = {
  value: "revenue",
  dataKey: "revenue",
  color: "#28ba8e",
  type: "line" as const,
};
const LEGEND_ITEM_SUBS = {
  value: "subscribers",
  dataKey: "subscribers",
  color: "#4fb2f9",
  type: "line" as const,
};

describe("Chart", () => {
  describe("ChartContainer", () => {
    it("renders with data-chart attribute", () => {
      render(
        <ChartContainer config={SAMPLE_CONFIG} data-testid="chart">
          <BarChart data={SAMPLE_DATA}>
            <Bar dataKey="revenue" />
          </BarChart>
        </ChartContainer>,
      );
      const el = screen.getByTestId("chart");
      expect(el).toBeInTheDocument();
      expect(el).toHaveAttribute("data-chart");
      expect(el).toHaveAttribute("data-slot", "chart");
    });

    it("applies custom className", () => {
      render(
        <ChartContainer config={SAMPLE_CONFIG} data-testid="chart" className="min-h-48">
          <BarChart data={SAMPLE_DATA}>
            <Bar dataKey="revenue" />
          </BarChart>
        </ChartContainer>,
      );
      expect(screen.getByTestId("chart")).toHaveClass("min-h-48");
    });

    it("forwards ref", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <ChartContainer config={SAMPLE_CONFIG} ref={ref}>
          <BarChart data={SAMPLE_DATA}>
            <Bar dataKey="revenue" />
          </BarChart>
        </ChartContainer>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("spreads additional HTML attributes", () => {
      render(
        <ChartContainer config={SAMPLE_CONFIG} data-testid="chart" aria-label="Revenue chart">
          <BarChart data={SAMPLE_DATA}>
            <Bar dataKey="revenue" />
          </BarChart>
        </ChartContainer>,
      );
      expect(screen.getByTestId("chart")).toHaveAttribute("aria-label", "Revenue chart");
    });

    it("provides chart context to children", () => {
      let contextValue: { config: ChartConfig } | null = null;
      function Consumer() {
        contextValue = useChart();
        return null;
      }

      render(
        <ChartContext.Provider value={{ config: SAMPLE_CONFIG }}>
          <Consumer />
        </ChartContext.Provider>,
      );

      expect(contextValue).not.toBeNull();
      expect(contextValue!.config).toBe(SAMPLE_CONFIG);
    });
  });

  describe("ChartStyle", () => {
    it("renders style tag with CSS variables", () => {
      const { container } = render(<ChartStyle id="test-chart" config={SAMPLE_CONFIG} />);
      const style = container.querySelector("style");
      expect(style).not.toBeNull();
      expect(style?.textContent).toContain("--color-revenue: #28ba8e");
      expect(style?.textContent).toContain("--color-subscribers: #4fb2f9");
    });

    it("renders nothing when config has no colors", () => {
      const config: ChartConfig = {
        revenue: { label: "Revenue" },
      };
      const { container } = render(<ChartStyle id="test-chart" config={config} />);
      const style = container.querySelector("style");
      expect(style).toBeNull();
    });

    it("scopes CSS variables to data-chart selector", () => {
      const { container } = render(<ChartStyle id="my-chart" config={SAMPLE_CONFIG} />);
      const style = container.querySelector("style");
      expect(style?.textContent).toContain("[data-chart=my-chart]");
    });

    it("generates dark theme overrides for themed entries", () => {
      const config: ChartConfig = {
        revenue: {
          label: "Revenue",
          theme: { light: "#28ba8e", dark: "#60dbb0" },
        },
      };
      const { container } = render(<ChartStyle id="test-chart" config={config} />);
      const style = container.querySelector("style");
      expect(style?.textContent).toContain(".dark [data-chart=test-chart]");
      expect(style?.textContent).toContain("--color-revenue: #60dbb0");
    });
  });

  describe("ChartTooltipContent", () => {
    it("returns null when not active", () => {
      const { container } = render(
        <ChartContext.Provider value={{ config: SAMPLE_CONFIG }}>
          <ChartTooltipContent active={false} payload={[]} />
        </ChartContext.Provider>,
      );
      expect(container.firstChild).toBeNull();
    });

    it("returns null when payload is empty", () => {
      const { container } = render(
        <ChartContext.Provider value={{ config: SAMPLE_CONFIG }}>
          <ChartTooltipContent active payload={[]} />
        </ChartContext.Provider>,
      );
      expect(container.firstChild).toBeNull();
    });

    it("renders payload items with labels from config", () => {
      const payload = [{ ...TOOLTIP_ITEM, value: 1234 }];
      render(
        <ChartContext.Provider value={{ config: SAMPLE_CONFIG }}>
          <ChartTooltipContent active payload={payload} />
        </ChartContext.Provider>,
      );
      expect(screen.getAllByText("Revenue").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("1,234")).toBeInTheDocument();
    });

    it("hides label when hideLabel is true", () => {
      render(
        <ChartContext.Provider value={{ config: SAMPLE_CONFIG }}>
          <ChartTooltipContent active payload={[TOOLTIP_ITEM]} hideLabel label="January" />
        </ChartContext.Provider>,
      );
      expect(screen.queryByText("January")).not.toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <ChartContext.Provider value={{ config: SAMPLE_CONFIG }}>
          <ChartTooltipContent active payload={[TOOLTIP_ITEM]} className="custom-tooltip" />
        </ChartContext.Provider>,
      );
      expect(container.querySelector(".custom-tooltip")).not.toBeNull();
    });
  });

  describe("ChartLegendContent", () => {
    it("returns null when payload is empty", () => {
      const { container } = render(
        <ChartContext.Provider value={{ config: SAMPLE_CONFIG }}>
          <ChartLegendContent payload={[]} />
        </ChartContext.Provider>,
      );
      expect(container.firstChild).toBeNull();
    });

    it("renders legend items with labels from config", () => {
      render(
        <ChartContext.Provider value={{ config: SAMPLE_CONFIG }}>
          <ChartLegendContent payload={[LEGEND_ITEM_REVENUE, LEGEND_ITEM_SUBS]} />
        </ChartContext.Provider>,
      );
      expect(screen.getByText("Revenue")).toBeInTheDocument();
      expect(screen.getByText("Subscribers")).toBeInTheDocument();
    });

    it("filters out items with type 'none'", () => {
      const payload = [
        LEGEND_ITEM_REVENUE,
        { value: "hidden", dataKey: "hidden", color: "#000", type: "none" as const },
      ];
      render(
        <ChartContext.Provider value={{ config: SAMPLE_CONFIG }}>
          <ChartLegendContent payload={payload} />
        </ChartContext.Provider>,
      );
      expect(screen.getByText("Revenue")).toBeInTheDocument();
      expect(screen.queryByText("hidden")).not.toBeInTheDocument();
    });
  });

  describe("useChart", () => {
    it("throws when used outside ChartContainer", () => {
      function BadConsumer() {
        useChart();
        return null;
      }

      expect(() => render(<BadConsumer />)).toThrow(
        "useChart must be used within a <ChartContainer />",
      );
    });
  });

  describe("accessibility", () => {
    it("ChartContainer has no accessibility violations", async () => {
      const { container } = render(
        <ChartContainer config={SAMPLE_CONFIG} role="img" aria-label="Revenue chart">
          <BarChart data={SAMPLE_DATA}>
            <Bar dataKey="revenue" />
          </BarChart>
        </ChartContainer>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("ChartCard has no accessibility violations", async () => {
      const { container } = render(
        <ChartCard title="Revenue" subtitle="$1,234" dateInfo="Mar 1 - Mar 14">
          <div>chart placeholder</div>
        </ChartCard>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("ChartLoadingOverlay has no accessibility violations", async () => {
      const { container } = render(
        <ChartLoadingOverlay loading>
          <div>chart placeholder</div>
        </ChartLoadingOverlay>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("ChartSeriesToggle has no accessibility violations", async () => {
      const { container } = render(
        <ChartSeriesToggle
          items={[
            { key: "a", label: "Series A", color: "#28ba8e" },
            { key: "b", label: "Series B", color: "#4fb2f9" },
          ]}
          value={new Set(["a", "b"])}
          onValueChange={() => {}}
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("ChartPieLegend has no accessibility violations", async () => {
      const { container } = render(
        <ChartPieLegend
          items={[
            { label: "Subscriptions", value: 4500, color: "#28ba8e" },
            { label: "Messages", value: 2100, color: "#4fb2f9" },
          ]}
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("ChartCenterLabel has no accessibility violations", async () => {
      const { container } = render(
        <svg role="img" aria-label="Progress chart">
          <ChartCenterLabel viewBox={{ cx: 100, cy: 100 }} value="78%" subtitle="Complete" />
        </svg>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
