import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { DatePicker } from "./DatePicker";

const DEFAULT_MONTH = new Date(2026, 1);

const meta = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=4663-5621&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["single", "double"],
    },
    showFooter: { control: "boolean" },
    cancelLabel: { control: "text" },
    applyLabel: { control: "text" },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState<Date | undefined>();
    return (
      <DatePicker
        mode="single"
        defaultMonth={DEFAULT_MONTH}
        selected={selected}
        onSelect={setSelected}
        onApply={() => console.log("Applied:", selected)}
        onCancel={() => setSelected(undefined)}
      />
    );
  },
};

export const SingleSelection: Story = {
  render: () => {
    const [selected, setSelected] = useState<Date | undefined>(new Date(2026, 1, 15));
    return (
      <DatePicker
        mode="single"
        defaultMonth={DEFAULT_MONTH}
        selected={selected}
        onSelect={setSelected}
        onApply={() => console.log("Applied:", selected)}
        onCancel={() => setSelected(undefined)}
      />
    );
  },
};

export const RangeSelection: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>({
      from: new Date(2026, 1, 9),
      to: new Date(2026, 1, 19),
    });
    return (
      <DatePicker
        mode="range"
        defaultMonth={DEFAULT_MONTH}
        selected={range}
        onSelect={setRange}
        onApply={() => console.log("Applied:", range)}
        onCancel={() => setRange(undefined)}
      />
    );
  },
};

export const DoubleMonth: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>({
      from: new Date(2026, 1, 9),
      to: new Date(2026, 2, 4),
    });
    return (
      <DatePicker
        mode="range"
        variant="double"
        defaultMonth={DEFAULT_MONTH}
        selected={range}
        onSelect={setRange}
        onApply={() => console.log("Applied:", range)}
        onCancel={() => setRange(undefined)}
      />
    );
  },
};

export const WithoutFooter: Story = {
  render: () => {
    const [selected, setSelected] = useState<Date | undefined>();
    return (
      <DatePicker
        mode="single"
        defaultMonth={DEFAULT_MONTH}
        selected={selected}
        onSelect={setSelected}
        showFooter={false}
      />
    );
  },
};

export const CustomLabels: Story = {
  render: () => {
    const [selected, setSelected] = useState<Date | undefined>();
    return (
      <DatePicker
        mode="single"
        defaultMonth={DEFAULT_MONTH}
        selected={selected}
        onSelect={setSelected}
        cancelLabel="Reset"
        applyLabel="Confirm"
        onApply={() => console.log("Applied:", selected)}
        onCancel={() => setSelected(undefined)}
      />
    );
  },
};

export const WithDisabledDates: Story = {
  render: () => {
    const [selected, setSelected] = useState<Date | undefined>();
    return (
      <DatePicker
        mode="single"
        defaultMonth={DEFAULT_MONTH}
        selected={selected}
        onSelect={setSelected}
        disabled={{ before: new Date(2026, 1, 10) }}
      />
    );
  },
};

export const WithInputTrigger: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Date | undefined>();

    const formatted = selected
      ? selected.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";

    return (
      <div className="relative inline-block">
        <input
          type="text"
          readOnly
          placeholder="Select a date…"
          value={formatted}
          onClick={() => setOpen((prev) => !prev)}
          className="w-56 cursor-pointer rounded-lg border border-neutral-200 bg-background-inverse-solid px-3 py-2 text-body-100 text-sm placeholder:text-body-200 focus:outline-none focus:ring-2 focus:ring-brand-purple-500"
        />

        {open && (
          <div className="absolute top-full left-0 z-50 mt-2">
            <DatePicker
              mode="single"
              defaultMonth={DEFAULT_MONTH}
              selected={selected}
              onSelect={setSelected}
              onApply={() => setOpen(false)}
              onCancel={() => {
                setSelected(undefined);
                setOpen(false);
              }}
            />
          </div>
        )}
      </div>
    );
  },
};
