import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { ChartCenterLabel } from "./ChartCenterLabel";
import { ChartContainer } from "./ChartContainer";
import { ChartLegend, ChartLegendContent } from "./ChartLegend";
import { ChartTooltip, ChartTooltipContent } from "./ChartTooltip";
import type { ChartConfig } from "./types";

const meta = {
  title: "Components/Charts/RadialChart",
  component: ChartContainer,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof ChartContainer>;

const chartConfig = {
  photos: {
    label: "Photos",
    color: "var(--color-special-chart-teal)",
  },
  videos: {
    label: "Videos",
    color: "var(--color-special-chart-sky)",
  },
  messages: {
    label: "Messages",
    color: "var(--color-special-chart-magenta)",
  },
  tips: {
    label: "Tips",
    color: "var(--color-special-chart-orange)",
  },
  subscriptions: {
    label: "Subscriptions",
    color: "var(--color-special-chart-pink)",
  },
} satisfies ChartConfig;

const data = [
  { name: "photos", value: 340, fill: "var(--color-photos)" },
  { name: "videos", value: 210, fill: "var(--color-videos)" },
  { name: "messages", value: 185, fill: "var(--color-messages)" },
  { name: "tips", value: 120, fill: "var(--color-tips)" },
  { name: "subscriptions", value: 95, fill: "var(--color-subscriptions)" },
];

function DefaultRadialChart({ children }: { children?: ReactNode }) {
  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square w-[300px]">
      <RadialBarChart data={data} innerRadius={30} outerRadius={110}>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <RadialBar dataKey="value" background />
        {children}
      </RadialBarChart>
    </ChartContainer>
  );
}

export const Default: Story = {
  render: () => <DefaultRadialChart />,
};

const profileConfig = {
  completion: {
    label: "Completion",
    color: "var(--color-special-chart-teal)",
  },
} satisfies ChartConfig;

const PROFILE_VALUE = 78;
const profileData = [{ name: "completion", value: PROFILE_VALUE, fill: "var(--color-completion)" }];

export const WithLabel: Story = {
  render: () => (
    <ChartContainer config={profileConfig} className="mx-auto aspect-square w-[300px]">
      <RadialBarChart
        data={profileData}
        startAngle={90}
        endAngle={90 - 360 * (PROFILE_VALUE / 100)}
        innerRadius={80}
        outerRadius={110}
      >
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => (
              <ChartCenterLabel viewBox={viewBox} value={`${PROFILE_VALUE}%`} subtitle="Complete" />
            )}
          />
        </PolarRadiusAxis>
        <RadialBar dataKey="value" background cornerRadius={10} />
      </RadialBarChart>
    </ChartContainer>
  ),
};

const stackedConfig = {
  posts: {
    label: "Posts",
    color: "var(--color-special-chart-teal)",
  },
  engagement: {
    label: "Engagement",
    color: "var(--color-special-chart-sky)",
  },
  reach: {
    label: "Reach",
    color: "var(--color-special-chart-magenta)",
  },
} satisfies ChartConfig;

const stackedData = [{ name: "progress", posts: 72, engagement: 58, reach: 85 }];

export const Stacked: Story = {
  render: () => (
    <ChartContainer config={stackedConfig} className="mx-auto aspect-square w-[300px]">
      <RadialBarChart data={stackedData} innerRadius={30} outerRadius={110}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <RadialBar
          dataKey="posts"
          stackId="stack"
          fill="var(--color-posts)"
          background
          className="stroke-2 stroke-transparent"
        />
        <RadialBar
          dataKey="engagement"
          stackId="stack"
          fill="var(--color-engagement)"
          className="stroke-2 stroke-transparent"
        />
        <RadialBar
          dataKey="reach"
          stackId="stack"
          fill="var(--color-reach)"
          className="stroke-2 stroke-transparent"
        />
      </RadialBarChart>
    </ChartContainer>
  ),
};

export const WithLegend: Story = {
  render: () => (
    <DefaultRadialChart>
      <ChartLegend content={<ChartLegendContent nameKey="name" />} />
    </DefaultRadialChart>
  ),
};

export const GridCircle: Story = {
  render: () => (
    <DefaultRadialChart>
      <PolarGrid gridType="circle" />
    </DefaultRadialChart>
  ),
};
