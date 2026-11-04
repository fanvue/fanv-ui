import type { Meta, StoryObj } from "@storybook/react";
import { formatPlayChipDuration, MediaPlayChip } from "./MediaPlayChip";

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

/** Over a bright photo, where the translucent fill is at its weakest. */
export const OnLightMedia: Story = {
  args: { duration: 42 },
  decorators: [
    (Story) => (
      <div className="relative h-40 w-72 overflow-hidden rounded-sm bg-surface-primary">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop"
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <Story />
      </div>
    ),
  ],
};

/** The host names the tile, including the length, since the chip is hidden from assistive tech. */
export const OnSelectableTile: Story = {
  args: { duration: 42 },
  render: (args) => (
    <button
      type="button"
      aria-label={["Beach video", formatPlayChipDuration(args.duration)].filter(Boolean).join(", ")}
      className="absolute inset-0 cursor-pointer"
    >
      <MediaPlayChip {...args} />
    </button>
  ),
};
