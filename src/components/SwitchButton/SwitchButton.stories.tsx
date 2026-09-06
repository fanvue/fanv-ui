import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { NON_VISUAL_STORY_PARAMETERS } from "../../storybook";
import { SwitchButton, type SwitchButtonSize } from "./SwitchButton";

const meta = {
  title: "Components/SwitchButton",
  component: SwitchButton,
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
} satisfies Meta<typeof SwitchButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const SIZES: SwitchButtonSize[] = ["40", "32", "24"];

const HOVER_CLASS = "bg-buttons-switch-hover";

/**
 * For stories that render a fixed set of instances rather than one driven by args.
 * Their whole point is the combinations they hardcode, so leaving the Controls panel
 * enabled advertises knobs that cannot move anything — toggle props on `Default`
 * instead.
 */
const STATIC_STORY_PARAMETERS = {
  controls: { disable: true },
} as const;

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
  parameters: STATIC_STORY_PARAMETERS,
  render: () => (
    <div className="flex flex-col gap-6">
      {SIZES.map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="typography-description-12px-regular w-10 text-content-secondary">
            {size}px
          </span>
          <SwitchButton size={size} label="CTA" />
          <SwitchButton size={size} label="CTA" defaultPressed />
          <SwitchButton size={size} variant="ai" label="CTA" />
          <SwitchButton size={size} variant="ai" label="CTA" defaultPressed />
        </div>
      ))}
    </div>
  ),
};

export const IconSlots: Story = {
  name: "Icon slots",
  parameters: {
    ...STATIC_STORY_PARAMETERS,
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
          <SwitchButton size={size} label="Neither" />
          <SwitchButton size={size} label="Left" showLeftIcon />
          <SwitchButton size={size} label="Right" showRightIcon />
          <SwitchButton size={size} label="Both" showLeftIcon showRightIcon />
        </div>
      ))}
    </div>
  ),
};

export const IconSlotsPressed: Story = {
  name: "Icon slots pressed",
  parameters: STATIC_STORY_PARAMETERS,
  render: () => (
    <div className="flex flex-col gap-6">
      {SIZES.map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="typography-description-12px-regular w-10 text-content-secondary">
            {size}px
          </span>
          <SwitchButton size={size} label="Neither" defaultPressed />
          <SwitchButton size={size} label="Left" showLeftIcon defaultPressed />
          <SwitchButton size={size} label="Right" showRightIcon defaultPressed />
          <SwitchButton size={size} label="Both" showLeftIcon showRightIcon defaultPressed />
        </div>
      ))}
    </div>
  ),
};

export const Matrix: Story = {
  parameters: {
    ...STATIC_STORY_PARAMETERS,
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
                <SwitchButton variant={variant} size={size} label="CTA" />
                <SwitchButton
                  variant={variant}
                  size={size}
                  label="CTA"
                  className={HOVER_CLASS}
                  tabIndex={-1}
                />
                <SwitchButton variant={variant} size={size} label="CTA" defaultPressed />
                <SwitchButton variant={variant} size={size} label="CTA" disabled />
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
    ...STATIC_STORY_PARAMETERS,
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
        <SwitchButton label="Hide sold out" pressed={pressed} onPressedChange={setPressed} />
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
    ...STATIC_STORY_PARAMETERS,
    docs: {
      description: {
        story: "No `pressed` prop. State is held internally, seeded by `defaultPressed`.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-4">
      <SwitchButton label="Off by default" />
      <SwitchButton label="On by default" defaultPressed />
    </div>
  ),
};
