import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "../Avatar/Avatar";
import { Badge } from "../Badge/Badge";
import { IconButton } from "../IconButton/IconButton";
import { BoltIcon } from "../Icons/BoltIcon";
import { MoreIcon } from "../Icons/MoreIcon";
import { PlusIcon } from "../Icons/PlusIcon";
import { SearchIcon } from "../Icons/SearchIcon";
import {
  MainContainerHeader,
  MainContainerHeaderEnd,
  MainContainerHeaderStart,
  MainContainerHeaderTitle,
} from "./MainContainerHeader";

const meta = {
  title: "Components/MainContainerHeader",
  component: MainContainerHeader,
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=1445-23497",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    device: {
      control: "select",
      options: ["desktop", "mobile"],
    },
  },
} satisfies Meta<typeof MainContainerHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const demoAvatar =
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop";

export const DesktopDefault: Story = {
  render: (args) => (
    <MainContainerHeader {...args} className="max-w-xl">
      <MainContainerHeaderStart>
        <Avatar src={demoAvatar} alt="Creator" fallback="C" size={40} onlineIndicator />
        <MainContainerHeaderTitle>Title</MainContainerHeaderTitle>
        <Badge variant="success" className="text-content-primary" leftDot>
          Live
        </Badge>
      </MainContainerHeaderStart>
      <MainContainerHeaderEnd>
        <IconButton variant="tertiary" size="32" icon={<SearchIcon />} aria-label="Search" />
        <span className="typography-semibold-body-sm inline-flex items-center justify-center rounded-full bg-brand-secondary-default px-2 py-1 text-content-on-brand">
          Beta
        </span>
        <IconButton variant="tertiary" size="32" icon={<MoreIcon />} aria-label="More options" />
        <IconButton variant="tertiary" size="32" icon={<BoltIcon />} aria-label="Quick actions" />
        <IconButton variant="tertiary" size="32" icon={<PlusIcon />} aria-label="Add" />
      </MainContainerHeaderEnd>
    </MainContainerHeader>
  ),
  args: {
    device: "desktop",
  },
};

export const Mobile: Story = {
  render: (args) => (
    <MainContainerHeader {...args} className="max-w-sm">
      <MainContainerHeaderStart>
        <Avatar src={demoAvatar} alt="Creator" fallback="C" size={40} onlineIndicator />
        <MainContainerHeaderTitle>Title</MainContainerHeaderTitle>
        <Badge variant="success" className="text-content-primary" leftDot>
          Live
        </Badge>
      </MainContainerHeaderStart>
      <MainContainerHeaderEnd>
        <span className="typography-semibold-body-sm inline-flex items-center justify-center rounded-full bg-brand-secondary-default px-2 py-1 text-content-on-brand">
          Beta
        </span>
        <IconButton variant="tertiary" size="32" icon={<MoreIcon />} aria-label="More options" />
        <IconButton variant="tertiary" size="32" icon={<BoltIcon />} aria-label="Quick actions" />
        <IconButton variant="tertiary" size="32" icon={<PlusIcon />} aria-label="Add" />
      </MainContainerHeaderEnd>
    </MainContainerHeader>
  ),
  args: {
    device: "mobile",
  },
};
