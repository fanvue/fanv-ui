import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { NON_VISUAL_STORY_PARAMETERS } from "../../storybook";
import { AIIcon } from "../Icons/AIIcon";
import { GridViewIcon } from "../Icons/GridViewIcon";
import { HomeIcon } from "../Icons/HomeIcon";
import { ListViewIcon } from "../Icons/ListViewIcon";
import { RepeatIcon } from "../Icons/RepeatIcon";
import type { SegmentedControlSize, SegmentedControlVariant } from "./SegmentedControl";
import { SegmentedControl } from "./SegmentedControl";

const meta = {
  title: "Components/SegmentedControl",
  component: SegmentedControl,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=16965-105414&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["32", "40", "48"],
    },
    variant: {
      control: "inline-radio",
      options: ["hug", "fill"],
    },
    appearance: {
      control: "inline-radio",
      options: ["pill", "plain", "ai"],
    },
    disabled: {
      control: "boolean",
    },
    collapsible: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

const twoOptions = [
  { label: "Net", value: "net" },
  { label: "Gross", value: "gross" },
];

const threeOptions = [
  { label: "Net", value: "net" },
  { label: "Gross", value: "gross" },
  { label: "Total", value: "total" },
];

export const Disabled: Story = {
  args: {
    options: twoOptions,
    disabled: true,
    "aria-label": "Amount type",
  },
};

export const Controlled: Story = {
  parameters: NON_VISUAL_STORY_PARAMETERS,
  args: {
    options: threeOptions,
    "aria-label": "Amount type",
  },
  render: function ControlledRender() {
    const [value, setValue] = useState("net");
    return (
      <div className="flex flex-col items-center gap-3">
        <SegmentedControl
          options={threeOptions}
          value={value}
          onChange={setValue}
          aria-label="Amount type"
        />
        <span className="typography-body-small-14px-regular text-content-secondary">
          Selected: {value}
        </span>
      </div>
    );
  },
};

const iconOnlyOptions = [
  { label: "List view", value: "list", icon: <ListViewIcon size={16} aria-hidden="true" /> },
  { label: "Grid view", value: "grid", icon: <GridViewIcon size={16} aria-hidden="true" /> },
];

/** Icon-only toggle (e.g. the Vault list/grid view switch) using `appearance="plain"`. */
export const IconOnly: Story = {
  args: {
    appearance: "plain",
    options: iconOnlyOptions,
    "aria-label": "View",
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/LB9q4XzCNlbOaeW3xN6tQo/Creator---Content---Creation?node-id=4506-17416",
    },
  },
};

const aiOptions = [
  { label: "Home", value: "home", icon: <HomeIcon size={16} aria-hidden="true" /> },
  { label: "Agent", value: "agent", icon: <AIIcon size={16} aria-hidden="true" /> },
];

/**
 * Icon + visible label with the `V2 Switch Button` AI pill selected — the Home/Agent navigation
 * switch.
 * Colours are approximated with existing tokens pending dedicated navigation tokens.
 */
export const Ai: Story = {
  name: "AI",
  args: {
    appearance: "ai",
    options: aiOptions,
    defaultValue: "agent",
    "aria-label": "Navigation mode",
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/fDlJj7bf7KXQlibPoujgaC/Creator---AI-Features?node-id=6470-48376",
    },
  },
};

/**
 * With `collapsible`, an icon-bearing control (`plain` or `ai`) collapses to a single icon
 * toggle when its container is too narrow to show every segment, and expands again when the
 * space returns. Collapsed, it shows the selected option's icon; clicking it (or pressing
 * Enter/Space) cycles to the next option, wrapping around.
 *
 * Drag the right edge of the box to shrink it and watch the control collapse.
 */
export const Collapsible: Story = {
  args: {
    appearance: "plain",
    collapsible: true,
    options: iconOnlyOptions,
    "aria-label": "View",
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/LB9q4XzCNlbOaeW3xN6tQo/Creator---Content---Creation?node-id=4506-17416",
    },
  },
  render: function CollapsibleRender(args) {
    const [view, setView] = useState("list");
    return (
      <div className="flex flex-col items-start gap-3">
        <span className="typography-body-small-14px-regular text-content-secondary">
          Drag the right edge to shrink the container — the control collapses to the selected icon
          and cycles on click.
        </span>
        <div
          className="resize-x overflow-auto rounded-lg border border-border-primary p-4"
          style={{ width: 260, minWidth: 72, maxWidth: 420 }}
        >
          <SegmentedControl {...args} value={view} onChange={setView} />
        </div>
        <span className="typography-body-small-14px-regular text-content-secondary">
          Selected: {view}
        </span>
      </div>
    );
  },
};

/**
 * `collapsedIcon` replaces the selected option's icon with a single glyph, so the collapsed control
 * reads as one switch affordance. Collapsed it is a neutral circle centred in its column, which is
 * how the navigation rail shows the Home/Agent switch once the rail is reduced to icons.
 */
export const CollapsibleWithToggleIcon: Story = {
  args: {
    appearance: "ai",
    variant: "fill",
    collapsible: true,
    collapsedIcon: <RepeatIcon size={16} />,
    options: aiOptions,
    "aria-label": "Navigation mode",
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=21606-13563",
    },
  },
  render: function CollapsibleWithToggleIconRender(args) {
    const [mode, setMode] = useState("agent");
    return (
      <div className="flex items-start gap-6">
        <div className="flex flex-col gap-2">
          <span className="typography-body-small-14px-regular text-content-secondary">
            Expanded rail
          </span>
          <div className="rounded-lg border border-border-primary p-4" style={{ width: 230 }}>
            <SegmentedControl {...args} value={mode} onChange={setMode} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="typography-body-small-14px-regular text-content-secondary">
            Collapsed rail
          </span>
          <div className="rounded-lg border border-border-primary p-4" style={{ width: 72 }}>
            <SegmentedControl {...args} value={mode} onChange={setMode} />
          </div>
        </div>
      </div>
    );
  },
};

/** Every combination in the Figma variant sheet: hug/fill × 32/40/48px × 2/3 options. */
export const AllVariants: Story = {
  args: {
    options: twoOptions,
    "aria-label": "Amount type",
  },
  parameters: { layout: "padded" },
  render: () => {
    const sizes: SegmentedControlSize[] = ["32", "40", "48"];
    const variants: SegmentedControlVariant[] = ["hug", "fill"];
    return (
      <div className="flex flex-col items-start gap-8">
        {variants.map((variant) => (
          <div key={variant} className="flex flex-col items-start gap-4">
            <span className="typography-body-default-16px-semibold text-content-primary capitalize">
              {variant}
            </span>
            {sizes.map((size) => (
              <div
                key={size}
                className="flex flex-col items-start gap-3"
                style={{ width: variant === "fill" ? 560 : "auto" }}
              >
                <span className="typography-description-12px-regular text-content-secondary">
                  {size}px
                </span>
                <SegmentedControl
                  size={size}
                  variant={variant}
                  options={twoOptions}
                  aria-label={`${variant} ${size}px two options`}
                />
                <SegmentedControl
                  size={size}
                  variant={variant}
                  options={threeOptions}
                  aria-label={`${variant} ${size}px three options`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  },
};
