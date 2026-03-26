import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button/Button";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=14487-61248&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "centered"],
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

function EmptyVaultArtwork() {
  return (
    <div className="relative h-full w-full bg-surface-secondary">
      <div className="absolute left-5 top-8 size-20 rounded-full bg-surface-primary" />
      <div className="absolute left-24 top-5 size-36 rounded-full bg-surface-tertiary" />
      <div className="absolute left-40 top-20 size-24 rounded-full bg-surface-primary" />
    </div>
  );
}

const defaultArgs = {
  title: "Empty Vault, Full Potential!",
  description:
    "Add your photos to the Vault to start sharing your creations and earning! The more you add, the more opportunities you will unlock to grow your audience and income.",
  media: <EmptyVaultArtwork />,
  primaryAction: <Button variant="brand">Add Media to Vault</Button>,
};

export const Default: Story = {
  args: {
    variant: "default",
    ...defaultArgs,
  },
};

export const Centered: Story = {
  args: {
    variant: "centered",
    ...defaultArgs,
  },
};

export const WithSecondaryAction: Story = {
  args: {
    variant: "default",
    ...defaultArgs,
    secondaryAction: <Button variant="secondary">Learn more</Button>,
  },
};
