import type { Meta, StoryObj } from "@storybook/react";
import { ProfileStatus } from "./ProfileStatus";

const meta = {
  title: "Components/ProfileStatus",
  component: ProfileStatus,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=17801-109201&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    active: { control: "boolean" },
    size: { control: "select", options: ["sm", "md"] },
  },
} satisfies Meta<typeof ProfileStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    active: true,
  },
};

export const Inactive: Story = {
  args: {
    active: false,
  },
};

export const Small: Story = {
  args: {
    active: true,
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    active: true,
    size: "md",
  },
};

export const WithLabel: Story = {
  args: {
    active: true,
    "aria-label": "Online",
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-3">
        <ProfileStatus active size="sm" />
        <ProfileStatus active size="md" />
      </div>
      <div className="flex items-center gap-3">
        <ProfileStatus active={false} size="sm" />
        <ProfileStatus active={false} size="md" />
      </div>
    </div>
  ),
};
