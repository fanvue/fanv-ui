import type { Meta, StoryObj } from "@storybook/react";
import { Count } from "./Count";

const meta = {
  title: "Components/Count",
  component: Count,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=1810-5202&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["Default", "Brand", "Pink", "Info", "Success", "Warning"],
    },
    size: {
      control: "select",
      options: ["Small", "Medium", "Large"],
    },
    value: {
      control: { type: "number", min: 0, max: 999 },
    },
    max: {
      control: { type: "number", min: 1, max: 999 },
    },
  },
} satisfies Meta<typeof Count>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 5,
  },
};

export const Brand: Story = {
  args: {
    variant: "Brand",
    value: 12,
  },
};

export const Pink: Story = {
  args: {
    variant: "Pink",
    value: 8,
  },
};

export const Info: Story = {
  args: {
    variant: "Info",
    value: 3,
  },
};

export const Success: Story = {
  args: {
    variant: "Success",
    value: 7,
  },
};

export const Warning: Story = {
  args: {
    variant: "Warning",
    value: 99,
  },
};

export const SmallSize: Story = {
  args: {
    size: "Small",
    value: 9,
  },
};

export const MediumSize: Story = {
  args: {
    size: "Medium",
    value: 42,
  },
};

export const LargeSize: Story = {
  args: {
    size: "Large",
    value: 128,
  },
};

export const MaxValue: Story = {
  args: {
    value: 150,
    max: 99,
  },
};

export const ZeroValue: Story = {
  args: {
    value: 0,
  },
};

export const CustomContent: Story = {
  args: {
    children: "NEW",
  },
};

export const OnButton: Story = {
  render: () => (
    <button
      type="button"
      className="relative inline-flex items-center gap-2 rounded-lg bg-neutral-100 px-4 py-2"
    >
      Messages
      <Count value={24} className="absolute -top-2 -right-2" />
    </button>
  ),
};

export const MultipleVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Count value={5} variant="Default" />
      <Count value={12} variant="Brand" />
      <Count value={8} variant="Pink" />
      <Count value={3} variant="Info" />
      <Count value={7} variant="Success" />
      <Count value={99} variant="Warning" />
    </div>
  ),
};
