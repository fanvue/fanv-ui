import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarFallback, AvatarImage, AvatarRoot } from "./Avatar";

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

// Default with image
export const Default: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop",
    alt: "User avatar",
    fallback: "JD",
  },
};

// Size variants with image
export const Size16: Story = {
  args: {
    size: 16,
    src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop",
    alt: "User avatar",
    fallback: "JD",
  },
};

export const Size24: Story = {
  args: {
    size: 24,
    src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop",
    alt: "User avatar",
    fallback: "JD",
  },
};

export const Size32: Story = {
  args: {
    size: 32,
    src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop",
    alt: "User avatar",
    fallback: "JD",
  },
};

export const Size40: Story = {
  args: {
    size: 40,
    src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop",
    alt: "User avatar",
    fallback: "JD",
  },
};

export const Size48: Story = {
  args: {
    size: 48,
    src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop",
    alt: "User avatar",
    fallback: "JD",
  },
};

export const Size64: Story = {
  args: {
    size: 64,
    src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop",
    alt: "User avatar",
    fallback: "JD",
  },
};

export const Size88: Story = {
  args: {
    size: 88,
    src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop",
    alt: "User avatar",
    fallback: "JD",
  },
};

export const Size148: Story = {
  args: {
    size: 148,
    src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop",
    alt: "User avatar",
    fallback: "JD",
  },
};

// With initials
export const WithInitials: Story = {
  args: {
    fallback: "AB",
  },
};

export const WithInitialsSmall: Story = {
  args: {
    size: 24,
    fallback: "AB",
  },
};

export const WithInitialsLarge: Story = {
  args: {
    size: 88,
    fallback: "AB",
  },
};

// With icon
export const WithIcon: Story = {
  args: {
    fallback: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

export const WithIconSmall: Story = {
  args: {
    size: 24,
    fallback: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-3"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

export const WithIconLarge: Story = {
  args: {
    size: 88,
    fallback: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-10"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

// With online status
export const WithOnlineStatus: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop",
    alt: "User avatar",
    fallback: "JD",
    onlineIndicator: true,
  },
};

export const WithOnlineStatusSmall: Story = {
  args: {
    size: 24,
    src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop",
    alt: "User avatar",
    fallback: "JD",
    onlineIndicator: true,
  },
};

export const WithOnlineStatusLarge: Story = {
  args: {
    size: 88,
    src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop",
    alt: "User avatar",
    fallback: "JD",
    onlineIndicator: true,
  },
};

export const WithOnlineStatusInitials: Story = {
  args: {
    fallback: "AB",
    onlineIndicator: true,
  },
};

export const WithOnlineStatusIcon: Story = {
  args: {
    fallback: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
    onlineIndicator: true,
  },
};

// Empty/placeholder avatar
export const Empty: Story = {
  args: {
    fallback: "",
  },
};

// Platinum gradient border
export const WithPlatinum: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop",
    alt: "User avatar",
    fallback: "JD",
    platinumShow: true,
  },
};

export const WithPlatinumSmall: Story = {
  args: {
    size: 24,
    src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop",
    alt: "User avatar",
    fallback: "JD",
    platinumShow: true,
  },
};

export const WithPlatinumLarge: Story = {
  args: {
    size: 88,
    src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop",
    alt: "User avatar",
    fallback: "JD",
    platinumShow: true,
  },
};

export const WithPlatinumInitials: Story = {
  args: {
    fallback: "AB",
    platinumShow: true,
  },
};

export const WithPlatinumAndStatus: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop",
    alt: "User avatar",
    fallback: "JD",
    platinumShow: true,
    onlineIndicator: true,
  },
};

// NSFW blur filter
export const WithNSFW: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop",
    alt: "User avatar",
    fallback: "JD",
    NSFWShow: true,
  },
};

export const WithNSFWSmall: Story = {
  args: {
    size: 24,
    src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop",
    alt: "User avatar",
    fallback: "JD",
    NSFWShow: true,
  },
};

export const WithNSFWLarge: Story = {
  args: {
    size: 88,
    src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop",
    alt: "User avatar",
    fallback: "JD",
    NSFWShow: true,
  },
};

export const WithNSFWInitials: Story = {
  args: {
    fallback: "AB",
    NSFWShow: true,
  },
};

// Combined variations
export const WithPlatinumAndNSFW: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop",
    alt: "User avatar",
    fallback: "JD",
    platinumShow: true,
    NSFWShow: true,
  },
};

export const WithAllFeatures: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop",
    alt: "User avatar",
    fallback: "JD",
    size: 48,
    platinumShow: true,
    NSFWShow: true,
    onlineIndicator: true,
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
      <AvatarImage
        src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop"
        alt="User avatar"
      />
      <AvatarFallback>JD</AvatarFallback>
    </AvatarRoot>
  ),
  args: {
    size: 40,
    onlineIndicator: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "For framework-specific image components (Next.js, Gatsby, etc.), import `AvatarRoot`, `AvatarImage`, and `AvatarFallback` individually. Use the `asChild` prop on `AvatarImage` to render custom image components with full control over image optimization and loading.",
      },
    },
  },
};
