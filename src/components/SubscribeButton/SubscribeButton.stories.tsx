import type { Meta, StoryObj } from "@storybook/react";
import { SubscribeButton } from "./SubscribeButton";

const meta = {
  title: "Components/SubscribeButton",
  component: SubscribeButton,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=16800-10417",
    },
  },
  tags: ["autodocs"],
  args: {
    children: "Join now",
    price: "$9.99/mo",
    discount: "$19.99",
    variant: "primary",
    size: "48",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "outline", "brand"],
    },
    size: {
      control: "select",
      options: ["48", "40", "32"],
    },
    negative: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
} satisfies Meta<typeof SubscribeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Brand: Story = {
  args: { variant: "brand" },
};

export const WithoutDiscount: Story = {
  args: { discount: undefined },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <SubscribeButton {...args} variant="primary" />
      <SubscribeButton {...args} variant="secondary" />
      <SubscribeButton {...args} variant="tertiary" />
      <SubscribeButton {...args} variant="outline" />
      <SubscribeButton {...args} variant="brand" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-3">
      <SubscribeButton {...args} size="48" />
      <SubscribeButton {...args} size="40" />
      <SubscribeButton {...args} size="32" />
    </div>
  ),
};

export const Negative: Story = {
  args: { negative: true },
  parameters: { backgrounds: { default: "dark" } },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-neutral-900 p-8">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <div className="flex flex-col gap-3">
      <SubscribeButton {...args} variant="primary" />
      <SubscribeButton {...args} variant="secondary" />
      <SubscribeButton {...args} variant="tertiary" />
      <SubscribeButton {...args} variant="outline" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};
