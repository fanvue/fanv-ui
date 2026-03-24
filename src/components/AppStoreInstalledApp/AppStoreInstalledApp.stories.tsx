import type { Meta, StoryObj } from "@storybook/react";
import { AppStoreInstalledApp } from "./AppStoreInstalledApp";

const sampleImage = {
  src: "https://placehold.co/160x160/151515/ffffff/png?text=App",
  alt: "App icon",
};

const meta = {
  title: "App store/AppStoreInstalledApp",
  component: AppStoreInstalledApp,
  args: {
    title: "Content Scheduler Pro",
    builderName: "Builder name",
    imageProps: sampleImage,
    onOpen: () => {},
    onMenuPress: () => {},
  },
} satisfies Meta<typeof AppStoreInstalledApp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
