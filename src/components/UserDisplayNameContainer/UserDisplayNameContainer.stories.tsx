import type { Meta, StoryObj } from "@storybook/react";
import { UserDisplayNameContainer } from "./UserDisplayNameContainer";

const VARIANTS = [
  "body2SemiBold",
  "body1SemiBold",
  "subtitle1",
  "heading4",
  "captionRegular",
] as const;

const meta = {
  title: "Components/UserDisplayNameContainer",
  component: UserDisplayNameContainer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    ambassador: { control: "boolean" },
    verified: { control: "boolean" },
    showOnlineStatus: { control: "boolean" },
    noWrap: { control: "boolean" },
    variant: { control: "select", options: VARIANTS },
    component: {
      control: "select",
      options: ["span", "h1", "h2", "h3", "p", "div"],
    },
    textAlign: { control: "inline-radio", options: ["left", "center", "right"] },
    children: { control: "text" },
  },
  args: {
    children: "Aitana Lopez",
  },
  render: (args) => (
    <div className="w-72">
      <UserDisplayNameContainer {...args} />
    </div>
  ),
} satisfies Meta<typeof UserDisplayNameContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Ambassador: Story = {
  args: { ambassador: true },
};

export const Verified: Story = {
  args: { verified: true },
};

export const OnlineStatus: Story = {
  args: { showOnlineStatus: true },
};

export const AmbassadorWithOnlineStatus: Story = {
  args: { ambassador: true, showOnlineStatus: true },
};

export const VerifiedWithOnlineStatus: Story = {
  args: { verified: true, showOnlineStatus: true },
};

/** When both are set, the ambassador badge takes precedence over verified. */
export const AmbassadorTakesPrecedence: Story = {
  args: { ambassador: true, verified: true },
};

export const Truncated: Story = {
  args: { children: "Aitana Lopez de la Vega Hernández Rodríguez del Castillo" },
};

const LONG_NAME = "Aitana Lopez de la Vega Hernández Rodríguez del Castillo";

/**
 * The name truncates with an ellipsis while the verified/ambassador badge and
 * online-status indicator stay fully visible on the same line — nothing wraps
 * or gets clipped.
 */
export const TruncatedWithIconsAndStatus: Story = {
  name: "Truncated with icons + online status",
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <UserDisplayNameContainer verified showOnlineStatus>
          {LONG_NAME}
        </UserDisplayNameContainer>
        <span className="typography-description-12px-regular text-content-secondary">
          verified + online
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <UserDisplayNameContainer ambassador showOnlineStatus>
          {LONG_NAME}
        </UserDisplayNameContainer>
        <span className="typography-description-12px-regular text-content-secondary">
          ambassador + online
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <UserDisplayNameContainer verified>{LONG_NAME}</UserDisplayNameContainer>
        <span className="typography-description-12px-regular text-content-secondary">
          verified only
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <UserDisplayNameContainer showOnlineStatus>{LONG_NAME}</UserDisplayNameContainer>
        <span className="typography-description-12px-regular text-content-secondary">
          online only
        </span>
      </div>
    </div>
  ),
};

/** The same content at an even narrower width still keeps the icons pinned. */
export const TruncatedNarrow: Story = {
  name: "Truncated (narrow container)",
  render: () => (
    <div className="flex w-40 flex-col gap-1">
      <UserDisplayNameContainer ambassador showOnlineStatus>
        {LONG_NAME}
      </UserDisplayNameContainer>
      <span className="typography-description-12px-regular text-content-secondary">w-40</span>
    </div>
  ),
};

export const Wrapping: Story = {
  args: {
    noWrap: false,
    children: "Aitana Lopez de la Vega Hernández Rodríguez del Castillo",
  },
};

export const CustomLabels: Story = {
  name: "Custom badge labels",
  args: {
    ambassador: true,
    showOnlineStatus: true,
    ambassadorLabel: "Fanvue Ambassador",
    onlineLabel: "Active now",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-1">
          <UserDisplayNameContainer variant={variant} verified>
            Aitana Lopez
          </UserDisplayNameContainer>
          <span className="typography-description-12px-regular text-content-secondary">
            variant=&quot;{variant}&quot;
          </span>
        </div>
      ))}
    </div>
  ),
};

export const SemanticElements: Story = {
  name: "Polymorphic element",
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      {(["h1", "h2", "h3", "p", "div"] as const).map((component) => (
        <UserDisplayNameContainer key={component} component={component} variant="subtitle1">
          Rendered as &lt;{component}&gt;
        </UserDisplayNameContainer>
      ))}
    </div>
  ),
};
