import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";
import { ArrowRightIcon } from "../Icons/ArrowRightIcon";
import { WarningTriangleIcon } from "../Icons/WarningTriangleIcon";
import { Banner } from "./Banner";

const meta = {
  title: "Components/Banner",
  component: Banner,
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=4126-18640&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["Default", "Subtle", "whatsNew", "appStore1", "appStore2", "appStore3"],
    },
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleImg = (
  <img
    alt=""
    className="size-full object-cover"
    src="https://placehold.co/96x96/e5e5e5/404040/png?text=•"
  />
);

function NewBadge() {
  return (
    <Badge variant="success" leftDot className="typography-semibold-badge">
      new
    </Badge>
  );
}

function StatusChip({ children }: { children: ReactNode }) {
  return (
    <Badge
      variant="default"
      leftDot={false}
      leftIcon={<WarningTriangleIcon className="size-2.5" />}
      className="typography-semibold-badge"
    >
      {children}
    </Badge>
  );
}

function BannerTertiaryTextAction({ label }: { label: string }) {
  return (
    <Button
      type="button"
      variant="tertiary"
      size="32"
      className="h-auto min-h-0 px-0 py-1 shadow-none hover:bg-transparent active:bg-transparent"
      rightIcon={<ArrowRightIcon className="size-3" aria-hidden />}
    >
      {label}
    </Button>
  );
}

/** Figma `Type`: Default, `Orientation`: Vertical */
export const DefaultVertical: Story = {
  args: {
    variant: "Default",
    layout: "vertical",
    media: sampleImg,
    eyebrow: "HOW TO",
    title: "Use Paid Media Links",
    description: "For the next 7 days when you earn a milestone…",
    primaryAction: <Button variant="brand">Learn more</Button>,
  },
};

/** Figma `Type`: Default, `Orientation`: Horizontal */
export const DefaultHorizontal: Story = {
  args: {
    variant: "Default",
    layout: "horizontal",
    media: sampleImg,
    eyebrow: "HOW TO",
    title: "Use Paid Media Links",
    description: "For the next 7 days when you earn a milestone…",
    primaryAction: <Button variant="brand">Learn more</Button>,
  },
};

export const DefaultDismissible: Story = {
  args: { variant: "Default" },
  render: (args) => {
    const [open, setOpen] = useState(true);
    return open ? (
      <Banner
        {...args}
        variant="Default"
        layout="vertical"
        media={sampleImg}
        eyebrow="HOW TO"
        title="Use Paid Media Links"
        description="For the next 7 days when you earn a milestone…"
        primaryAction={<Button variant="brand">Learn more</Button>}
        onDismiss={() => setOpen(false)}
      />
    ) : (
      <Button type="button" variant="text" size="32" onClick={() => setOpen(true)}>
        Reset banner
      </Button>
    );
  },
};

/** Figma `Type`: Subtle */
export const SubtleInformational: Story = {
  args: {
    variant: "Subtle",
    media: sampleImg,
    leadBadge: <NewBadge />,
    title: "Find out how OAuth works",
    description: "Learn more about how to make an app that works.",
    secondaryLine: "For the next 7 days when you earn a milestone…",
    stackedAction: (
      <Button variant="primary" size="32" rightIcon={<ArrowRightIcon className="size-3.5" />}>
        Account Health
      </Button>
    ),
    statusRow: (
      <>
        <StatusChip>2 warning</StatusChip>
        <StatusChip>2 media removed</StatusChip>
        <StatusChip>1 media in review</StatusChip>
      </>
    ),
    primaryAction: <Button variant="secondary">Learn more</Button>,
  },
};

/** Figma `Type`: whatsNew, `Orientation`: Horizontal */
export const WhatsNewHorizontal: Story = {
  args: {
    variant: "whatsNew",
    layout: "horizontal",
    media: (
      <div className="typography-regular-body-sm flex size-full items-center justify-center bg-surface-tertiary text-content-secondary">
        Art
      </div>
    ),
    title: "Perfectly proportioned",
    description: "Aspect ratio selection is here!",
    textAction: <BannerTertiaryTextAction label="See how it works" />,
  },
};

/** Figma `Type`: whatsNew, `Orientation`: Vertical */
export const WhatsNewVertical: Story = {
  args: {
    variant: "whatsNew",
    layout: "vertical",
    media: (
      <div className="typography-regular-body-sm flex size-full min-h-[100px] items-center justify-center bg-surface-tertiary text-content-secondary">
        Art
      </div>
    ),
    title: "Perfectly proportioned",
    description: "Aspect ratio selection is here!",
    textAction: <BannerTertiaryTextAction label="See how it works" />,
  },
};

/** Figma `Type`: whatsNew, `Orientation`: HorizontalSmall */
export const WhatsNewCompact: Story = {
  args: {
    variant: "whatsNew",
    layout: "compact",
    media: (
      <div className="typography-regular-body-sm flex size-full items-center justify-center bg-surface-tertiary text-content-secondary">
        Art
      </div>
    ),
    title: "Perfectly proportioned",
    description: "Aspect ratio selection is here!",
    textAction: <BannerTertiaryTextAction label="See how it works" />,
  },
};

/** Figma `Type`: appStore1 */
export const AppStore1: Story = {
  args: {
    variant: "appStore1",
    eyebrow: "Learn",
    title: "Heading of guide here",
    description: "Subheading of guide here, maybe over 2 lines",
    textAction: <BannerTertiaryTextAction label="CTA label" />,
  },
};

/** Figma `Type`: appStore2 */
export const AppStore2: Story = {
  args: {
    variant: "appStore2",
    eyebrow: "Learn",
    title: "Heading of guide here",
    description: "Subheading of guide here, maybe over 2 lines",
    textAction: <BannerTertiaryTextAction label="CTA label" />,
  },
};

/** Figma `Type`: appStore3 */
export const AppStore3: Story = {
  args: {
    variant: "appStore3",
    eyebrow: "Learn",
    title: "Heading of guide here",
    description: "Subheading of guide here, maybe over 2 lines",
    textAction: <BannerTertiaryTextAction label="CTA label" />,
  },
};
