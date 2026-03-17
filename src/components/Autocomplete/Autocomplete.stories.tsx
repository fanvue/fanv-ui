import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { HomeIcon } from "../Icons/HomeIcon";
import { Autocomplete, type AutocompleteOption, type AutocompleteProps } from "./Autocomplete";

const COUNTRIES: AutocompleteOption[] = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "br", label: "Brazil" },
];

const FRUITS: AutocompleteOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
];

const meta = {
  title: "Components/Autocomplete",
  component: Autocomplete,
  parameters: {
    layout: "centered",
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
    clearable: { control: "boolean" },
    loading: { control: "boolean" },
    creatable: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "375px" }}>
        <Story />
      </div>
    ),
  ],
} as Meta<AutocompleteProps>;

export default meta;
type Story = StoryObj<AutocompleteProps>;

export const Default: Story = {
  args: {
    label: "Country",
    placeholder: "Search countries...",
    helperText: "Start typing to filter",
    options: COUNTRIES,
    emptyText: "No results",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-[375px] flex-col gap-4">
      <Autocomplete
        size="48"
        label="Size 48"
        placeholder="Search..."
        options={COUNTRIES}
        emptyText="No results"
      />
      <Autocomplete
        size="40"
        label="Size 40"
        placeholder="Search..."
        options={COUNTRIES}
        emptyText="No results"
      />
      <Autocomplete
        size="32"
        label="Size 32"
        placeholder="Search..."
        options={COUNTRIES}
        emptyText="No results"
      />
    </div>
  ),
};

export const ErrorState: Story = {
  args: {
    label: "Country",
    placeholder: "Search countries...",
    options: COUNTRIES,
    error: true,
    errorMessage: "This field is required",
    emptyText: "No results",
  },
};

export const Disabled: Story = {
  args: {
    label: "Country",
    placeholder: "Search countries...",
    options: COUNTRIES,
    disabled: true,
    emptyText: "No results",
  },
};

export const MultiSelect: Story = {
  args: {
    label: "Fruits",
    placeholder: "Select fruits...",
    options: FRUITS,
    multiple: true,
    defaultValue: ["apple", "cherry"],
    emptyText: "No results",
  },
};

export const Clearable: Story = {
  args: {
    label: "Country",
    placeholder: "Search countries...",
    options: COUNTRIES,
    clearable: true,
    clearAriaLabel: "Clear selection",
    defaultValue: "us",
    emptyText: "No results",
  },
};

export const Loading: Story = {
  args: {
    label: "Country",
    placeholder: "Search countries...",
    options: [],
    loading: true,
    loadingText: "Loading...",
    emptyText: "No results",
  },
};

export const Creatable: Story = {
  args: {
    label: "Tag",
    placeholder: "Type to search or create...",
    options: FRUITS,
    creatable: true,
    creatableLabel: (val: string) => `Create "${val}"`,
    emptyText: "No results",
  },
};

export const CustomRenderOption: Story = {
  args: {
    label: "Country",
    placeholder: "Search countries...",
    options: COUNTRIES,
    emptyText: "No results",
    renderOption: (option: AutocompleteOption, state: { selected: boolean; active: boolean }) => (
      <div className="flex w-full items-center gap-2">
        <span className="min-w-0 flex-1 truncate">{option.label ?? option.value}</span>
        {state.selected && <span className="text-foreground-secondary text-xs">Selected</span>}
      </div>
    ),
  },
};

export const CustomRenderTag: Story = {
  args: {
    label: "Fruits",
    placeholder: "Select fruits...",
    options: FRUITS,
    multiple: true,
    defaultValue: ["apple", "banana"],
    emptyText: "No results",
    renderTag: (option: AutocompleteOption, onRemove: () => void) => (
      <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-xs">
        {option.label ?? option.value}
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 cursor-pointer text-foreground-secondary"
        >
          x
        </button>
      </span>
    ),
  },
};

export const WithLeftIcon: Story = {
  args: {
    label: "Country",
    placeholder: "Search countries...",
    options: COUNTRIES,
    leftIcon: <HomeIcon />,
    emptyText: "No results",
  },
};

export const FullWidth: Story = {
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: "100%", maxWidth: "600px" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: "Country",
    placeholder: "Search countries...",
    options: COUNTRIES,
    fullWidth: true,
    emptyText: "No results",
  },
};

function ControlledExample() {
  const [value, setValue] = React.useState<string | null>("us");

  return (
    <div className="flex flex-col gap-2">
      <Autocomplete
        label="Country"
        placeholder="Search countries..."
        options={COUNTRIES}
        value={value}
        onChange={setValue}
        clearable
        clearAriaLabel="Clear selection"
        emptyText="No results"
      />
      <p className="typography-regular-body-sm text-foreground-secondary">
        Selected: {value ?? "none"}
      </p>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
};

const GROUPED_OPTIONS: AutocompleteOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "carrot", label: "Carrot" },
  { value: "broccoli", label: "Broccoli" },
  { value: "salmon", label: "Salmon" },
  { value: "tuna", label: "Tuna" },
];

export const GroupedOptions: Story = {
  args: {
    label: "Food",
    placeholder: "Search foods...",
    options: GROUPED_OPTIONS,
    emptyText: "No results",
  },
};

const LONG_OPTIONS: AutocompleteOption[] = [
  { value: "us-minor", label: "United States Minor Outlying Islands" },
  { value: "png", label: "Papua New Guinea (Independent State of Papua New Guinea)" },
  { value: "gb", label: "United Kingdom of Great Britain and Northern Ireland" },
  { value: "caf", label: "Central African Republic" },
  { value: "stpm", label: "Saint Pierre and Miquelon (Collectivit\u00e9 territoriale)" },
];

const LONG_FRUITS: AutocompleteOption[] = [
  { value: "passion", label: "Purple passionfruit (Passiflora edulis)" },
  { value: "dragon", label: "Dragon fruit (Hylocereus undatus)" },
  { value: "star", label: "Star fruit / Carambola (Averrhoa carambola)" },
  { value: "jack", label: "Jackfruit (Artocarpus heterophyllus)" },
  { value: "blood", label: "Blood orange (Citrus \u00d7 sinensis)" },
];

export const TruncatedOptions: Story = {
  args: {
    label: "Country",
    placeholder: "Search countries...",
    options: LONG_OPTIONS,
    defaultValue: "gb",
    emptyText: "No results",
  },
};

export const TruncatedMultiSelectTags: Story = {
  args: {
    label: "Fruits",
    placeholder: "Select fruits...",
    options: LONG_FRUITS,
    multiple: true,
    defaultValue: ["passion", "dragon", "star", "jack", "blood"],
    emptyText: "No results",
  },
};

export const TruncatedNarrow: Story = {
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: "200px" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: "Country",
    placeholder: "Search...",
    options: LONG_OPTIONS,
    defaultValue: "png",
    emptyText: "No results",
  },
};
