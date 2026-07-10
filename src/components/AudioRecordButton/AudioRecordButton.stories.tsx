import type { Meta, StoryObj } from "@storybook/react";
import { AudioRecordButton } from "./AudioRecordButton";

const meta = {
  title: "Components/AudioRecordButton",
  component: AudioRecordButton,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=18381-63172",
    },
  },
  tags: ["autodocs"],
  args: {
    status: "idle",
    size: "40",
  },
  argTypes: {
    status: {
      control: "select",
      options: ["idle", "recording"],
    },
    size: {
      control: "select",
      options: ["24", "32", "40", "48", "52", "72"],
    },
  },
} satisfies Meta<typeof AudioRecordButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {};

export const Recording: Story = {
  args: { status: "recording" },
};

export const BothStates: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <AudioRecordButton {...args} status="idle" />
      <AudioRecordButton {...args} status="recording" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <AudioRecordButton {...args} size="32" />
      <AudioRecordButton {...args} size="40" />
      <AudioRecordButton {...args} size="48" />
      <AudioRecordButton {...args} size="52" />
      <AudioRecordButton {...args} size="72" />
    </div>
  ),
};
