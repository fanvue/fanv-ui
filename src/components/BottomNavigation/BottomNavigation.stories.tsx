import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Avatar } from "../Avatar/Avatar";
import { Count } from "../Count/Count";
import { AddIcon } from "../Icons/AddIcon";
import { BellIcon } from "../Icons/BellIcon";
import { HomeIcon } from "../Icons/HomeIcon";
import { LoveIcon } from "../Icons/LoveIcon";
import { MessageIcon } from "../Icons/MessageIcon";
import { SearchIcon } from "../Icons/SearchIcon";
import { UserIcon } from "../Icons/UserIcon";
import { BottomNavigation } from "./BottomNavigation";
import { BottomNavigationAction } from "./BottomNavigationAction";

const meta: Meta<typeof BottomNavigation> = {
  title: "Components/BottomNavigation",
  component: BottomNavigation,
  parameters: {
    layout: "fullscreen",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=17061-28673",
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ height: 200, position: "relative" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BottomNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState("home");
    return (
      <BottomNavigation value={value} onValueChange={setValue} aria-label="Main navigation">
        <BottomNavigationAction value="home" icon={<HomeIcon />} label="Home" />
        <BottomNavigationAction
          value="notifications"
          icon={<BellIcon />}
          label="Notifications"
          badge={
            <Count
              value={5}
              max={99}
              variant="default"
              size="24"
              className="ring-2 ring-bg-primary"
            />
          }
        />
        <BottomNavigationAction value="create" icon={<AddIcon />} label="Create" />
        <BottomNavigationAction
          value="messages"
          icon={<MessageIcon />}
          label="Messages"
          badge={
            <Count
              value={1}
              max={99}
              variant="default"
              size="24"
              className="ring-2 ring-bg-primary"
            />
          }
        />
        <BottomNavigationAction
          value="profile"
          icon={<Avatar size={32} alt="User" fallback="JD" />}
          label="Profile"
        />
      </BottomNavigation>
    );
  },
};

export const WithBadges: Story = {
  render: () => {
    const [value, setValue] = React.useState("home");
    return (
      <BottomNavigation value={value} onValueChange={setValue} aria-label="Main navigation">
        <BottomNavigationAction value="home" icon={<HomeIcon />} label="Home" />
        <BottomNavigationAction value="search" icon={<SearchIcon />} label="Search" />
        <BottomNavigationAction
          value="favorites"
          icon={<LoveIcon />}
          label="Favorites"
          badge={
            <Count
              value={5}
              max={99}
              variant="alert"
              size="24"
              className="ring-2 ring-bg-primary"
            />
          }
        />
        <BottomNavigationAction value="profile" icon={<UserIcon />} label="Profile" />
      </BottomNavigation>
    );
  },
};

export const WithAsChild: Story = {
  name: "With asChild (Links)",
  render: () => {
    const [value, setValue] = React.useState("home");
    return (
      <BottomNavigation value={value} onValueChange={setValue} aria-label="Main navigation">
        <BottomNavigationAction value="home" icon={<HomeIcon />} label="Home" asChild>
          {/* biome-ignore lint/a11y/useAnchorContent: content provided by Slot */}
          <a href="#home" aria-label="Home" />
        </BottomNavigationAction>
        <BottomNavigationAction value="search" icon={<SearchIcon />} label="Search" asChild>
          {/* biome-ignore lint/a11y/useAnchorContent: content provided by Slot */}
          <a href="#search" aria-label="Search" />
        </BottomNavigationAction>
        <BottomNavigationAction value="favorites" icon={<LoveIcon />} label="Favorites" asChild>
          {/* biome-ignore lint/a11y/useAnchorContent: content provided by Slot */}
          <a href="#favorites" aria-label="Favorites" />
        </BottomNavigationAction>
        <BottomNavigationAction value="profile" icon={<UserIcon />} label="Profile" asChild>
          {/* biome-ignore lint/a11y/useAnchorContent: content provided by Slot */}
          <a href="#profile" aria-label="Profile" />
        </BottomNavigationAction>
      </BottomNavigation>
    );
  },
};

export const SelectedState: Story = {
  render: () => (
    <BottomNavigation value="favorites" aria-label="Main navigation">
      <BottomNavigationAction value="home" icon={<HomeIcon />} label="Home" />
      <BottomNavigationAction value="search" icon={<SearchIcon />} label="Search" />
      <BottomNavigationAction value="favorites" icon={<LoveIcon />} label="Favorites" />
      <BottomNavigationAction value="profile" icon={<UserIcon />} label="Profile" />
    </BottomNavigation>
  ),
};

export const InformationArchitectureNav: Story = {
  name: "Information Architecture Nav",
  render: () => {
    const [value, setValue] = React.useState("home");
    return (
      <BottomNavigation
        value={value}
        onValueChange={setValue}
        hasInformationArchitectureNav
        aria-label="Main navigation"
      >
        <BottomNavigationAction value="home" icon={<HomeIcon />} label="Home" />
        <BottomNavigationAction
          value="notifications"
          icon={<BellIcon />}
          label="Notifications"
          badge={
            <Count
              value={5}
              max={99}
              variant="default"
              size="24"
              className="ring-2 ring-bg-primary"
            />
          }
        />
        <BottomNavigationAction value="create" icon={<AddIcon />} label="Create" />
        <BottomNavigationAction
          value="messages"
          icon={<MessageIcon />}
          label="Messages"
          badge={
            <Count
              value={1}
              max={99}
              variant="default"
              size="24"
              className="ring-2 ring-bg-primary"
            />
          }
        />
        <BottomNavigationAction
          value="profile"
          icon={
            <span className="inline-flex size-6 items-center justify-center overflow-hidden rounded-full">
              <Avatar size={32} alt="User" fallback="JD" />
            </span>
          }
          label="Profile"
        />
      </BottomNavigation>
    );
  },
};

export const InformationArchitectureNavWithBadges: Story = {
  name: "Information Architecture Nav – With Badges",
  render: () => {
    const [value, setValue] = React.useState("home");
    return (
      <BottomNavigation
        value={value}
        onValueChange={setValue}
        hasInformationArchitectureNav
        aria-label="Main navigation"
      >
        <BottomNavigationAction value="home" icon={<HomeIcon />} label="Home" />
        <BottomNavigationAction
          value="search"
          icon={<SearchIcon />}
          label="Search"
          badge={
            <Count
              value={3}
              max={99}
              variant="alert"
              size="24"
              className="ring-2 ring-bg-primary"
            />
          }
        />
        <BottomNavigationAction
          value="favorites"
          icon={<LoveIcon />}
          label="Favorites"
          badge={
            <Count
              value={5}
              max={99}
              variant="alert"
              size="24"
              className="ring-2 ring-bg-primary"
            />
          }
        />
        <BottomNavigationAction
          value="profile"
          icon={<UserIcon />}
          label="Profile"
          badge={
            <Count
              value={12}
              max={99}
              variant="alert"
              size="24"
              className="ring-2 ring-bg-primary"
            />
          }
        />
      </BottomNavigation>
    );
  },
};

export const InformationArchitectureNavSelected: Story = {
  name: "Information Architecture Nav – Selected State",
  render: () => (
    <BottomNavigation value="favorites" hasInformationArchitectureNav aria-label="Main navigation">
      <BottomNavigationAction value="home" icon={<HomeIcon />} label="Home" />
      <BottomNavigationAction value="search" icon={<SearchIcon />} label="Search" />
      <BottomNavigationAction value="favorites" icon={<LoveIcon />} label="Favorites" />
      <BottomNavigationAction value="profile" icon={<UserIcon />} label="Profile" />
    </BottomNavigation>
  ),
};
