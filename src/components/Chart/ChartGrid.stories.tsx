import type { Meta, StoryObj } from "@storybook/react";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer } from "./ChartContainer";
import { ChartGrid, chartGridYDomain } from "./ChartGrid";
import { ChartTooltip, ChartTooltipContent } from "./ChartTooltip";
import type { ChartConfig } from "./types";

const meta = {
  title: "Components/Charts/ChartGrid",
  component: ChartGrid,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof ChartGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const config = {
  net: { label: "Net earnings", color: "var(--color-special-chart-teal)" },
} satisfies ChartConfig;

const DAYS = ["Mar 1", "Mar 2", "Mar 3", "Mar 4", "Mar 5", "Mar 6", "Mar 7"];

function NetEarningsChart({ values }: { values: number[] }) {
  return (
    <ChartContainer config={config} className="min-h-[200px] w-full max-w-lg">
      <LineChart accessibilityLayer data={values.map((net, i) => ({ day: DAYS[i], net }))}>
        <ChartGrid />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis domain={chartGridYDomain} tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="net" stroke="var(--color-net)" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  );
}

export const PositiveValues: Story = {
  render: () => <NetEarningsChart values={[142, 189, 234, 178, 295, 312, 267]} />,
};

export const MixedValues: Story = {
  render: () => <NetEarningsChart values={[42, 18, -24, -61, 12, 75, 38]} />,
};

export const AllNegative: Story = {
  render: () => <NetEarningsChart values={[-120, -145, -130, -160, -138, -152, -125]} />,
};
