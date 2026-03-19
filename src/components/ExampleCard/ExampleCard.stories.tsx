import type { Meta, StoryObj } from "@storybook/react";
import { ExampleCard } from "./ExampleCard";

const meta = {
  title: "Components/ExampleCard",
  component: ExampleCard,
  args: {
    title: "Internal Component",
    description:
      "This card composes Card and Button from @fanvue/ui to verify the peer dependency integration works correctly.",
  },
} satisfies Meta<typeof ExampleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomAction: Story = {
  args: {
    actionLabel: "Get started",
    onAction: () => console.log("clicked"),
  },
};
