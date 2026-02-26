import type { Meta, StoryObj } from "@storybook/react";
import { HomeIcon } from "../Icons/HomeIcon";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
} from "./Select";

const COUNTRIES = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
];

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=1012-1377&m=dev",
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
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
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

const DefaultContent = () => (
  <SelectContent>
    {COUNTRIES.map((c) => (
      <SelectItem key={c.value} value={c.value}>
        {c.label}
      </SelectItem>
    ))}
  </SelectContent>
);

export const Default: Story = {
  args: {
    label: "Label",
    placeholder: "Placeholder Text",
    helperText: "Helper Text",
  },
  render: (args) => (
    <Select {...args}>
      <DefaultContent />
    </Select>
  ),
};

export const WithoutLabel: Story = {
  args: {
    "aria-label": "Country",
    placeholder: "Select a country",
  },
  render: (args) => (
    <Select {...args}>
      <DefaultContent />
    </Select>
  ),
};

export const Size48: Story = {
  args: { size: "48", label: "Size 48", placeholder: "Placeholder Text" },
  render: (args) => (
    <Select {...args}>
      <DefaultContent />
    </Select>
  ),
};

export const Size40: Story = {
  args: { size: "40", label: "Size 40", placeholder: "Placeholder Text" },
  render: (args) => (
    <Select {...args}>
      <DefaultContent />
    </Select>
  ),
};

export const Size32: Story = {
  args: { size: "32", label: "Size 32", placeholder: "Placeholder Text" },
  render: (args) => (
    <Select {...args}>
      <DefaultContent />
    </Select>
  ),
};

export const WithHelperText: Story = {
  args: {
    label: "Country",
    placeholder: "Select a country",
    helperText: "Used for currency and tax calculations",
  },
  render: (args) => (
    <Select {...args}>
      <DefaultContent />
    </Select>
  ),
};

export const WithLeftIcon: Story = {
  args: {
    label: "Country",
    placeholder: "Select a country",
    leftIcon: <HomeIcon />,
  },
  render: (args) => (
    <Select {...args}>
      <DefaultContent />
    </Select>
  ),
};

export const ErrorState: Story = {
  args: {
    label: "Country",
    placeholder: "Select a country",
    error: true,
    errorMessage: "This field is required",
  },
  render: (args) => (
    <Select {...args}>
      <DefaultContent />
    </Select>
  ),
};

export const Disabled: Story = {
  args: {
    label: "Country",
    placeholder: "Select a country",
    disabled: true,
  },
  render: (args) => (
    <Select {...args}>
      <DefaultContent />
    </Select>
  ),
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
    label: "Country",
    placeholder: "Select a country",
    fullWidth: true,
  },
  render: (args) => (
    <Select {...args}>
      <DefaultContent />
    </Select>
  ),
};

export const WithGroupsAndSeparator: Story = {
  args: {
    label: "Location",
    placeholder: "Select a location",
  },
  render: (args) => (
    <Select {...args}>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="uk">United Kingdom</SelectItem>
          <SelectItem value="de">Germany</SelectItem>
          <SelectItem value="fr">France</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const AllSizes: Story = {
  name: "All Sizes",
  render: () => (
    <div className="flex w-[375px] flex-col gap-4">
      <Select size="48" label="Size 48" placeholder="Placeholder Text">
        <DefaultContent />
      </Select>
      <Select size="40" label="Size 40" placeholder="Placeholder Text">
        <DefaultContent />
      </Select>
      <Select size="32" label="Size 32" placeholder="Placeholder Text">
        <DefaultContent />
      </Select>
    </div>
  ),
};

export const LongList: Story = {
  name: "Long List (50 items)",
  args: {
    label: "US State",
    placeholder: "Select a state",
  },
  render: (args) => (
    <Select {...args}>
      <SelectContent>
        {US_STATES.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
};

export const AllStates: Story = {
  name: "All States",
  render: () => (
    <div className="flex w-[375px] flex-col gap-6">
      <Select label="Default" placeholder="Placeholder Text">
        <DefaultContent />
      </Select>
      <Select label="With helper" placeholder="Placeholder Text" helperText="Helper text">
        <DefaultContent />
      </Select>
      <Select
        label="Error"
        placeholder="Placeholder Text"
        error
        errorMessage="This field is required"
      >
        <DefaultContent />
      </Select>
      <Select label="Disabled" placeholder="Placeholder Text" disabled>
        <DefaultContent />
      </Select>
      <Select label="With left icon" placeholder="Placeholder Text" leftIcon={<HomeIcon />}>
        <DefaultContent />
      </Select>
    </div>
  ),
};
