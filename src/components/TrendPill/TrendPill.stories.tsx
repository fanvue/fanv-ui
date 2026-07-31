import type { Meta, StoryObj } from "@storybook/react";
import { TrendPill } from "./TrendPill";

const meta = {
  title: "Components/TrendPill",
  component: TrendPill,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    trend: {
      control: "inline-radio",
      options: ["positive", "negative"],
    },
  },
  args: {
    label: "$240 vs Jun",
    trend: "positive",
  },
} satisfies Meta<typeof TrendPill>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Positive: Story = {};

export const Negative: Story = {
  args: { label: "$120 vs Jun", trend: "negative" },
};

export const BothDirections: Story = {
  name: "Both directions",
  render: () => (
    <div className="flex items-center gap-2">
      <TrendPill label="$240 vs Jun" trend="positive" />
      <TrendPill label="$120 vs Jun" trend="negative" />
    </div>
  ),
};
