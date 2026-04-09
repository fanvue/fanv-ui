import type { Meta, StoryObj } from "@storybook/react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { ChartContainer } from "./ChartContainer";
import { ChartLegend, ChartLegendContent } from "./ChartLegend";
import { ChartTooltip, ChartTooltipContent } from "./ChartTooltip";
import { earningsConfig } from "./chartStoryFixtures";
import type { ChartConfig } from "./types";

const meta = {
  title: "Components/Charts/BarChart",
  component: ChartContainer,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof ChartContainer>;

const earningsData = [
  { category: "Photos", earnings: 4200 },
  { category: "Videos", earnings: 7800 },
  { category: "Messages", earnings: 3100 },
  { category: "Tips", earnings: 5400 },
  { category: "Streams", earnings: 6200 },
  { category: "Bundles", earnings: 2900 },
];

function EarningsBarChart({
  radius = [8, 8, 0, 0],
}: {
  radius?: [number, number, number, number];
}) {
  return (
    <ChartContainer config={earningsConfig} className="min-h-[200px] w-full max-w-lg">
      <BarChart accessibilityLayer data={earningsData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="earnings" fill="var(--color-earnings)" radius={radius} />
      </BarChart>
    </ChartContainer>
  );
}

export const Default: Story = {
  render: () => <EarningsBarChart />,
};

const horizontalData = [
  { type: "Subscriptions", revenue: 8200 },
  { type: "Pay-per-view", revenue: 4600 },
  { type: "Tips", revenue: 3900 },
  { type: "Messages", revenue: 5100 },
  { type: "Referrals", revenue: 2400 },
  { type: "Bundles", revenue: 3200 },
];

const horizontalConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--color-special-chart-sky)",
  },
} satisfies ChartConfig;

export const Horizontal: Story = {
  render: () => (
    <ChartContainer config={horizontalConfig} className="min-h-[200px] w-full max-w-lg">
      <BarChart accessibilityLayer data={horizontalData} layout="vertical">
        <CartesianGrid vertical={false} />
        <YAxis
          dataKey="type"
          type="category"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={100}
        />
        <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ChartContainer>
  ),
};

const stackedData = [
  { month: "Jan", subscriptions: 3200, tips: 1800 },
  { month: "Feb", subscriptions: 3800, tips: 2100 },
  { month: "Mar", subscriptions: 4100, tips: 1600 },
  { month: "Apr", subscriptions: 4500, tips: 2400 },
  { month: "May", subscriptions: 4200, tips: 2800 },
  { month: "Jun", subscriptions: 4900, tips: 3100 },
  { month: "Jul", subscriptions: 5200, tips: 2700 },
];

const stackedConfig = {
  subscriptions: {
    label: "Subscriptions",
    color: "var(--color-special-chart-teal)",
  },
  tips: {
    label: "Tips",
    color: "var(--color-special-chart-magenta)",
  },
} satisfies ChartConfig;

export const Stacked: Story = {
  render: () => (
    <ChartContainer config={stackedConfig} className="min-h-[200px] w-full max-w-lg">
      <BarChart accessibilityLayer data={stackedData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="subscriptions" stackId="a" fill="var(--color-subscriptions)" />
        <Bar dataKey="tips" stackId="a" fill="var(--color-tips)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ChartContainer>
  ),
};

const groupedData = [
  { month: "Jan", current: 4200, previous: 3100 },
  { month: "Feb", current: 5100, previous: 3800 },
  { month: "Mar", current: 4800, previous: 4200 },
  { month: "Apr", current: 6200, previous: 4500 },
  { month: "May", current: 5900, previous: 5100 },
  { month: "Jun", current: 7100, previous: 4900 },
];

const groupedConfig = {
  current: {
    label: "This Period",
    color: "var(--color-special-chart-sky)",
  },
  previous: {
    label: "Last Period",
    color: "var(--color-special-chart-gray)",
  },
} satisfies ChartConfig;

export const Grouped: Story = {
  render: () => (
    <ChartContainer config={groupedConfig} className="min-h-[200px] w-full max-w-lg">
      <BarChart accessibilityLayer data={groupedData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="current" fill="var(--color-current)" radius={[8, 8, 0, 0]} />
        <Bar dataKey="previous" fill="var(--color-previous)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ChartContainer>
  ),
};

const legendData = [
  { month: "Jan", subscribers: 320, followers: 1200 },
  { month: "Feb", subscribers: 380, followers: 1450 },
  { month: "Mar", subscribers: 410, followers: 1600 },
  { month: "Apr", subscribers: 450, followers: 1850 },
  { month: "May", subscribers: 520, followers: 2100 },
  { month: "Jun", subscribers: 580, followers: 2400 },
  { month: "Jul", subscribers: 640, followers: 2800 },
];

const legendConfig = {
  subscribers: {
    label: "Subscribers",
    color: "var(--color-special-chart-purple)",
  },
  followers: {
    label: "Followers",
    color: "var(--color-special-chart-orange)",
  },
} satisfies ChartConfig;

export const WithLegend: Story = {
  render: () => (
    <ChartContainer config={legendConfig} className="min-h-[200px] w-full max-w-lg">
      <BarChart accessibilityLayer data={legendData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="subscribers" fill="var(--color-subscribers)" radius={[8, 8, 0, 0]} />
        <Bar dataKey="followers" fill="var(--color-followers)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ChartContainer>
  ),
};

const negativeData = [
  { month: "Jan", change: 1200 },
  { month: "Feb", change: -400 },
  { month: "Mar", change: 800 },
  { month: "Apr", change: -150 },
  { month: "May", change: 2100 },
  { month: "Jun", change: -600 },
  { month: "Jul", change: 1500 },
  { month: "Aug", change: -300 },
];

const negativeConfig = {
  change: {
    label: "Net Change",
    color: "var(--color-special-chart-teal)",
  },
} satisfies ChartConfig;

export const NegativeValues: Story = {
  render: () => (
    <ChartContainer config={negativeConfig} className="min-h-[200px] w-full max-w-lg">
      <BarChart accessibilityLayer data={negativeData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="change" radius={[8, 8, 0, 0]}>
          {negativeData.map((entry) => (
            <Cell
              key={entry.month}
              fill={
                entry.change >= 0
                  ? "var(--color-special-chart-teal)"
                  : "var(--color-special-chart-pink)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  ),
};

export const CustomBarRadius: Story = {
  render: () => <EarningsBarChart radius={[999, 999, 0, 0]} />,
};
