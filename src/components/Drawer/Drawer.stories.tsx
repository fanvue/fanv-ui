import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { userEvent, within } from "storybook/test";
import { NON_VISUAL_STORY_PARAMETERS } from "../../storybook";
import { Button } from "../Button/Button";
import { TextField } from "../TextField/TextField";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./Drawer";

const meta: Meta<typeof DrawerContent> = {
  title: "Components/Drawer",
  component: DrawerContent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["panel", "sheet", "menu", "modal"],
    },
    position: {
      control: "select",
      options: ["left", "right", "top", "bottom"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "full"],
    },
    overlay: {
      control: "boolean",
    },
  },
  args: {
    position: "right",
    size: "sm",
    overlay: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const openDrawer: Story["play"] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const buttons = canvas.getAllByRole("button");
  await userEvent.click(buttons[0] as HTMLElement);
};

export const Default: Story = {
  play: openDrawer,
  render: (args) => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent {...args}>
        <DrawerHeader>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerDescription>
            This is a default drawer that slides in from the right.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <p>Drawer content goes here.</p>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const Left: Story = {
  args: { position: "left" },
  play: openDrawer,
  render: (args) => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Left Drawer</Button>
      </DrawerTrigger>
      <DrawerContent {...args}>
        <DrawerHeader>
          <DrawerTitle>Left Drawer</DrawerTitle>
          <DrawerDescription>This drawer slides in from the left.</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <p>Navigation or sidebar content.</p>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const Top: Story = {
  args: { position: "top" },
  play: openDrawer,
  render: (args) => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Top Drawer</Button>
      </DrawerTrigger>
      <DrawerContent {...args}>
        <DrawerHeader>
          <DrawerTitle>Top Drawer</DrawerTitle>
          <DrawerDescription>This drawer slides in from the top.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <p>Notification or banner content.</p>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const Bottom: Story = {
  args: { position: "bottom" },
  play: openDrawer,
  render: (args) => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Bottom Drawer</Button>
      </DrawerTrigger>
      <DrawerContent {...args}>
        <DrawerHeader>
          <DrawerTitle>Bottom Drawer</DrawerTitle>
          <DrawerDescription>This drawer slides in from the bottom.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <p>Action sheet or bottom panel content.</p>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const BottomSheet: Story = {
  args: { position: "bottom", variant: "sheet" },
  play: openDrawer,
  render: (args) => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Bottom Sheet</Button>
      </DrawerTrigger>
      <DrawerContent {...args}>
        <DrawerHeader>
          <DrawerTitle className="typography-header-heading-xs">Switch AI Model</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pt-0">
          <p>The sheet variant uses the modal surface and a large top radius.</p>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * `variant="menu"` is for a dropdown that becomes a bottom overlay on a narrow
 * viewport. Unlike `"sheet"` it floats clear of the edges and keeps the dropdown
 * surface, so the menu reads as the same object it is on desktop.
 */
export const BottomMenu: Story = {
  args: { position: "bottom", variant: "menu" },
  play: openDrawer,
  render: (args) => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Bottom Menu</Button>
      </DrawerTrigger>
      <DrawerContent {...args}>
        <DrawerHeader>
          <DrawerTitle className="typography-header-heading-xs">Revenue View</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pt-0">
          <p>Inset from all three edges, rounded on every corner.</p>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * `variant="modal"` is the V2 side modal: a 440px card floating 8px clear of the
 * viewport edges, on the modal surface over the heavy overlay. The panel carries
 * its own 24px padding, so the header and footer drop theirs.
 */
export const SideModal: Story = {
  args: { position: "right", variant: "modal" },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/FWL1kdZB4CdBS0grWchMo4/Creator---Earnings---Wallet---Checkout?node-id=3316-42174",
    },
  },
  play: openDrawer,
  render: (args) => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Side Modal</Button>
      </DrawerTrigger>
      <DrawerContent {...args}>
        <DrawerHeader>
          <DrawerTitle className="typography-header-heading-xs">Add Payout Method</DrawerTitle>
          <DrawerDescription>Choose how you want to get paid.</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto py-6">
          <p>Floats 8px clear of the top, bottom and side edges.</p>
        </div>
        <DrawerFooter className="flex-row">
          <DrawerClose asChild>
            <Button variant="outline" size="48" fullWidth>
              Cancel
            </Button>
          </DrawerClose>
          <Button size="48" fullWidth>
            Continue
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const WithoutOverlay: Story = {
  args: { overlay: false },
  play: openDrawer,
  render: (args) => (
    <Drawer overlay={args.overlay}>
      <DrawerTrigger asChild>
        <Button>Open Without Overlay</Button>
      </DrawerTrigger>
      <DrawerContent {...args}>
        <DrawerHeader>
          <DrawerTitle>No Overlay</DrawerTitle>
          <DrawerDescription>This drawer has no backdrop overlay behind it.</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <p>The page behind remains fully visible.</p>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const Controlled: Story = {
  parameters: NON_VISUAL_STORY_PARAMETERS,
  play: openDrawer,
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex items-center gap-4">
        <Button onClick={() => setOpen(true)}>Open Controlled Drawer</Button>
        <span className="typography-description-12px-regular text-content-secondary">
          {open ? "Open" : "Closed"}
        </span>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent {...args}>
            <DrawerHeader>
              <DrawerTitle>Controlled Drawer</DrawerTitle>
              <DrawerDescription>This drawer is controlled via external state.</DrawerDescription>
            </DrawerHeader>
            <div className="flex-1 overflow-y-auto p-4">
              <p>The open state is managed by the parent component.</p>
            </div>
            <DrawerFooter>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Close
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    );
  },
};

export const WithLongContent: Story = {
  play: openDrawer,
  render: (args) => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Scrollable Drawer</Button>
      </DrawerTrigger>
      <DrawerContent {...args}>
        <DrawerHeader>
          <DrawerTitle>Long Content</DrawerTitle>
          <DrawerDescription>This drawer demonstrates scrollable content.</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-4">
          {Array.from({ length: 30 }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static list for demo purposes
            <p key={i} className="mb-4">
              Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const NestedContent: Story = {
  args: { size: "md" },
  play: openDrawer,
  render: (args) => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Form Drawer</Button>
      </DrawerTrigger>
      <DrawerContent {...args}>
        <DrawerHeader>
          <DrawerTitle>Edit Profile</DrawerTitle>
          <DrawerDescription>Update your profile information below.</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <TextField label="First name" placeholder="Enter first name" />
          <TextField label="Last name" placeholder="Enter last name" />
          <TextField label="Email" placeholder="you@example.com" type="email" />
          <TextField label="Bio" placeholder="Tell us about yourself" />
        </div>
        <DrawerFooter>
          <div className="flex gap-2">
            <DrawerClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DrawerClose>
            <Button>Save Changes</Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const WithCustomWidth: Story = {
  play: openDrawer,
  render: () => (
    <div className="flex gap-4">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="secondary">Small (sm)</Button>
        </DrawerTrigger>
        <DrawerContent position="right" size="sm">
          <DrawerHeader>
            <DrawerTitle>Small Drawer</DrawerTitle>
            <DrawerDescription>max-w-sm</DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-4">
            <p>Small drawer content.</p>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="secondary">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="secondary">Medium (md)</Button>
        </DrawerTrigger>
        <DrawerContent position="right" size="md">
          <DrawerHeader>
            <DrawerTitle>Medium Drawer</DrawerTitle>
            <DrawerDescription>max-w-md</DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-4">
            <p>Medium drawer content.</p>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="secondary">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="secondary">Large (lg)</Button>
        </DrawerTrigger>
        <DrawerContent position="right" size="lg">
          <DrawerHeader>
            <DrawerTitle>Large Drawer</DrawerTitle>
            <DrawerDescription>max-w-lg</DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-4">
            <p>Large drawer content.</p>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="secondary">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="secondary">Full</Button>
        </DrawerTrigger>
        <DrawerContent position="right" size="full">
          <DrawerHeader>
            <DrawerTitle>Full-width Drawer</DrawerTitle>
            <DrawerDescription>max-w-full</DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-4">
            <p>Full-width drawer content.</p>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="secondary">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  ),
};
