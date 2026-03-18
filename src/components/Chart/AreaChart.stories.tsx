import type { Meta, StoryObj } from "@storybook/react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer } from "./ChartContainer";
import { ChartLegend, ChartLegendContent } from "./ChartLegend";
import { ChartTooltip, ChartTooltipContent } from "./ChartTooltip";
import { AreaGradient, earningsConfig } from "./chartStoryFixtures";
import type { ChartConfig } from "./types";

const meta = {
  title: "Components/Charts/AreaChart",
  component: ChartContainer,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof ChartContainer>;

const earningsData = [
  { month: "Jan", earnings: 2400 },
  { month: "Feb", earnings: 1398 },
  { month: "Mar", earnings: 3200 },
  { month: "Apr", earnings: 2780 },
  { month: "May", earnings: 4890 },
  { month: "Jun", earnings: 3908 },
];

export const Default: Story = {
  render: () => (
    <ChartContainer config={earningsConfig} className="min-h-[200px] w-full max-w-lg">
      <AreaChart accessibilityLayer data={earningsData}>
        <defs>
          <AreaGradient id="fillEarnings" color="var(--color-earnings)" />
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="natural"
          dataKey="earnings"
          stroke="var(--color-earnings)"
          fill="url(#fillEarnings)"
        />
      </AreaChart>
    </ChartContainer>
  ),
};

const visitorsData = [
  { month: "Jan", desktop: 1860, mobile: 1200 },
  { month: "Feb", desktop: 2105, mobile: 1450 },
  { month: "Mar", desktop: 2370, mobile: 1680 },
  { month: "Apr", desktop: 1730, mobile: 1900 },
  { month: "May", desktop: 2490, mobile: 2100 },
  { month: "Jun", desktop: 2140, mobile: 2450 },
];

const visitorsConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--color-special-chart-sky)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--color-special-chart-magenta)",
  },
} satisfies ChartConfig;

function VisitorsAreaChart({ showLegend = false }: { showLegend?: boolean }) {
  return (
    <ChartContainer config={visitorsConfig} className="min-h-[200px] w-full max-w-lg">
      <AreaChart accessibilityLayer data={visitorsData}>
        <defs>
          <AreaGradient id="fillDesktop" color="var(--color-desktop)" />
          <AreaGradient id="fillMobile" color="var(--color-mobile)" />
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
        <Area
          type="natural"
          dataKey="desktop"
          stroke="var(--color-desktop)"
          fill="url(#fillDesktop)"
        />
        <Area
          type="natural"
          dataKey="mobile"
          stroke="var(--color-mobile)"
          fill="url(#fillMobile)"
        />
      </AreaChart>
    </ChartContainer>
  );
}

export const Stacked: Story = {
  render: () => <VisitorsAreaChart />,
};

export const WithLegend: Story = {
  render: () => <VisitorsAreaChart showLegend />,
};

const linearData = [
  { month: "Jan", value: 1200 },
  { month: "Feb", value: 1800 },
  { month: "Mar", value: 1400 },
  { month: "Apr", value: 2600 },
  { month: "May", value: 2200 },
  { month: "Jun", value: 3100 },
];

const linearConfig = {
  value: {
    label: "Value",
    color: "var(--color-special-chart-orange)",
  },
} satisfies ChartConfig;

export const Linear: Story = {
  render: () => (
    <ChartContainer config={linearConfig} className="min-h-[200px] w-full max-w-lg">
      <AreaChart accessibilityLayer data={linearData}>
        <defs>
          <AreaGradient id="fillLinear" color="var(--color-value)" />
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area type="linear" dataKey="value" stroke="var(--color-value)" fill="url(#fillLinear)" />
      </AreaChart>
    </ChartContainer>
  ),
};

const gradientData = [
  { month: "Jan", subscribers: 320 },
  { month: "Feb", subscribers: 480 },
  { month: "Mar", subscribers: 610 },
  { month: "Apr", subscribers: 540 },
  { month: "May", subscribers: 720 },
  { month: "Jun", subscribers: 890 },
  { month: "Jul", subscribers: 1040 },
  { month: "Aug", subscribers: 960 },
];

const gradientConfig = {
  subscribers: {
    label: "Subscribers",
    color: "var(--color-special-chart-purple)",
  },
} satisfies ChartConfig;

export const GradientFill: Story = {
  render: () => (
    <ChartContainer config={gradientConfig} className="min-h-[200px] w-full max-w-lg">
      <AreaChart accessibilityLayer data={gradientData}>
        <defs>
          <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-subscribers)" stopOpacity={0.9} />
            <stop offset="50%" stopColor="var(--color-subscribers)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="var(--color-subscribers)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="natural"
          dataKey="subscribers"
          stroke="var(--color-subscribers)"
          strokeWidth={2}
          fill="url(#fillGradient)"
        />
      </AreaChart>
    </ChartContainer>
  ),
};

const multiSeriesData = [
  { month: "Jan", revenue: 4200, expenses: 2800, profit: 1400 },
  { month: "Feb", revenue: 3800, expenses: 2600, profit: 1200 },
  { month: "Mar", revenue: 5100, expenses: 3200, profit: 1900 },
  { month: "Apr", revenue: 4600, expenses: 3000, profit: 1600 },
  { month: "May", revenue: 5800, expenses: 3400, profit: 2400 },
  { month: "Jun", revenue: 6200, expenses: 3600, profit: 2600 },
  { month: "Jul", revenue: 5400, expenses: 3100, profit: 2300 },
  { month: "Aug", revenue: 6800, expenses: 3800, profit: 3000 },
];

const multiSeriesConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--color-special-chart-teal)",
  },
  expenses: {
    label: "Expenses",
    color: "var(--color-special-chart-pink)",
  },
  profit: {
    label: "Profit",
    color: "var(--color-special-chart-sky)",
  },
} satisfies ChartConfig;

export const MultiSeries: Story = {
  render: () => (
    <ChartContainer config={multiSeriesConfig} className="min-h-[200px] w-full max-w-lg">
      <AreaChart accessibilityLayer data={multiSeriesData}>
        <defs>
          <AreaGradient id="fillRevenue" color="var(--color-revenue)" />
          <AreaGradient id="fillExpenses" color="var(--color-expenses)" />
          <AreaGradient id="fillProfit" color="var(--color-profit)" />
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="natural"
          dataKey="revenue"
          stroke="var(--color-revenue)"
          fill="url(#fillRevenue)"
        />
        <Area
          type="natural"
          dataKey="expenses"
          stroke="var(--color-expenses)"
          fill="url(#fillExpenses)"
        />
        <Area
          type="natural"
          dataKey="profit"
          stroke="var(--color-profit)"
          fill="url(#fillProfit)"
        />
      </AreaChart>
    </ChartContainer>
  ),
};
