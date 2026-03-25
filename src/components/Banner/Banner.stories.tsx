import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { useState } from "react";
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
    <div className="flex h-5 items-center gap-1 rounded-full bg-success-surface px-2">
      <span className="size-1 shrink-0 rounded-full bg-success-content" aria-hidden />
      <span className="typography-semibold-badge text-content-primary">new</span>
    </div>
  );
}

function StatusChip({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-5 items-center gap-2 rounded-full bg-neutral-alphas-50 px-2">
      <WarningTriangleIcon className="size-2.5 text-content-primary" />
      <span className="typography-semibold-badge text-content-primary">{children}</span>
    </div>
  );
}

export const InverseVertical: Story = {
  args: {
    tone: "inverse",
    layout: "vertical",
    media: sampleImg,
    eyebrow: "HOW TO",
    title: "Use Paid Media Links",
    description: "For the next 7 days when you earn a milestone…",
    primaryAction: <Button variant="brand">Learn more</Button>,
  },
};

export const InverseHorizontal: Story = {
  args: {
    tone: "inverse",
    layout: "horizontal",
    media: sampleImg,
    eyebrow: "HOW TO",
    title: "Use Paid Media Links",
    description: "For the next 7 days when you earn a milestone…",
    primaryAction: <Button variant="brand">Learn more</Button>,
  },
};

export const InverseDismissible: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    return open ? (
      <Banner
        {...args}
        tone="inverse"
        layout="vertical"
        media={sampleImg}
        eyebrow="HOW TO"
        title="Use Paid Media Links"
        description="For the next 7 days when you earn a milestone…"
        primaryAction={<Button variant="brand">Learn more</Button>}
        onDismiss={() => setOpen(false)}
      />
    ) : (
      <button
        type="button"
        className="typography-regular-body-sm text-content-secondary underline"
        onClick={() => setOpen(true)}
      >
        Reset banner
      </button>
    );
  },
};

export const SubtleInformational: Story = {
  args: {
    tone: "subtle",
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

export const FeatureHorizontal: Story = {
  args: {
    tone: "feature",
    layout: "horizontal",
    media: (
      <div className="typography-regular-body-sm flex size-full items-center justify-center bg-surface-tertiary text-content-secondary">
        Art
      </div>
    ),
    title: "Perfectly proportioned",
    description: "Aspect ratio selection is here!",
    textAction: (
      <button
        type="button"
        className="typography-semibold-body-md inline-flex items-center gap-2 rounded-full py-0.5 text-content-primary"
      >
        See how it works
        <ArrowRightIcon className="size-3" aria-hidden />
      </button>
    ),
  },
};

export const FeatureVertical: Story = {
  args: {
    tone: "feature",
    layout: "vertical",
    media: (
      <div className="typography-regular-body-sm flex size-full min-h-[100px] items-center justify-center bg-surface-tertiary text-content-secondary">
        Art
      </div>
    ),
    title: "Perfectly proportioned",
    description: "Aspect ratio selection is here!",
    textAction: (
      <button
        type="button"
        className="typography-semibold-body-md inline-flex items-center gap-2 rounded-full py-0.5 text-content-primary"
      >
        See how it works
        <ArrowRightIcon className="size-3" aria-hidden />
      </button>
    ),
  },
};

export const FeatureCompact: Story = {
  args: {
    tone: "feature",
    layout: "compact",
    media: (
      <div className="typography-regular-body-sm flex size-full items-center justify-center bg-surface-tertiary text-content-secondary">
        Art
      </div>
    ),
    title: "Perfectly proportioned",
    description: "Aspect ratio selection is here!",
    textAction: (
      <button
        type="button"
        className="typography-semibold-body-md inline-flex items-center gap-2 rounded-full py-0.5 text-content-primary"
      >
        See how it works
        <ArrowRightIcon className="size-3" aria-hidden />
      </button>
    ),
  },
};

export const GuideSage: Story = {
  args: {
    tone: "guide",
    guideStyle: "sage",
    eyebrow: "Learn",
    title: "Heading of guide here",
    description: "Subheading of guide here, maybe over 2 lines",
    textAction: (
      <button
        type="button"
        className="typography-semibold-body-md inline-flex items-center gap-1.5 rounded-full py-0.5 text-content-primary"
      >
        CTA label
        <ArrowRightIcon className="size-3" aria-hidden />
      </button>
    ),
  },
};

export const GuideLavender: Story = {
  args: {
    tone: "guide",
    guideStyle: "lavender",
    eyebrow: "Learn",
    title: "Heading of guide here",
    description: "Subheading of guide here, maybe over 2 lines",
    textAction: (
      <button
        type="button"
        className="typography-semibold-body-md inline-flex items-center gap-1.5 rounded-full py-0.5 text-content-primary"
      >
        CTA label
        <ArrowRightIcon className="size-3" aria-hidden />
      </button>
    ),
  },
};

export const GuideBlend: Story = {
  args: {
    tone: "guide",
    guideStyle: "blend",
    eyebrow: "Learn",
    title: "Heading of guide here",
    description: "Subheading of guide here, maybe over 2 lines",
    textAction: (
      <button
        type="button"
        className="typography-semibold-body-md inline-flex items-center gap-1.5 rounded-full py-0.5 text-content-primary"
      >
        CTA label
        <ArrowRightIcon className="size-3" aria-hidden />
      </button>
    ),
  },
};
