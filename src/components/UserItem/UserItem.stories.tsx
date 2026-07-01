import type { Meta, StoryObj } from "@storybook/react";
import { UserItem } from "./UserItem";

const SAMPLE_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop";

const sampleUser = {
  avatarUri: { url: SAMPLE_AVATAR },
  displayName: "Aitana Lopez",
  handle: "fit_aitana",
};

const meta = {
  title: "Components/UserItem",
  component: UserItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    avatarSize: {
      control: "select",
      options: [16, 24, 32, 40, 48, 64, 88, 148],
    },
    isMuted: { control: "boolean" },
    isOnline: { control: "boolean" },
    showAvatar: { control: "boolean" },
    showHandle: { control: "boolean" },
    showOnlineStatus: { control: "boolean" },
  },
  args: {
    user: sampleUser,
    isMuted: false,
    isOnline: false,
    showAvatar: true,
    showHandle: true,
    showOnlineStatus: false,
  },
  render: (args) => (
    <div className="w-72">
      <UserItem {...args} />
    </div>
  ),
} satisfies Meta<typeof UserItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutAvatar: Story = {
  args: { showAvatar: false },
};

export const WithoutHandle: Story = {
  args: { showHandle: false },
};

export const Nickname: Story = {
  args: {
    user: { ...sampleUser, nickname: "Aitana" },
  },
};

export const FallbackInitials: Story = {
  args: {
    user: { displayName: "Aitana Lopez", handle: "fit_aitana" },
  },
};

export const Muted: Story = {
  args: { isMuted: true },
};

export const OnlineIndicator: Story = {
  args: { isOnline: true, showOnlineStatus: true },
};

export const OnlineButStatusHidden: Story = {
  name: "Online (status hidden)",
  args: { isOnline: true, showOnlineStatus: false },
};

export const LongName: Story = {
  args: {
    user: {
      ...sampleUser,
      displayName: "Aitana Lopez de la Vega Hernández Rodríguez",
      handle: "an_extremely_long_handle_that_should_truncate",
    },
  },
};

export const MutedAndOnline: Story = {
  args: { isMuted: true, isOnline: true, showOnlineStatus: true },
};

export const AvatarSizes: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-2">
      {([16, 24, 32, 40, 48, 64, 88, 148] as const).map((avatarSize) => (
        <div key={avatarSize} className="flex flex-col gap-1">
          <UserItem {...args} avatarSize={avatarSize} />
          <p className="typography-description-12px-regular pl-2 text-content-secondary">
            avatarSize={avatarSize}
          </p>
        </div>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-4">
      <UserItem {...args} />
      <UserItem {...args} isOnline showOnlineStatus />
      <UserItem {...args} isMuted />
      <UserItem {...args} showHandle={false} />
      <UserItem {...args} showAvatar={false} />
      <UserItem {...args} user={{ ...sampleUser, nickname: "Aitana" }} />
    </div>
  ),
};
