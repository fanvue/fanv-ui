import type { Meta, StoryObj } from "@storybook/react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./Chart";

const meta: Meta<typeof ChartContainer> = {
  title: "Charts/Bar Chart",
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
  desktop: { label: "Desktop", color: "var(--color-special-chart-purple)" },
  mobile: { label: "Mobile", color: "var(--color-special-chart-teal)" },
} satisfies ChartConfig;

export const Default: Story = {
  args: {
    config: twoSeriesConfig,
    className: "min-h-[300px] w-full",
    children: (
      <BarChart accessibilityLayer data={monthlyData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    ),
  },
};

export const Stacked: Story = {
  args: {
    config: twoSeriesConfig,
    className: "min-h-[300px] w-full",
    children: (
      <BarChart accessibilityLayer data={monthlyData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" stackId="a" fill="var(--color-desktop)" radius={[0, 0, 4, 4]} />
        <Bar dataKey="mobile" stackId="a" fill="var(--color-mobile)" radius={[4, 4, 0, 0]} />
      </BarChart>
    ),
  },
};

const horizontalData = [
  { month: "Jan", revenue: 4200, expenses: 2800 },
  { month: "Feb", revenue: 5100, expenses: 3200 },
  { month: "Mar", revenue: 4800, expenses: 2900 },
  { month: "Apr", revenue: 6200, expenses: 3500 },
  { month: "May", revenue: 5900, expenses: 3100 },
  { month: "Jun", revenue: 7100, expenses: 3800 },
];

const horizontalConfig = {
  revenue: { label: "Revenue", color: "var(--color-special-chart-teal)" },
  expenses: { label: "Expenses", color: "var(--color-special-chart-orange)" },
} satisfies ChartConfig;

export const Horizontal: Story = {
  args: {
    config: horizontalConfig,
    className: "min-h-[300px] w-full",
    children: (
      <BarChart accessibilityLayer data={horizontalData} layout="vertical" margin={{ left: 0 }}>
        <CartesianGrid horizontal={false} />
        <YAxis dataKey="month" type="category" tickLine={false} tickMargin={10} axisLine={false} />
        <XAxis type="number" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
        <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
      </BarChart>
    ),
  },
};

const negativeData = [
  { month: "Jan", profit: 1400 },
  { month: "Feb", profit: 1900 },
  { month: "Mar", profit: -500 },
  { month: "Apr", profit: 2700 },
  { month: "May", profit: -200 },
  { month: "Jun", profit: 3300 },
];

const negativeConfig = {
  profit: { label: "Profit / Loss", color: "var(--color-special-chart-sky)" },
} satisfies ChartConfig;

export const Negative: Story = {
  args: {
    config: negativeConfig,
    className: "min-h-[300px] w-full",
    children: (
      <BarChart accessibilityLayer data={negativeData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="profit" fill="var(--color-profit)" radius={4} />
      </BarChart>
    ),
  },
};

const labelData = [
  { month: "Jan", visitors: 186 },
  { month: "Feb", visitors: 305 },
  { month: "Mar", visitors: 237 },
  { month: "Apr", visitors: 173 },
  { month: "May", visitors: 209 },
  { month: "Jun", visitors: 214 },
];

const labelConfig = {
  visitors: { label: "Visitors", color: "var(--color-special-chart-purple)" },
} satisfies ChartConfig;

export const WithLabels: Story = {
  args: {
    config: labelConfig,
    className: "min-h-[300px] w-full",
    children: (
      <BarChart accessibilityLayer data={labelData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="visitors" fill="var(--color-visitors)" radius={4}>
          <LabelList dataKey="visitors" position="top" className="fill-foreground-default" />
        </Bar>
      </BarChart>
    ),
  },
};

const singleConfig = {
  visitors: { label: "Visitors", color: "var(--color-special-chart-teal)" },
} satisfies ChartConfig;

export const Single: Story = {
  args: {
    config: singleConfig,
    className: "min-h-[300px] w-full",
    children: (
      <BarChart accessibilityLayer data={labelData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="visitors" fill="var(--color-visitors)" radius={8} />
      </BarChart>
    ),
  },
};
