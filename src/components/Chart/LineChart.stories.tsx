import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer } from "./ChartContainer";
import { ChartLegend, ChartLegendContent } from "./ChartLegend";
import { ChartTooltip, ChartTooltipContent } from "./ChartTooltip";
import type { ChartConfig } from "./types";

const meta = {
  title: "Components/Charts/LineChart",
  component: ChartContainer,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof ChartContainer>;

const earningsData = [
  { day: "Mar 1", earnings: 142 },
  { day: "Mar 2", earnings: 189 },
  { day: "Mar 3", earnings: 234 },
  { day: "Mar 4", earnings: 178 },
  { day: "Mar 5", earnings: 295 },
  { day: "Mar 6", earnings: 312 },
  { day: "Mar 7", earnings: 267 },
  { day: "Mar 8", earnings: 345 },
  { day: "Mar 9", earnings: 289 },
  { day: "Mar 10", earnings: 378 },
  { day: "Mar 11", earnings: 412 },
  { day: "Mar 12", earnings: 356 },
  { day: "Mar 13", earnings: 423 },
  { day: "Mar 14", earnings: 389 },
];

const defaultConfig = {
  earnings: {
    label: "Total Earnings",
    color: "var(--color-special-chart-teal)",
  },
} satisfies ChartConfig;

function EarningsLineChart({
  lineProps,
  gridProps,
}: {
  lineProps?: Partial<ComponentProps<typeof Line>>;
  gridProps?: Partial<ComponentProps<typeof CartesianGrid>>;
}) {
  return (
    <ChartContainer config={defaultConfig} className="min-h-[200px] w-full max-w-lg">
      <LineChart accessibilityLayer data={earningsData}>
        <CartesianGrid vertical={false} {...gridProps} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="earnings"
          stroke="var(--color-earnings)"
          strokeWidth={2}
          dot={false}
          {...lineProps}
        />
      </LineChart>
    </ChartContainer>
  );
}

export const Default: Story = {
  render: () => <EarningsLineChart />,
};

const comparisonData = [
  { day: "Mar 1", current: 142, previous: 98 },
  { day: "Mar 2", current: 189, previous: 124 },
  { day: "Mar 3", current: 234, previous: 156 },
  { day: "Mar 4", current: 178, previous: 145 },
  { day: "Mar 5", current: 295, previous: 201 },
  { day: "Mar 6", current: 312, previous: 189 },
  { day: "Mar 7", current: 267, previous: 223 },
  { day: "Mar 8", current: 345, previous: 245 },
  { day: "Mar 9", current: 289, previous: 267 },
  { day: "Mar 10", current: 378, previous: 298 },
  { day: "Mar 11", current: 412, previous: 312 },
  { day: "Mar 12", current: 356, previous: 278 },
  { day: "Mar 13", current: 423, previous: 334 },
  { day: "Mar 14", current: 389, previous: 301 },
];

const comparisonConfig = {
  current: {
    label: "Current Period",
    color: "var(--color-special-chart-teal)",
  },
  previous: {
    label: "Previous Period",
    color: "var(--color-special-chart-gray)",
  },
} satisfies ChartConfig;

function ComparisonLineChart({ showLegend = false }: { showLegend?: boolean }) {
  return (
    <ChartContainer config={comparisonConfig} className="min-h-[200px] w-full max-w-lg">
      <LineChart accessibilityLayer data={comparisonData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
        <Line
          type="monotone"
          dataKey="current"
          stroke="var(--color-current)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="previous"
          stroke="var(--color-previous)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

export const CurrentVsPrevious: Story = {
  render: () => <ComparisonLineChart />,
};

const multiSeriesData = [
  {
    day: "Mar 1",
    subscription: 85,
    message: 23,
    post: 12,
    tip: 8,
    referral: 4,
    renewal: 6,
    other: 4,
  },
  {
    day: "Mar 3",
    subscription: 108,
    message: 41,
    post: 25,
    tip: 22,
    referral: 12,
    renewal: 15,
    other: 11,
  },
  {
    day: "Mar 5",
    subscription: 134,
    message: 52,
    post: 34,
    tip: 28,
    referral: 15,
    renewal: 18,
    other: 14,
  },
  {
    day: "Mar 8",
    subscription: 156,
    message: 56,
    post: 42,
    tip: 29,
    referral: 21,
    renewal: 24,
    other: 17,
  },
  {
    day: "Mar 11",
    subscription: 178,
    message: 68,
    post: 52,
    tip: 42,
    referral: 25,
    renewal: 28,
    other: 19,
  },
  {
    day: "Mar 14",
    subscription: 168,
    message: 63,
    post: 49,
    tip: 37,
    referral: 22,
    renewal: 31,
    other: 19,
  },
];

const multiSeriesConfig = {
  subscription: {
    label: "Subscription",
    color: "var(--color-special-chart-teal)",
  },
  message: {
    label: "Message",
    color: "var(--color-special-chart-sky)",
  },
  post: {
    label: "Post",
    color: "var(--color-special-chart-magenta)",
  },
  tip: {
    label: "Tip",
    color: "var(--color-special-chart-orange)",
  },
  referral: {
    label: "Referral",
    color: "var(--color-special-chart-pink)",
  },
  renewal: {
    label: "Renewal",
    color: "var(--color-special-chart-purple)",
  },
  other: {
    label: "Other",
    color: "var(--color-special-chart-gray)",
  },
} satisfies ChartConfig;

export const MultiSeries: Story = {
  render: () => (
    <ChartContainer config={multiSeriesConfig} className="min-h-[200px] w-full max-w-lg">
      <LineChart accessibilityLayer data={multiSeriesData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {Object.keys(multiSeriesConfig).map((key) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={`var(--color-${key})`}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  ),
};

const subscriberData = [
  { day: "Mar 1", total: 1245, new: 18, lost: 5 },
  { day: "Mar 2", total: 1258, new: 22, lost: 9 },
  { day: "Mar 3", total: 1271, new: 19, lost: 6 },
  { day: "Mar 4", total: 1284, new: 21, lost: 8 },
  { day: "Mar 5", total: 1297, new: 24, lost: 11 },
  { day: "Mar 6", total: 1310, new: 20, lost: 7 },
  { day: "Mar 7", total: 1323, new: 17, lost: 4 },
  { day: "Mar 8", total: 1336, new: 25, lost: 12 },
  { day: "Mar 9", total: 1349, new: 23, lost: 10 },
  { day: "Mar 10", total: 1362, new: 19, lost: 6 },
  { day: "Mar 11", total: 1375, new: 26, lost: 13 },
  { day: "Mar 12", total: 1388, new: 21, lost: 8 },
  { day: "Mar 13", total: 1401, new: 28, lost: 15 },
  { day: "Mar 14", total: 1414, new: 20, lost: 7 },
];

const subscriberConfig = {
  total: {
    label: "Total",
    color: "var(--color-special-chart-gray)",
  },
  new: {
    label: "New",
    color: "var(--color-special-chart-teal)",
  },
  lost: {
    label: "Lost",
    color: "var(--color-special-chart-pink)",
  },
} satisfies ChartConfig;

export const SubscribersOverTime: Story = {
  render: () => (
    <ChartContainer config={subscriberConfig} className="min-h-[200px] w-full max-w-lg">
      <LineChart accessibilityLayer data={subscriberData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {Object.keys(subscriberConfig).map((key) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={`var(--color-${key})`}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  ),
};

export const WithDots: Story = {
  render: () => <EarningsLineChart lineProps={{ dot: true }} />,
};

export const DashedGridLines: Story = {
  render: () => <EarningsLineChart gridProps={{ strokeDasharray: "5 3" }} />,
};

export const WithLegend: Story = {
  render: () => <ComparisonLineChart showLegend />,
};

export const LinearCurve: Story = {
  render: () => <EarningsLineChart lineProps={{ type: "linear" }} />,
};
