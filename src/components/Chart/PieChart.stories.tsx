import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import { ChartCenterLabel } from "./ChartCenterLabel";
import { ChartContainer } from "./ChartContainer";
import { ChartLegend, ChartLegendContent } from "./ChartLegend";
import { ChartTooltip, ChartTooltipContent } from "./ChartTooltip";
import type { ChartConfig } from "./types";

const meta = {
  title: "Components/Charts/PieChart",
  component: ChartContainer,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof ChartContainer>;

const chartConfig = {
  subscriptions: {
    label: "Subscriptions",
    color: "var(--color-special-chart-teal)",
  },
  messages: {
    label: "Messages",
    color: "var(--color-special-chart-sky)",
  },
  posts: {
    label: "Posts",
    color: "var(--color-special-chart-magenta)",
  },
  tips: {
    label: "Tips",
    color: "var(--color-special-chart-orange)",
  },
  referrals: {
    label: "Referrals",
    color: "var(--color-special-chart-gray)",
  },
} satisfies ChartConfig;

const data = [
  { name: "subscriptions", value: 4500, fill: "var(--color-subscriptions)" },
  { name: "messages", value: 2100, fill: "var(--color-messages)" },
  { name: "posts", value: 1800, fill: "var(--color-posts)" },
  { name: "tips", value: 1200, fill: "var(--color-tips)" },
  { name: "referrals", value: 600, fill: "var(--color-referrals)" },
];

const total = data.reduce((sum, d) => sum + d.value, 0);

export const Default: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square w-[300px]">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie data={data} dataKey="value" nameKey="name" />
      </PieChart>
    </ChartContainer>
  ),
};

export const Donut: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square w-[300px]">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100}>
          <Label
            content={({ viewBox }) => (
              <ChartCenterLabel viewBox={viewBox} value={total.toLocaleString()} subtitle="Total" />
            )}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  ),
};

export const SemiCircleDonut: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="mx-auto aspect-[2/1] w-[300px]">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          startAngle={180}
          endAngle={0}
          innerRadius={60}
          outerRadius={80}
          cy="80%"
          cornerRadius={4}
        >
          <Label
            content={({ viewBox }) => (
              <ChartCenterLabel viewBox={viewBox} value={total.toLocaleString()} subtitle="Total" />
            )}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  ),
};

export const WithLegend: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square w-[300px]">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie data={data} dataKey="value" nameKey="name" />
        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
      </PieChart>
    </ChartContainer>
  ),
};

function InteractivePie() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = data[activeIndex];

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square w-[300px]">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={100}
          activeShape={({
            cx,
            cy,
            innerRadius,
            outerRadius,
            startAngle,
            endAngle,
            fill,
          }: PieSectorDataItem) => (
            <g>
              <Sector
                cx={cx as number}
                cy={cy as number}
                innerRadius={innerRadius as number}
                outerRadius={(outerRadius as number) + 10}
                startAngle={startAngle as number}
                endAngle={endAngle as number}
                fill={fill as string}
              />
            </g>
          )}
          onMouseEnter={(_, index) => setActiveIndex(index)}
        >
          <Label
            content={({ viewBox }) => (
              <ChartCenterLabel
                viewBox={viewBox}
                value={activeItem?.value.toLocaleString() ?? ""}
                subtitle={
                  activeItem
                    ? chartConfig[activeItem.name as keyof typeof chartConfig]?.label
                    : undefined
                }
              />
            )}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

export const Interactive: Story = {
  render: () => <InteractivePie />,
};
