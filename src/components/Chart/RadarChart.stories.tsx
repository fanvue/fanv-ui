import type { Meta, StoryObj } from "@storybook/react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./Chart";

const meta: Meta<typeof ChartContainer> = {
  title: "Charts/Radar Chart",
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

const skillData = [
  { skill: "Design", score: 86, average: 65 },
  { skill: "Code", score: 95, average: 70 },
  { skill: "Testing", score: 72, average: 68 },
  { skill: "DevOps", score: 60, average: 55 },
  { skill: "Planning", score: 82, average: 72 },
  { skill: "Comms", score: 78, average: 60 },
];

const twoSeriesConfig = {
  score: { label: "Your Score", color: "var(--color-special-chart-sky)" },
  average: { label: "Average", color: "var(--color-special-chart-pink)" },
} satisfies ChartConfig;

export const Default: Story = {
  args: {
    config: twoSeriesConfig,
    className: "mx-auto aspect-square max-h-[300px]",
    children: (
      <RadarChart data={skillData}>
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

export const LinesOnly: Story = {
  args: {
    config: twoSeriesConfig,
    className: "mx-auto aspect-square max-h-[300px]",
    children: (
      <RadarChart data={skillData}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <PolarAngleAxis dataKey="skill" />
        <PolarGrid />
        <Radar dataKey="score" fill="none" stroke="var(--color-score)" strokeWidth={2} />
        <Radar
          dataKey="average"
          fill="none"
          stroke="var(--color-average)"
          strokeWidth={2}
          strokeDasharray="5 5"
        />
        <ChartLegend className="mt-8" content={<ChartLegendContent />} />
      </RadarChart>
    ),
  },
};

export const WithDots: Story = {
  args: {
    config: {
      score: { label: "Score", color: "var(--color-special-chart-purple)" },
    } satisfies ChartConfig,
    className: "mx-auto aspect-square max-h-[300px]",
    children: (
      <RadarChart data={skillData}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <PolarAngleAxis dataKey="skill" />
        <PolarGrid />
        <Radar
          dataKey="score"
          fill="var(--color-score)"
          fillOpacity={0.4}
          stroke="var(--color-score)"
          strokeWidth={2}
          dot={{ r: 4, fill: "var(--color-score)", fillOpacity: 1 }}
        />
      </RadarChart>
    ),
  },
};

const multiData = [
  { metric: "Speed", frontend: 90, backend: 70, infra: 85 },
  { metric: "Quality", frontend: 75, backend: 95, infra: 80 },
  { metric: "Uptime", frontend: 88, backend: 92, infra: 99 },
  { metric: "Security", frontend: 60, backend: 85, infra: 95 },
  { metric: "Scale", frontend: 70, backend: 80, infra: 90 },
  { metric: "DX", frontend: 95, backend: 65, infra: 50 },
];

const multiConfig = {
  frontend: { label: "Frontend", color: "var(--color-special-chart-sky)" },
  backend: { label: "Backend", color: "var(--color-special-chart-teal)" },
  infra: { label: "Infra", color: "var(--color-special-chart-orange)" },
} satisfies ChartConfig;

export const MultiSeries: Story = {
  args: {
    config: multiConfig,
    className: "mx-auto aspect-square max-h-[350px]",
    children: (
      <RadarChart data={multiData}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <PolarAngleAxis dataKey="metric" />
        <PolarGrid />
        <Radar
          dataKey="frontend"
          fill="var(--color-frontend)"
          fillOpacity={0.3}
          stroke="var(--color-frontend)"
          strokeWidth={2}
        />
        <Radar
          dataKey="backend"
          fill="var(--color-backend)"
          fillOpacity={0.3}
          stroke="var(--color-backend)"
          strokeWidth={2}
        />
        <Radar
          dataKey="infra"
          fill="var(--color-infra)"
          fillOpacity={0.3}
          stroke="var(--color-infra)"
          strokeWidth={2}
        />
        <ChartLegend className="mt-8" content={<ChartLegendContent />} />
      </RadarChart>
    ),
  },
};

export const WithRadius: Story = {
  args: {
    config: {
      score: { label: "Score", color: "var(--color-special-chart-magenta)" },
    } satisfies ChartConfig,
    className: "mx-auto aspect-square max-h-[300px]",
    children: (
      <RadarChart data={skillData}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <PolarAngleAxis dataKey="skill" />
        <PolarGrid radialLines={false} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          dataKey="score"
          fill="var(--color-score)"
          fillOpacity={0.5}
          stroke="var(--color-score)"
          strokeWidth={2}
        />
      </RadarChart>
    ),
  },
};
