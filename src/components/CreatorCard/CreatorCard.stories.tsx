import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button/Button";
import { CreatorCard } from "./CreatorCard";

const SAMPLE_BACKGROUND = "/creator-card/banner.jpg";
const SAMPLE_AVATAR = "/creator-card/avatar.png";

const meta = {
  title: "Components/CreatorCard",
  component: CreatorCard,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/fEiyjeC3EyobaMp0nReSS6/Growth---Experiments?node-id=8639-75",
    },
  },
  tags: ["autodocs"],
  args: {
    className: "w-40 rounded-2xl",
    background: <img src={SAMPLE_BACKGROUND} alt="" loading="lazy" />,
    pill: { variant: "contrast", children: "Popular this week" },
    avatar: { src: SAMPLE_AVATAR, fallback: "AL" },
    name: "Aitana Lopez",
    verified: true,
    tagline: "Fitness · 412 posts",
    content: "$9.99 / month",
    action: (
      <Button variant="primary" size="32" fullWidth>
        Subscribe
      </Button>
    ),
  },
} satisfies Meta<typeof CreatorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Subscribed: Story = {
  args: {
    action: (
      <Button variant="secondary" size="32" fullWidth>
        Subscribed
      </Button>
    ),
  },
};

export const WithoutAction: Story = {
  args: {
    action: undefined,
  },
};

export const WithoutPill: Story = {
  args: {
    pill: undefined,
  },
};

export const CustomContent: Story = {
  args: {
    content: (
      <span className="flex items-baseline gap-1">
        $4.99
        <span className="typography-body-small-14px-regular text-content-secondary line-through">
          $9.99
        </span>
      </span>
    ),
  },
};

export const Wide: Story = {
  args: {
    className: "w-72 rounded-md",
    pill: { variant: "brand", children: "New creator" },
  },
};
