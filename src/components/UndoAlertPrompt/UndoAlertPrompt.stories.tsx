import type { Meta, StoryObj } from "@storybook/react";
import { ToastProvider, ToastViewport } from "../Toast/Toast";
import { UndoAlertPrompt } from "./UndoAlertPrompt";

const meta = {
  title: "Components/UndoAlertPrompt",
  component: UndoAlertPrompt,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=22780-3433&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["positive", "removed"],
    },
  },
  args: {
    title: "Template Moved",
    onUndo: () => {},
    open: true,
  },
  decorators: [
    (Story) => (
      <ToastProvider duration={Number.POSITIVE_INFINITY}>
        <Story />
        <ToastViewport className="relative" />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof UndoAlertPrompt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Positive: Story = {
  args: {
    type: "positive",
    title: "Template Moved",
  },
};

export const Removed: Story = {
  args: {
    type: "removed",
    title: "Folder Deleted",
  },
};

/** Both types. Rendered in one viewport so they stack as they would in the app. */
export const AllTypes: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div className="flex flex-col items-start gap-3">
      <UndoAlertPrompt {...args} type="positive" title="Template Moved" />
      <UndoAlertPrompt {...args} type="removed" title="Folder Deleted" />
    </div>
  ),
};

export const CustomLabel: Story = {
  args: {
    type: "removed",
    title: "Message Unsent",
    undoLabel: "Restore",
  },
};
