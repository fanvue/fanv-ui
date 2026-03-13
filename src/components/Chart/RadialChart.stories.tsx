import type { Meta, StoryObj } from "@storybook/react";
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./Chart";

const meta: Meta<typeof ChartContainer> = {
  title: "Charts/Radial Chart",
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

const progressData = [{ progress: 72, fill: "var(--color-progress)" }];

const progressConfig = {
  progress: { label: "Progress", color: "var(--color-special-chart-purple)" },
} satisfies ChartConfig;

export const Default: Story = {
  args: {
    config: progressConfig,
    className: "mx-auto aspect-square max-h-[250px]",
    children: (
      <RadialBarChart
        data={progressData}
        startAngle={0}
        endAngle={250}
        innerRadius={80}
        outerRadius={110}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          polarRadius={[86, 74]}
          className="first:fill-neutral-100 last:fill-surface-page"
        />
        <RadialBar dataKey="progress" background cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground-default font-bold text-4xl"
                    >
                      72%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-foreground-secondary"
                    >
                      Progress
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    ),
  },
};

const multiData = [
  { name: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { name: "safari", visitors: 200, fill: "var(--color-safari)" },
  { name: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { name: "edge", visitors: 173, fill: "var(--color-edge)" },
];

const multiConfig = {
  visitors: { label: "Visitors" },
  chrome: { label: "Chrome", color: "var(--color-special-chart-purple)" },
  safari: { label: "Safari", color: "var(--color-special-chart-teal)" },
  firefox: { label: "Firefox", color: "var(--color-special-chart-sky)" },
  edge: { label: "Edge", color: "var(--color-special-chart-orange)" },
} satisfies ChartConfig;

export const Stacked: Story = {
  args: {
    config: multiConfig,
    className: "mx-auto aspect-square max-h-[300px]",
    children: (
      <RadialBarChart data={multiData} innerRadius={30} outerRadius={110}>
        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
        <RadialBar dataKey="visitors" background />
      </RadialBarChart>
    ),
  },
};

const gaugeData = [{ value: 68, fill: "var(--color-value)" }];

const gaugeConfig = {
  value: { label: "Score", color: "var(--color-special-chart-teal)" },
} satisfies ChartConfig;

export const Gauge: Story = {
  args: {
    config: gaugeConfig,
    className: "mx-auto aspect-square max-h-[250px]",
    children: (
      <RadialBarChart
        data={gaugeData}
        startAngle={180}
        endAngle={180 - (68 / 100) * 360}
        innerRadius={80}
        outerRadius={110}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          polarRadius={[86, 74]}
          className="first:fill-neutral-100 last:fill-surface-page"
        />
        <RadialBar dataKey="value" background={false} cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground-default font-bold text-4xl"
                    >
                      68
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-foreground-secondary"
                    >
                      Score
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    ),
  },
};

const gridData = [
  { name: "storage", value: 78, fill: "var(--color-storage)" },
  { name: "cpu", value: 45, fill: "var(--color-cpu)" },
  { name: "memory", value: 62, fill: "var(--color-memory)" },
];

const gridConfig = {
  value: { label: "Usage" },
  storage: { label: "Storage", color: "var(--color-special-chart-magenta)" },
  cpu: { label: "CPU", color: "var(--color-special-chart-sky)" },
  memory: { label: "Memory", color: "var(--color-special-chart-pink)" },
} satisfies ChartConfig;

export const WithGrid: Story = {
  args: {
    config: gridConfig,
    className: "mx-auto aspect-square max-h-[300px]",
    children: (
      <RadialBarChart data={gridData} innerRadius={30} outerRadius={100}>
        <PolarGrid gridType="circle" />
        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
        <RadialBar dataKey="value" background cornerRadius={5} />
      </RadialBarChart>
    ),
  },
};
