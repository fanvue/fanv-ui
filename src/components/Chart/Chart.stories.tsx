import type { Meta, StoryObj } from "@storybook/react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./Chart";

const meta: Meta<typeof ChartContainer> = {
  title: "Charts/ChartContainer",
  component: ChartContainer,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
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
  desktop: {
    label: "Desktop",
    color: "var(--color-special-chart-purple)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--color-special-chart-teal)",
  },
} satisfies ChartConfig;

const multiSeriesData = [
  { month: "Jan", revenue: 4200, expenses: 2800, profit: 1400 },
  { month: "Feb", revenue: 5100, expenses: 3200, profit: 1900 },
  { month: "Mar", revenue: 4800, expenses: 2900, profit: 1900 },
  { month: "Apr", revenue: 6200, expenses: 3500, profit: 2700 },
  { month: "May", revenue: 5900, expenses: 3100, profit: 2800 },
  { month: "Jun", revenue: 7100, expenses: 3800, profit: 3300 },
];

const multiSeriesConfig = {
  revenue: { label: "Revenue", color: "var(--color-special-chart-teal)" },
  expenses: { label: "Expenses", color: "var(--color-special-chart-orange)" },
  profit: { label: "Profit", color: "var(--color-special-chart-sky)" },
} satisfies ChartConfig;

export const SmallChart: Story = {
  name: "Responsive - Small (320px)",
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    config: twoSeriesConfig,
    className: "min-h-[200px] w-full",
    children: (
      <BarChart accessibilityLayer data={monthlyData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={8} axisLine={false} fontSize={10} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    ),
  },
};

export const MediumChart: Story = {
  name: "Responsive - Medium (480px)",
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    config: twoSeriesConfig,
    className: "min-h-[250px] w-full",
    children: (
      <LineChart accessibilityLayer data={monthlyData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="desktop"
          type="monotone"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="mobile"
          type="monotone"
          stroke="var(--color-mobile)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    ),
  },
};

export const LargeChart: Story = {
  name: "Responsive - Large (800px)",
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 800 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    config: multiSeriesConfig,
    className: "min-h-[400px] w-full",
    children: (
      <AreaChart accessibilityLayer data={multiSeriesData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <defs>
          <linearGradient id="fillRevenueLg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillExpensesLg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-expenses)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-expenses)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area
          dataKey="revenue"
          type="natural"
          fill="url(#fillRevenueLg)"
          stroke="var(--color-revenue)"
          strokeWidth={2}
        />
        <Area
          dataKey="expenses"
          type="natural"
          fill="url(#fillExpensesLg)"
          stroke="var(--color-expenses)"
          strokeWidth={2}
        />
      </AreaChart>
    ),
  },
};
