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
    title: { control: "text" },
    undoLabel: { control: "text" },
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

/** Both types with the same copy. Edit `title` in Controls to try your own. */
export const AllTypes: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div className="flex flex-col items-start gap-3">
      <UndoAlertPrompt {...args} type="positive" />
      <UndoAlertPrompt {...args} type="removed" />
    </div>
  ),
};

const ACTION_EXAMPLES = [
  { type: "positive", title: "Template Moved" },
  { type: "positive", title: "Post Scheduled" },
  { type: "positive", title: "3 Messages Archived" },
  { type: "removed", title: "Folder Deleted" },
  { type: "removed", title: "Media Removed from Vault" },
  { type: "removed", title: "Draft Discarded" },
] as const;

/**
 * The copy is not fixed. Write the title for whichever action just completed,
 * and pick `type` by outcome: `removed` for deletions, `positive` otherwise.
 */
export const ActionCopy: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div className="flex flex-col items-start gap-3">
      {ACTION_EXAMPLES.map((example) => (
        <UndoAlertPrompt key={example.title} {...args} type={example.type} title={example.title} />
      ))}
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
