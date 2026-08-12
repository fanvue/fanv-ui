import type { Meta, StoryObj } from "@storybook/react";
import { AiDisclosureLabel } from "./AiDisclosureLabel";

const meta = {
  title: "Components/AiDisclosureLabel",
  component: AiDisclosureLabel,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=20586-1134&m=dev",
    },
  },
  tags: ["autodocs"],
  args: { label: "Generated" },
  argTypes: {
    size: { control: "inline-radio", options: ["12", "16", "20"] },
    tone: {
      control: "inline-radio",
      options: ["dark", "light", "transparent"],
    },
  },
} satisfies Meta<typeof AiDisclosureLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Generated: Story = {};

export const Modified: Story = {
  args: { label: "Modified" },
};

export const Sizes: Story = {
  args: { label: "Modified" },
  render: (args) => (
    <div className="flex items-center gap-4">
      <AiDisclosureLabel {...args} size="12" />
      <AiDisclosureLabel {...args} size="16" />
      <AiDisclosureLabel {...args} size="20" />
    </div>
  ),
};

/** Every tone is fixed rather than theme-reactive, so each is shown over media. */
export const Tones: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 rounded-md bg-linear-to-br from-[#0e3b2f] via-[#1f8f6a] to-[#35d0a5] p-6">
      <AiDisclosureLabel {...args} tone="dark" />
      <AiDisclosureLabel {...args} tone="light" />
      <AiDisclosureLabel {...args} tone="transparent" />
    </div>
  ),
};

/** The wording is live text, so a translated string flows through unchanged. */
export const Translated: Story = {
  args: { label: "Modifié" },
};
