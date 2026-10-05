import type { Meta, StoryObj } from "@storybook/react";
import type * as React from "react";
import { Button } from "../Button/Button";
import { InfoCircleIcon } from "../Icons/InfoCircleIcon";
import { LiveStatus } from "../LiveStatus/LiveStatus";
import {
  ChatEmbed,
  type ChatEmbedProps,
  ChatEmbedSkeleton,
  type ChatEmbedSocialProof,
  ChatEmbedUnavailable,
  type ChatEmbedVariant,
} from "./ChatEmbed";

type ChatEmbedStoryArgs = Omit<ChatEmbedProps, "variant" | "socialProof"> & {
  variant?: ChatEmbedVariant;
  socialProof?: ChatEmbedSocialProof;
};

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
  component: ChatEmbed as React.ComponentType<ChatEmbedStoryArgs>,
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
    inactive: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="w-100">
        <Story />
      </div>
    ),
  ],
  args: {
    href: "https://www.fanvue.com",
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
} satisfies Meta<ChatEmbedStoryArgs>;

export default meta;
type Story = StoryObj<ChatEmbedStoryArgs>;

export const Creator: Story = {};

const experienceArgs = {
  variant: "experience",
  verified: true,
  aiDisclosure: false,
  media: <img src={STREAM} alt="" />,
  title: "Friday night Q&A",
  subtitle: "Made by @jane_doe",
} as const;

const OPEN = (
  <Button variant="white" size="32">
    Open
  </Button>
);

export const Generic: Story = {
  args: {
    ...experienceArgs,
    title: "Launch your page",
    action: OPEN,
  },
};

const CATEGORIES: Array<{ key: string; args: Partial<ChatEmbedStoryArgs> }> = [
  { key: "live-stream", args: { title: "Friday night Q&A", category: "Live stream" } },
  { key: "live-audio", args: { title: "Late night chat", category: "Live audio" } },
  {
    key: "video",
    args: {
      title: "Behind the scenes",
      category: "Video",
      media: <img src={PORTRAIT} alt="" />,
      mediaBackdrop: <img src={PORTRAIT} alt="" />,
      verticalMedia: true,
    },
  },
  {
    key: "audio",
    args: { title: "Morning meditation", category: "Audio", media: <img src={COVER} alt="" /> },
  },
  { key: "game", args: { title: "Neon Run", category: "Game", media: <img src={GAME} alt="" /> } },
  {
    key: "challenge",
    args: { title: "30 day glow up", category: "Challenge", media: <img src={COVER} alt="" /> },
  },
  { key: "quiz", args: { title: "How well do you know me?", category: "Quiz", media: undefined } },
  { key: "event", args: { title: "Fan meetup", category: "Event", meta: "Sat 12 Dec" } },
  { key: "other", args: { title: "Launch your page" } },
];

export const Categories: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {CATEGORIES.map((item) => (
        <ChatEmbed
          key={item.key}
          {...({ ...args, ...experienceArgs, action: OPEN, ...item.args } as ChatEmbedProps)}
        />
      ))}
    </div>
  ),
};

export const Live: Story = {
  args: {
    ...experienceArgs,
    badge: <LiveStatus variant="live" />,
    action: (
      <Button variant="white" size="32">
        Join
      </Button>
    ),
  },
};

export const LiveAudio: Story = {
  args: { ...Live.args, category: "Audio" },
};

export const LiveEnded: Story = {
  args: {
    ...experienceArgs,
    badge: <LiveStatus variant="ended" />,
    meta: "2 hours ago",
    inactive: true,
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
    category: "Game",
    media: <img src={GAME} alt="" />,
    title: "Neon Run",
    action: (
      <Button variant="white" size="32">
        Play Now
      </Button>
    ),
  },
};

export const WithSocialProof: Story = {
  args: {
    ...Live.args,
    socialProof: { avatars: WATCHERS, label: "+3 watching" },
  },
};

export const WithoutMedia: Story = {
  args: { ...Game.args, media: undefined },
};

export const VerticalMedia: Story = {
  args: {
    ...Live.args,
    media: <img src={PORTRAIT} alt="" />,
    mediaBackdrop: <img src={PORTRAIT} alt="" />,
    verticalMedia: true,
  },
};

export const Loading: Story = {
  render: () => <ChatEmbedSkeleton variant="experience" />,
};

export const Unavailable: Story = {
  render: () => (
    <ChatEmbedUnavailable variant="experience" icon={<InfoCircleIcon className="size-6" />} />
  ),
};
