import type { Meta, StoryObj } from "@storybook/react";
import { OnlineBlinkingIcon } from "./OnlineBlinkingIcon";

const meta = {
  title: "Components/OnlineBlinkingIcon",
  component: OnlineBlinkingIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md"] },
  },
} satisfies Meta<typeof OnlineBlinkingIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <OnlineBlinkingIcon size="sm" />
      <OnlineBlinkingIcon size="md" />
    </div>
  ),
};
