import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./Skeleton";

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "circular", "rectangular", "rounded"],
    },
    animation: {
      control: "select",
      options: ["pulse", "wave", false],
    },
    width: { control: "text" },
    height: { control: "text" },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 200,
    height: 20,
  },
};

export const Text: Story = {
  args: {
    variant: "text",
    width: 200,
  },
};

export const Circular: Story = {
  args: {
    variant: "circular",
    width: 40,
    height: 40,
  },
};

export const Rectangular: Story = {
  args: {
    variant: "rectangular",
    width: 240,
    height: 120,
  },
};

export const Rounded: Story = {
  args: {
    variant: "rounded",
    width: 240,
    height: 120,
  },
};

export const WaveAnimation: Story = {
  args: {
    variant: "rectangular",
    width: 240,
    height: 120,
    animation: "wave",
  },
};

export const NoAnimation: Story = {
  args: {
    variant: "rectangular",
    width: 240,
    height: 120,
    animation: false,
  },
};

export const AvatarWithText: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-1">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
  ),
};

export const CardSkeleton: Story = {
  render: () => (
    <div className="w-72 space-y-3">
      <Skeleton variant="rectangular" width="100%" height={160} />
      <div className="flex items-center gap-3 px-2">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-1">
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="50%" />
        </div>
      </div>
      <div className="space-y-1 px-2">
        <Skeleton variant="text" />
        <Skeleton variant="text" width="90%" />
      </div>
    </div>
  ),
};

export const WrappingChildren: Story = {
  render: () => (
    <Skeleton variant="rounded">
      <div className="h-24 w-64">Content shape preserved</div>
    </Skeleton>
  ),
};
