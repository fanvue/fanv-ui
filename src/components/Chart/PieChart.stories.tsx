import type { Meta, StoryObj } from "@storybook/react";
import { Label, Pie, PieChart } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./Chart";

const meta: Meta<typeof ChartContainer> = {
  title: "Charts/Pie Chart",
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

const browserData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

const pieConfig = {
  visitors: { label: "Visitors" },
  chrome: { label: "Chrome", color: "var(--color-special-chart-purple)" },
  safari: { label: "Safari", color: "var(--color-special-chart-teal)" },
  firefox: { label: "Firefox", color: "var(--color-special-chart-sky)" },
  edge: { label: "Edge", color: "var(--color-special-chart-pink)" },
  other: { label: "Other", color: "var(--color-special-chart-orange)" },
} satisfies ChartConfig;

export const Donut: Story = {
  args: {
    config: pieConfig,
    className: "mx-auto aspect-square max-h-[300px]",
    children: (
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={browserData}
          dataKey="visitors"
          nameKey="browser"
          innerRadius={60}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground-default font-bold text-3xl"
                    >
                      {browserData.reduce((sum, d) => sum + d.visitors, 0).toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-foreground-secondary"
                    >
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

export const Simple: Story = {
  args: {
    config: pieConfig,
    className: "mx-auto aspect-square max-h-[300px]",
    children: (
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie data={browserData} dataKey="visitors" nameKey="browser" />
      </PieChart>
    ),
  },
};

export const WithLegend: Story = {
  args: {
    config: pieConfig,
    className: "mx-auto aspect-square max-h-[350px]",
    children: (
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie data={browserData} dataKey="visitors" nameKey="browser" innerRadius={50} />
        <ChartLegend content={<ChartLegendContent nameKey="browser" />} />
      </PieChart>
    ),
  },
};

const categoryData = [
  { category: "food", amount: 450, fill: "var(--color-food)" },
  { category: "rent", amount: 1200, fill: "var(--color-rent)" },
  { category: "transport", amount: 180, fill: "var(--color-transport)" },
  { category: "entertainment", amount: 320, fill: "var(--color-entertainment)" },
];

const categoryConfig = {
  amount: { label: "Amount" },
  food: { label: "Food", color: "var(--color-special-chart-teal)" },
  rent: { label: "Rent", color: "var(--color-special-chart-purple)" },
  transport: { label: "Transport", color: "var(--color-special-chart-sky)" },
  entertainment: { label: "Entertainment", color: "var(--color-special-chart-magenta)" },
} satisfies ChartConfig;

export const HalfCircle: Story = {
  args: {
    config: categoryConfig,
    className: "mx-auto aspect-[2/1] max-h-[200px]",
    children: (
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={categoryData}
          dataKey="amount"
          nameKey="category"
          startAngle={180}
          endAngle={0}
          innerRadius={60}
          outerRadius={100}
        />
        <ChartLegend content={<ChartLegendContent nameKey="category" />} />
      </PieChart>
    ),
  },
};

const innerData = [
  { name: "q1", value: 1200, fill: "var(--color-special-chart-purple)" },
  { name: "q2", value: 1500, fill: "var(--color-special-chart-sky)" },
  { name: "q3", value: 900, fill: "var(--color-special-chart-teal)" },
  { name: "q4", value: 1800, fill: "var(--color-special-chart-pink)" },
];

const outerData = [
  { name: "online", value: 3200, fill: "var(--color-special-chart-orange)" },
  { name: "offline", value: 2200, fill: "var(--color-special-chart-gray)" },
];

const nestedConfig = {
  value: { label: "Revenue" },
  q1: { label: "Q1", color: "var(--color-special-chart-purple)" },
  q2: { label: "Q2", color: "var(--color-special-chart-sky)" },
  q3: { label: "Q3", color: "var(--color-special-chart-teal)" },
  q4: { label: "Q4", color: "var(--color-special-chart-pink)" },
  online: { label: "Online", color: "var(--color-special-chart-orange)" },
  offline: { label: "Offline", color: "var(--color-special-chart-gray)" },
} satisfies ChartConfig;

export const Nested: Story = {
  args: {
    config: nestedConfig,
    className: "mx-auto aspect-square max-h-[300px]",
    children: (
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie data={innerData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} />
        <Pie data={outerData} dataKey="value" nameKey="name" innerRadius={80} outerRadius={100} />
      </PieChart>
    ),
  },
};
