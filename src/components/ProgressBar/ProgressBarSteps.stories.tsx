import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBarSteps } from "./ProgressBarSteps";

const meta = {
  title: "Components/ProgressBarSteps",
  component: ProgressBarSteps,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=18411-91424",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    steps: { control: { type: "number", min: 1, max: 12 } },
    value: { control: { type: "number", min: 0, max: 12 } },
    size: { control: "select", options: ["default", "small"] },
    variant: { control: "select", options: ["brand", "mono"] },
  },
  args: {
    className: "w-[300px]",
    steps: 4,
    value: 1,
  },
} satisfies Meta<typeof ProgressBarSteps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Brand: Story = {
  args: {
    variant: "brand",
  },
};

export const Mono: Story = {
  args: {
    variant: "mono",
  },
};

export const BrandSmall: Story = {
  args: {
    variant: "brand",
    size: "small",
  },
};

export const MonoSmall: Story = {
  args: {
    variant: "mono",
    size: "small",
  },
};

export const HalfComplete: Story = {
  args: {
    steps: 6,
    value: 3,
    variant: "brand",
  },
};

export const Complete: Story = {
  args: {
    steps: 4,
    value: 4,
    variant: "brand",
  },
};
