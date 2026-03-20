import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button/Button";
import { IconButton } from "../IconButton/IconButton";
import { BoltIcon } from "../Icons/BoltIcon";
import { ChartIcon } from "../Icons/ChartIcon";
import { ChevronLeftIcon } from "../Icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../Icons/ChevronRightIcon";
import { MoreIcon } from "../Icons/MoreIcon";
import { PlusIcon } from "../Icons/PlusIcon";
import { SearchIcon } from "../Icons/SearchIcon";
import { UploadIcon } from "../Icons/UploadIcon";
import { UsersIcon } from "../Icons/UsersIcon";
import {
  ScreenHeader,
  ScreenHeaderActions,
  ScreenHeaderDotIndicators,
  ScreenHeaderGreeting,
  ScreenHeaderOnboardingRow,
  ScreenHeaderSteps,
  ScreenHeaderTitle,
  ScreenHeaderToolbar,
} from "./ScreenHeader";

const meta = {
  title: "Components/ScreenHeader",
  component: ScreenHeader,
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=87-5436",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    device: { control: "select", options: ["mobile", "desktop"] },
    surface: { control: "select", options: ["default", "frosted"] },
  },
} satisfies Meta<typeof ScreenHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HomeWithSearch: Story = {
  render: (args) => (
    <ScreenHeader {...args} className="max-w-md">
      <ScreenHeaderToolbar>
        <ScreenHeaderTitle className="min-w-0 flex-1">Home</ScreenHeaderTitle>
        <ScreenHeaderActions>
          <IconButton variant="tertiary" size="32" icon={<SearchIcon />} aria-label="Search" />
        </ScreenHeaderActions>
      </ScreenHeaderToolbar>
    </ScreenHeader>
  ),
  args: { device: "mobile", surface: "default" },
};

export const MessagesToolbar: Story = {
  render: (args) => (
    <ScreenHeader {...args} className="max-w-md">
      <ScreenHeaderToolbar>
        <ScreenHeaderTitle className="min-w-0 flex-1">Messages</ScreenHeaderTitle>
        <ScreenHeaderActions>
          <IconButton variant="tertiary" size="32" icon={<UsersIcon />} aria-label="Add contact" />
          <IconButton variant="tertiary" size="32" icon={<ChartIcon />} aria-label="Statistics" />
          <IconButton variant="tertiary" size="32" icon={<BoltIcon />} aria-label="Quick actions" />
          <IconButton variant="tertiary" size="32" icon={<PlusIcon />} aria-label="Create" />
        </ScreenHeaderActions>
      </ScreenHeaderToolbar>
    </ScreenHeader>
  ),
  args: { device: "mobile", surface: "default" },
};

export const CreateProfileDiscover: Story = {
  render: (args) => (
    <div className="flex max-w-md flex-col gap-4">
      {(["Create", "Profile", "Discover"] as const).map((label) => (
        <ScreenHeader
          key={label}
          {...args}
          surface={label === "Discover" ? "frosted" : "default"}
          className="max-w-md rounded-lg"
        >
          <ScreenHeaderToolbar>
            <ScreenHeaderTitle className="min-w-0 flex-1">{label}</ScreenHeaderTitle>
            <ScreenHeaderActions>
              <IconButton
                variant="tertiary"
                size="32"
                icon={<ChartIcon />}
                aria-label="Statistics"
              />
              <IconButton
                variant="tertiary"
                size="32"
                icon={<BoltIcon />}
                aria-label="Quick actions"
              />
              <IconButton variant="tertiary" size="32" icon={<PlusIcon />} aria-label="Create" />
            </ScreenHeaderActions>
          </ScreenHeaderToolbar>
        </ScreenHeader>
      ))}
    </div>
  ),
  args: { device: "mobile", surface: "default" },
};

export const Greeting: Story = {
  render: (args) => (
    <ScreenHeader {...args} className="max-w-md">
      <ScreenHeaderToolbar>
        <ScreenHeaderGreeting greetingTitle="Hello, [Name]" greetingSubtitle="Profile" />
        <ScreenHeaderActions>
          <IconButton variant="tertiary" size="32" icon={<MoreIcon />} aria-label="More" />
        </ScreenHeaderActions>
      </ScreenHeaderToolbar>
    </ScreenHeader>
  ),
  args: { device: "mobile", surface: "default" },
};

export const TitleWithSave: Story = {
  render: (args) => (
    <ScreenHeader {...args} className="max-w-md">
      <ScreenHeaderToolbar>
        <ScreenHeaderTitle className="min-w-0 flex-1">Title</ScreenHeaderTitle>
        <ScreenHeaderActions>
          <Button variant="tertiary" size="32">
            Save
          </Button>
        </ScreenHeaderActions>
      </ScreenHeaderToolbar>
    </ScreenHeader>
  ),
  args: { device: "mobile", surface: "default" },
};

export const PageTicker: Story = {
  render: (args) => (
    <ScreenHeader {...args} className="max-w-md flex-col items-stretch">
      <ScreenHeaderSteps total={6} activeIndex={0} className="flex-1" />
    </ScreenHeader>
  ),
  args: { device: "mobile", surface: "default" },
};

export const PaginationCarousel: Story = {
  render: (args) => (
    <ScreenHeader {...args} className="max-w-md flex-col items-stretch gap-0 p-0">
      <ScreenHeaderOnboardingRow>
        <IconButton variant="tertiary" size="32" icon={<ChevronLeftIcon />} aria-label="Previous" />
        <div className="flex flex-col items-center gap-3">
          <p className="typography-semibold-body-lg text-center text-content-primary">Title</p>
          <ScreenHeaderDotIndicators count={11} activeIndex={0} className="w-[168px]" />
        </div>
        <IconButton variant="tertiary" size="32" icon={<ChevronRightIcon />} aria-label="Next" />
      </ScreenHeaderOnboardingRow>
    </ScreenHeader>
  ),
  args: { device: "mobile", surface: "default" },
};

export const Insight: Story = {
  render: (args) => (
    <ScreenHeader {...args} className="max-w-md">
      <ScreenHeaderToolbar>
        <ScreenHeaderTitle className="min-w-0 flex-1">Insight</ScreenHeaderTitle>
        <ScreenHeaderActions className="gap-4">
          <IconButton variant="tertiary" size="32" icon={<UploadIcon />} aria-label="Upload" />
          <div className="flex items-center gap-0">
            <IconButton
              variant="tertiary"
              size="32"
              icon={<ChevronLeftIcon />}
              aria-label="Previous day"
            />
            <Button variant="tertiary" size="32" className="typography-semibold-body-lg underline">
              Today
            </Button>
            <IconButton
              variant="tertiary"
              size="32"
              icon={<ChevronRightIcon />}
              aria-label="Next day"
            />
          </div>
        </ScreenHeaderActions>
      </ScreenHeaderToolbar>
    </ScreenHeader>
  ),
  args: { device: "mobile", surface: "default" },
};

export const SimpleText: Story = {
  render: (args) => (
    <ScreenHeader {...args} className="max-w-md">
      <ScreenHeaderToolbar>
        <ScreenHeaderTitle className="min-w-0 flex-1">Text</ScreenHeaderTitle>
      </ScreenHeaderToolbar>
    </ScreenHeader>
  ),
  args: { device: "mobile", surface: "default" },
};
