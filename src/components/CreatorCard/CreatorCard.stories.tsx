import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button/Button";
import { CreatorCard } from "./CreatorCard";

const SAMPLE_BACKGROUND =
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=320&h=352&fit=crop";
const SAMPLE_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop";

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
    className: "w-40 rounded-md",
    background: <img src={SAMPLE_BACKGROUND} alt="" loading="lazy" />,
    pill: { variant: "contrast", children: "Popular this week" },
    avatar: { src: SAMPLE_AVATAR, fallback: "JD" },
    name: "Jane Doe",
    verified: true,
    tagline: "412 posts",
    content: <span className="block truncate">$9.99 / month</span>,
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
