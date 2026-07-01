import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Avatar } from "../Avatar/Avatar";
import { RadioGroup } from "../RadioGroup/RadioGroup";
import { Radio } from "./Radio";

const avatarSrc =
  "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop";

const meta = {
  title: "Components/Radio",
  component: Radio,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=17915-63462",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["default", "small"],
    },
    layout: {
      control: "radio",
      options: ["leading", "trailing"],
    },
    disabled: {
      control: "boolean",
    },
    label: {
      control: "text",
    },
    helperText: {
      control: "text",
    },
  },
  render: (args) => (
    <RadioGroup className="w-64">
      <Radio {...args} />
    </RadioGroup>
  ),
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Option",
    value: "option",
  },
};

export const UncontrolledExample: Story = {
  name: "Uncontrolled",
  args: { value: "unused" },
  parameters: {
    docs: {
      description: {
        story:
          "RadioGroup uses `defaultValue`. Selection is managed internally (e.g. no React state).",
      },
    },
  },
  render: () => (
    <RadioGroup defaultValue="b">
      <Radio label="Option A" value="a" />
      <Radio label="Option B" value="b" />
      <Radio label="Option C" value="c" />
    </RadioGroup>
  ),
};

export const ControlledExample: Story = {
  name: "Controlled",
  args: { value: "unused" },
  parameters: {
    docs: {
      description: {
        story:
          "RadioGroup uses `value` and `onValueChange`. Works with React state and form libraries (e.g. react-hook-form).",
      },
    },
  },
  render: function ControlledExampleRender() {
    const [value, setValue] = useState("b");
    return (
      <RadioGroup value={value} onValueChange={setValue}>
        <Radio label="Option A" value="a" />
        <Radio label="Option B" value="b" />
        <Radio label="Option C" value="c" />
      </RadioGroup>
    );
  },
};

export const Small: Story = {
  args: {
    size: "small",
    label: "Option",
    value: "option",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled",
    value: "disabled",
    disabled: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Option with helper",
    helperText: "This is helpful descriptive text",
    value: "helper",
  },
};

export const Trailing: Story = {
  args: {
    layout: "trailing",
    label: "Radio Title",
    helperText: "Helper",
    value: "trailing",
  },
  parameters: {
    docs: {
      description: {
        story:
          '`layout="trailing"` pushes the radio button to the far end of the row — ideal for list rows where the label is the primary element.',
      },
    },
  },
};

export const WithAvatar: Story = {
  args: {
    label: "Jane Doe",
    helperText: "@jane_doe",
    value: "jane",
    avatar: <Avatar size={32} src={avatarSrc} alt="Jane Doe" fallback="JD" onlineIndicator />,
  },
  parameters: {
    docs: {
      description: {
        story: "Enable an avatar for options that represent a person or account.",
      },
    },
  },
};

export const TrailingWithAvatar: Story = {
  args: {
    layout: "trailing",
    label: "Jane Doe",
    helperText: "@jane_doe",
    value: "jane",
    avatar: <Avatar size={32} src={avatarSrc} alt="Jane Doe" fallback="JD" onlineIndicator />,
  },
};

export const ListRows: Story = {
  name: "List rows (trailing + avatar)",
  args: { value: "unused" },
  parameters: {
    docs: {
      description: {
        story: "Trailing layout with avatars, as used for selectable list rows.",
      },
    },
  },
  render: () => (
    <RadioGroup defaultValue="jane" aria-label="People" className="flex w-80 flex-col gap-2">
      <Radio
        layout="trailing"
        label="Jane Doe"
        helperText="@jane_doe"
        value="jane"
        avatar={<Avatar size={32} src={avatarSrc} alt="Jane Doe" fallback="JD" onlineIndicator />}
      />
      <Radio
        layout="trailing"
        label="Sam Rivers"
        helperText="@sam_rivers"
        value="sam"
        avatar={<Avatar size={32} fallback="SR" />}
      />
      <Radio
        layout="trailing"
        label="Alex Kim"
        helperText="@alex_kim"
        value="alex"
        disabled
        avatar={<Avatar size={32} fallback="AK" />}
      />
    </RadioGroup>
  ),
};
