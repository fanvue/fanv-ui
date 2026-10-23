import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "../Avatar/Avatar";
import { Checkbox } from "../Checkbox/Checkbox";
import { IconButton } from "../IconButton/IconButton";
import { ChevronRightIcon } from "../Icons/ChevronRightIcon";
import { StarIcon } from "../Icons/StarIcon";
import { Pill } from "../Pill/Pill";
import { TableMobileRow } from "./TableMobileRow";

const media = (
  <img
    src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=64&h=64&fit=crop"
    alt=""
  />
);

const avatar = (
  <Avatar
    size={40}
    alt="Jane Doe"
    fallback="JD"
    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop"
  />
);

const subContent = [
  { label: "Joined", value: "12 Jan 2025" },
  { label: "Spent", value: "$120.00" },
  { label: "Status", value: <Pill variant="green">Subscriber</Pill> },
];

const meta = {
  title: "Components/Table/TableMobileRow",
  component: TableMobileRow,
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=21310-4905",
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-[361px]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    type: {
      control: "select",
      options: ["base-text", "default", "with-image", "avatar"],
    },
  },
  args: {
    title: "Top Spenders",
    description: "320 members",
    badge: <Pill variant="green">Dynamic</Pill>,
    actions: (
      <>
        <StarIcon size={16} filled />
        <IconButton
          variant="secondary"
          size="24"
          aria-label="Open list"
          icon={<ChevronRightIcon />}
        />
      </>
    ),
  },
} satisfies Meta<typeof TableMobileRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BaseText: Story = {
  args: { type: "base-text", title: "Main content of the table", description: "Primary" },
};

export const WithImage: Story = {
  args: {
    type: "with-image",
    title: "Summer shoot behind the scenes",
    description: "Post",
    media,
  },
};

export const AvatarRow: Story = {
  name: "Avatar",
  args: {
    type: "avatar",
    title: "Jane Doe",
    description: "@jane_doe",
    avatar,
    actions: <Checkbox aria-label="Select Jane Doe" />,
  },
};

export const WithSubContent: Story = {
  args: { subContent },
};

export const WithoutBadge: Story = {
  args: { badge: undefined, actions: undefined },
};

export const List: Story = {
  render: (args) => (
    <div className="flex flex-col">
      <TableMobileRow {...args} subContent={subContent} />
      <TableMobileRow
        {...args}
        type="base-text"
        title="Main content of the table"
        description="Primary"
        subContent={subContent}
      />
      <TableMobileRow
        {...args}
        type="with-image"
        title="Summer shoot behind the scenes"
        description="Post"
        media={media}
      />
      <TableMobileRow
        type="avatar"
        title="Jane Doe"
        description="@jane_doe"
        avatar={avatar}
        actions={<Checkbox aria-label="Select Jane Doe" />}
        subContent={subContent}
      />
    </div>
  ),
};
