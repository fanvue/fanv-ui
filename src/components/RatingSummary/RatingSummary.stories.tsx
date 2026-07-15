import type { Meta, StoryObj } from "@storybook/react";
import { RatingSummary } from "./RatingSummary";

const meta = {
  title: "Components/RatingSummary",
  component: RatingSummary,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[400px] max-w-full">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    maxRating: { control: { type: "number", min: 1 } },
    averageRating: { control: { type: "number", min: 0, step: 0.1 } },
  },
} satisfies Meta<typeof RatingSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    distribution: [
      { rating: 5, count: 300 },
      { rating: 4, count: 20 },
      { rating: 3, count: 20 },
      { rating: 2, count: 10 },
      { rating: 1, count: 0 },
    ],
  },
};

export const Mixed: Story = {
  args: {
    distribution: [
      { rating: 5, count: 64 },
      { rating: 4, count: 81 },
      { rating: 3, count: 40 },
      { rating: 2, count: 18 },
      { rating: 1, count: 12 },
    ],
  },
};

export const CustomAverage: Story = {
  args: {
    averageRating: 4.3,
    distribution: [
      { rating: 5, count: 300 },
      { rating: 4, count: 20 },
      { rating: 3, count: 20 },
      { rating: 2, count: 10 },
      { rating: 1, count: 0 },
    ],
  },
};

export const LargeVolume: Story = {
  args: {
    distribution: [
      { rating: 5, count: 18420 },
      { rating: 4, count: 7310 },
      { rating: 3, count: 1290 },
      { rating: 2, count: 540 },
      { rating: 1, count: 880 },
    ],
  },
};

/**
 * Rows mixing singular ("1 review") and plural ("6 reviews") labels: the
 * differing label widths must not change the track lengths — every bar's
 * right edge stays aligned.
 */
export const MixedPlurality: Story = {
  args: {
    distribution: [
      { rating: 5, count: 6 },
      { rating: 4, count: 1 },
      { rating: 3, count: 3 },
      { rating: 2, count: 0 },
      { rating: 1, count: 0 },
    ],
  },
};

export const SingleReview: Story = {
  args: {
    distribution: [
      { rating: 5, count: 1 },
      { rating: 4, count: 0 },
      { rating: 3, count: 0 },
      { rating: 2, count: 0 },
      { rating: 1, count: 0 },
    ],
  },
};

export const Empty: Story = {
  args: {
    distribution: [
      { rating: 5, count: 0 },
      { rating: 4, count: 0 },
      { rating: 3, count: 0 },
      { rating: 2, count: 0 },
      { rating: 1, count: 0 },
    ],
  },
};
