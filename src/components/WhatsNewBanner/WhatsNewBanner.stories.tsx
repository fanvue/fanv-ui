import type { Meta, StoryObj } from "@storybook/react";
import { WhatsNewBanner } from "./WhatsNewBanner";

const PREVIEW_IMAGE =
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=264&h=264&fit=crop&auto=format";

const meta = {
  title: "Components/WhatsNewBanner",
  component: WhatsNewBanner,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=7741-35760",
    },
  },
  tags: ["autodocs"],
  args: {
    title: "Perfectly proportioned",
    description: "Aspect ratio selection is here!",
    ctaLabel: "See how it works",
    ctaHref: "#",
    imageSrc: PREVIEW_IMAGE,
    imageAlt: "Feature preview",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["portrait", "landscape", "landscape-small"],
    },
  },
} satisfies Meta<typeof WhatsNewBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Portrait: Story = {
  args: { variant: "portrait" },
};

export const Landscape: Story = {
  args: { variant: "landscape" },
};

export const LandscapeSmall: Story = {
  args: { variant: "landscape-small" },
};

export const WithButtonCta: Story = {
  args: {
    variant: "landscape",
    ctaHref: undefined,
    ctaLabel: "See how it works",
  },
};

export const NoCtaLabel: Story = {
  args: {
    variant: "portrait",
    ctaLabel: "",
  },
};
