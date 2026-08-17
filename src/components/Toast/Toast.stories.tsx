import type { Meta, StoryObj } from "@storybook/react";
import { Toast, ToastProvider, ToastViewport } from "./Toast";

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=17949-11949&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "warning", "success", "error", "messageToast"],
    },
    showClose: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
        <ToastViewport className="relative" />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every variant. Rendered in one viewport so they stack as they would in the app. */
export const AllVariants: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-3">
      {(["info", "warning", "success", "error", "messageToast"] as const).map((variant) => (
        <Toast
          key={variant}
          open
          variant={variant}
          title={variant}
          description={`This is a ${variant} message`}
        />
      ))}
    </div>
  ),
};

export const WithoutDescription: Story = {
  args: {
    variant: "info",
    title: "Info message",
    open: true,
  },
};

export const WithoutTitle: Story = {
  args: {
    variant: "success",
    description: "Operation completed successfully",
    open: true,
  },
};

export const WithAction: Story = {
  args: {
    variant: "info",
    title: "Update available",
    description: "A new version is available",
    onActionClick: () => {
      console.log("Action clicked");
    },
    actionLabel: "Update",
    open: true,
  },
};

export const WithoutClose: Story = {
  args: {
    variant: "success",
    title: "Success",
    description: "Operation completed",
    showClose: false,
    open: true,
  },
};

export const LongContent: Story = {
  args: {
    variant: "warning",
    title: "Warning: Important Information",
    description:
      "This is a longer message that demonstrates how the toast component handles multiple lines of text and maintains its layout with proper spacing and readability.",
    open: true,
  },
};
