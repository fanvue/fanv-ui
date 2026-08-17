import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../Button/Button";
import { VipBadgeIcon } from "../Icons/VipBadgeIcon";
import { Snackbar } from "./Snackbar";

const DefaultMessage = (
  <span className="typography-body-small-14px-semibold">
    <span>@user.with.username</span> changed their subscription price to <span>$43.99</span> per
    month
  </span>
);

const VipBadge = <VipBadgeIcon />;

const meta = {
  title: "Components/Snackbar",
  component: Snackbar,
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=2089-20333&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "vipEarn", "welcome"],
    },
    showActions: { control: "boolean" },
    closable: { control: "boolean" },
    title: { control: "text" },
    description: { control: "text" },
    primaryLabel: { control: "text" },
    secondaryLabel: { control: "text" },
  },
} satisfies Meta<typeof Snackbar>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANT_CONTENT = [
  {
    variant: "default",
    props: { children: DefaultMessage },
    primary: "Accept",
    secondary: "Dismiss",
  },
  {
    variant: "vipEarn",
    props: {
      icon: VipBadge,
      title: "You're killing it! You've earned 1,000pts",
      description: "Find out how to redeem them, and earn more...",
    },
    primary: "Redeem points",
    secondary: "Maybe later",
  },
  {
    variant: "welcome",
    props: {
      title: "Welcome to Fanvue 👋",
      description: "Let's get you started!",
    },
    primary: "Become a creator",
    secondary: "Discover creators",
  },
] as const;

/**
 * Every variant against the four ways its action area can be filled — both labels,
 * primary only, no actions, and custom slots — plus the closable affordance.
 */
export const AllVariants: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-10">
      {VARIANT_CONTENT.map(({ variant, props, primary, secondary }) => (
        <div key={variant} className="flex flex-col gap-3">
          <h3 className="typography-body-small-14px-semibold text-content-primary">{variant}</h3>
          <Snackbar
            variant={variant}
            {...props}
            primaryLabel={primary}
            secondaryLabel={secondary}
          />
          <Snackbar variant={variant} {...props} primaryLabel={primary} />
          <Snackbar variant={variant} {...props} showActions={false} />
          <Snackbar
            variant={variant}
            {...props}
            primarySlot={
              <Button variant="primary" size="40">
                Custom Primary
              </Button>
            }
            secondarySlot={
              <a href="#dismiss" className="typography-links-link-md text-content-secondary">
                Custom link
              </a>
            }
          />
          <Snackbar variant={variant} {...props} primaryLabel={primary} closable />
        </div>
      ))}
    </div>
  ),
};

export const Default: Story = {
  args: {
    children: DefaultMessage,
    primaryLabel: "Accept",
    secondaryLabel: "Dismiss",
  },
};

export const VipEarnWithoutIcon: Story = {
  args: {
    variant: "vipEarn",
    title: "You're killing it! You've earned 1,000pts",
    description: "Find out how to redeem them, and earn more...",
    primaryLabel: "Redeem points",
  },
};

// ─── Closable / interactive ───────────────────────────────────────

export const DefaultClosable: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => {
    const [visible, setVisible] = useState(true);
    return visible ? (
      <Snackbar
        {...args}
        primaryLabel="Accept"
        secondaryLabel="Dismiss"
        closable
        onClose={() => setVisible(false)}
      >
        {DefaultMessage}
      </Snackbar>
    ) : (
      <div className="text-content-tertiary text-sm">
        Snackbar dismissed!{" "}
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="cursor-pointer text-content-primary underline"
        >
          Show again
        </button>
      </div>
    );
  },
};

export const MultipleDismissible: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => {
    const [snackbars, setSnackbars] = useState({
      vipEarn: true,
      default: true,
      welcome: true,
    });

    return (
      <div className="flex max-w-xl flex-col gap-4">
        {snackbars.vipEarn && (
          <Snackbar
            variant="vipEarn"
            icon={VipBadge}
            title="You're killing it! You've earned 1,000pts"
            description="Find out how to redeem them, and earn more..."
            primaryLabel="Redeem points"
            closable
            onClose={() => setSnackbars({ ...snackbars, vipEarn: false })}
          />
        )}
        {snackbars.default && (
          <Snackbar
            primaryLabel="Accept"
            secondaryLabel="Dismiss"
            closable
            onClose={() => setSnackbars({ ...snackbars, default: false })}
          >
            {DefaultMessage}
          </Snackbar>
        )}
        {snackbars.welcome && (
          <Snackbar
            variant="welcome"
            title="Welcome to Fanvue 👋"
            description="Let's get you started!"
            primaryLabel="Become a creator"
            secondaryLabel="Discover creators"
            closable
            onClose={() => setSnackbars({ ...snackbars, welcome: false })}
          />
        )}
        {!snackbars.vipEarn && !snackbars.default && !snackbars.welcome && (
          <div className="text-content-tertiary text-sm">
            All snackbars dismissed!{" "}
            <button
              type="button"
              onClick={() => setSnackbars({ vipEarn: true, default: true, welcome: true })}
              className="cursor-pointer text-content-primary underline"
            >
              Reset all
            </button>
          </div>
        )}
      </div>
    );
  },
};
