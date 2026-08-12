import type { Meta, StoryObj } from "@storybook/react";
import { AiDisclosureBadge } from "./AiDisclosureBadge";

const meta = {
  title: "Components/AiDisclosureBadge",
  component: AiDisclosureBadge,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=20586-1134&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["dark", "light", "transparent"],
    },
  },
} satisfies Meta<typeof AiDisclosureBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <AiDisclosureBadge {...args} className="size-4" />
      <AiDisclosureBadge {...args} className="size-6" />
      <AiDisclosureBadge {...args} className="size-8" />
    </div>
  ),
};

/**
 * The palette is fixed rather than theme-reactive, so each tone is shown over
 * media: `dark` for light footage, `light` for dark, `transparent` where
 * the media should still read through.
 */
export const Tones: Story = {
  render: (args) => (
    <div className="flex gap-4">
      <div className="flex items-center gap-3 rounded-md bg-linear-to-br from-[#e8f5ef] via-[#9fd8c2] to-[#f7fbf9] p-6">
        <AiDisclosureBadge {...args} tone="dark" className="size-6" />
        <AiDisclosureBadge {...args} tone="transparent" className="size-6" />
      </div>
      <div className="flex items-center gap-3 rounded-md bg-linear-to-br from-[#0e3b2f] via-[#1f8f6a] to-[#0b2b23] p-6">
        <AiDisclosureBadge {...args} tone="light" className="size-6" />
        <AiDisclosureBadge {...args} tone="transparent" className="size-6" />
      </div>
    </div>
  ),
};
