import type { Meta, StoryObj } from "@storybook/react";
import { MediaStatusIndicator } from "./MediaStatusIndicator";

const meta = {
  title: "Components/MediaStatusIndicator",
  component: MediaStatusIndicator,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=18206-16999",
    },
  },
  tags: ["autodocs"],
  args: {
    status: "default",
  },
  argTypes: {
    status: {
      control: "select",
      options: ["default", "removed", "sensitive"],
    },
  },
} satisfies Meta<typeof MediaStatusIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Removed: Story = {
  args: { status: "removed" },
};

export const Sensitive: Story = {
  args: { status: "sensitive" },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <MediaStatusIndicator status="default" />
      <MediaStatusIndicator status="removed" />
      <MediaStatusIndicator status="sensitive" />
    </div>
  ),
};

export const OnMedia: Story = {
  name: "Overlaid on a thumbnail",
  render: () => (
    <div className="relative size-40 overflow-hidden rounded-lg bg-neutral-800">
      <div className="absolute top-2 right-2">
        <MediaStatusIndicator status="sensitive" />
      </div>
    </div>
  ),
};
