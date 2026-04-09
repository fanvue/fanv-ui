import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../Button/Button";
import { VipBadgeIcon } from "../Icons/VipBadgeIcon";
import { Snackbar } from "./Snackbar";

const DefaultMessage = (
  <span className="typography-semibold-body-md">
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

// ─── Default variant ──────────────────────────────────────────────

export const Default: Story = {
  args: {
    children: DefaultMessage,
    primaryLabel: "Accept",
    secondaryLabel: "Dismiss",
  },
};

export const DefaultWithoutActions: Story = {
  args: {
    children: DefaultMessage,
    showActions: false,
  },
};

export const DefaultPrimaryOnly: Story = {
  args: {
    children: DefaultMessage,
    primaryLabel: "Accept",
  },
};

export const DefaultWithCustomSlots: Story = {
  args: {
    children: DefaultMessage,
    primarySlot: (
      <Button variant="primary" size="40">
        Custom Primary
      </Button>
    ),
    secondarySlot: (
      <a href="#dismiss" className="typography-semibold-link-md text-content-secondary">
        Custom link
      </a>
    ),
  },
};

// ─── VipEarn variant ──────────────────────────────────────────────

export const VipEarn: Story = {
  args: {
    variant: "vipEarn",
    icon: VipBadge,
    title: "You're killing it! You've earned 1,000pts",
    description: "Find out how to redeem them, and earn more...",
    primaryLabel: "Redeem points",
  },
};

export const VipEarnClosable: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);
    return visible ? (
      <Snackbar
        {...args}
        variant="vipEarn"
        icon={VipBadge}
        title="You're killing it! You've earned 1,000pts"
        description="Find out how to redeem them, and earn more..."
        primaryLabel="Redeem points"
        closable
        onClose={() => setVisible(false)}
      />
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

export const VipEarnWithoutAction: Story = {
  args: {
    variant: "vipEarn",
    icon: VipBadge,
    title: "You're killing it! You've earned 1,000pts",
    description: "Find out how to redeem them, and earn more...",
    showActions: false,
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

export const VipEarnWithCustomSlot: Story = {
  args: {
    variant: "vipEarn",
    icon: VipBadge,
    title: "You're killing it! You've earned 1,000pts",
    description: "Find out how to redeem them, and earn more...",
    primarySlot: (
      <a href="#redeem" className="typography-semibold-link-md text-brand-secondary-default">
        Redeem now
      </a>
    ),
  },
};

// ─── Welcome variant ──────────────────────────────────────────────

export const Welcome: Story = {
  args: {
    variant: "welcome",
    title: "Welcome to Fanvue 👋",
    description: "Let's get you started!",
    primaryLabel: "Become a creator",
    secondaryLabel: "Discover creators",
  },
};

export const WelcomeWithoutActions: Story = {
  args: {
    variant: "welcome",
    title: "Welcome to Fanvue 👋",
    description: "Let's get you started!",
    showActions: false,
  },
};

export const WelcomePrimaryOnly: Story = {
  args: {
    variant: "welcome",
    title: "Welcome to Fanvue 👋",
    description: "Let's get you started!",
    primaryLabel: "Get started",
  },
};

export const WelcomeWithCustomSlots: Story = {
  args: {
    variant: "welcome",
    title: "Welcome to Fanvue 👋",
    description: "Let's get you started!",
    primarySlot: (
      <Button variant="primary" leftIcon={<span>🚀</span>}>
        Launch
      </Button>
    ),
    secondarySlot: (
      <a href="#explore" className="text-content-secondary text-sm underline">
        Explore instead
      </a>
    ),
  },
};

// ─── Closable / interactive ───────────────────────────────────────

export const DefaultClosable: Story = {
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
