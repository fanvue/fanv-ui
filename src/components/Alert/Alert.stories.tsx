import type { Meta, StoryObj } from "@storybook/react";
import type * as React from "react";
import { useState } from "react";
import { Alert } from "./Alert";

const InfoIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="size-5"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
      clipRule="evenodd"
    />
  </svg>
);

const SuccessIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="size-5"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
      clipRule="evenodd"
    />
  </svg>
);

const WarningIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="size-5"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
      clipRule="evenodd"
    />
  </svg>
);

const ErrorIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="size-5"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
      clipRule="evenodd"
    />
  </svg>
);

// Icon mapping for Storybook controls
const iconMap = {
  none: undefined,
  info: InfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

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
    icon: {
      control: "select",
      options: ["none", "info", "success", "warning", "error"],
      mapping: iconMap,
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: "info",
    icon: "info" as unknown as React.ReactNode,
    children: "This is an informational alert message.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    icon: "success" as unknown as React.ReactNode,
    children: "Your changes have been saved successfully.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    icon: "warning" as unknown as React.ReactNode,
    children: "Please review your information before proceeding.",
  },
};

// biome-ignore lint/suspicious/noShadowRestrictedNames: Story name must match Figma variant
export const Error: Story = {
  args: {
    variant: "error",
    icon: "error" as unknown as React.ReactNode,
    children: "An error occurred while processing your request.",
  },
};

export const InfoClosable: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);
    return visible ? (
      <Alert {...args} variant="info" icon={InfoIcon} closable onClose={() => setVisible(false)}>
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
      <Alert
        {...args}
        variant="success"
        icon={SuccessIcon}
        closable
        onClose={() => setVisible(false)}
      >
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
      <Alert
        {...args}
        variant="warning"
        icon={WarningIcon}
        closable
        onClose={() => setVisible(false)}
      >
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
      <Alert {...args} variant="error" icon={ErrorIcon} closable onClose={() => setVisible(false)}>
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
    icon: "none" as unknown as React.ReactNode,
    children: "This is an alert without an icon.",
  },
};

export const WithTitle: Story = {
  args: {
    variant: "info",
    icon: "info" as unknown as React.ReactNode,
    title: "Alert title",
    children: "This is the body text for info in-app alert, longer text for the reference",
  },
};

export const SuccessWithTitle: Story = {
  args: {
    variant: "success",
    icon: "success" as unknown as React.ReactNode,
    title: "Success!",
    children: "Your changes have been saved successfully.",
  },
};

export const WarningWithTitle: Story = {
  args: {
    variant: "warning",
    icon: "warning" as unknown as React.ReactNode,
    title: "Warning",
    children: "Please review your information before proceeding.",
  },
};

export const ErrorWithTitle: Story = {
  args: {
    variant: "error",
    icon: "error" as unknown as React.ReactNode,
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
        icon={WarningIcon}
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

export const LongContent: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);
    return visible ? (
      <Alert {...args} variant="info" icon={InfoIcon} closable onClose={() => setVisible(false)}>
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
    icon: "warning" as unknown as React.ReactNode,
    title: "Important Update",
    children:
      "Your subscription will expire in 3 days. Please renew to continue enjoying our services.",
  },
};

// Interactive example showing dismissal behavior
export const InteractiveDismissible: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);

    return (
      <div className="space-y-4">
        {visible ? (
          <Alert
            {...args}
            variant="info"
            icon={InfoIcon}
            closable
            onClose={() => setVisible(false)}
          >
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

// Multiple alerts with independent dismissal
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
          <Alert
            variant="info"
            icon={InfoIcon}
            closable
            onClose={() => setAlerts({ ...alerts, info: false })}
          >
            This is an informational alert. Click to dismiss.
          </Alert>
        )}
        {alerts.success && (
          <Alert
            variant="success"
            icon={SuccessIcon}
            closable
            onClose={() => setAlerts({ ...alerts, success: false })}
          >
            Operation completed successfully. Click to dismiss.
          </Alert>
        )}
        {alerts.warning && (
          <Alert
            variant="warning"
            icon={WarningIcon}
            closable
            onClose={() => setAlerts({ ...alerts, warning: false })}
          >
            Please review this warning. Click to dismiss.
          </Alert>
        )}
        {alerts.error && (
          <Alert
            variant="error"
            icon={ErrorIcon}
            closable
            onClose={() => setAlerts({ ...alerts, error: false })}
          >
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
