import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { BottomNavigation } from "./BottomNavigation";
import { BottomNavigationAction } from "./BottomNavigationAction";

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

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
        <BottomNavigationAction value="favorites" icon={<HeartIcon />} label="Favorites" />
        <BottomNavigationAction value="profile" icon={<ProfileIcon />} label="Profile" />
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
          icon={<HeartIcon />}
          label="Favorites"
          badge={
            <span className="flex size-4 items-center justify-center rounded-full bg-error-default text-[10px] text-white">
              3
            </span>
          }
        />
        <BottomNavigationAction value="profile" icon={<ProfileIcon />} label="Profile" />
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
        <BottomNavigationAction value="favorites" icon={<HeartIcon />} label="Favorites" />
        <BottomNavigationAction value="profile" icon={<ProfileIcon />} label="Profile" />
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
        <BottomNavigationAction value="favorites" icon={<HeartIcon />} label="Favorites" />
        <BottomNavigationAction value="profile" icon={<ProfileIcon />} label="Profile" />
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
        <BottomNavigationAction value="favorites" icon={<HeartIcon />} label="Favorites" asChild>
          <a href="#favorites">Favorites</a>
        </BottomNavigationAction>
        <BottomNavigationAction value="profile" icon={<ProfileIcon />} label="Profile" asChild>
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
      <BottomNavigationAction value="favorites" icon={<HeartIcon />} label="Favorites" />
      <BottomNavigationAction value="profile" icon={<ProfileIcon />} label="Profile" />
    </BottomNavigation>
  ),
};
