import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ChartCard } from "./ChartCard";
import { ChartLoadingOverlay } from "./ChartLoadingOverlay";
import { ChartPieLegend } from "./ChartPieLegend";
import { ChartSeriesToggle } from "./ChartSeriesToggle";
import { SimpleLineChart, simpleLineConfig } from "./chartStoryFixtures";

const meta = {
  title: "Components/Charts/Helpers",
  component: ChartCard,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof ChartCard>;

export default meta;
type Story = StoryObj<typeof ChartCard>;

export const CardDefault: Story = {
  render: () => (
    <div className="w-full max-w-lg">
      <ChartCard
        title="Total Earnings"
        subtitle="$4,523"
        trendChip={{ label: "12.5% vs prev", trend: "positive" }}
        dateInfo="Mar 1 - Mar 14"
      >
        <SimpleLineChart config={simpleLineConfig} />
      </ChartCard>
    </div>
  ),
};

export const CardLoading: Story = {
  render: () => (
    <div className="w-full max-w-lg">
      <ChartCard title="Revenue" loading>
        <div className="h-48 w-full" />
      </ChartCard>
    </div>
  ),
};

export const CardWithTooltip: Story = {
  render: () => (
    <div className="w-full max-w-lg">
      <ChartCard
        title="Total Earnings"
        subtitle="$4,523"
        tooltip="Total earnings for the selected period."
        dateInfo="Mar 1 - Mar 14"
      >
        <SimpleLineChart config={simpleLineConfig} />
      </ChartCard>
    </div>
  ),
};

export const CardHierarchies: Story = {
  render: () => (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <ChartCard
        hierarchy="primary"
        title="Primary surface"
        subtitle="$4,523"
        dateInfo="Mar 1 - Mar 14"
      >
        <SimpleLineChart config={simpleLineConfig} />
      </ChartCard>
      <ChartCard
        hierarchy="secondary"
        title="Secondary surface"
        subtitle="$4,523"
        dateInfo="Mar 1 - Mar 14"
      >
        <SimpleLineChart config={simpleLineConfig} />
      </ChartCard>
    </div>
  ),
};

export const CardMetricTilesWithoutChildren: Story = {
  render: () => (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
      <ChartCard
        title="Total Earnings"
        subtitle="$4,523"
        trendChip={{ label: "12.5% vs prev", trend: "positive" }}
        dateInfo="Mar 1 - Mar 14"
      />
      <ChartCard
        title="Subscribers"
        subtitle="1,284"
        trendChip={{ label: "3.1% vs prev", trend: "negative" }}
        dateInfo="Mar 1 - Mar 14"
      />
      <ChartCard title="Avg. Spend" subtitle="$18.40" dateInfo="Mar 1 - Mar 14" />
    </div>
  ),
};

export const LoadingOverlay: Story = {
  render: () => (
    <div className="w-full max-w-lg">
      <ChartLoadingOverlay loading>
        <SimpleLineChart config={simpleLineConfig} />
      </ChartLoadingOverlay>
    </div>
  ),
};

export const LoadingOverlayIdle: Story = {
  render: () => (
    <div className="w-full max-w-lg">
      <ChartLoadingOverlay loading={false}>
        <SimpleLineChart config={simpleLineConfig} />
      </ChartLoadingOverlay>
    </div>
  ),
};

function SeriesToggleInteractive() {
  const [visible, setVisible] = useState(new Set(["photos", "videos", "messages", "tips", "subs"]));
  return (
    <div className="w-full max-w-lg">
      <ChartSeriesToggle
        items={[
          { key: "photos", label: "Photos", color: "var(--color-special-chart-teal)" },
          { key: "videos", label: "Videos", color: "var(--color-special-chart-sky)" },
          { key: "messages", label: "Messages", color: "var(--color-special-chart-orange)" },
          { key: "tips", label: "Tips", color: "var(--color-special-chart-gray)" },
          { key: "subs", label: "Subscriptions", color: "var(--color-special-chart-pink)" },
        ]}
        value={visible}
        onValueChange={setVisible}
      />
    </div>
  );
}

export const SeriesToggle: Story = {
  render: () => <SeriesToggleInteractive />,
};

function SeriesTogglePartialInteractive() {
  const [visible, setVisible] = useState(new Set(["photos", "messages"]));
  return (
    <div className="w-full max-w-lg">
      <ChartSeriesToggle
        items={[
          { key: "photos", label: "Photos", color: "var(--color-special-chart-teal)" },
          { key: "videos", label: "Videos", color: "var(--color-special-chart-sky)" },
          { key: "messages", label: "Messages", color: "var(--color-special-chart-orange)" },
          { key: "tips", label: "Tips", color: "var(--color-special-chart-gray)" },
          { key: "subs", label: "Subscriptions", color: "var(--color-special-chart-pink)" },
        ]}
        value={visible}
        onValueChange={setVisible}
      />
    </div>
  );
}

export const SeriesTogglePartialSelection: Story = {
  render: () => <SeriesTogglePartialInteractive />,
};

function SeriesToggleManyInteractive() {
  const [visible, setVisible] = useState(new Set(["total"]));
  return (
    <div className="w-full max-w-3xl">
      <ChartSeriesToggle
        items={[
          { key: "total", label: "Total", color: "var(--color-special-chart-purple)" },
          { key: "subs", label: "Subs", color: "var(--color-special-chart-sky)" },
          { key: "messages", label: "Messages", color: "var(--color-special-chart-orange)" },
          { key: "posts", label: "Posts", color: "var(--color-special-chart-magenta)" },
          { key: "tips", label: "Tips", color: "var(--color-special-chart-teal)" },
          { key: "referrals", label: "Referrals", color: "var(--color-special-chart-pink)" },
          { key: "other", label: "Other", color: "var(--color-special-chart-gray)" },
        ]}
        value={visible}
        onValueChange={setVisible}
      />
    </div>
  );
}

export const SeriesToggleManySeries: Story = {
  render: () => <SeriesToggleManyInteractive />,
};

export const PieLegendDefault: Story = {
  render: () => (
    <div className="w-full max-w-lg">
      <ChartPieLegend
        items={[
          {
            label: "Subscriptions",
            value: 4500,
            formattedValue: "$4,500",
            color: "var(--color-special-chart-teal)",
          },
          {
            label: "Messages",
            value: 2100,
            formattedValue: "$2,100",
            color: "var(--color-special-chart-sky)",
          },
          {
            label: "Tips",
            value: 1200,
            formattedValue: "$1,200",
            color: "var(--color-special-chart-orange)",
          },
          {
            label: "Referrals",
            value: 600,
            formattedValue: "$600",
            color: "var(--color-special-chart-gray)",
          },
          {
            label: "Other",
            value: 300,
            formattedValue: "$300",
            color: "var(--color-special-chart-pink)",
          },
        ]}
      />
    </div>
  ),
};

export const PieLegendCompact: Story = {
  render: () => (
    <div className="w-full max-w-lg">
      <ChartPieLegend
        items={[
          {
            label: "Photos",
            value: 3200,
            formattedValue: "$3,200",
            color: "var(--color-special-chart-teal)",
          },
          {
            label: "Videos",
            value: 5800,
            formattedValue: "$5,800",
            color: "var(--color-special-chart-sky)",
          },
          {
            label: "Audio",
            value: 1400,
            formattedValue: "$1,400",
            color: "var(--color-special-chart-orange)",
          },
        ]}
      />
    </div>
  ),
};
