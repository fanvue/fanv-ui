import type { Meta, StoryObj } from "@storybook/react";
import { MediaPlayChip } from "./MediaPlayChip";

const meta = {
  title: "Components/MediaPlayChip",
  component: MediaPlayChip,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=18294-36429",
    },
  },
  tags: ["autodocs"],
  args: { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" },
  argTypes: {
    duration: { control: "number" },
  },
  decorators: [
    (Story) => (
      <div className="relative h-40 w-72 overflow-hidden rounded-sm bg-gradient-to-br from-brand-primary-default to-content-always-black">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MediaPlayChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithDuration: Story = {
  args: { duration: 42 },
};

/** Without a length, the chip is a 32px circle around the icon. */
export const IconOnly: Story = {};

export const LongVideo: Story = {
  args: { duration: 3725 },
};
