import type { Meta, StoryObj } from "@storybook/react";
import { Toast, ToastProvider, ToastViewport } from "./Toast";

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=627-1406&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    state: {
      control: "select",
      options: ["Info", "Warning", "Success", "Error"],
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
    state: "Info",
    title: "Info",
    description: "This is an informational message",
    open: true,
  },
};

export const Warning: Story = {
  args: {
    state: "Warning",
    title: "Warning",
    description: "This is a warning message",
    open: true,
  },
};

export const Success: Story = {
  args: {
    state: "Success",
    title: "Success",
    description: "This is a success message",
    open: true,
  },
};

// biome-ignore lint/suspicious/noShadowRestrictedNames: Story name must match Figma variant
export const Error: Story = {
  args: {
    state: "Error",
    title: "Error",
    description: "This is an error message",
    open: true,
  },
};

export const WithoutDescription: Story = {
  args: {
    state: "Info",
    title: "Info message",
    open: true,
  },
};

export const WithoutTitle: Story = {
  args: {
    state: "Success",
    description: "Operation completed successfully",
    open: true,
  },
};

export const WithAction: Story = {
  args: {
    state: "Info",
    title: "Update available",
    description: "A new version is available",
    action: (
      <button
        type="button"
        className="rounded bg-info-500 px-3 py-1.5 font-semibold text-body-300 text-xs hover:bg-info-500/90"
      >
        Update
      </button>
    ),
    open: true,
  },
};

export const WithoutClose: Story = {
  args: {
    state: "Success",
    title: "Success",
    description: "Operation completed",
    showClose: false,
    open: true,
  },
};

export const LongContent: Story = {
  args: {
    state: "Warning",
    title: "Warning: Important Information",
    description:
      "This is a longer message that demonstrates how the toast component handles multiple lines of text and maintains its layout with proper spacing and readability.",
    open: true,
  },
};
