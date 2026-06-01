import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { Button } from "../Button/Button";
import { Dialog, DialogTrigger } from "../Dialog/Dialog";
import { SwitchToCreatorDialog } from "./SwitchToCreatorDialog";

const meta = {
  title: "Components/SwitchToCreatorDialog",
  component: SwitchToCreatorDialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onSwitchAccount: fn(),
    onOpenChange: fn(),
  },
} satisfies Meta<typeof SwitchToCreatorDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
  },
};

export const CustomLabels: Story = {
  args: {
    open: true,
    title: "Creator Account Required",
    description:
      "This app can only be purchased from a creator account. Please switch to one of your managed creator accounts to continue.",
    switchAccountLabel: "Select Creator",
    cancelLabel: "Maybe Later",
  },
};

export const AppStorePurchase: Story = {
  name: "App Store Purchase",
  args: {
    open: true,
    title: "Switch to Purchase",
    description:
      "To purchase this app, please switch to a creator account. The app will be installed for the selected creator.",
    switchAccountLabel: "Switch Account",
    cancelLabel: "Cancel",
  },
};

export const WithTrigger: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="brand">Purchase App</Button>
      </DialogTrigger>
      <SwitchToCreatorDialog {...args} />
    </Dialog>
  ),
  args: {
    description: "To purchase this app, please switch to a creator account.",
  },
};
