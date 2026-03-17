import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps, ReactNode } from "react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";
import { ChartContainer } from "./ChartContainer";
import { ChartLegend, ChartLegendContent } from "./ChartLegend";
import { ChartTooltip, ChartTooltipContent } from "./ChartTooltip";
import type { ChartConfig } from "./types";

const meta = {
  title: "Components/Charts/RadarChart",
  component: ChartContainer,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof ChartContainer>;

const engagementData = [
  { category: "Likes", engagement: 186 },
  { category: "Comments", engagement: 124 },
  { category: "Shares", engagement: 97 },
  { category: "Saves", engagement: 153 },
  { category: "Views", engagement: 214 },
  { category: "Reach", engagement: 170 },
];

const defaultConfig = {
  engagement: {
    label: "Engagement",
    color: "var(--color-special-chart-teal)",
  },
} satisfies ChartConfig;

function SingleRadarChart({
  radarProps,
  gridType,
  children,
}: {
  radarProps?: Partial<ComponentProps<typeof Radar>>;
  gridType?: "polygon" | "circle";
  children?: ReactNode;
}) {
  return (
    <ChartContainer config={defaultConfig} className="mx-auto aspect-square w-[300px]">
      <RadarChart data={engagementData} accessibilityLayer>
        <PolarGrid gridType={gridType} />
        <PolarAngleAxis dataKey="category" />
        <ChartTooltip content={<ChartTooltipContent />} />
        {children}
        <Radar
          dataKey="engagement"
          fill="var(--color-engagement)"
          stroke="var(--color-engagement)"
          {...radarProps}
        />
      </RadarChart>
    </ChartContainer>
  );
}

export const Default: Story = {
  render: () => <SingleRadarChart />,
};

const multiSeriesData = [
  { category: "Likes", thisMonth: 186, lastMonth: 140 },
  { category: "Comments", thisMonth: 124, lastMonth: 98 },
  { category: "Shares", thisMonth: 97, lastMonth: 72 },
  { category: "Saves", thisMonth: 153, lastMonth: 110 },
  { category: "Views", thisMonth: 214, lastMonth: 190 },
  { category: "Reach", thisMonth: 170, lastMonth: 130 },
];

const multiSeriesConfig = {
  thisMonth: {
    label: "This Month",
    color: "var(--color-special-chart-teal)",
  },
  lastMonth: {
    label: "Last Month",
    color: "var(--color-special-chart-magenta)",
  },
} satisfies ChartConfig;

function MultiRadarChart({ showLegend = false }: { showLegend?: boolean }) {
  return (
    <ChartContainer config={multiSeriesConfig} className="mx-auto aspect-square w-[300px]">
      <RadarChart data={multiSeriesData} accessibilityLayer>
        <PolarGrid />
        <PolarAngleAxis dataKey="category" />
        <ChartTooltip content={<ChartTooltipContent />} />
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
        <Radar
          dataKey="thisMonth"
          fill="var(--color-thisMonth)"
          stroke="var(--color-thisMonth)"
          fillOpacity={0.15}
        />
        <Radar
          dataKey="lastMonth"
          fill="var(--color-lastMonth)"
          stroke="var(--color-lastMonth)"
          fillOpacity={0.15}
        />
      </RadarChart>
    </ChartContainer>
  );
}

export const MultiSeries: Story = {
  render: () => <MultiRadarChart />,
};

export const WithLegend: Story = {
  render: () => <MultiRadarChart showLegend />,
};

export const FilledRadar: Story = {
  render: () => <SingleRadarChart radarProps={{ fillOpacity: 0.3 }} />,
};

export const WithDots: Story = {
  render: () => (
    <SingleRadarChart radarProps={{ dot: { fill: "var(--color-engagement)", r: 4 } }} />
  ),
};

export const CustomGrid: Story = {
  render: () => (
    <SingleRadarChart radarProps={{ fillOpacity: 0.2 }} gridType="circle">
      <PolarRadiusAxis />
    </SingleRadarChart>
  ),
};
