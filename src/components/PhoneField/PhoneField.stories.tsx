import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { PhoneField } from "./PhoneField";

const ItalyFlag = () => (
  <span aria-hidden="true" className="text-base leading-none">
    🇮🇹
  </span>
);

const meta: Meta<typeof PhoneField> = {
  title: "Components/PhoneField",
  component: PhoneField,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=16633-67897",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["48", "40", "32"],
    },
    label: { control: "text" },
    helperText: { control: "text" },
    errorMessage: { control: "text" },
    placeholder: { control: "text" },
    dialCode: { control: "text" },
    countryButtonLabel: { control: "text" },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
  args: {
    label: "Phone number",
    dialCode: "+39",
    flag: <ItalyFlag />,
    placeholder: "Input Content",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "375px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: {
    defaultValue: "3381020300",
  },
};

export const Size40: Story = {
  args: {
    size: "40",
    defaultValue: "3381020300",
  },
};

export const Size32: Story = {
  args: {
    size: "32",
    defaultValue: "3381020300",
  },
};

export const WithHelperText: Story = {
  args: {
    helperText: "We'll send a verification code to this number",
  },
};

export const ErrorState: Story = {
  args: {
    error: true,
    errorMessage: "Enter a valid phone number",
    defaultValue: "33810",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "3381020300",
  },
};

export const WithoutFlag: Story = {
  name: "Without flag",
  args: {
    flag: undefined,
  },
};

export const FullWidth: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: "600px" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    fullWidth: true,
    defaultValue: "3381020300",
  },
};

export const AllSizes: Story = {
  name: "All sizes",
  render: () => (
    <div className="flex w-[375px] flex-col gap-4">
      <PhoneField
        size="48"
        label="Size 48"
        flag={<ItalyFlag />}
        dialCode="+39"
        defaultValue="3381020300"
      />
      <PhoneField
        size="40"
        label="Size 40"
        flag={<ItalyFlag />}
        dialCode="+39"
        defaultValue="3381020300"
      />
      <PhoneField
        size="32"
        label="Size 32"
        flag={<ItalyFlag />}
        dialCode="+39"
        defaultValue="3381020300"
      />
    </div>
  ),
};

const DEFAULT_COUNTRY = { flag: "🇮🇹", dialCode: "+39" };
const COUNTRIES = [
  DEFAULT_COUNTRY,
  { flag: "🇬🇧", dialCode: "+44" },
  { flag: "🇺🇸", dialCode: "+1" },
];

export const Controlled: Story = {
  name: "Controlled with country picker",
  parameters: {
    docs: {
      description: {
        story:
          "The country picker is owned by the consumer. `onCountrySelect` opens it; here it cycles through a small list to show `flag` and `dialCode` updating.",
      },
    },
  },
  render: function ControlledRender() {
    const [value, setValue] = useState("");
    const [country, setCountry] = useState(DEFAULT_COUNTRY);

    return (
      <div className="flex w-[375px] flex-col gap-4">
        <PhoneField
          label="Phone number"
          placeholder="Input Content"
          flag={
            <span aria-hidden="true" className="text-base leading-none">
              {country.flag}
            </span>
          }
          dialCode={country.dialCode}
          onCountrySelect={() =>
            setCountry(
              (c) => COUNTRIES[(COUNTRIES.indexOf(c) + 1) % COUNTRIES.length] ?? DEFAULT_COUNTRY,
            )
          }
          value={value}
          onChange={(e) => setValue(e.target.value)}
          helperText="Tap the flag to change country"
        />
        <div className="typography-description-12px-regular text-content-secondary">
          {country.dialCode} {value || "(empty)"}
        </div>
      </div>
    );
  },
};
