import type { Meta, StoryObj } from "@storybook/react";
import { Toast, ToastProvider, ToastViewport } from "./Toast";

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=12676-31063&m=dev",
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
        <ToastViewport />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: "info",
    title: "Info",
    description: "This is an informational message",
    open: true,
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Warning",
    description: "This is a warning message",
    open: true,
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "Success",
    description: "This is a success message",
    open: true,
  },
};

// biome-ignore lint/suspicious/noShadowRestrictedNames: Story name must match Figma variant
export const Error: Story = {
  args: {
    variant: "error",
    title: "Error",
    description: "This is an error message",
    open: true,
  },
};

export const MessageToast: Story = {
  args: {
    variant: "messageToast",
    title: "Title",
    description: "Placeholder text for info toast notifications",
    avatarSrc: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop",
    avatarAlt: "User avatar",
    avatarFallback: "16",
    open: true,
  },
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
