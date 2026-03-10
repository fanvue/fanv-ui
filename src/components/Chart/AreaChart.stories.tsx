import type { Meta, StoryObj } from "@storybook/react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./Chart";

const meta: Meta<typeof ChartContainer> = {
  title: "Charts/Area Chart",
  component: ChartContainer,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-3xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const monthlyData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

const twoSeriesConfig = {
  desktop: { label: "Desktop", color: "var(--color-special-chart-teal)" },
  mobile: { label: "Mobile", color: "var(--color-special-chart-orange)" },
} satisfies ChartConfig;

export const Default: Story = {
  args: {
    config: twoSeriesConfig,
    className: "min-h-[300px] w-full",
    children: (
      <AreaChart accessibilityLayer data={monthlyData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <defs>
          <linearGradient id="areaFillDesktop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="areaFillMobile" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area
          dataKey="mobile"
          type="natural"
          fill="url(#areaFillMobile)"
          stroke="var(--color-mobile)"
          stackId="a"
        />
        <Area
          dataKey="desktop"
          type="natural"
          fill="url(#areaFillDesktop)"
          stroke="var(--color-desktop)"
          stackId="a"
        />
      </AreaChart>
    ),
  },
};

export const Stacked: Story = {
  args: {
    config: {
      desktop: { label: "Desktop", color: "var(--color-special-chart-purple)" },
      mobile: { label: "Mobile", color: "var(--color-special-chart-sky)" },
    } satisfies ChartConfig,
    className: "min-h-[300px] w-full",
    children: (
      <AreaChart accessibilityLayer data={monthlyData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        <Area
          dataKey="mobile"
          type="natural"
          fill="var(--color-mobile)"
          fillOpacity={0.4}
          stroke="var(--color-mobile)"
          stackId="a"
        />
        <Area
          dataKey="desktop"
          type="natural"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
          stroke="var(--color-desktop)"
          stackId="a"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    ),
  },
};

const singleData = [
  { month: "Jan", value: 120 },
  { month: "Feb", value: 180 },
  { month: "Mar", value: 250 },
  { month: "Apr", value: 310 },
  { month: "May", value: 420 },
  { month: "Jun", value: 580 },
];

const singleConfig = {
  value: { label: "Subscribers", color: "var(--color-special-chart-sky)" },
} satisfies ChartConfig;

export const Single: Story = {
  args: {
    config: singleConfig,
    className: "min-h-[300px] w-full",
    children: (
      <AreaChart accessibilityLayer data={singleData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <defs>
          <linearGradient id="areaFillSingle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area
          dataKey="value"
          type="natural"
          fill="url(#areaFillSingle)"
          stroke="var(--color-value)"
          strokeWidth={2}
        />
      </AreaChart>
    ),
  },
};

export const Step: Story = {
  args: {
    config: {
      desktop: { label: "Desktop", color: "var(--color-special-chart-purple)" },
      mobile: { label: "Mobile", color: "var(--color-special-chart-pink)" },
    } satisfies ChartConfig,
    className: "min-h-[300px] w-full",
    children: (
      <AreaChart accessibilityLayer data={monthlyData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="desktop"
          type="step"
          fill="var(--color-desktop)"
          fillOpacity={0.3}
          stroke="var(--color-desktop)"
          strokeWidth={2}
        />
        <Area
          dataKey="mobile"
          type="step"
          fill="var(--color-mobile)"
          fillOpacity={0.3}
          stroke="var(--color-mobile)"
          strokeWidth={2}
        />
      </AreaChart>
    ),
  },
};

export const Gradient: Story = {
  args: {
    config: {
      value: { label: "Revenue", color: "var(--color-special-chart-magenta)" },
    } satisfies ChartConfig,
    className: "min-h-[300px] w-full",
    children: (
      <AreaChart accessibilityLayer data={singleData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.6} />
            <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          dataKey="value"
          type="monotone"
          fill="url(#areaGradient)"
          stroke="var(--color-value)"
          strokeWidth={2}
        />
      </AreaChart>
    ),
  },
};
