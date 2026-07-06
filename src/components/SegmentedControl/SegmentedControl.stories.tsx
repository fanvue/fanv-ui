import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
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
    disabled: {
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

export const Default: Story = {
  args: {
    options: twoOptions,
    size: "32",
    variant: "hug",
    "aria-label": "Amount type",
  },
};

export const ThreeOptions: Story = {
  args: {
    options: threeOptions,
    size: "32",
    variant: "hug",
    "aria-label": "Amount type",
  },
};

export const Fill: Story = {
  args: {
    options: twoOptions,
    size: "32",
    variant: "fill",
    "aria-label": "Amount type",
  },
  render: (args) => (
    <div style={{ width: 480 }}>
      <SegmentedControl {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    options: twoOptions,
    disabled: true,
    "aria-label": "Amount type",
  },
};

export const Controlled: Story = {
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

export const Sizes: Story = {
  args: {
    options: twoOptions,
    "aria-label": "Amount type",
  },
  render: () => (
    <div className="flex flex-col items-start gap-4">
      {(["32", "40", "48"] as const).map((size) => (
        <div key={size} className="flex flex-col items-start gap-2">
          <span className="typography-body-small-14px-semibold text-content-secondary">
            {size}px
          </span>
          <SegmentedControl size={size} options={twoOptions} aria-label={`${size}px control`} />
        </div>
      ))}
    </div>
  ),
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
