import type { Meta, StoryObj } from "@storybook/react";
import { Pill } from "./Pill";

const meta = {
  title: "Components/Pill",
  component: Pill,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "Green",
        "Grey",
        "Blue",
        "Gold",
        "Pink Light",
        "Base",
        "Brand",
        "Brand light",
        "Beta",
        "Error",
      ],
    },
  },
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Green: Story = {
  args: {
    variant: "Green",
    children: "Subscriber",
  },
};

export const Grey: Story = {
  args: {
    variant: "Grey",
    children: "Expired",
  },
};

export const Blue: Story = {
  args: {
    variant: "Blue",
    children: "Follower",
  },
};

export const Gold: Story = {
  args: {
    variant: "Gold",
    children: "VIP Subscriber",
  },
};

export const PinkLight: Story = {
  args: {
    variant: "Pink Light",
    children: "Text",
  },
};

export const Base: Story = {
  args: {
    variant: "Base",
    children: "Example",
  },
};

export const Brand: Story = {
  args: {
    variant: "Brand",
    children: "20% discount",
  },
};

export const BrandLight: Story = {
  args: {
    variant: "Brand light",
    children: "20% discount",
  },
};

export const Beta: Story = {
  args: {
    variant: "Beta",
    children: "Beta",
  },
};

// biome-ignore lint/suspicious/noShadowRestrictedNames: Story name must match Figma variant
export const Error: Story = {
  args: {
    variant: "Error",
    children: "Error",
  },
};

export const LeftIcon: Story = {
  args: {
    variant: "Base",
    leftIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-4"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M13.5 4.938a7 7 0 11-9.006 1.737c.202-.257.59-.218.793.039.278.352.594.672.943.954.332.269.786-.049.773-.476a5.977 5.977 0 01.572-2.759 6.026 6.026 0 012.486-2.665c.247-.14.55-.016.677.238A6.967 6.967 0 0013.5 4.938zM14 12a4 4 0 01-4 4c-1.913 0-3.52-1.398-3.91-3.182-.093-.429.44-.643.814-.413a4.043 4.043 0 001.601.564c.303.038.531-.24.51-.544a5.975 5.975 0 011.315-4.192.447.447 0 01.431-.16A4.001 4.001 0 0114 12z"
          clipRule="evenodd"
        />
      </svg>
    ),
    children: "Example",
  },
};

export const RightIcon: Story = {
  args: {
    variant: "Brand",
    rightIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-4"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
          clipRule="evenodd"
        />
      </svg>
    ),
    children: "20% discount",
  },
};
