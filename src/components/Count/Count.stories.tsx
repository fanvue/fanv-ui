import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button/Button";
import { Count } from "./Count";

const meta = {
  title: "Components/Count",
  component: Count,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      // V2 Notification Count — Fanvue Library (instance node used by V2 Chips)
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=17898-11698&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "contrast", "brand", "alert", "pink", "info", "success", "warning"],
    },
    showAmount: { control: "boolean" },
    value: {
      control: { type: "number", min: 0, max: 999 },
    },
    max: {
      control: { type: "number", min: 1, max: 999 },
    },
    size: {
      control: "select",
      options: ["16", "24", "32"],
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
    variant: "brand",
    value: 12,
    size: "24",
  },
};

export const Contrast: Story = {
  args: {
    variant: "contrast",
    value: 3,
    size: "24",
  },
  decorators: [
    (Story) => (
      <div className="rounded-md bg-neutral-alphas-600 p-6">
        <Story />
      </div>
    ),
  ],
};

export const DotBrand: Story = {
  name: "Show Amount False (Dot)",
  args: {
    variant: "brand",
    value: 1,
    showAmount: false,
  },
};

export const Alert: Story = {
  args: {
    variant: "alert",
    value: 5,
  },
};

export const Pink: Story = {
  args: {
    variant: "pink",
    value: 8,
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    value: 3,
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    value: 7,
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    value: 99,
  },
};

export const MaxValue: Story = {
  args: {
    value: 150,
    max: 99,
    size: "24",
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
    size: "24",
  },
};

export const OnButton: Story = {
  render: () => (
    <Button variant="tertiary" size="40" className="relative">
      Messages
      <Count value={24} variant="alert" size="24" className="absolute -top-2 -right-2" />
    </Button>
  ),
};

export const V2Types: Story = {
  name: "V2 Types × Show Amount",
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Count value={5} variant="default" size="24" />
        <Count value={12} variant="brand" size="24" />
        <div className="rounded-md bg-neutral-alphas-600 p-3">
          <Count value={3} variant="contrast" size="24" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Count value={1} variant="default" showAmount={false} />
        <Count value={1} variant="brand" showAmount={false} />
        <div className="rounded-md bg-neutral-alphas-600 p-3">
          <Count value={1} variant="contrast" showAmount={false} />
        </div>
      </div>
    </div>
  ),
};

export const MultipleVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Count value={5} variant="default" size="24" />
      <Count value={3} variant="contrast" size="24" />
      <Count value={12} variant="brand" size="24" />
      <Count value={3} variant="alert" size="24" />
      <Count value={8} variant="pink" size="24" />
      <Count value={3} variant="info" size="24" />
      <Count value={7} variant="success" size="24" />
      <Count value={99} variant="warning" size="24" />
    </div>
  ),
};
