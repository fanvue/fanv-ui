import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button/Button";
import { ChatEmbed } from "./ChatEmbed";

const COVER = "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=320&fit=crop";
const STREAM = "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=480&fit=crop";
const GAME = "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=480&fit=crop";
const PORTRAIT =
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=360&h=640&fit=crop";
const AVATAR = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop";
const WATCHERS = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop",
].map((src) => ({ src, alt: "" }));

const meta = {
  title: "Components/ChatEmbed",
  component: ChatEmbed,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=21501-2977",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["creator", "experience"] },
    status: { control: "select", options: [undefined, "live", "ended", "game"] },
  },
  decorators: [
    (Story) => (
      <div className="w-100">
        <Story />
      </div>
    ),
  ],
  args: {
    media: <img src={COVER} alt="" />,
    avatar: { src: AVATAR, alt: "Jane Doe", fallback: "JD" },
    title: "Display Name",
    subtitle: "@handle",
    verified: true,
    aiDisclosure: true,
    action: (
      <Button variant="white" size="32">
        View Profile
      </Button>
    ),
  },
} satisfies Meta<typeof ChatEmbed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Creator: Story = {};

const experienceArgs = {
  variant: "experience",
  verified: false,
  aiDisclosure: false,
  media: <img src={STREAM} alt="" />,
  title: "Friday night Q&A",
  subtitle: "@jane_doe",
  socialProof: { avatars: WATCHERS, name: "Jane Doe", label: "+2 watching" },
} as const;

export const Live: Story = {
  args: {
    ...experienceArgs,
    status: "live",
    action: (
      <Button variant="white" size="32">
        Join
      </Button>
    ),
  },
};

export const LiveWithMeta: Story = {
  args: { ...Live.args, meta: "842 watching" },
};

export const LiveEnded: Story = {
  args: {
    ...experienceArgs,
    status: "ended",
    meta: "2 hours ago",
    socialProof: undefined,
    action: (
      <Button variant="white" size="32">
        Follow
      </Button>
    ),
  },
};

export const Game: Story = {
  args: {
    ...experienceArgs,
    status: "game",
    media: <img src={GAME} alt="" />,
    title: "Neon Run",
    subtitle: "Made by @jane_doe",
    action: (
      <Button variant="white" size="32">
        Play Now
      </Button>
    ),
  },
};

export const VerticalMedia: Story = {
  args: {
    ...Live.args,
    media: <img src={PORTRAIT} alt="" />,
    verticalMedia: true,
  },
};
