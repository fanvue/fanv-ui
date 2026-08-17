import type { Meta, StoryObj } from "@storybook/react";
import { CheckCircleIcon } from "../Icons/CheckCircleIcon";
import { Avatar, AvatarFallback, AvatarImage, AvatarRoot, type AvatarSize } from "./Avatar";

const SRC = "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=1393-1699&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: [16, 24, 32, 40, 48, 64, 88, 148],
      description: "Avatar size in pixels (matches Figma size property)",
      table: {
        type: { summary: "16 | 24 | 32 | 40 | 48 | 64 | 88 | 148" },
        defaultValue: { summary: "40" },
      },
    },
    onlineIndicator: { control: "boolean" },
    platinumShow: { control: "boolean" },
    NSFWShow: { control: "boolean" },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

const SIZES: AvatarSize[] = [16, 24, 32, 40, 48, 64, 88, 148];

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    <span className="typography-description-12px-semibold text-content-tertiary">{label}</span>
    <div className="flex flex-wrap items-end gap-3">{children}</div>
  </div>
);

/** Every size, for each of the three content types the avatar can render. */
export const AllSizes: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-6">
      <Row label="Image">
        {SIZES.map((size) => (
          <Avatar key={size} size={size} src={SRC} alt="User avatar" fallback="JD" />
        ))}
      </Row>
      <Row label="Initials">
        {SIZES.map((size) => (
          <Avatar key={size} size={size} fallback="AB" />
        ))}
      </Row>
      <Row label="Icon">
        {SIZES.map((size) => (
          <Avatar key={size} size={size} fallback={<CheckCircleIcon />} />
        ))}
      </Row>
      <Row label="Empty">
        {SIZES.map((size) => (
          <Avatar key={size} size={size} fallback="" />
        ))}
      </Row>
    </div>
  ),
};

/**
 * The three decorations — online indicator, platinum gradient border and NSFW blur —
 * against each content type, at a small, default and large size so the indicator
 * scaling is covered.
 */
export const AllDecorations: Story = {
  parameters: { layout: "padded" },
  render: () => {
    const decorations = [
      { label: "Online indicator", props: { onlineIndicator: true } },
      { label: "Platinum", props: { platinumShow: true } },
      { label: "NSFW", props: { NSFWShow: true } },
      { label: "Platinum + NSFW", props: { platinumShow: true, NSFWShow: true } },
      {
        label: "All three",
        props: { platinumShow: true, NSFWShow: true, onlineIndicator: true },
      },
    ];
    return (
      <div className="flex flex-col gap-6">
        {decorations.map(({ label, props }) => (
          <Row key={label} label={label}>
            {([24, 40, 88] as AvatarSize[]).map((size) => (
              <Avatar key={size} size={size} src={SRC} alt="User avatar" fallback="JD" {...props} />
            ))}
            {([24, 40, 88] as AvatarSize[]).map((size) => (
              <Avatar key={`initials-${size}`} size={size} fallback="AB" {...props} />
            ))}
            <Avatar size={40} fallback={<CheckCircleIcon />} {...props} />
          </Row>
        ))}
      </div>
    );
  },
};

export const Default: Story = {
  args: {
    src: SRC,
    alt: "User avatar",
    fallback: "JD",
  },
};

/**
 * Framework-Agnostic Usage
 *
 * For Next.js, Gatsby, or other custom image components, import the individual components
 * and use `asChild` on `AvatarImage` to render your framework's image component.
 *
 * @example
 * // With Next.js Image
 * import { AvatarRoot, AvatarImage, AvatarFallback } from '@fanvue/ui';
 * import Image from 'next/image';
 *
 * <AvatarRoot size={40} onlineIndicator>
 *   <AvatarImage asChild>
 *     <Image src="/avatar.jpg" alt="User" fill style={{ objectFit: 'cover' }} />
 *   </AvatarImage>
 *   <AvatarFallback>JD</AvatarFallback>
 * </AvatarRoot>
 *
 * @example
 * // With Gatsby Image
 * import { AvatarRoot, AvatarImage, AvatarFallback } from '@fanvue/ui';
 * import { GatsbyImage } from 'gatsby-plugin-image';
 *
 * <AvatarRoot size={88}>
 *   <AvatarImage asChild>
 *     <GatsbyImage image={avatarImage} alt="User" />
 *   </AvatarImage>
 *   <AvatarFallback>AB</AvatarFallback>
 * </AvatarRoot>
 *
 * @example
 * // With standard img (no framework)
 * import { AvatarRoot, AvatarImage, AvatarFallback } from '@fanvue/ui';
 *
 * <AvatarRoot size={40}>
 *   <AvatarImage src="https://example.com/avatar.jpg" alt="User" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </AvatarRoot>
 */
export const FrameworkAgnostic: Story = {
  render: (args) => (
    <AvatarRoot size={args.size} onlineIndicator={args.onlineIndicator}>
      <AvatarImage src={SRC} alt="User avatar" />
      <AvatarFallback>JD</AvatarFallback>
    </AvatarRoot>
  ),
  args: {
    size: 40,
    onlineIndicator: true,
  },
};
