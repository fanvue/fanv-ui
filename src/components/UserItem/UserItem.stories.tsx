import type { Meta, StoryObj } from "@storybook/react";
import { UserItem } from "./UserItem";
import { UserItemTrailing } from "./UserItemTrailing";

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
    aiDisclosure: { control: "boolean" },
    isMuted: { control: "boolean" },
    isOnline: { control: "boolean" },
    showAvatar: { control: "boolean" },
    showHandle: { control: "boolean" },
    showOnlineStatus: { control: "boolean" },
    verified: { control: "boolean" },
  },
  args: {
    user: sampleUser,
    isMuted: false,
    isOnline: false,
    showAvatar: true,
    showHandle: true,
    showOnlineStatus: false,
    aiDisclosure: false,
    verified: false,
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

export const Verified: Story = {
  args: { verified: true },
};

export const AiDisclosure: Story = {
  name: "AI disclosure",
  args: { aiDisclosure: true },
};

export const VerifiedAiCreator: Story = {
  name: "Verified AI creator",
  args: { verified: true, aiDisclosure: true },
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

export const Trailing: Story = {
  args: {
    avatarSize: 32,
    showHandle: false,
    trailing: <UserItemTrailing value="$14,523.59" />,
  },
};

/**
 * Trailing content keeps its intrinsic width while the name truncates, so values
 * stay aligned down a list whatever the display names do.
 */
export const TrailingList: Story = {
  name: "Trailing (list)",
  render: (args) => (
    <div className="flex w-96 flex-col gap-2">
      {[
        { name: "Caroline King", value: "$14,523.59" },
        { name: "Agency Chatter", value: "$12,837.17" },
        { name: "Agency Managed Creator 1 Fan", value: "$12,545.95" },
      ].map(({ name, value }) => (
        <UserItem
          {...args}
          key={name}
          user={{ ...sampleUser, displayName: name }}
          avatarSize={32}
          showHandle={false}
          trailing={<UserItemTrailing value={value} />}
        />
      ))}
    </div>
  ),
};

/**
 * An activity feed: `primary` carries a sentence about the user instead of their
 * name, and the value sits above its timestamp at the end of the row.
 */
export const ActivityFeed: Story = {
  name: "Activity feed (secondary + trailing)",
  render: (args) => (
    <div className="flex w-96 flex-col gap-2">
      {[
        {
          name: "Benjamin Griffin",
          action: "subscribed to your feed",
          value: "$421.32",
          meta: "7 hours ago",
        },
        {
          name: "Caroline King",
          action: "renewed their subscription",
          value: "$102.05",
          meta: "22 hours ago",
        },
        {
          name: "Agency Chatter",
          action: "purchased a post",
          value: "$21.88",
          meta: "1 day ago",
        },
      ].map(({ name, action, value, meta }) => (
        <UserItem
          {...args}
          key={name}
          user={{ ...sampleUser, displayName: name }}
          avatarSize={32}
          showHandle={false}
          secondary={action}
          trailing={<UserItemTrailing value={value} meta={meta} />}
        />
      ))}
    </div>
  ),
};
