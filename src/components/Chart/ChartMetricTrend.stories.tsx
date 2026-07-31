import type { Meta, StoryObj } from "@storybook/react";
import { ChartMetricTrend } from "./ChartMetricTrend";

const meta = {
  title: "Charts/ChartMetricTrend",
  component: ChartMetricTrend,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "inline-radio",
      options: ["red", "teal"],
    },
  },
  args: {
    value: 62,
    color: "teal",
    series: [41, 44, 43, 52, 58, 55, 62],
  },
  decorators: [
    (Story) => (
      <div className="max-w-[320px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChartMetricTrend>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithSeries: Story = {
  name: "With series",
};

export const Red: Story = {
  args: { color: "red", series: [78, 74, 75, 69, 66, 61, 58] },
};

export const FlatWithoutSeries: Story = {
  name: "Flat (no series)",
  args: { series: undefined },
};
