import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { Bar, BarChart } from "recharts";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ChartCard } from "./ChartCard";
import { ChartCenterLabel } from "./ChartCenterLabel";
import { ChartContainer } from "./ChartContainer";
import { ChartLegendContent } from "./ChartLegend";
import { ChartLoadingOverlay } from "./ChartLoadingOverlay";
import { ChartPieLegend } from "./ChartPieLegend";
import { ChartSeriesToggle } from "./ChartSeriesToggle";
import { ChartSkeleton } from "./ChartSkeleton";
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

  describe("ChartCard", () => {
    it("renders the V2 Insight Card surface by default", () => {
      const { container } = render(<ChartCard title="Revenue" />);
      const card = container.firstElementChild;
      expect(card).toHaveClass("rounded-sm", "border-border-strong", "bg-background-primary");
      expect(card).not.toHaveClass("rounded-lg", "border-border-primary", "bg-surface-primary");
      expect(card).not.toHaveClass("shadow-sm");
    });

    it("renders the title in the secondary content colour at regular weight", () => {
      render(<ChartCard title="Revenue" />);
      const title = screen.getByText("Revenue");
      expect(title).toHaveClass("typography-body-small-14px-regular", "text-content-secondary");
    });

    it("renders the trend as coloured text with a directional arrow, not a filled chip", () => {
      const { container } = render(
        <ChartCard
          title="ARPU"
          subtitle="$135.84"
          trendChip={{ label: "1.3% vs prev", trend: "negative" }}
        />,
      );
      const label = screen.getByText("1.3% vs prev");
      const trend = label.parentElement;
      expect(trend).toHaveClass("text-error-content");
      expect(trend).not.toHaveClass("bg-error-surface", "rounded-full");
      expect(container.querySelector("svg.rotate-90")).not.toBeNull();
    });

    it("points the trend arrow up and green for a positive trend", () => {
      const { container } = render(
        <ChartCard
          title="New Fans"
          subtitle="1,389"
          trendChip={{ label: "13.1% vs prev", trend: "positive" }}
        />,
      );
      expect(screen.getByText("13.1% vs prev").parentElement).toHaveClass("text-success-content");
      expect(container.querySelector("svg.rotate-90")).toBeNull();
    });

    it("applies the secondary surface when hierarchy is secondary", () => {
      const { container } = render(<ChartCard title="Revenue" hierarchy="secondary" />);
      expect(container.firstElementChild).toHaveClass(
        "border-border-strong",
        "bg-surface-secondary",
      );
    });

    it("omits the children wrapper when no children are provided", () => {
      const { container } = render(<ChartCard title="Revenue" subtitle="$1,234" />);
      expect(container.querySelector(".mt-auto")).toBeNull();
    });

    it("renders the children wrapper when children are provided", () => {
      const { container } = render(
        <ChartCard title="Revenue" subtitle="$1,234">
          <div>chart</div>
        </ChartCard>,
      );
      expect(container.querySelector(".mt-auto")).not.toBeNull();
    });

    it("renders the outlined info glyph rather than the filled disc", () => {
      render(<ChartCard title="Revenue" tooltip="Total revenue." />);
      const svg = screen.getByRole("button", { name: "More info" }).querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 16 16");
      expect(svg?.querySelector("path[stroke='currentColor']")).not.toBeNull();
      expect(svg?.querySelector("g.opacity-100")).not.toBeNull();
    });

    it("renders a 32px circular tooltip trigger with interactive states", () => {
      render(<ChartCard title="Revenue" tooltip="Total revenue." />);
      const trigger = screen.getByRole("button", { name: "More info" });
      expect(trigger).toHaveClass("size-8", "rounded-full");
      expect(trigger).toHaveClass("not-disabled:hover:bg-buttons-tertiary-hover");
      expect(trigger).toHaveClass("not-disabled:active:bg-buttons-tertiary-hover");
      expect(trigger).toHaveClass("focus-visible:shadow-focus-ring");
    });

    it("applies flex-wrap and whitespace-nowrap to prevent trendChip truncation", () => {
      render(
        <ChartCard
          title="This month"
          subtitle="$2,358.99"
          trendChip={{ label: "$455.68 vs Mar", trend: "positive" }}
          dateInfo="April 2026"
        >
          <div>chart</div>
        </ChartCard>,
      );
      const label = screen.getByText("$455.68 vs Mar");
      expect(label).toBeInTheDocument();
      expect(label).toHaveClass("whitespace-nowrap");
      expect(label.closest(".flex-wrap")).not.toBeNull();
    });
  });

  describe("ChartSeriesToggle", () => {
    const TOGGLE_ITEMS = [
      { key: "a", label: "Series A", color: "rgb(40, 186, 142)" },
      { key: "b", label: "Series B", color: "rgb(79, 178, 249)" },
    ];

    it("renders each series as a chip button reflecting selection via aria-pressed", () => {
      render(
        <ChartSeriesToggle items={TOGGLE_ITEMS} value={new Set(["a"])} onValueChange={() => {}} />,
      );
      expect(screen.getByRole("button", { name: "Series A" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      expect(screen.getByRole("button", { name: "Series B" })).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    });

    it("lays chips out in a wrapping row so each sizes to its label", () => {
      const { container } = render(
        <ChartSeriesToggle items={TOGGLE_ITEMS} value={new Set(["a"])} onValueChange={() => {}} />,
      );
      const wrapper = container.firstElementChild;
      expect(wrapper).toHaveClass("flex", "flex-wrap", "gap-2");
      expect(wrapper?.className).not.toMatch(/\bgrid\b/);
      expect(screen.getByRole("button", { name: "Series A" })).not.toHaveClass("justify-start");
    });

    it("uses the V2 chip tokens for selected and unselected series", () => {
      render(
        <ChartSeriesToggle items={TOGGLE_ITEMS} value={new Set(["a"])} onValueChange={() => {}} />,
      );
      expect(screen.getByRole("button", { name: "Series A" })).toHaveClass(
        "bg-buttons-chip-active",
      );
      expect(screen.getByRole("button", { name: "Series B" })).toHaveClass(
        "bg-buttons-chip-default",
        "hover:bg-buttons-chip-hover",
      );
    });

    it("renders a colour dot per series", () => {
      render(
        <ChartSeriesToggle
          items={TOGGLE_ITEMS}
          value={new Set(["a", "b"])}
          onValueChange={() => {}}
        />,
      );
      const dot = screen
        .getByRole("button", { name: "Series A" })
        .querySelector<HTMLElement>(".size-2");
      expect(dot).not.toBeNull();
      expect(dot).toHaveStyle({ backgroundColor: "rgb(40, 186, 142)" });
    });

    it("adds a key to the Set when toggling an unselected series on", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ChartSeriesToggle
          items={TOGGLE_ITEMS}
          value={new Set(["a"])}
          onValueChange={onValueChange}
        />,
      );
      await user.click(screen.getByRole("button", { name: "Series B" }));
      expect(onValueChange).toHaveBeenCalledWith(new Set(["a", "b"]));
    });

    it("removes a key from the Set when toggling a selected series off", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ChartSeriesToggle
          items={TOGGLE_ITEMS}
          value={new Set(["a", "b"])}
          onValueChange={onValueChange}
        />,
      );
      await user.click(screen.getByRole("button", { name: "Series A" }));
      expect(onValueChange).toHaveBeenCalledWith(new Set(["b"]));
    });

    it("does not mutate the Set it was given", async () => {
      const user = userEvent.setup();
      const value = new Set(["a"]);
      render(<ChartSeriesToggle items={TOGGLE_ITEMS} value={value} onValueChange={() => {}} />);
      await user.click(screen.getByRole("button", { name: "Series B" }));
      expect(value).toEqual(new Set(["a"]));
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

    it("renders a wave skeleton instead of the spinner when variant is set", () => {
      const { container } = render(
        <ChartLoadingOverlay loading variant="bar">
          <div>chart</div>
        </ChartLoadingOverlay>,
      );
      expect(container.querySelector(".fv-skeleton-wave")).not.toBeNull();
      expect(container.querySelector('[class*="bg-surface-primary/60"]')).toBeNull();
    });

    it("shows the area skeleton by default and the spinner only at variant={false}", () => {
      const { container: byDefault } = render(
        <ChartLoadingOverlay loading>
          <div>chart</div>
        </ChartLoadingOverlay>,
      );
      expect(byDefault.querySelector(".fv-skeleton-wave")).not.toBeNull();

      const { container: legacy } = render(
        <ChartLoadingOverlay loading variant={false}>
          <div>chart</div>
        </ChartLoadingOverlay>,
      );
      expect(legacy.querySelector(".fv-skeleton-wave")).toBeNull();
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
  describe("ChartSkeleton", () => {
    it("renders a circular placeholder for circular charts", () => {
      const { container } = render(<ChartSkeleton variant="circular" />);
      expect(container.querySelector(".rounded-full")).not.toBeNull();
    });

    it("renders one bar per sample for bar charts", () => {
      const { container } = render(<ChartSkeleton variant="bar" />);
      expect(container.querySelectorAll(".fv-skeleton-wave").length).toBe(7);
    });

    it("renders line charts as a single band, matching area", () => {
      const { container } = render(<ChartSkeleton variant="line" />);
      expect(container.querySelectorAll(".fv-skeleton-wave").length).toBe(1);
    });

    it("renders a single filled band for area charts", () => {
      const { container } = render(<ChartSkeleton variant="area" />);
      expect(container.querySelectorAll(".fv-skeleton-wave").length).toBe(1);
    });

    it("renders a header plus one row per entry for tables", () => {
      const { container } = render(<ChartSkeleton variant="table" rows={5} />);
      // 3 header bars, then 4 elements per row (rank, avatar, label, value).
      expect(container.querySelectorAll(".fv-skeleton-wave").length).toBe(3 + 5 * 4);
    });

    it("renders a glyph, label, value and bar per breakdown row", () => {
      const { container } = render(<ChartSkeleton variant="rows" rows={3} />);
      expect(container.querySelectorAll(".fv-skeleton-wave").length).toBe(3 * 4);
    });

    it("matches the row count it is given, so the card does not resize on load", () => {
      const { container } = render(<ChartSkeleton variant="rows" rows={1} />);
      expect(container.querySelectorAll(".fv-skeleton-wave").length).toBe(4);
    });

    it("has no accessibility violations", async () => {
      const { container } = render(<ChartSkeleton variant="line" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations for the list variants", async () => {
      const table = render(<ChartSkeleton variant="table" rows={3} />);
      expect(await axe(table.container)).toHaveNoViolations();
      table.unmount();

      const rows = render(<ChartSkeleton variant="rows" rows={3} />);
      expect(await axe(rows.container)).toHaveNoViolations();
    });
  });
});
