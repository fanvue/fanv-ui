import type { Meta, StoryObj } from "@storybook/react";
import { AudioUpload } from "./AudioUpload";

const meta = {
  title: "Components/AudioUpload",
  component: AudioUpload,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=8698-181417&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    maxFileSize: { control: "number" },
    maxRecordingDuration: { control: "number" },
    minRecordingDuration: { control: "number" },
    allowRecording: { control: "boolean" },
    disabled: { control: "boolean" },
    uploadTitle: { control: "text" },
    uploadDescription: { control: "text" },
    recordButtonLabel: { control: "text" },
    separatorText: { control: "text" },
    maxFiles: { control: "number" },
  },
  args: {
    className: "w-80",
  },
} satisfies Meta<typeof AudioUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutRecording: Story = {
  args: {
    allowRecording: false,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const CustomLabels: Story = {
  args: {
    uploadTitle: "Drop your audio here",
    uploadDescription: "MP3, WAV, OGG — max 5MB",
    separatorText: "or alternatively",
    recordButtonLabel: "Use microphone",
    maxFileSize: 5 * 1024 * 1024,
  },
};

export const MultipleFiles: Story = {
  args: {
    maxFiles: 7,
    uploadDescription: "Audio files only, up to 10MB each (max 7 files)",
  },
};

export const ShortMaxDuration: Story = {
  args: {
    maxRecordingDuration: 10,
  },
};
