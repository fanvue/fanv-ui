import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "storybook/test";
import { Avatar } from "../Avatar/Avatar";
import { Button } from "../Button/Button";
import { Chip } from "../Chip/Chip";
import { ArrowRightIcon } from "../Icons/ArrowRightIcon";
import { CheckIcon } from "../Icons/CheckIcon";
import { SearchField } from "../SearchField/SearchField";
import { TextArea } from "../TextArea/TextArea";
import { TextField } from "../TextField/TextField";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Dialog";

const V2_FIGMA_URL =
  "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=17004-106869&p=f&m=dev";

const meta = {
  title: "Components/Dialog",
  component: DialogContent,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: V2_FIGMA_URL,
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DialogContent>;

export default meta;
type Story = StoryObj<typeof meta>;

const openDialog: Story["play"] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole("button", { name: /open dialog/i }));
};

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Text</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <TextArea placeholder="Type something…" fullWidth />
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: openDialog,
};

export const WithHeaderDescription: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign creator</DialogTitle>
          <DialogDescription>Choose a creator to assign to this account.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button>Assign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: openDialog,
};

export const AllStatesV2: Story = {
  name: "All states (v2)",
  parameters: { design: { type: "figma", url: V2_FIGMA_URL } },
  render: () => (
    <div className="flex max-w-3xl flex-col gap-4">
      <div>
        <p className="typography-body-default-16px-semibold mb-2 text-content-primary">
          Modal states
        </p>
        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Desktop with CTAs</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Title goes here</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <DialogDescription>
                  Dialog content can hold text, forms, lists, or any custom component.
                </DialogDescription>
              </DialogBody>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">CTA</Button>
                </DialogClose>
                <Button>CTA</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">No CTAs</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Title goes here</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <DialogDescription>
                  Use this pattern when the body contains its own self-contained action flow.
                </DialogDescription>
              </DialogBody>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Destructive</Button>
            </DialogTrigger>
            <DialogContent size="sm">
              <DialogHeader>
                <DialogTitle>Remove member?</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <DialogDescription>
                  This will remove the selected member from your team.
                </DialogDescription>
              </DialogBody>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button variant="destructive">Remove</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Upsell</Button>
            </DialogTrigger>
            <DialogContent size="sm">
              <DialogHeader>
                <DialogTitle>Upgrade plan</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <DialogDescription>
                  Unlock additional team seats and advanced controls.
                </DialogDescription>
              </DialogBody>
              <DialogFooter>
                <Button variant="brand">Upgrade</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Search header</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="sr-only">Search dialog</DialogTitle>
                <SearchField size="32" placeholder="Search..." fullWidth />
              </DialogHeader>
              <DialogBody>
                <DialogDescription>
                  Search-specific headers can compose the existing SearchField component.
                </DialogDescription>
              </DialogBody>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div>
        <p className="typography-body-default-16px-semibold mb-2 text-content-primary">
          Sheet states
        </p>
        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Mobile sheet</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Title goes here</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <DialogDescription>
                  On mobile viewports, Dialog uses the v2 sheet treatment with a pull handle.
                </DialogDescription>
              </DialogBody>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">CTA</Button>
                </DialogClose>
                <Button>CTA</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">No pull handle</Button>
            </DialogTrigger>
            <DialogContent showMobileHandle={false}>
              <DialogHeader>
                <DialogTitle>Title goes here</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <DialogDescription>
                  The mobile handle can be hidden for highly custom shell treatments.
                </DialogDescription>
              </DialogBody>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  ),
};

export const WithTrigger: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            Dialog body text goes here. Describe the content or provide information to the user.
          </DialogDescription>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: openDialog,
};

export const SimpleDefault: Story = {
  name: "Simple Default",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent size="md">
        <DialogHeader showClose={false}>
          <DialogTitle>Your funds are on the way!</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="typography-body-default-16px-regular text-content-secondary">Remember:</p>
          <ul className="mt-3 space-y-2">
            <li className="typography-body-default-16px-regular flex items-start gap-2 text-content-secondary">
              <CheckIcon className="mt-0.5 size-5 shrink-0 text-content-primary" />
              <span>
                It could take up to{" "}
                <strong className="text-content-primary">10 working days</strong>
              </span>
            </li>
            <li className="typography-body-default-16px-regular flex items-start gap-2 text-content-secondary">
              <CheckIcon className="mt-0.5 size-5 shrink-0 text-content-primary" />
              <span>Your provider could charge you a fee</span>
            </li>
          </ul>
        </DialogBody>
        <DialogFooter>
          <Button>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: openDialog,
};

export const WithBackButton: Story = {
  name: "With Back Button",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader onBack={() => {}}>
          <DialogTitle>Text</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <TextArea placeholder="Type something…" fullWidth />
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: openDialog,
};

export const Confirmation: Story = {
  name: "Confirmation (Destructive)",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="flex items-center gap-3">
            <div className="size-10 shrink-0 rounded-full bg-neutral-alphas-100" />
            <p className="typography-body-default-16px-regular text-content-secondary">
              This media will be permanently deleted.
            </p>
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">No, cancel</Button>
          </DialogClose>
          <Button variant="destructive">Yes, delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: openDialog,
};

export const Referrals: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent size="md">
        <DialogHeader showClose={false}>
          <DialogTitle>Referrals</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="typography-header-heading-xs text-content-primary">
            increase your earnings with referrals
          </p>
          <ul className="mt-4 space-y-2">
            <li className="typography-body-default-16px-regular flex items-start gap-2 text-content-secondary">
              <CheckIcon className="mt-0.5 size-5 shrink-0 text-content-primary" />
              You get 5% earnings of every creator you refer
            </li>
            <li className="typography-body-default-16px-regular flex items-start gap-2 text-content-secondary">
              <CheckIcon className="mt-0.5 size-5 shrink-0 text-content-primary" />
              They get 90% for the first 7 days
            </li>
          </ul>
          <p className="typography-description-12px-regular mt-4 text-content-tertiary">
            Simply copy the link, and share it with a future creator. They enter the code during
            sign up and that&apos;s it.
          </p>
        </DialogBody>
        <DialogFooter>
          <Button>Copy referral link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: openDialog,
};

export const WithDescription: Story = {
  name: "With Description",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Account Health</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="typography-header-heading-sm text-content-primary">What are warnings?</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li className="typography-body-default-16px-regular text-content-secondary">
              A warning means an incident on your account broke our guidelines. This may involve one
              or several uploads.
            </li>
            <li className="typography-body-default-16px-regular text-content-secondary">
              Warnings can add up. Severe or repeated cases may lead to a ban.
            </li>
          </ul>
          <p className="typography-body-default-16px-regular mt-3 text-content-secondary">
            Need clarity?{" "}
            <a
              href="https://example.com/support"
              className="typography-links-link-lg text-content-primary underline"
            >
              Contact Support.
            </a>
          </p>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: openDialog,
};

export const LargeDialog: Story = {
  name: "Large (600px)",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Team Roles</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>Assign roles to team members to manage access.</DialogDescription>
          <div className="mt-4 space-y-3">
            {["Owner", "Team Manager", "Chatter"].map((role) => (
              <div
                key={role}
                className="flex items-center justify-between rounded-sm border border-neutral-alphas-200 p-4"
              >
                <span className="typography-body-default-16px-semibold text-content-primary">
                  {role}
                </span>
                <span className="typography-body-small-14px-regular text-content-secondary">
                  Permissions
                </span>
              </div>
            ))}
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: openDialog,
};

export const WithInputContent: Story = {
  name: "With Input Content",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent aria-label="Warnings" aria-describedby={undefined}>
        <DialogBody className="py-0">
          <p className="typography-header-heading-sm text-content-primary">What are warnings?</p>
          <p className="typography-body-default-16px-semibold mt-1 text-content-primary">
            Dialog title here
          </p>
          <p className="typography-body-default-16px-regular mt-2 text-content-secondary">
            Dialog body text goes here. Describe the content or provide information to the user.
          </p>
          <div className="mt-4 px-1 pb-1">
            <TextField label="Label" placeholder="You can choose field variant." fullWidth />
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
  play: openDialog,
};

export const NoHeader: Story = {
  name: "No Header (Indent)",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent size="sm" aria-label="Sell 5 PTV pieces" aria-describedby={undefined}>
        <DialogBody>
          <p className="typography-header-heading-sm text-content-primary">Sell 5 PTV pieces</p>
          <p className="typography-body-default-16px-regular mt-2 text-content-secondary">
            You can try either:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li className="typography-body-default-16px-regular text-content-secondary">
              <strong className="text-content-primary">Creating a $100 post</strong>, so your
              subscribers can buy it.
            </li>
            <li className="typography-body-default-16px-regular text-content-secondary">
              <strong className="text-content-primary">Offer directly to a fan.</strong> Go to a
              chat with a Fan &gt; add image from vault &gt; set price &gt; send message
            </li>
          </ul>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary">Not now</Button>
          <Button variant="destructive" rightIcon={<ArrowRightIcon />}>
            Let&apos;s go
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: openDialog,
};

export const ScrollableContent: Story = {
  name: "Scrollable Content",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {Array.from({ length: 20 }, (_, i) => `paragraph-${i + 1}`).map((id) => (
            <p
              key={id}
              className="typography-body-default-16px-regular mb-4 text-content-secondary"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris.
            </p>
          ))}
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Decline</Button>
          </DialogClose>
          <Button>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: openDialog,
};

export const SingleAction: Story = {
  name: "Single Action",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent size="md">
        <DialogHeader showClose={false}>
          <DialogTitle>Creating your avatar</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="flex justify-center">
            <Avatar size={88} fallback="JD" />
          </div>
          <p className="typography-body-default-16px-regular mt-4 text-content-secondary">
            Your avatar is being generated. This can take a few minutes. You can close this and
            we&apos;ll let you know when it&apos;s done.
          </p>
        </DialogBody>
        <DialogFooter>
          <Button>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: openDialog,
};

export const MobileSheet: Story = {
  name: "Mobile Sheet (375px)",
  tags: ["!autodocs"],
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    chromatic: {
      modes: {
        "light-mobile": { theme: "light", viewport: 375 },
      },
    },
  },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="typography-body-default-16px-regular text-content-secondary">
            On mobile viewports, the dialog slides up from the bottom with only top border radius,
            behaving like a bottom sheet.
          </p>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: openDialog,
};

export const MobileSheetTallContent: Story = {
  name: "Mobile Sheet — Tall Content (ENG-12221)",
  tags: ["!autodocs"],
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    chromatic: {
      modes: {
        "light-mobile": { theme: "light", viewport: 375 },
      },
    },
  },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="typography-body-default-16px-regular mb-3 text-content-secondary">
            Regression coverage for ENG-12221: on iOS in-app browsers (e.g. Instagram),{" "}
            <code>vh</code> reports taller than the actually-visible viewport, squishing/clipping
            sheet content. The sheet is capped by the <code>dialog-max-h-dynamic</code> utility (
            <code>85dvh</code> with an <code>85vh</code> fallback), stays scrollable, and its bottom
            padding grows for the safe-area / home-indicator inset instead of clipping the footer
            buttons.
          </p>
          {Array.from({ length: 12 }, (_, i) => `paragraph-${i + 1}`).map((id) => (
            <p
              key={id}
              className="typography-body-default-16px-regular mb-4 text-content-secondary"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
          ))}
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: openDialog,
};

export const WithoutPortal: Story = {
  name: "Without Portal",
  render: () => (
    <div className="relative h-80 overflow-hidden rounded-lg border border-border-primary p-6">
      <p className="typography-body-small-14px-regular mb-4 text-content-secondary">
        Dialog renders inside this box instead of portaling to document.body.
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Inline Dialog</Button>
        </DialogTrigger>
        <DialogContent portal={false} size="sm">
          <DialogHeader>
            <DialogTitle>Inline dialog</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <DialogDescription>
              Use portal=false when the dialog must stay in a specific DOM subtree.
            </DialogDescription>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /open inline dialog/i }));
  },
};

export const CustomOverlay: Story = {
  name: "Custom Overlay (backdrop blur)",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent overlayProps={{ className: "backdrop-blur-xl" }}>
        <DialogHeader>
          <DialogTitle>Custom overlay</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            `overlayProps` forwards to the default overlay, letting consumers apply a custom
            backdrop treatment (e.g. the v2 Modal backdrop blur) without replacing it.
          </DialogDescription>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
  play: openDialog,
};

export const RemoveMembers: Story = {
  name: "Remove Members",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            The following members will be removed from your team.
          </DialogDescription>
          <div className="mt-3 flex gap-2">
            <Chip leftIcon={<Avatar size={24} fallback="TC" alt="Talented Chatter" />}>
              Talented Chatter
            </Chip>
            <Chip leftIcon={<Avatar size={24} fallback="TR" alt="The Rock" />}>The Rock</Chip>
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">No, wait</Button>
          </DialogClose>
          <Button variant="destructive">Remove</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: openDialog,
};
