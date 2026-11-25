import type { Meta, StoryObj } from "@storybook/react";
import { Fragment } from "react";
import { NON_VISUAL_STORY_PARAMETERS } from "../../storybook";
import { FlashIcon } from "../Icons/FlashIcon";
import { Tag, type TagSize, type TagVariant } from "./Tag";

const VARIANTS: readonly TagVariant[] = [
  "gray",
  "blue",
  "teal",
  "green",
  "amber",
  "red",
  "pink",
  "purple",
];

const SIZES: readonly TagSize[] = ["16", "20"];

const meta = {
  title: "Components/Tag",
  component: Tag,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=23541-629",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    size: { control: "select", options: SIZES },
    removeVisibility: { control: "select", options: ["always", "hover"] },
  },
  args: { children: "Whale" },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { leadingIcon: "🐳", variant: "blue" },
};

export const Removable: Story = {
  args: { leadingIcon: "🐳", variant: "blue", onRemove: () => {}, removeVisibility: "hover" },
  parameters: NON_VISUAL_STORY_PARAMETERS,
};

/**
 * Every V2 Tags colour at both sizes. Each row shows the tag with no remove button, then with
 * an always-visible ×. Switch the theme in the toolbar to check the dark palette.
 */
export const AllColours: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid grid-cols-[auto_repeat(2,max-content)] items-center justify-items-start gap-x-8 gap-y-3">
      {SIZES.map((size) => (
        <Fragment key={size}>
          {VARIANTS.map((variant) => (
            <Fragment key={variant}>
              <span className="typography-description-12px-semibold text-content-tertiary capitalize">
                {variant} {size}px
              </span>
              <Tag variant={variant} size={size} leadingIcon="🐳">
                Whale
              </Tag>
              <Tag variant={variant} size={size} leadingIcon="🐳" onRemove={() => {}}>
                Whale
              </Tag>
            </Fragment>
          ))}
        </Fragment>
      ))}
    </div>
  ),
};

/**
 * The V2 Tags types: Tag (creator-picked colour, × on hover), List (× always), Dynamic list
 * (flash icon, × on hover) and the +N overflow. Hover a tag to see the overlay and the ×.
 */
export const Types: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid grid-cols-[auto_repeat(4,max-content)] items-center justify-items-start gap-x-8 gap-y-3">
      <span />
      {["Tag", "List", "Dynamic list", "Overflow"].map((type) => (
        <span key={type} className="typography-description-12px-semibold text-content-tertiary">
          {type}
        </span>
      ))}
      {SIZES.map((size) => (
        <Fragment key={size}>
          <span className="typography-description-12px-semibold text-content-tertiary">
            {size}px
          </span>
          <Tag
            variant="blue"
            size={size}
            leadingIcon="🐳"
            onRemove={() => {}}
            removeVisibility="hover"
          >
            Whale
          </Tag>
          <Tag size={size} onRemove={() => {}}>
            VIPs
          </Tag>
          <Tag
            size={size}
            leadingIcon={<FlashIcon className="text-success-content" />}
            onRemove={() => {}}
            removeVisibility="hover"
          >
            VIPs
          </Tag>
          <Tag size={size}>+2</Tag>
        </Fragment>
      ))}
    </div>
  ),
};

export const Truncated: Story = {
  args: {
    children: "A very long tag label that does not fit",
    className: "max-w-40",
    onRemove: () => {},
  },
};
