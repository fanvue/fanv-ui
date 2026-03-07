import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button/Button";
import { HomeIcon } from "../Icons/HomeIcon";
import { SettingsIcon } from "../Icons/SettingsIcon";
import { StarIcon } from "../Icons/StarIcon";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./Card";

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=14900-1019794&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["outlined", "elevated", "filled", "ghost"],
    },
    fullWidth: { control: "boolean" },
    noPadding: { control: "boolean" },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Outlined: Story = {
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <CardHeader action={<HomeIcon className="size-5" />}>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Card description text</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="typography-regular-body-md text-foreground-tertiary">Content goes here</p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" size="40">
          Label
        </Button>
        <Button variant="primary" size="40">
          Label
        </Button>
      </CardFooter>
    </Card>
  ),
  args: {
    variant: "outlined",
  },
};

export const Elevated: Story = {
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <CardHeader action={<HomeIcon className="size-5" />}>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Card description text</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="typography-regular-body-md text-foreground-tertiary">Content goes here</p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" size="40">
          Label
        </Button>
        <Button variant="primary" size="40">
          Label
        </Button>
      </CardFooter>
    </Card>
  ),
  args: {
    variant: "elevated",
  },
};

export const Filled: Story = {
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <CardHeader action={<HomeIcon className="size-5" />}>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Card description text</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="typography-regular-body-md text-foreground-tertiary">Content goes here</p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" size="40">
          Label
        </Button>
        <Button variant="primary" size="40">
          Label
        </Button>
      </CardFooter>
    </Card>
  ),
  args: {
    variant: "filled",
  },
};

export const Ghost: Story = {
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <CardHeader action={<HomeIcon className="size-5" />}>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Card description text</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="typography-regular-body-md text-foreground-tertiary">Content goes here</p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" size="40">
          Label
        </Button>
        <Button variant="primary" size="40">
          Label
        </Button>
      </CardFooter>
    </Card>
  ),
  args: {
    variant: "ghost",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      {(["outlined", "elevated", "filled", "ghost"] as const).map((variant) => (
        <Card key={variant} variant={variant} className="w-64">
          <CardHeader action={<HomeIcon className="size-5" />}>
            <CardTitle>Card title</CardTitle>
            <CardDescription>Card description text</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="typography-regular-body-md text-foreground-tertiary">Content goes here</p>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" size="40">
              Label
            </Button>
            <Button variant="primary" size="40">
              Label
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  ),
};

export const HeaderOnly: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader action={<SettingsIcon className="size-5" />}>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account preferences</CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardContent>
        <p className="typography-regular-body-md text-foreground-default">
          A simple card with just content and no header or footer.
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithCustomAction: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader action={<StarIcon className="size-5 text-foreground-tertiary" />}>
        <CardTitle>Featured</CardTitle>
        <CardDescription>This card has a custom action icon</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="typography-regular-body-md text-foreground-tertiary">
          Content area for featured items
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="brand" size="40" fullWidth>
          Get Started
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const NoPadding: Story = {
  render: () => (
    <Card className="max-w-sm" noPadding>
      <div className="h-40 w-full rounded-t-2xl bg-neutral-200" />
      <div className="p-4">
        <CardHeader>
          <CardTitle>Media Card</CardTitle>
          <CardDescription>Card with an image banner</CardDescription>
        </CardHeader>
      </div>
    </Card>
  ),
};

export const InlineWidth: Story = {
  render: () => (
    <Card fullWidth={false} className="inline-flex">
      <CardHeader>
        <CardTitle>Inline card</CardTitle>
        <CardDescription>This card does not stretch to full width</CardDescription>
      </CardHeader>
    </Card>
  ),
};
