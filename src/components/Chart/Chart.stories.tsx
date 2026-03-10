import type { Meta, StoryObj } from "@storybook/react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
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
    color: "var(--color-chart-50)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--color-chart-100)",
  },
} satisfies ChartConfig;

export const BarChartDefault: Story = {
  name: "Bar Chart",
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

export const BarChartStacked: Story = {
  name: "Bar Chart - Stacked",
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

export const AreaChartDefault: Story = {
  name: "Area Chart",
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
          <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area
          dataKey="mobile"
          type="natural"
          fill="url(#fillMobile)"
          stroke="var(--color-mobile)"
          stackId="a"
        />
        <Area
          dataKey="desktop"
          type="natural"
          fill="url(#fillDesktop)"
          stroke="var(--color-desktop)"
          stackId="a"
        />
      </AreaChart>
    ),
  },
};

export const AreaChartStacked: Story = {
  name: "Area Chart - Stacked",
  args: {
    config: twoSeriesConfig,
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
      </AreaChart>
    ),
  },
};

export const LineChartDefault: Story = {
  name: "Line Chart",
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

export const LineChartWithDots: Story = {
  name: "Line Chart - With Dots",
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

const pieData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

const pieConfig = {
  visitors: { label: "Visitors" },
  chrome: { label: "Chrome", color: "var(--color-chart-50)" },
  safari: { label: "Safari", color: "var(--color-chart-100)" },
  firefox: { label: "Firefox", color: "var(--color-chart-200)" },
  edge: { label: "Edge", color: "var(--color-chart-300)" },
  other: { label: "Other", color: "var(--color-chart-400)" },
} satisfies ChartConfig;

export const PieChartDonut: Story = {
  name: "Pie Chart - Donut",
  args: {
    config: pieConfig,
    className: "mx-auto aspect-square max-h-[300px]",
    children: (
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie data={pieData} dataKey="visitors" nameKey="browser" innerRadius={60} strokeWidth={5}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-body-100 font-bold text-3xl"
                    >
                      {pieData.reduce((sum, d) => sum + d.visitors, 0).toLocaleString()}
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-body-200">
                      Visitors
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    ),
  },
};

export const PieChartSimple: Story = {
  name: "Pie Chart - Simple",
  args: {
    config: pieConfig,
    className: "mx-auto aspect-square max-h-[300px]",
    children: (
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie data={pieData} dataKey="visitors" nameKey="browser" />
      </PieChart>
    ),
  },
};

const radarData = [
  { skill: "Design", score: 86, average: 65 },
  { skill: "Code", score: 95, average: 70 },
  { skill: "Testing", score: 72, average: 68 },
  { skill: "DevOps", score: 60, average: 55 },
  { skill: "Planning", score: 82, average: 72 },
  { skill: "Comms", score: 78, average: 60 },
];

const radarConfig = {
  score: { label: "Your Score", color: "var(--color-chart-50)" },
  average: { label: "Average", color: "var(--color-chart-200)" },
} satisfies ChartConfig;

export const RadarChartDefault: Story = {
  name: "Radar Chart",
  args: {
    config: radarConfig,
    className: "mx-auto aspect-square max-h-[300px]",
    children: (
      <RadarChart data={radarData}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <PolarAngleAxis dataKey="skill" />
        <PolarGrid />
        <Radar
          dataKey="score"
          fill="var(--color-score)"
          fillOpacity={0.6}
          dot={{ r: 4, fillOpacity: 1 }}
        />
        <Radar dataKey="average" fill="var(--color-average)" fillOpacity={0.3} />
        <ChartLegend className="mt-8" content={<ChartLegendContent />} />
      </RadarChart>
    ),
  },
};

const multiSeriesData = [
  { month: "Jan", revenue: 4200, expenses: 2800, profit: 1400 },
  { month: "Feb", revenue: 5100, expenses: 3200, profit: 1900 },
  { month: "Mar", revenue: 4800, expenses: 2900, profit: 1900 },
  { month: "Apr", revenue: 6200, expenses: 3500, profit: 2700 },
  { month: "May", revenue: 5900, expenses: 3100, profit: 2800 },
  { month: "Jun", revenue: 7100, expenses: 3800, profit: 3300 },
];

const multiSeriesConfig = {
  revenue: { label: "Revenue", color: "var(--color-chart-50)" },
  expenses: { label: "Expenses", color: "var(--color-chart-300)" },
  profit: { label: "Profit", color: "var(--color-chart-600)" },
} satisfies ChartConfig;

export const BarChartHorizontal: Story = {
  name: "Bar Chart - Horizontal",
  args: {
    config: multiSeriesConfig,
    className: "min-h-[300px] w-full",
    children: (
      <BarChart accessibilityLayer data={multiSeriesData} layout="vertical" margin={{ left: 0 }}>
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

export const LineChartMultiSeries: Story = {
  name: "Line Chart - Multi Series",
  args: {
    config: multiSeriesConfig,
    className: "min-h-[300px] w-full",
    children: (
      <LineChart accessibilityLayer data={multiSeriesData}>
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

const singleSeriesConfig = {
  value: {
    label: "Subscribers",
    color: "var(--color-chart-600)",
  },
} satisfies ChartConfig;

const singleSeriesData = [
  { month: "Jan", value: 120 },
  { month: "Feb", value: 180 },
  { month: "Mar", value: 250 },
  { month: "Apr", value: 310 },
  { month: "May", value: 420 },
  { month: "Jun", value: 580 },
];

export const AreaChartSingle: Story = {
  name: "Area Chart - Single Series",
  args: {
    config: singleSeriesConfig,
    className: "min-h-[300px] w-full",
    children: (
      <AreaChart accessibilityLayer data={singleSeriesData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <defs>
          <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area
          dataKey="value"
          type="natural"
          fill="url(#fillValue)"
          stroke="var(--color-value)"
          strokeWidth={2}
        />
      </AreaChart>
    ),
  },
};

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
