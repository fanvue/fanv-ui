import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { HomeIcon } from "../Icons/HomeIcon";
import { LoveIcon } from "../Icons/LoveIcon";
import { SearchIcon } from "../Icons/SearchIcon";
import { UserIcon } from "../Icons/UserIcon";
import { BottomNavigation } from "./BottomNavigation";
import { BottomNavigationAction } from "./BottomNavigationAction";

const meta: Meta<typeof BottomNavigation> = {
  title: "Components/BottomNavigation",
  component: BottomNavigation,
  parameters: {
    layout: "fullscreen",
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
        <BottomNavigationAction value="search" icon={<SearchIcon />} label="Search" />
        <BottomNavigationAction value="favorites" icon={<LoveIcon />} label="Favorites" />
        <BottomNavigationAction value="profile" icon={<UserIcon />} label="Profile" />
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
            <span className="flex size-4 items-center justify-center rounded-full bg-error-default text-[10px] text-white">
              3
            </span>
          }
        />
        <BottomNavigationAction value="profile" icon={<UserIcon />} label="Profile" />
      </BottomNavigation>
    );
  },
};

export const HideLabels: Story = {
  render: () => {
    const [value, setValue] = React.useState("home");
    return (
      <BottomNavigation
        value={value}
        onValueChange={setValue}
        hideLabels
        aria-label="Main navigation"
      >
        <BottomNavigationAction value="home" icon={<HomeIcon />} label="Home" />
        <BottomNavigationAction value="search" icon={<SearchIcon />} label="Search" />
        <BottomNavigationAction value="favorites" icon={<LoveIcon />} label="Favorites" />
        <BottomNavigationAction value="profile" icon={<UserIcon />} label="Profile" />
      </BottomNavigation>
    );
  },
};

export const ShowLabelsOnlyWhenActive: Story = {
  render: () => {
    const [value, setValue] = React.useState("home");
    return (
      <BottomNavigation
        value={value}
        onValueChange={setValue}
        showLabelsOnlyWhenActive
        aria-label="Main navigation"
      >
        <BottomNavigationAction value="home" icon={<HomeIcon />} label="Home" />
        <BottomNavigationAction value="search" icon={<SearchIcon />} label="Search" />
        <BottomNavigationAction value="favorites" icon={<LoveIcon />} label="Favorites" />
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
          <a href="#home">Home</a>
        </BottomNavigationAction>
        <BottomNavigationAction value="search" icon={<SearchIcon />} label="Search" asChild>
          <a href="#search">Search</a>
        </BottomNavigationAction>
        <BottomNavigationAction value="favorites" icon={<LoveIcon />} label="Favorites" asChild>
          <a href="#favorites">Favorites</a>
        </BottomNavigationAction>
        <BottomNavigationAction value="profile" icon={<UserIcon />} label="Profile" asChild>
          <a href="#profile">Profile</a>
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
