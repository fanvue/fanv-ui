import type { Meta, StoryObj } from "@storybook/react";
import { ProfileOnlineStatus } from "./ProfileOnlineStatus";

const meta = {
  title: "Components/ProfileOnlineStatus",
  component: ProfileOnlineStatus,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
  },
  args: {
    label: "Online",
  },
} satisfies Meta<typeof ProfileOnlineStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomLabel: Story = {
  args: { label: "Active now" },
};

/** Composed inline after a display name, mirroring its use in `UserDisplayNameContainer`. */
export const InlineWithText: Story = {
  render: (args) => (
    <span className="typography-body-small-14px-semibold inline-flex items-center">
      Aitana Lopez
      <ProfileOnlineStatus {...args} />
    </span>
  ),
};
