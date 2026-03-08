import type { Meta, StoryObj } from "@storybook/react";
import { Loader } from "./Loader";

const meta = {
  title: "Components/Loader",
  component: Loader,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    show: { control: "boolean" },
    center: { control: "boolean" },
    centerX: { control: "boolean" },
    centerY: { control: "boolean" },
    minHeight: { control: "text" },
    ariaLabel: { control: "text" },
  },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    minHeight: 200,
  },
};

export const Centered: Story = {
  args: {
    center: true,
    minHeight: 200,
  },
};

export const CenteredHorizontally: Story = {
  args: {
    centerX: true,
    minHeight: 200,
  },
};

export const CenteredVertically: Story = {
  args: {
    centerY: true,
    minHeight: 200,
  },
};

export const Hidden: Story = {
  args: {
    show: false,
    minHeight: 200,
  },
};

export const CustomMinHeight: Story = {
  args: {
    center: true,
    minHeight: 400,
  },
};
