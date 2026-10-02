import type { Meta, StoryObj } from "@storybook/react";
import { LiveStatus } from "./LiveStatus";

const meta = {
  title: "Components/LiveStatus",
  component: LiveStatus,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=22813-51",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["live", "ended", "game"] },
  },
} satisfies Meta<typeof LiveStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Live: Story = { args: { variant: "live" } };

export const Ended: Story = { args: { variant: "ended" } };

export const Game: Story = { args: { variant: "game" } };

export const CustomLabel: Story = { args: { variant: "live", children: "EN DIRECT" } };
