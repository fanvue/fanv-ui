import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { NON_VISUAL_STORY_PARAMETERS } from "../../storybook";
import { FlameIcon } from "../Icons/FlameIcon";
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
      options: ["info", "success", "warning", "error", "neutral"],
    },
    title: { control: "text" },
    closable: { control: "boolean" },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS = ["info", "success", "warning", "error", "neutral"] as const;

/**
 * Every variant against every combination of the three layout props — title,
 * closable and the `action` link slot. The `closable` column renders the close
 * affordance; dismissing behaviour is covered by `InteractiveDismissible`.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-3">
          <h3 className="typography-body-small-14px-semibold text-content-primary capitalize">
            {variant}
          </h3>
          <Alert variant={variant}>Body text only.</Alert>
          <Alert variant={variant} title="Alert title">
            Body text with a title above it.
          </Alert>
          <Alert variant={variant} closable>
            Body text with a close button.
          </Alert>
          <Alert variant={variant} title="Alert title" closable action={<a href="#more">More</a>}>
            Title, close button and an action link.
          </Alert>
        </div>
      ))}
    </div>
  ),
};

/**
 * Fixture for `e2e/alert.spec.ts`, which dismisses this alert and asserts on the
 * "Alert dismissed!" fallback. The closable appearance is covered by `AllVariants`,
 * so this does not take a snapshot. Renaming it will fail the E2E job.
 */
export const InfoClosable: Story = {
  parameters: NON_VISUAL_STORY_PARAMETERS,
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
          className="cursor-pointer text-info-content underline"
        >
          Show again
        </button>
      </div>
    );
  },
};

export const WithLink: Story = {
  args: {
    variant: "info",
    title: "Alert title",
    children: "This is the body text for an info in-app alert with a link to more detail.",
    action: <a href="#learn-more">Learn more</a>,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The `action` slot is composable: pass any element and it receives the variant-appropriate link styling via Radix `Slot`. For a Next.js app, pass a router-aware link instead of a plain anchor, e.g. `action={<Link href="/changelog">See what\'s new</Link>}` where `Link` is imported from `next/link`.',
      },
    },
  },
};

export const WithLinkClosable: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);
    return visible ? (
      <Alert
        {...args}
        variant="warning"
        title="Subscription expiring"
        closable
        action={<a href="#renew-now">Renew now</a>}
        onClose={() => setVisible(false)}
      >
        Your subscription will expire in 3 days.
      </Alert>
    ) : (
      <div className="text-gray-500 text-sm">
        Alert dismissed!{" "}
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="cursor-pointer text-warning-content underline"
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

export const CustomIcon: Story = {
  args: {
    variant: "warning",
    icon: <FlameIcon />,
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
          className="cursor-pointer text-info-content underline"
        >
          Show again
        </button>
      </div>
    );
  },
};

export const InteractiveDismissible: Story = {
  parameters: NON_VISUAL_STORY_PARAMETERS,
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
              className="cursor-pointer text-info-content underline"
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
  parameters: NON_VISUAL_STORY_PARAMETERS,
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
              className="cursor-pointer text-info-content underline"
            >
              Reset all
            </button>
          </div>
        )}
      </div>
    );
  },
};
