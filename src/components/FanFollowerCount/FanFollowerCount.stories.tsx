import type { Meta, StoryObj } from "@storybook/react";
import { FanFollowerCount } from "./FanFollowerCount";

const meta = {
  title: "Components/FanFollowerCount",
  component: FanFollowerCount,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=19249-12840",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    fans: {
      control: "text",
    },
    subs: {
      control: "text",
    },
    showFans: {
      control: "boolean",
    },
    showSubs: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof FanFollowerCount>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fans: 1200,
    subs: 3000,
  },
};

export const PreformattedStrings: Story = {
  args: {
    fans: "1.2k",
    subs: "3k",
  },
};

export const LargeCounts: Story = {
  args: {
    fans: 1250000,
    subs: 48900,
  },
};

export const SmallCounts: Story = {
  args: {
    fans: 42,
    subs: 7,
  },
};

export const FansOnly: Story = {
  args: {
    fans: 1200,
    showSubs: false,
  },
};

export const SubsOnly: Story = {
  args: {
    subs: 3000,
    showFans: false,
  },
};
