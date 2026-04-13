import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Avatar } from "../Avatar/Avatar";
import { Button } from "../Button/Button";
import { IconButton } from "../IconButton/IconButton";
import { ExpandIcon } from "../Icons/ExpandIcon";
import { HomeIcon } from "../Icons/HomeIcon";
import { LoveIcon } from "../Icons/LoveIcon";
import { MessageIcon } from "../Icons/MessageIcon";
import { MoreIcon } from "../Icons/MoreIcon";
import { PinIcon } from "../Icons/PinIcon";
import { SettingsIcon } from "../Icons/SettingsIcon";
import { StarIcon } from "../Icons/StarIcon";
import { Skeleton } from "../Skeleton/Skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./Card";

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=14900-1019794&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["outlined", "elevated", "filled", "ghost"],
    },
    direction: {
      control: "select",
      options: ["vertical", "horizontal"],
    },
    as: {
      control: "select",
      options: ["div", "button"],
    },
    rounded: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl", "2xl", "3xl", "full"],
    },
    fullWidth: { control: "boolean" },
    noPadding: { control: "boolean" },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Outlined: Story = {
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <CardHeader action={<HomeIcon className="size-5" />}>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Card description text</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="typography-regular-body-md text-content-tertiary">Content goes here</p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" size="40">
          Label
        </Button>
        <Button variant="primary" size="40">
          Label
        </Button>
      </CardFooter>
    </Card>
  ),
  args: {
    variant: "outlined",
  },
};

export const Elevated: Story = {
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <CardHeader action={<HomeIcon className="size-5" />}>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Card description text</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="typography-regular-body-md text-content-tertiary">Content goes here</p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" size="40">
          Label
        </Button>
        <Button variant="primary" size="40">
          Label
        </Button>
      </CardFooter>
    </Card>
  ),
  args: {
    variant: "elevated",
  },
};

export const Filled: Story = {
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <CardHeader action={<HomeIcon className="size-5" />}>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Card description text</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="typography-regular-body-md text-content-tertiary">Content goes here</p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" size="40">
          Label
        </Button>
        <Button variant="primary" size="40">
          Label
        </Button>
      </CardFooter>
    </Card>
  ),
  args: {
    variant: "filled",
  },
};

export const Ghost: Story = {
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <CardHeader action={<HomeIcon className="size-5" />}>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Card description text</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="typography-regular-body-md text-content-tertiary">Content goes here</p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" size="40">
          Label
        </Button>
        <Button variant="primary" size="40">
          Label
        </Button>
      </CardFooter>
    </Card>
  ),
  args: {
    variant: "ghost",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      {(["outlined", "elevated", "filled", "ghost"] as const).map((variant) => (
        <Card key={variant} variant={variant} className="w-64">
          <CardHeader action={<HomeIcon className="size-5" />}>
            <CardTitle>Card title</CardTitle>
            <CardDescription>Card description text</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="typography-regular-body-md text-content-tertiary">Content goes here</p>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" size="40">
              Label
            </Button>
            <Button variant="primary" size="40">
              Label
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  ),
};

export const HeaderOnly: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader action={<SettingsIcon className="size-5" />}>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account preferences</CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardContent>
        <p className="typography-regular-body-md text-content-primary">
          A simple card with just content and no header or footer.
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithMultipleActions: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader
        action={
          <div className="flex items-center gap-1">
            <IconButton variant="tertiary" size="32" icon={<StarIcon />} aria-label="Favorite" />
            <IconButton variant="tertiary" size="32" icon={<PinIcon />} aria-label="Pin" />
            <IconButton
              variant="tertiary"
              size="32"
              icon={<MoreIcon />}
              aria-label="More options"
            />
          </div>
        }
      >
        <CardTitle>Featured</CardTitle>
        <CardDescription>This card has multiple action icons</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="typography-regular-body-md text-content-tertiary">
          Content area for featured items
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="brand" size="40" fullWidth>
          Get Started
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const NoPadding: Story = {
  render: () => (
    <Card className="max-w-sm" noPadding>
      <div className="h-40 w-full rounded-t-md bg-neutral-alphas-200" />
      <div className="p-4">
        <CardHeader>
          <CardTitle>Media Card</CardTitle>
          <CardDescription>Card with an image banner</CardDescription>
        </CardHeader>
      </div>
    </Card>
  ),
};

export const InlineWidth: Story = {
  render: () => (
    <Card fullWidth={false} className="inline-flex">
      <CardHeader>
        <CardTitle>Inline card</CardTitle>
        <CardDescription>This card does not stretch to full width</CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Card direction="horizontal" className="max-w-md gap-4">
      <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-neutral-alphas-100">
        <HomeIcon className="size-6" />
      </div>
      <div className="min-w-0 flex-1">
        <CardHeader>
          <CardTitle>Horizontal card</CardTitle>
          <CardDescription>Content flows left to right</CardDescription>
        </CardHeader>
      </div>
    </Card>
  ),
};

export const Clickable: Story = {
  render: () => (
    <Card
      as="button"
      onClick={() => alert("Card clicked!")}
      className="max-w-sm transition-colors hover:bg-neutral-alphas-50"
    >
      <CardHeader action={<HomeIcon className="size-5" />}>
        <CardTitle>Clickable card</CardTitle>
        <CardDescription>This entire card is a button</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="typography-regular-body-md text-content-tertiary">
          Click anywhere on this card
        </p>
      </CardContent>
    </Card>
  ),
};

export const HorizontalClickable: Story = {
  render: () => (
    <Card
      as="button"
      direction="horizontal"
      variant="ghost"
      noPadding
      onClick={() => alert("Card clicked!")}
      className="group max-w-md gap-4 rounded-2xl border border-transparent p-3 transition-all hover:border-neutral-alphas-200 hover:bg-neutral-alphas-50"
    >
      <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border-2 border-transparent bg-neutral-alphas-100 transition-colors group-hover:border-brand-primary-hover">
        <HomeIcon className="size-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="typography-semibold-body-md truncate text-content-primary">Item title</p>
        <p className="typography-regular-body-sm text-content-secondary">
          A horizontal clickable card pattern
        </p>
      </div>
    </Card>
  ),
};

const MOCK_COMMENTS = [
  {
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop",
    fallback: "JD",
    username: "precious-caribou-33",
    time: "14 days ago",
    text: "Dove e quando",
  },
  {
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
    fallback: "SM",
    username: "sexymegrain",
    time: "4 months ago",
    text: "@violet_aria ❤️",
  },
];

function MediaPostExample() {
  const [showComments, setShowComments] = useState(false);

  return (
    <Card noPadding className="max-w-[480px]">
      <div className="flex items-center gap-3 p-4 pb-2">
        <Avatar
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
          alt="Creator With Everything"
          fallback="CW"
          size={40}
          platinumShow
        />
        <div className="min-w-0 flex-1">
          <p className="typography-semibold-body-md text-content-primary">
            Creator With Everything
          </p>
          <p className="typography-regular-body-sm text-content-secondary">
            @creator-with-everything
          </p>
        </div>
        <div className="flex items-center gap-1">
          <IconButton variant="tertiary" size="32" icon={<StarIcon />} aria-label="Favorite" />
          <IconButton variant="tertiary" size="32" icon={<MoreIcon />} aria-label="More options" />
        </div>
      </div>
      <p className="typography-regular-body-md px-4 pb-2 text-content-primary">testtest</p>
      <button type="button" className="group relative cursor-pointer">
        <img
          src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=960&h=640&fit=crop"
          alt="Forest with large tree"
          className="w-full object-cover"
          style={{ aspectRatio: "4/3" }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
          <ExpandIcon className="size-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1">
          <span className="flex size-5 items-center justify-center rounded-full border border-white font-bold text-[10px] text-white">
            $
          </span>
          <span className="typography-regular-body-sm text-white">Subscribers only</span>
        </div>
      </button>
      <div className="flex items-center gap-4 px-4 pt-3 pb-1">
        <LoveIcon className="size-6 text-content-primary" />
        <MessageIcon className="size-6 text-content-primary" />
      </div>
      <div className="flex items-center justify-between px-4 pt-1 pb-4">
        <div className="flex items-center gap-3">
          <Button variant="text" size="32">
            3 likes
          </Button>
          <Button variant="text" size="32" onClick={() => setShowComments(true)}>
            8 comments
          </Button>
        </div>
        <button
          type="button"
          className="typography-semibold-body-sm cursor-pointer rounded-xs border border-neutral-alphas-200 px-3 py-1.5 text-content-primary"
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? "Hide comments" : "Show comments"}
        </button>
      </div>
      {showComments && (
        <div className="flex flex-col gap-4 px-4 pb-4">
          {MOCK_COMMENTS.map((comment) => (
            <div key={comment.username} className="flex items-start gap-3">
              <Avatar
                src={comment.avatar}
                alt={comment.username}
                fallback={comment.fallback}
                size={40}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="typography-semibold-body-sm text-content-primary">
                    {comment.username}
                  </span>
                  <span className="typography-regular-body-xs text-content-tertiary">
                    {comment.time}
                  </span>
                </div>
                <p className="typography-regular-body-sm text-content-primary">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export const MediaPost: Story = {
  render: () => <MediaPostExample />,
};

export const MediaPostSkeleton: Story = {
  render: () => (
    <Card noPadding className="max-w-[480px]">
      <div className="flex items-center gap-3 p-4 pb-2">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="min-w-0 flex-1 space-y-1.5">
          <Skeleton variant="text" width={160} height={14} />
          <Skeleton variant="text" width={120} height={12} />
        </div>
      </div>
      <Skeleton variant="rectangular" width="100%" style={{ aspectRatio: "4/3" }} />
    </Card>
  ),
};
