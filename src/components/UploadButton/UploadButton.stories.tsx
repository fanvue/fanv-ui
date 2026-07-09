import type { Meta, StoryObj } from "@storybook/react";
import { UploadButton } from "./UploadButton";

const meta = {
  title: "Components/UploadButton",
  component: UploadButton,
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
    "aria-label": "Upload file",
  },
  argTypes: {
    status: {
      control: "select",
      options: ["idle", "uploading", "error"],
    },
    size: {
      control: "select",
      options: ["24", "32", "40", "48", "52", "72"],
    },
    negative: { control: "boolean" },
  },
} satisfies Meta<typeof UploadButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Uploading: Story = {
  args: { status: "uploading" },
};

export const Errored: Story = {
  args: { status: "error" },
};

export const AllStatuses: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <UploadButton {...args} status="idle" />
      <UploadButton {...args} status="uploading" />
      <UploadButton {...args} status="error" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <UploadButton {...args} size="24" />
      <UploadButton {...args} size="32" />
      <UploadButton {...args} size="40" />
      <UploadButton {...args} size="48" />
      <UploadButton {...args} size="52" />
      <UploadButton {...args} size="72" />
    </div>
  ),
};
