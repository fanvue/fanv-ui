import type { Meta, StoryObj } from "@storybook/react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./Chart";

const meta: Meta<typeof ChartContainer> = {
  title: "Charts/Line Chart",
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
  desktop: { label: "Desktop", color: "var(--color-special-chart-sky)" },
  mobile: { label: "Mobile", color: "var(--color-special-chart-pink)" },
} satisfies ChartConfig;

export const Default: Story = {
  args: {
    config: twoSeriesConfig,
    className: "min-h-[300px] w-full",
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

export const WithDots: Story = {
  args: {
    config: twoSeriesConfig,
    className: "min-h-[300px] w-full",
    children: (
      <LineChart accessibilityLayer data={monthlyData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Line
          dataKey="desktop"
          type="natural"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={{ fill: "var(--color-desktop)" }}
          activeDot={{ r: 6 }}
        />
        <Line
          dataKey="mobile"
          type="natural"
          stroke="var(--color-mobile)"
          strokeWidth={2}
          dot={{ fill: "var(--color-mobile)" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    ),
  },
};

const multiData = [
  { month: "Jan", revenue: 4200, expenses: 2800, profit: 1400 },
  { month: "Feb", revenue: 5100, expenses: 3200, profit: 1900 },
  { month: "Mar", revenue: 4800, expenses: 2900, profit: 1900 },
  { month: "Apr", revenue: 6200, expenses: 3500, profit: 2700 },
  { month: "May", revenue: 5900, expenses: 3100, profit: 2800 },
  { month: "Jun", revenue: 7100, expenses: 3800, profit: 3300 },
];

const multiConfig = {
  revenue: { label: "Revenue", color: "var(--color-special-chart-teal)" },
  expenses: { label: "Expenses", color: "var(--color-special-chart-orange)" },
  profit: { label: "Profit", color: "var(--color-special-chart-sky)" },
} satisfies ChartConfig;

export const MultiSeries: Story = {
  args: {
    config: multiConfig,
    className: "min-h-[300px] w-full",
    children: (
      <LineChart accessibilityLayer data={multiData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="revenue"
          type="monotone"
          stroke="var(--color-revenue)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="expenses"
          type="monotone"
          stroke="var(--color-expenses)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="profit"
          type="monotone"
          stroke="var(--color-profit)"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
        />
      </LineChart>
    ),
  },
};

export const Linear: Story = {
  args: {
    config: twoSeriesConfig,
    className: "min-h-[300px] w-full",
    children: (
      <LineChart accessibilityLayer data={monthlyData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="desktop"
          type="linear"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={{ fill: "var(--color-desktop)", r: 3 }}
        />
        <Line
          dataKey="mobile"
          type="linear"
          stroke="var(--color-mobile)"
          strokeWidth={2}
          dot={{ fill: "var(--color-mobile)", r: 3 }}
        />
      </LineChart>
    ),
  },
};

export const Step: Story = {
  args: {
    config: {
      desktop: { label: "Desktop", color: "var(--color-special-chart-purple)" },
      mobile: { label: "Mobile", color: "var(--color-special-chart-magenta)" },
    } satisfies ChartConfig,
    className: "min-h-[300px] w-full",
    children: (
      <LineChart accessibilityLayer data={monthlyData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="desktop"
          type="step"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="mobile"
          type="step"
          stroke="var(--color-mobile)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    ),
  },
};
