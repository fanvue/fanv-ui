import type { Meta, StoryObj } from "@storybook/react";
import { Banner } from "./Banner";

const meta = {
  title: "Components/Banner",
  component: Banner,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
    },
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
    badgeLabel: "New",
    heading: "Boost your earnings",
    description: "Try our latest feature to grow faster.",
    cta: { label: "Learn more", onClick: () => {} },
    style: { width: "320px" },
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    badgeLabel: "Limited",
    heading: "Exclusive offer",
    description: "Upgrade now and save 20%.",
    cta: { label: "Upgrade", onClick: () => {} },
    style: { width: "320px" },
  },
};

export const Tertiary: Story = {
  args: {
    variant: "tertiary",
    badgeLabel: "Trending",
    heading: "You're on fire",
    description: "Your content is performing well this week.",
    cta: { label: "View stats", onClick: () => {} },
    style: { width: "320px" },
  },
};

export const Minimal: Story = {
  args: {
    variant: "primary",
    heading: "Simple announcement",
    description: "No badge or call-to-action needed.",
    style: { width: "320px" },
  },
};

export const FullWidth: Story = {
  args: {
    variant: "primary",
    badgeLabel: "New",
    heading: "Full width banner",
    description: "Stretches to fill available space.",
    cta: { label: "Learn more", onClick: () => {} },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "600px" }}>
        <Story />
      </div>
    ),
  ],
};
