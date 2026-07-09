import type { Meta, StoryObj } from "@storybook/react";
import { VoiceNote } from "./VoiceNote";

const meta = {
  title: "Components/VoiceNote",
  component: VoiceNote,
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=18178-73101",
    },
  },
  tags: ["autodocs"],
  args: {
    time: "0:05",
  },
  argTypes: {
    variant: { control: "select", options: ["default", "flat"] },
    size: { control: "select", options: ["default", "small"] },
    negative: { control: "boolean" },
    progress: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
  },
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VoiceNote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Listening: Story = {
  args: { progress: 0.4, playing: true, time: "0:02" },
};

export const Flat: Story = {
  args: { variant: "flat" },
};

export const Small: Story = {
  args: { size: "small" },
};

export const WithFileName: Story = {
  args: { fileName: "audio_name.mp4" },
};

export const WithRemove: Story = {
  args: { showRemove: true },
};

export const WithoutControls: Story = {
  args: { showControls: false },
};

export const Negative: Story = {
  args: { negative: true, progress: 0.4, playing: true, time: "0:02" },
  decorators: [
    (Story) => (
      <div className="w-[420px] rounded-md bg-surface-primary-inverted p-4">
        <Story />
      </div>
    ),
  ],
};

export const States: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <VoiceNote {...args} variant="flat" />
      <VoiceNote {...args} />
      <VoiceNote {...args} progress={0.4} playing time="0:02" />
    </div>
  ),
};
