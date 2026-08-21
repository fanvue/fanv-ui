import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { NON_VISUAL_STORY_PARAMETERS } from "../../storybook";
import { SwitchToggle, type SwitchToggleSize } from "./SwitchToggle";

const meta = {
  title: "Components/SwitchToggle",
  component: SwitchToggle,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=16800-9469",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "ai"],
    },
    size: {
      control: "inline-radio",
      options: ["24", "32", "40"],
    },
    label: {
      control: "text",
    },
    pressed: {
      control: "boolean",
    },
    defaultPressed: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    showLeftIcon: {
      control: "boolean",
    },
    showRightIcon: {
      control: "boolean",
    },
  },
  args: {
    label: "CTA",
    size: "40",
    variant: "default",
  },
} satisfies Meta<typeof SwitchToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

const SIZES: SwitchToggleSize[] = ["40", "32", "24"];

const HOVER_CLASS = "bg-buttons-switch-hover";

export const Default: Story = {};

export const Pressed: Story = {
  args: { defaultPressed: true },
};

export const Ai: Story = {
  name: "AI",
  args: { variant: "ai" },
};

export const AiPressed: Story = {
  name: "AI pressed",
  args: { variant: "ai", defaultPressed: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {SIZES.map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="typography-description-12px-regular w-10 text-content-secondary">
            {size}px
          </span>
          <SwitchToggle size={size} label="CTA" />
          <SwitchToggle size={size} label="CTA" defaultPressed />
          <SwitchToggle size={size} variant="ai" label="CTA" />
          <SwitchToggle size={size} variant="ai" label="CTA" defaultPressed />
        </div>
      ))}
    </div>
  ),
};

export const IconSlots: Story = {
  name: "Icon slots",
  parameters: {
    docs: {
      description: {
        story:
          "`showLeftIcon` and `showRightIcon` are independent booleans, each rendering the add glyph on that side. Both are available on the `default` variant only — the `ai` variant types them as `never`, since its sparkle is fixed and it has no trailing slot.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {SIZES.map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="typography-description-12px-regular w-10 text-content-secondary">
            {size}px
          </span>
          <SwitchToggle size={size} label="Neither" />
          <SwitchToggle size={size} label="Left" showLeftIcon />
          <SwitchToggle size={size} label="Right" showRightIcon />
          <SwitchToggle size={size} label="Both" showLeftIcon showRightIcon />
        </div>
      ))}
    </div>
  ),
};

export const IconSlotsPressed: Story = {
  name: "Icon slots pressed",
  render: () => (
    <div className="flex flex-col gap-6">
      {SIZES.map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="typography-description-12px-regular w-10 text-content-secondary">
            {size}px
          </span>
          <SwitchToggle size={size} label="Neither" defaultPressed />
          <SwitchToggle size={size} label="Left" showLeftIcon defaultPressed />
          <SwitchToggle size={size} label="Right" showRightIcon defaultPressed />
          <SwitchToggle size={size} label="Both" showLeftIcon showRightIcon defaultPressed />
        </div>
      ))}
    </div>
  ),
};

export const Matrix: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Mirrors the `V2 Toggle` Figma frame: every size against every state, for both variants. The hover column is painted with the hover token directly, since a real `:hover` cannot be held open in a static snapshot — move the pointer over the inactive column to see the genuine transition.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      {(["default", "ai"] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-4">
          <span className="typography-body-small-14px-semibold text-content-secondary">
            {variant === "ai" ? "AI" : "Default"}
          </span>
          <div className="grid grid-cols-[3rem_repeat(4,minmax(6rem,auto))] items-center justify-items-start gap-x-4 gap-y-3">
            <span />
            {["Inactive", "Hover", "Active", "Disabled"].map((state) => (
              <span
                key={state}
                className="typography-description-12px-regular text-content-secondary"
              >
                {state}
              </span>
            ))}
            {SIZES.map((size) => (
              <div key={size} className="col-span-5 grid grid-cols-subgrid items-center">
                <span className="typography-description-12px-regular text-content-secondary">
                  {size}px
                </span>
                <SwitchToggle variant={variant} size={size} label="CTA" />
                <SwitchToggle
                  variant={variant}
                  size={size}
                  label="CTA"
                  className={HOVER_CLASS}
                  tabIndex={-1}
                />
                <SwitchToggle variant={variant} size={size} label="CTA" defaultPressed />
                <SwitchToggle variant={variant} size={size} label="CTA" disabled />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const ControlledExample: Story = {
  name: "Controlled",
  parameters: {
    ...NON_VISUAL_STORY_PARAMETERS,
    docs: {
      description: {
        story: "`pressed` and `onPressedChange` driven by React state.",
      },
    },
  },
  render: function ControlledRender() {
    const [pressed, setPressed] = useState(false);
    return (
      <div className="flex items-center gap-3">
        <SwitchToggle label="Hide sold out" pressed={pressed} onPressedChange={setPressed} />
        <span className="typography-body-small-14px-regular text-content-secondary">
          {pressed ? "On" : "Off"}
        </span>
      </div>
    );
  },
};

export const UncontrolledExample: Story = {
  name: "Uncontrolled",
  parameters: {
    ...NON_VISUAL_STORY_PARAMETERS,
    docs: {
      description: {
        story: "No `pressed` prop. State is held internally, seeded by `defaultPressed`.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-4">
      <SwitchToggle label="Off by default" />
      <SwitchToggle label="On by default" defaultPressed />
    </div>
  ),
};

export const MigrationFromSegmented: Story = {
  name: "Migrating from the two-option API",
  parameters: {
    ...NON_VISUAL_STORY_PARAMETERS,
    docs: {
      description: {
        story:
          "`SwitchToggle` used to be a two-option segmented control taking `options`, `value` and `onChange`. That control is now `SegmentedControl` — move any either/or view switcher there. `SwitchToggle` is a single binary toggle, so reach for it when one named thing turns on and off.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-4">
      <SwitchToggle label="Only my posts" />
      <SwitchToggle variant="ai" label="Smart replies" defaultPressed />
    </div>
  ),
};
