import type { Meta, StoryObj } from "@storybook/react";
import { Demographics } from "./Demographics";

const meta = {
  title: "Components/Demographics",
  component: Demographics,
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/23x2vofTPkLpbcJyRdDa55/Creator---Management%E2%80%A8--Teams?node-id=8294-29097",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Demographics>;

export default meta;
type Story = StoryObj<typeof Demographics>;

const COUNTRIES = [
  { label: "United States", value: 52.6 },
  { label: "United Kingdom", value: 29.2 },
  { label: "Netherlands", value: 7.6 },
  { label: "Italy", value: 7.3 },
  { label: "Spain", value: 6.9 },
];

/**
 * `icon` is any node, so these stories fill the slot with a plain disc rather
 * than depending on `CountryFlag`. Agency insights pairs it with a real flag
 * from `@fanvue/ui/flags`; the row itself neither knows nor cares.
 */
const Glyph = () => <span aria-hidden className="size-5 rounded-full bg-special-chart-sky" />;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-sm">
      <Demographics label="United States" value={52.6} formattedValue="52.6%" icon={<Glyph />} />
    </div>
  ),
};

export const Breakdown: Story = {
  name: "Stacked breakdown",
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {COUNTRIES.map((country) => (
        <Demographics
          key={country.label}
          label={country.label}
          value={country.value}
          formattedValue={`${country.value}%`}
          icon={<Glyph />}
        />
      ))}
    </div>
  ),
};

export const WithoutIcon: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Demographics label="Direct" value={64} formattedValue="64%" />
      <Demographics label="Referral" value={36} formattedValue="36%" />
    </div>
  ),
};
