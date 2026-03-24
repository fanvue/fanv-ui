import type { Meta, StoryObj } from "@storybook/react";
import { AppStoreHeader } from "./AppStoreHeader";

const heroImage = {
  src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80",
  alt: "",
} as const;

const meta = {
  title: "App store/AppStoreHeader",
  component: AppStoreHeader,
  args: {
    title: (
      <>
        Do more
        <br />
        With fanvue Apps
      </>
    ),
    subtitle: "Reach the full potential of your earnings",
    imageProps: heroImage,
  },
} satisfies Meta<typeof AppStoreHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
