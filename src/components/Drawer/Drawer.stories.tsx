import type { Meta, StoryObj } from "@storybook/react";
import { type ReactNode, useState } from "react";
import { expect, screen, userEvent, within } from "storybook/test";
import { NON_VISUAL_STORY_PARAMETERS } from "../../storybook";
import { Button } from "../Button/Button";
import { IconButton } from "../IconButton/IconButton";
import { EditIcon } from "../Icons/EditIcon";
import { MoreIcon } from "../Icons/MoreIcon";
import { TagIcon } from "../Icons/TagIcon";
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
      options: ["panel", "sheet", "menu", "modal", "page"],
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
 * `variant="page"` is a detail page that rises over the one behind it. It sits on
 * the opaque page background, 16px below the top edge so the page behind stays in
 * view, and always runs to the bottom edge. Its rise is slower than its fall. It always
 * rises from the bottom, whatever `position` is.
 */
export const Page: Story = {
  args: { variant: "page" },
  play: openDrawer,
  render: (args) => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Page</Button>
      </DrawerTrigger>
      <DrawerContent {...args}>
        <DrawerHeader>
          <DrawerTitle className="typography-header-heading-xs">Summer launch</DrawerTitle>
          <DrawerDescription>1 Jun to 31 Aug</DrawerDescription>
        </DrawerHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 pt-0">
          <p>The page variant uses the page background and a 16px top radius.</p>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * A `"page"` panel spans the full width by default. Inset it with `style` or
 * `className` to cover one column and leave navigation beside it in view.
 */
export const PageOverColumn: Story = {
  args: { variant: "page", style: { left: 72, right: 8 } },
  play: openDrawer,
  render: (args) => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Page Over Column</Button>
      </DrawerTrigger>
      <DrawerContent {...args}>
        <DrawerHeader>
          <DrawerTitle className="typography-header-heading-xs">Summer launch</DrawerTitle>
          <DrawerDescription>1 Jun to 31 Aug</DrawerDescription>
        </DrawerHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 pt-0">
          <p>Inset 72px from the left and 8px from the right.</p>
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

const TAGS = ["VIP", "Big spender", "New", "Needs reply"];

function SheetRow({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="typography-body-small-14px-regular flex h-10 w-full cursor-pointer items-center gap-2 rounded-sm px-3 text-start text-content-primary outline-hidden hover:bg-interaction-hover focus-visible:bg-interaction-hover"
    >
      {icon}
      {label}
    </button>
  );
}

function SheetWithViewsDemo() {
  const [view, setView] = useState<"tags" | "options" | "edit">("tags");
  const back = () => setView("tags");
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open sheet</Button>
      </DrawerTrigger>
      <DrawerContent
        position="bottom"
        variant="sheet"
        step={view === "tags" ? 0 : 1}
        aria-describedby={undefined}
      >
        {view === "tags" && (
          <>
            <DrawerHeader>
              <div className="flex items-center gap-2">
                <DrawerTitle className="min-w-0 flex-1">Tags</DrawerTitle>
                <IconButton
                  variant="tertiary"
                  size="32"
                  icon={<MoreIcon size={16} />}
                  aria-label="Tag options"
                  onClick={() => setView("options")}
                />
              </div>
            </DrawerHeader>
            <div className="px-4">
              {TAGS.map((tag) => (
                <SheetRow
                  key={tag}
                  icon={<TagIcon size={16} />}
                  label={tag}
                  onClick={() => setView("edit")}
                />
              ))}
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button className="w-full">Done</Button>
              </DrawerClose>
            </DrawerFooter>
          </>
        )}
        {view === "options" && (
          <>
            <DrawerHeader onBack={back}>
              <DrawerTitle>Tag options</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <SheetRow
                icon={<EditIcon size={16} />}
                label="Edit tags"
                onClick={() => setView("edit")}
              />
            </div>
          </>
        )}
        {view === "edit" && (
          <>
            <DrawerHeader onBack={back}>
              <DrawerTitle>Edit tag</DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col gap-4 px-4">
              <TextField label="Name" defaultValue="VIP" fullWidth />
              <TextField label="Description" defaultValue="Fans who tip every week" fullWidth />
            </div>
            <DrawerFooter>
              <Button className="w-full" onClick={back}>
                Save
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}

/**
 * Give `DrawerContent` a `step` and a sheet turns into a deeper view in place instead of stacking
 * a second sheet: it morphs to the new view's height and slides the view in from the right, and
 * `DrawerHeader`'s `onBack` adds the back arrow that slides it back from the left. The header's
 * actions are 32px, and the sheet's action sits full width at the very bottom.
 */
export const SheetWithViews: Story = {
  tags: ["!autodocs"],
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    chromatic: {
      modes: {
        "light-mobile": { theme: "light", viewport: 375 },
      },
    },
  },
  render: () => <SheetWithViewsDemo />,
  play: async (context) => {
    await openDrawer?.(context);
    await userEvent.click(await screen.findByRole("button", { name: "Tag options" }));
    await expect(await screen.findByRole("dialog", { name: "Tag options" })).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Go back" }));
    await expect(await screen.findByRole("dialog", { name: "Tags" })).toBeVisible();
  },
};
