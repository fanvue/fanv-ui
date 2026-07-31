import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Button } from "../Button/Button";
import { AnimatedNumber } from "./AnimatedNumber";

const formatPrice = (value: number) =>
  `$${(Math.round(value) / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const meta: Meta<typeof AnimatedNumber> = {
  title: "Components/AnimatedNumber",
  component: AnimatedNumber,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "inline-radio", options: ["count", "roll"] },
    durationMs: { control: { type: "number", min: 0, step: 50 } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** The two gross values the insights earnings toggle switches between. */
const GROSS = 12_804_673;
const NET = 10_243_738;

export const Default: Story = {
  args: { value: 1234, variant: "count" },
};

/**
 * Both variants against the same value change, so the difference is directly
 * comparable: `roll` moves each digit column and eases the box width when the
 * digit count changes, while `count` interpolates the value itself.
 */
export const Comparison: Story = {
  render: () => {
    const [value, setValue] = React.useState(GROSS);

    return (
      <div className="flex w-96 flex-col items-start gap-6">
        <Button
          variant="secondary"
          size="40"
          onClick={() => setValue((current) => (current === GROSS ? NET : GROSS))}
        >
          Toggle net / gross
        </Button>

        <div className="flex flex-col gap-1">
          <span className="typography-description-12px-regular text-content-secondary">
            roll — headline figure
          </span>
          <span className="typography-header-heading-lg text-content-primary">
            <AnimatedNumber value={value} format={formatPrice} variant="roll" />
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="typography-description-12px-regular text-content-secondary">
            count — supporting figure
          </span>
          <span className="typography-body-default-16px-semibold text-content-primary">
            <AnimatedNumber value={value} format={formatPrice} variant="count" />
          </span>
        </div>
      </div>
    );
  },
};

/**
 * A change that drops a digit, which is where the box width eases rather than
 * snapping. Toggle repeatedly to see the separators shift.
 */
export const DigitCountChange: Story = {
  render: () => {
    const [value, setValue] = React.useState(999_99);

    return (
      <div className="flex w-96 flex-col items-start gap-6">
        <Button
          variant="secondary"
          size="40"
          onClick={() => setValue((current) => (current === 999_99 ? 1_000_00 : 999_99))}
        >
          Cross the thousand
        </Button>
        <span className="typography-header-heading-lg text-content-primary">
          <AnimatedNumber value={value} format={formatPrice} variant="roll" />
        </span>
      </div>
    );
  },
};
