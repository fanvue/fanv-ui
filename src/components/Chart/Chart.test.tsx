import { render, screen } from "@testing-library/react";
import type * as React from "react";
import { Bar, BarChart } from "recharts";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  type ChartConfig,
  ChartContainer,
  ChartContext,
  ChartLegend,
  ChartLegendContent,
  type ChartLegendContentProps,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  type ChartTooltipContentProps,
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

function ChartProvider({
  config = chartConfig,
  children,
}: {
  config?: ChartConfig;
  children: React.ReactNode;
}) {
  return <ChartContext.Provider value={{ config }}>{children}</ChartContext.Provider>;
}

const tooltipPayload = [
  {
    value: 186,
    name: "desktop",
    dataKey: "desktop",
    payload: { month: "January", desktop: 186, mobile: 80 },
    color: "#2563eb",
  },
];

const multiPayload = [
  ...tooltipPayload,
  {
    value: 80,
    name: "mobile",
    dataKey: "mobile",
    payload: { month: "January", desktop: 186, mobile: 80 },
    color: "#60a5fa",
  },
];

const legendPayload = [
  { value: "desktop", dataKey: "desktop", color: "#2563eb", type: "rect" as const },
  { value: "mobile", dataKey: "mobile", color: "#60a5fa", type: "rect" as const },
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

    it("injects CSS variables as inline styles", () => {
      const { container } = render(
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper.style.getPropertyValue("--color-desktop")).toBe("#2563eb");
      expect(wrapper.style.getPropertyValue("--color-mobile")).toBe("#60a5fa");
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

    it("forwards id to the wrapper element", () => {
      const { container } = render(
        <ChartContainer id="my-chart" config={chartConfig}>
          <BarChart data={chartData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );
      const wrapper = container.firstElementChild;
      expect(wrapper).toHaveAttribute("id", "my-chart");
      expect(wrapper?.getAttribute("data-chart")).toBe("chart-my-chart");
    });

    it("renders style tag for theme-based color overrides", () => {
      const themeConfig = {
        desktop: {
          label: "Desktop",
          theme: { light: "#2563eb", dark: "#93c5fd" },
        },
      } satisfies ChartConfig;
      const { container } = render(
        <ChartContainer config={themeConfig}>
          <BarChart data={chartData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );
      const style = container.querySelector("style");
      expect(style).toBeInTheDocument();
      expect(style?.textContent).toContain("--color-desktop");
    });

    it("skips entries without color or theme in config", () => {
      const sparseConfig = {
        desktop: { label: "Desktop", color: "#2563eb" },
        label_only: { label: "No color" },
      } satisfies ChartConfig;
      const { container } = render(
        <ChartContainer config={sparseConfig}>
          <BarChart data={chartData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper.style.getPropertyValue("--color-desktop")).toBe("#2563eb");
      expect(wrapper.style.getPropertyValue("--color-label_only")).toBe("");
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

describe("ChartStyle", () => {
  it("returns null for empty config array", () => {
    const { container } = render(<ChartStyle id="test" config={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("omits CSS variable when theme color is empty for a given mode", () => {
    const partialConfig = {
      desktop: { label: "Desktop", theme: { light: "#2563eb", dark: "" } },
    } as unknown as ChartConfig;
    const { container } = render(
      <ChartContainer config={partialConfig}>
        <BarChart data={chartData}>
          <Bar dataKey="desktop" />
        </BarChart>
      </ChartContainer>,
    );
    const css = container.querySelector("style")?.textContent ?? "";
    expect(css).toContain("--color-desktop: #2563eb");
    const darkBlock = css.split(".dark")[1];
    expect(darkBlock).not.toContain("--color-desktop");
  });
});

describe("useChart", () => {
  it("throws when used outside ChartContainer", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ChartTooltipContent active payload={tooltipPayload} />)).toThrow(
      "useChart must be used within a <ChartContainer />",
    );
    consoleSpy.mockRestore();
  });
});

describe("ChartTooltipContent", () => {
  function renderTooltip(props: ChartTooltipContentProps, config?: ChartConfig) {
    return render(
      <ChartProvider config={config}>
        <ChartTooltipContent {...props} />
      </ChartProvider>,
    );
  }

  it("returns null when not active", () => {
    const { container } = renderTooltip({ active: false, payload: tooltipPayload });
    expect(container.querySelector("[class*='min-w-']")).not.toBeInTheDocument();
  });

  it("returns null when payload is empty", () => {
    const { container } = renderTooltip({ active: true, payload: [] });
    expect(container.querySelector("[class*='min-w-']")).not.toBeInTheDocument();
  });

  it("renders tooltip with values when active", () => {
    const { container } = renderTooltip({
      active: true,
      payload: tooltipPayload,
      label: "January",
    });
    expect(container.textContent).toContain("186");
    expect(container.textContent).toContain("January");
  });

  it("hides label when hideLabel is true", () => {
    const { container } = renderTooltip({
      active: true,
      payload: tooltipPayload,
      label: "January",
      hideLabel: true,
    });
    expect(container.textContent).toContain("186");
    expect(container.textContent).not.toContain("January");
  });

  it("uses labelFormatter when provided", () => {
    const { container } = renderTooltip({
      active: true,
      payload: tooltipPayload,
      label: "January",
      labelFormatter: (value) => `Formatted: ${value}`,
    });
    expect(container.textContent).toContain("Formatted: January");
  });

  it("renders dot indicator by default", () => {
    const { container } = renderTooltip({
      active: true,
      payload: tooltipPayload,
    });
    const indicator = container.querySelector("[style*='--color-bg']");
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass("h-2.5");
    expect(indicator).toHaveClass("w-2.5");
  });

  it("renders line indicator", () => {
    const { container } = renderTooltip({
      active: true,
      payload: tooltipPayload,
      indicator: "line",
    });
    const indicator = container.querySelector("[style*='--color-bg']");
    expect(indicator).toHaveClass("w-1");
  });

  it("renders dashed indicator", () => {
    const { container } = renderTooltip({
      active: true,
      payload: tooltipPayload,
      indicator: "dashed",
    });
    const indicator = container.querySelector("[style*='--color-bg']");
    expect(indicator).toHaveClass("border-dashed");
  });

  it("hides indicator when hideIndicator is true", () => {
    const { container } = renderTooltip({
      active: true,
      payload: tooltipPayload,
      hideIndicator: true,
    });
    expect(container.querySelector("[style*='--color-bg']")).not.toBeInTheDocument();
  });

  it("nests label when single payload with non-dot indicator", () => {
    const { container } = renderTooltip({
      active: true,
      payload: tooltipPayload,
      label: "January",
      indicator: "line",
    });
    expect(container.textContent).toContain("January");
    expect(container.textContent).toContain("186");
  });

  it("does not nest label with multiple payload entries", () => {
    const { container } = renderTooltip({
      active: true,
      payload: multiPayload,
      label: "January",
      indicator: "line",
    });
    expect(container.textContent).toContain("186");
    expect(container.textContent).toContain("80");
  });

  it("calls custom formatter", () => {
    renderTooltip({
      active: true,
      payload: tooltipPayload,
      formatter: (value) => <span data-testid="custom">{`$${value}`}</span>,
    });
    expect(screen.getByTestId("custom").textContent).toBe("$186");
  });

  it("uses color prop as indicator override", () => {
    const { container } = renderTooltip({
      active: true,
      payload: tooltipPayload,
      color: "#ff0000",
    });
    const indicator = container.querySelector("[style*='--color-bg']") as HTMLElement;
    expect(indicator?.style.getPropertyValue("--color-bg")).toBe("#ff0000");
  });

  it("resolves label from config when label matches a config key", () => {
    const { container } = renderTooltip({
      active: true,
      payload: tooltipPayload,
      label: "desktop",
    });
    expect(container.textContent).toContain("Desktop");
  });

  it("filters out payload entries with type none", () => {
    const payloadWithNone = [
      { ...tooltipPayload[0], type: "none" as const },
      {
        value: 80,
        name: "mobile",
        dataKey: "mobile",
        payload: { month: "January", desktop: 186, mobile: 80 },
        color: "#60a5fa",
      },
    ];
    const { container } = renderTooltip({
      active: true,
      payload: payloadWithNone,
    });
    expect(container.textContent).toContain("80");
    expect(container.textContent).not.toContain("186");
  });

  it("renders with labelKey to resolve label from payload", () => {
    const { container } = renderTooltip({
      active: true,
      payload: tooltipPayload,
      labelKey: "desktop",
    });
    expect(container.textContent).toContain("Desktop");
  });

  it("renders dashed indicator with nestLabel styling", () => {
    const { container } = renderTooltip({
      active: true,
      payload: tooltipPayload,
      indicator: "dashed",
      label: "January",
    });
    const indicator = container.querySelector("[style*='--color-bg']");
    expect(indicator).toHaveClass("my-0.5");
  });

  it("falls back to item.name when dataKey is missing in key resolution", () => {
    const payload = [{ value: 100, name: "desktop", payload: { desktop: 100 }, color: "#2563eb" }];
    const { container } = renderTooltip({ active: true, payload, label: "Test" });
    expect(container.textContent).toContain("Desktop");
  });

  it("falls back to 'value' when both name and dataKey are missing", () => {
    const payload = [{ value: 100, payload: {}, color: "#2563eb" }];
    const { container } = renderTooltip({ active: true, payload });
    expect(container.textContent).toContain("100");
  });

  it("returns null label when value resolves to falsy", () => {
    const noLabelConfig = { desktop: { color: "#2563eb" } } satisfies ChartConfig;
    const { container } = renderTooltip(
      { active: true, payload: tooltipPayload, label: 0 },
      noLabelConfig,
    );
    expect(container.textContent).toContain("186");
  });

  it("renders icon from config instead of indicator", () => {
    function StarIcon() {
      return <svg data-testid="star-icon" />;
    }
    const iconConfig = {
      desktop: { label: "Desktop", color: "#2563eb", icon: StarIcon },
    } satisfies ChartConfig;
    const { container } = renderTooltip({ active: true, payload: tooltipPayload }, iconConfig);
    expect(screen.getByTestId("star-icon")).toBeInTheDocument();
    expect(container.querySelector("[style*='--color-bg']")).not.toBeInTheDocument();
  });

  it("falls back to item.name when config label is missing", () => {
    const noLabelConfig = { desktop: { color: "#2563eb" } } satisfies ChartConfig;
    const { container } = renderTooltip({ active: true, payload: tooltipPayload }, noLabelConfig);
    expect(container.textContent).toContain("desktop");
  });

  it("uses index as key fallback when dataKey and name are absent", () => {
    const payload = [{ value: 42, payload: {}, color: "#aaa" }];
    const { container } = renderTooltip({ active: true, payload });
    expect(container.textContent).toContain("42");
  });

  it("resolves nameKey from nested payload property", () => {
    const config = {
      chrome: { label: "Chrome", color: "#4285f4" },
      desktop: { label: "Desktop", color: "#2563eb" },
    } satisfies ChartConfig;
    const payload = [
      {
        value: 200,
        name: "desktop",
        dataKey: "desktop",
        payload: { browser: "chrome" },
        color: "#2563eb",
      },
    ];
    const { container } = renderTooltip({ active: true, payload, nameKey: "browser" }, config);
    expect(container.textContent).toContain("Chrome");
  });

  it("uses payload.fill as indicator color when item.color is absent", () => {
    const payload = [
      {
        value: 100,
        name: "desktop",
        dataKey: "desktop",
        payload: { fill: "#ff00ff" },
      },
    ];
    const { container } = renderTooltip({ active: true, payload });
    const indicator = container.querySelector("[style*='--color-bg']") as HTMLElement;
    expect(indicator?.style.getPropertyValue("--color-bg")).toBe("#ff00ff");
  });
});

describe("ChartLegendContent", () => {
  function renderLegend(props: ChartLegendContentProps, config?: ChartConfig) {
    return render(
      <ChartProvider config={config}>
        <ChartLegendContent {...props} />
      </ChartProvider>,
    );
  }

  it("returns null when payload is empty", () => {
    const { container } = renderLegend({ payload: [] });
    expect(container.innerHTML).toBe("");
  });

  it("returns null when payload is undefined", () => {
    const { container } = renderLegend({});
    expect(container.innerHTML).toBe("");
  });

  it("renders legend items from payload", () => {
    const { container } = renderLegend({ payload: legendPayload });
    expect(container.textContent).toContain("Desktop");
    expect(container.textContent).toContain("Mobile");
  });

  it("applies bottom padding by default", () => {
    const { container } = renderLegend({ payload: legendPayload });
    const legend = container.firstElementChild;
    expect(legend).toHaveClass("pt-3");
  });

  it("applies top padding when verticalAlign is top", () => {
    const { container } = renderLegend({
      payload: legendPayload,
      verticalAlign: "top",
    });
    const legend = container.firstElementChild;
    expect(legend).toHaveClass("pb-3");
  });

  it("filters entries with type none", () => {
    const payloadWithNone = [
      { value: "desktop", dataKey: "desktop", color: "#2563eb", type: "none" as const },
      { value: "mobile", dataKey: "mobile", color: "#60a5fa", type: "rect" as const },
    ];
    const { container } = renderLegend({ payload: payloadWithNone });
    expect(container.textContent).not.toContain("Desktop");
    expect(container.textContent).toContain("Mobile");
  });

  it("renders color swatch with correct background", () => {
    const { container } = renderLegend({ payload: legendPayload });
    const swatches = container.querySelectorAll("[style*='background-color']");
    expect(swatches.length).toBe(2);
    expect((swatches[0] as HTMLElement).style.backgroundColor).toBe("rgb(37, 99, 235)");
  });

  it("applies custom className", () => {
    const { container } = renderLegend({
      payload: legendPayload,
      className: "custom-legend",
    });
    expect(container.firstElementChild).toHaveClass("custom-legend");
  });

  it("renders icon from config when available", () => {
    function ChartIcon() {
      return <svg data-testid="legend-icon" />;
    }
    const iconConfig = {
      desktop: { label: "Desktop", color: "#2563eb", icon: ChartIcon },
    } satisfies ChartConfig;
    renderLegend({ payload: legendPayload }, iconConfig);
    expect(screen.getByTestId("legend-icon")).toBeInTheDocument();
  });

  it("hides icon when hideIcon is true even if config has one", () => {
    function ChartIcon() {
      return <svg data-testid="legend-icon-hidden" />;
    }
    const iconConfig = {
      desktop: { label: "Desktop", color: "#2563eb", icon: ChartIcon },
    } satisfies ChartConfig;
    const { container } = renderLegend({ payload: legendPayload, hideIcon: true }, iconConfig);
    expect(container.querySelector("[data-testid='legend-icon-hidden']")).not.toBeInTheDocument();
    const swatches = container.querySelectorAll("[style*='background-color']");
    expect(swatches.length).toBeGreaterThan(0);
  });

  it("falls back to 'value' key when dataKey is missing", () => {
    const noDataKeyPayload = [{ value: "desktop", color: "#2563eb", type: "rect" as const }];
    const { container } = renderLegend({ payload: noDataKeyPayload });
    expect(container.textContent).toContain("Desktop");
  });
});
