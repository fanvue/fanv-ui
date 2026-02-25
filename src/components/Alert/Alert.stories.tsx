import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FireIcon } from "../Icons/FireIcon";
import { Alert } from "./Alert";

const meta = {
  title: "Components/Alert",
  component: Alert,
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=1622-9357&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "error"],
    },
    title: { control: "text" },
    closable: { control: "boolean" },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: "info",
    children: "This is an informational alert message.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "Your changes have been saved successfully.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children: "Please review your information before proceeding.",
  },
};

// biome-ignore lint/suspicious/noShadowRestrictedNames: Story name must match Figma variant
export const Error: Story = {
  args: {
    variant: "error",
    children: "An error occurred while processing your request.",
  },
};

export const InfoClosable: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);
    return visible ? (
      <Alert {...args} variant="info" closable onClose={() => setVisible(false)}>
        This is a closable info alert.
      </Alert>
    ) : (
      <div className="text-gray-500 text-sm">
        Alert dismissed!{" "}
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="cursor-pointer text-info-500 underline"
        >
          Show again
        </button>
      </div>
    );
  },
};

export const SuccessClosable: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);
    return visible ? (
      <Alert {...args} variant="success" closable onClose={() => setVisible(false)}>
        This is a closable success alert.
      </Alert>
    ) : (
      <div className="text-gray-500 text-sm">
        Alert dismissed!{" "}
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="cursor-pointer text-success-500 underline"
        >
          Show again
        </button>
      </div>
    );
  },
};

export const WarningClosable: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);
    return visible ? (
      <Alert {...args} variant="warning" closable onClose={() => setVisible(false)}>
        This is a closable warning alert.
      </Alert>
    ) : (
      <div className="text-gray-500 text-sm">
        Alert dismissed!{" "}
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="cursor-pointer text-warning-500 underline"
        >
          Show again
        </button>
      </div>
    );
  },
};

export const ErrorClosable: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);
    return visible ? (
      <Alert {...args} variant="error" closable onClose={() => setVisible(false)}>
        This is a closable error alert.
      </Alert>
    ) : (
      <div className="text-gray-500 text-sm">
        Alert dismissed!{" "}
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="cursor-pointer text-error-500 underline"
        >
          Show again
        </button>
      </div>
    );
  },
};

export const WithoutIcon: Story = {
  args: {
    variant: "info",
    icon: null,
    children: "This is an alert without an icon.",
  },
};

export const WithTitle: Story = {
  args: {
    variant: "info",
    title: "Alert title",
    children: "This is the body text for info in-app alert, longer text for the reference",
  },
};

export const SuccessWithTitle: Story = {
  args: {
    variant: "success",
    title: "Success!",
    children: "Your changes have been saved successfully.",
  },
};

export const WarningWithTitle: Story = {
  args: {
    variant: "warning",
    title: "Warning",
    children: "Please review your information before proceeding.",
  },
};

export const ErrorWithTitle: Story = {
  args: {
    variant: "error",
    title: "Error",
    children: "An error occurred while processing your request.",
  },
};

export const WithTitleClosable: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);
    return visible ? (
      <Alert
        {...args}
        variant="warning"
        title="Important Update"
        closable
        onClose={() => setVisible(false)}
      >
        Your subscription will expire in 3 days. Please renew to continue enjoying our services.
      </Alert>
    ) : (
      <div className="text-gray-500 text-sm">
        Alert dismissed!{" "}
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="cursor-pointer text-warning-500 underline"
        >
          Show again
        </button>
      </div>
    );
  },
};

export const CustomIcon: Story = {
  args: {
    variant: "warning",
    icon: <FireIcon />,
    children: "This alert uses a custom icon instead of the default.",
  },
};

export const LongContent: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);
    return visible ? (
      <Alert {...args} variant="info" closable onClose={() => setVisible(false)}>
        This is a longer alert message that contains multiple sentences. It demonstrates how the
        alert component handles more extensive content and ensures proper text wrapping and layout
        across different screen sizes.
      </Alert>
    ) : (
      <div className="text-gray-500 text-sm">
        Alert dismissed!{" "}
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="cursor-pointer text-info-500 underline"
        >
          Show again
        </button>
      </div>
    );
  },
};

export const WithCustomContent: Story = {
  args: {
    variant: "warning",
    title: "Important Update",
    children:
      "Your subscription will expire in 3 days. Please renew to continue enjoying our services.",
  },
};

export const InteractiveDismissible: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);

    return (
      <div className="space-y-4">
        {visible ? (
          <Alert {...args} variant="info" closable onClose={() => setVisible(false)}>
            Click the close button to dismiss this alert. It will disappear.
          </Alert>
        ) : (
          <div className="text-gray-500 text-sm">
            Alert dismissed!{" "}
            <button
              type="button"
              onClick={() => setVisible(true)}
              className="cursor-pointer text-info-500 underline"
            >
              Show again
            </button>
          </div>
        )}
      </div>
    );
  },
};

export const MultipleDismissible: Story = {
  render: () => {
    const [alerts, setAlerts] = useState({
      info: true,
      success: true,
      warning: true,
      error: true,
    });

    return (
      <div className="space-y-4">
        {alerts.info && (
          <Alert variant="info" closable onClose={() => setAlerts({ ...alerts, info: false })}>
            This is an informational alert. Click to dismiss.
          </Alert>
        )}
        {alerts.success && (
          <Alert
            variant="success"
            closable
            onClose={() => setAlerts({ ...alerts, success: false })}
          >
            Operation completed successfully. Click to dismiss.
          </Alert>
        )}
        {alerts.warning && (
          <Alert
            variant="warning"
            closable
            onClose={() => setAlerts({ ...alerts, warning: false })}
          >
            Please review this warning. Click to dismiss.
          </Alert>
        )}
        {alerts.error && (
          <Alert variant="error" closable onClose={() => setAlerts({ ...alerts, error: false })}>
            An error occurred. Click to dismiss.
          </Alert>
        )}
        {!alerts.info && !alerts.success && !alerts.warning && !alerts.error && (
          <div className="text-gray-500 text-sm">
            All alerts dismissed!{" "}
            <button
              type="button"
              onClick={() => setAlerts({ info: true, success: true, warning: true, error: true })}
              className="cursor-pointer text-info-500 underline"
            >
              Reset all
            </button>
          </div>
        )}
      </div>
    );
  },
};
