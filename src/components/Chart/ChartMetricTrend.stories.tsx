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

/**
 * Two cards of the same colour, which is the case that would break a gradient id
 * scoped by colour: both would emit the same `id` and every `url(#...)` in the
 * document would resolve to whichever rendered first. Both series must show their
 * own shape and fade.
 */
export const TwoSameColourCards: Story = {
  name: "Two cards, same colour",
  render: () => (
    <div className="flex gap-4">
      <ChartMetricTrend value={69} color="teal" series={[40, 46, 52, 58, 61, 66, 69]} />
      <ChartMetricTrend value={22} color="teal" series={[70, 58, 44, 36, 30, 25, 22]} />
    </div>
  ),
};
