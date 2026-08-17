import type { Meta, StoryObj } from "@storybook/react";
import { AIIcon } from "../Icons/AIIcon";
import { ArrowUpRightIcon } from "../Icons/ArrowUpRightIcon";
import { CheckCircleIcon } from "../Icons/CheckCircleIcon";
import { Badge, type BadgeVariant } from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=18028-289&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "dark",
        "success",
        "warning",
        "error",
        "special",
        "info",
        "successColour",
        "warningColour",
        "errorColour",
        "infoColour",
        "aiGenerated",
        "negative",
        "alwaysWhite",
        "online",
        "brand",
        "pink",
        "brandLight",
        "pinkLight",
      ],
    },
    leftDot: { control: "boolean" },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANT_GROUPS: { title: string; onDark?: boolean; variants: BadgeVariant[] }[] = [
  {
    title: "Status",
    variants: ["default", "dark", "success", "warning", "error", "info", "special"],
  },
  {
    title: "Colour",
    variants: ["successColour", "warningColour", "errorColour", "infoColour"],
  },
  {
    title: "Brand",
    variants: ["brand", "pink", "brandLight", "pinkLight", "online"],
  },
  {
    title: "On dark surfaces",
    onDark: true,
    variants: ["negative", "alwaysWhite", "aiGenerated"],
  },
];

const VariantBadge = ({ variant, showPip = true }: { variant: BadgeVariant; showPip?: boolean }) =>
  variant === "aiGenerated" ? (
    <Badge variant="aiGenerated" leftDot={false} leftIcon={<AIIcon className="size-2.5" />}>
      AI Generated
    </Badge>
  ) : (
    <Badge variant={variant} leftDot={showPip}>
      {variant}
    </Badge>
  );

const NO_PIP_VARIANTS: BadgeVariant[] = [
  "default",
  "successColour",
  "warningColour",
  "errorColour",
  "infoColour",
];

/**
 * Every Badge variant from the V2 Figma library in a single view, grouped by usage:
 * neutral status badges (colour is carried by the pip), filled colour variants, brand
 * variants, and the variants intended for dark or brand-coloured surfaces.
 */
export const AllVariants: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-8">
      {VARIANT_GROUPS.map((group) => (
        <div key={group.title} className="flex flex-col gap-3">
          <h3 className="typography-body-small-14px-semibold text-content-primary">
            {group.title}
          </h3>
          <div
            className={
              group.onDark
                ? "flex flex-wrap items-center gap-4 rounded-xs bg-surface-primary-inverted p-4"
                : "flex flex-wrap items-center gap-4"
            }
          >
            {group.variants.map((variant) => (
              <VariantBadge key={variant} variant={variant} />
            ))}
          </div>
        </div>
      ))}
      <div className="flex flex-col gap-3">
        <h3 className="typography-body-small-14px-semibold text-content-primary">Without pip</h3>
        <div className="flex flex-wrap items-center gap-4">
          {NO_PIP_VARIANTS.map((variant) => (
            <VariantBadge key={variant} variant={variant} showPip={false} />
          ))}
        </div>
      </div>
    </div>
  ),
};

export const Default: Story = {
  args: {
    children: "Badge",
  },
};

export const Truncated: Story = {
  render: () => (
    <div className="flex flex-col gap-3" style={{ width: 80 }}>
      <Badge variant="success">Very long badge text here</Badge>
      <Badge variant="brand" leftDot={false} leftIcon={<CheckCircleIcon className="size-2.5" />}>
        Truncated with icon
      </Badge>
      <Badge variant="default" rightIcon={<ArrowUpRightIcon className="size-2.5" />}>
        Truncated right icon
      </Badge>
    </div>
  ),
};

export const WithoutDot: Story = {
  args: {
    leftDot: false,
    children: "No Dot",
  },
};

export const LeftIcon: Story = {
  args: {
    leftIcon: <CheckCircleIcon className="size-2.5" />,
    leftDot: false,
    children: "Verified",
  },
};

export const RightIcon: Story = {
  args: {
    rightIcon: <ArrowUpRightIcon className="size-2.5" />,
    leftDot: false,
    children: "Link",
  },
};
