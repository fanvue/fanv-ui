import type { Meta, StoryObj } from "@storybook/react";
import { InfoCircleIcon } from "../Icons/InfoCircleIcon";
import { InfoBox, InfoBoxContent, InfoBoxTrigger } from "./InfoBox";

const meta: Meta<typeof InfoBoxContent> = {
  title: "Components/InfoBox",
  component: InfoBoxContent,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=15751-8983",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InfoBoxContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <InfoBox defaultOpen>
      <InfoBoxTrigger asChild>
        <button type="button" className="text-foreground-secondary">
          <InfoCircleIcon className="size-5" />
        </button>
      </InfoBoxTrigger>
      <InfoBoxContent heading="Title">Info text</InfoBoxContent>
    </InfoBox>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <InfoBox defaultOpen>
      <InfoBoxTrigger asChild>
        <button type="button" className="text-foreground-secondary">
          <InfoCircleIcon className="size-5" />
        </button>
      </InfoBoxTrigger>
      <InfoBoxContent
        icon={<InfoCircleIcon className="size-5 text-foreground-inverse" />}
        heading="Title"
      >
        Info text
      </InfoBoxContent>
    </InfoBox>
  ),
};

export const WithPill: Story = {
  render: () => (
    <InfoBox defaultOpen>
      <InfoBoxTrigger asChild>
        <button type="button" className="text-foreground-secondary">
          <InfoCircleIcon className="size-5" />
        </button>
      </InfoBoxTrigger>
      <InfoBoxContent
        heading="Title"
        pill={
          <span className="typography-semibold-body-sm rounded-full bg-neutral-solid px-3 py-1 text-foreground-inverse">
            Example
          </span>
        }
      >
        Info text
      </InfoBoxContent>
    </InfoBox>
  ),
};

export const WithActions: Story = {
  render: () => (
    <InfoBox defaultOpen>
      <InfoBoxTrigger asChild>
        <button type="button" className="text-foreground-secondary">
          <InfoCircleIcon className="size-5" />
        </button>
      </InfoBoxTrigger>
      <InfoBoxContent
        heading="Title"
        primaryAction={{ label: "OK" }}
        secondaryAction={{ label: "Dismiss" }}
      >
        Info text
      </InfoBoxContent>
    </InfoBox>
  ),
};

export const Full: Story = {
  render: () => (
    <InfoBox defaultOpen>
      <InfoBoxTrigger asChild>
        <button type="button" className="text-foreground-secondary">
          <InfoCircleIcon className="size-5" />
        </button>
      </InfoBoxTrigger>
      <InfoBoxContent
        icon={<InfoCircleIcon className="size-5 text-foreground-inverse" />}
        heading="Title"
        pill={
          <span className="typography-semibold-body-sm rounded-full bg-neutral-solid px-3 py-1 text-foreground-inverse">
            Example
          </span>
        }
        primaryAction={{ label: "OK" }}
        secondaryAction={{ label: "Dismiss" }}
      >
        Info text
      </InfoBoxContent>
    </InfoBox>
  ),
};

export const BottomPlacement: Story = {
  render: () => (
    <InfoBox defaultOpen>
      <InfoBoxTrigger asChild>
        <button type="button" className="text-foreground-secondary">
          <InfoCircleIcon className="size-5" />
        </button>
      </InfoBoxTrigger>
      <InfoBoxContent side="bottom" heading="Title">
        Info text
      </InfoBoxContent>
    </InfoBox>
  ),
};

export const NarrowViewport: Story = {
  name: "Narrow Viewport (constraint)",
  parameters: {
    layout: "fullscreen",
    chromatic: {
      modes: {
        "light-narrow": { theme: "light", viewport: 375 },
        "dark-narrow": { theme: "dark", viewport: 375 },
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          height: "200px",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        <Story />
      </div>
    ),
  ],
  render: () => (
    <InfoBox defaultOpen>
      <InfoBoxTrigger asChild>
        <button type="button" className="text-foreground-secondary">
          <InfoCircleIcon className="size-5" />
        </button>
      </InfoBoxTrigger>
      <InfoBoxContent
        icon={<InfoCircleIcon className="size-5 text-foreground-inverse" />}
        heading="Title"
        primaryAction={{ label: "OK" }}
        secondaryAction={{ label: "Dismiss" }}
      >
        This is a long info box that tests how the component handles content in a very narrow
        viewport where vertical space is limited. The info box should stay within bounds and not
        overflow.
      </InfoBoxContent>
    </InfoBox>
  ),
};
