import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "storybook/test";
import { Avatar } from "../Avatar/Avatar";
import { Button } from "../Button/Button";
import { Chip } from "../Chip/Chip";
import { ArrowRightIcon } from "../Icons/ArrowRightIcon";
import { CheckIcon } from "../Icons/CheckIcon";
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

const meta = {
  title: "Components/Dialog",
  component: DialogContent,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=1467-1293",
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
          <p className="typography-regular-body-lg text-foreground-secondary">Remember:</p>
          <ul className="mt-3 space-y-2">
            <li className="typography-regular-body-lg flex items-start gap-2 text-foreground-secondary">
              <CheckIcon className="mt-0.5 size-5 shrink-0 text-foreground-default" />
              <span>
                It could take up to{" "}
                <strong className="text-foreground-default">10 working days</strong>
              </span>
            </li>
            <li className="typography-regular-body-lg flex items-start gap-2 text-foreground-secondary">
              <CheckIcon className="mt-0.5 size-5 shrink-0 text-foreground-default" />
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
            <div className="size-10 shrink-0 rounded-full bg-neutral-100" />
            <p className="typography-regular-body-lg text-foreground-secondary">
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
          <p className="typography-bold-heading-xs text-foreground-default">
            increase your earnings with referrals
          </p>
          <ul className="mt-4 space-y-2">
            <li className="typography-regular-body-lg flex items-start gap-2 text-foreground-secondary">
              <CheckIcon className="mt-0.5 size-5 shrink-0 text-foreground-default" />
              You get 5% earnings of every creator you refer
            </li>
            <li className="typography-regular-body-lg flex items-start gap-2 text-foreground-secondary">
              <CheckIcon className="mt-0.5 size-5 shrink-0 text-foreground-default" />
              They get 90% for the first 7 days
            </li>
          </ul>
          <p className="typography-regular-body-sm mt-4 text-foreground-tertiary">
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
          <p className="typography-bold-heading-sm text-foreground-default">What are warnings?</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li className="typography-regular-body-lg text-foreground-secondary">
              A warning means an incident on your account broke our guidelines. This may involve one
              or several uploads.
            </li>
            <li className="typography-regular-body-lg text-foreground-secondary">
              Warnings can add up. Severe or repeated cases may lead to a ban.
            </li>
          </ul>
          <p className="typography-regular-body-lg mt-3 text-foreground-secondary">
            Need clarity?{" "}
            <a
              href="https://example.com/support"
              className="typography-semibold-link-lg text-foreground-default underline"
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
                className="flex items-center justify-between rounded-xl border border-neutral-200 p-4"
              >
                <span className="typography-semibold-body-lg text-foreground-default">{role}</span>
                <span className="typography-regular-body-md text-foreground-secondary">
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
        <DialogBody>
          <p className="typography-bold-heading-sm text-foreground-default">What are warnings?</p>
          <p className="typography-semibold-body-lg mt-1 text-foreground-default">
            Dialog title here
          </p>
          <p className="typography-regular-body-lg mt-2 text-foreground-secondary">
            Dialog body text goes here. Describe the content or provide information to the user.
          </p>
          <div className="mt-4">
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
          <p className="typography-bold-heading-sm text-foreground-default">Sell 5 PTV pieces</p>
          <p className="typography-regular-body-lg mt-2 text-foreground-secondary">
            You can try either:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li className="typography-regular-body-lg text-foreground-secondary">
              <strong className="text-foreground-default">Creating a $100 post</strong>, so your
              subscribers can buy it.
            </li>
            <li className="typography-regular-body-lg text-foreground-secondary">
              <strong className="text-foreground-default">Offer directly to a fan.</strong> Go to a
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
            <p key={id} className="typography-regular-body-lg mb-4 text-foreground-secondary">
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
          <p className="typography-regular-body-lg mt-4 text-foreground-secondary">
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
          <p className="typography-regular-body-lg text-foreground-secondary">
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
          <p className="typography-regular-body-lg text-foreground-secondary">
            The following members will be removed from your team.
          </p>
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
