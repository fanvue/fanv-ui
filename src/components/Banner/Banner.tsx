import * as React from "react";
import { cn } from "../../utils/cn";
import { Badge, type BadgeVariant } from "../Badge/Badge";
import { IconButton } from "../IconButton/IconButton";
import { CrossIcon } from "../Icons/CrossIcon";

/**
 * Matches the Fanvue Library Banner Figma component property `Type`
 * (`Default`, `Subtle`, `whatsNew`, `appStore1`, `appStore2`, `appStore3`).
 */
export type BannerVariant =
  | "Default"
  | "Subtle"
  | "whatsNew"
  | "appStore1"
  | "appStore2"
  | "appStore3";

/** Layout (`Vertical` / `Horizontal` / `HorizontalSmall` in Figma). Ignored for `Subtle` and app store types. */
export type BannerLayout = "vertical" | "horizontal" | "compact";

type AppStoreVariant = "appStore1" | "appStore2" | "appStore3";

const APP_STORE_VARIANTS: readonly AppStoreVariant[] = ["appStore1", "appStore2", "appStore3"];

function isAppStoreVariant(variant: BannerVariant): variant is AppStoreVariant {
  return (APP_STORE_VARIANTS as readonly string[]).includes(variant);
}

const GUIDE_BADGE_VARIANT: Record<AppStoreVariant, BadgeVariant> = {
  appStore1: "dark",
  appStore2: "default",
  appStore3: "default",
};

const BANNER_SHADOW = "shadow-sm";

const guideGradient: Record<AppStoreVariant, React.CSSProperties> = {
  appStore1: {
    backgroundImage:
      "linear-gradient(125.54deg, var(--color-brand-primary-muted) 0%, var(--color-neutral-alphas-50) 100%)",
  },
  appStore2: {
    backgroundImage:
      "linear-gradient(125.54deg, var(--color-brand-secondary-muted) 0%, var(--color-brand-secondary-muted) 100%)",
  },
  appStore3: {
    backgroundImage:
      "linear-gradient(125.54deg, var(--color-brand-secondary-muted) 0%, color-mix(in srgb, var(--color-info-surface) 80%, transparent) 100%)",
  },
};

export interface BannerProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Figma `Type` — selects structure, surfaces, and app store gradient. */
  variant: BannerVariant;
  /**
   * Figma `Orientation`. Ignored when `variant` is `Subtle` (horizontal) or an app store type (vertical).
   * @default `"vertical"` for `Default`, `"horizontal"` for `whatsNew`
   */
  layout?: BannerLayout;
  /** Leading visual (image, illustration, or composite). */
  media?: React.ReactNode;
  /** Small uppercase label (e.g. HOW TO). */
  eyebrow?: React.ReactNode;
  /** Top badge row (e.g. NEW pill) — mainly for `Subtle`. */
  leadBadge?: React.ReactNode;
  /** Main heading. */
  title?: React.ReactNode;
  /** Primary body copy. */
  description?: React.ReactNode;
  /** Extra line under description (`Subtle`). */
  secondaryLine?: React.ReactNode;
  /** Left-stacked pill action (`Subtle`). */
  stackedAction?: React.ReactNode;
  /** Row under stacked action (`Subtle`). */
  statusRow?: React.ReactNode;
  /** Primary button (e.g. Learn more). */
  primaryAction?: React.ReactNode;
  /** Text-style CTA (`whatsNew` / app store). */
  textAction?: React.ReactNode;
  /** When set, shows a dismiss control (`Default` only). */
  onDismiss?: () => void;
  /** Accessible label for dismiss. @default "Dismiss banner" */
  dismissLabel?: string;
}

function BannerDismiss({
  onDismiss,
  dismissLabel,
}: {
  onDismiss: () => void;
  dismissLabel: string;
}) {
  return (
    <IconButton
      variant="contrast"
      size="24"
      icon={<CrossIcon />}
      onClick={onDismiss}
      aria-label={dismissLabel}
      className="hover:bg-white/10 active:bg-white/15"
    />
  );
}

function resolveLayout(variant: BannerVariant, layoutProp: BannerLayout | undefined): BannerLayout {
  if (variant === "Subtle") {
    return "horizontal";
  }
  if (isAppStoreVariant(variant)) {
    return "vertical";
  }
  if (variant === "whatsNew") {
    return layoutProp ?? "horizontal";
  }
  return layoutProp ?? "vertical";
}

function bannerRootClass(variant: BannerVariant, layout: BannerLayout, className?: string): string {
  return cn(
    "flex rounded-md",
    BANNER_SHADOW,
    variant === "Default" && "gap-3 bg-surface-primary-inverted p-4 text-content-primary-inverted",
    variant === "Subtle" &&
      "w-full max-w-[600px] items-start gap-3 border border-border-primary bg-surface-secondary p-4 text-content-primary",
    variant === "whatsNew" &&
      layout === "horizontal" &&
      "w-full max-w-[446px] items-center gap-4 bg-surface-purple-muted p-4 text-content-primary",
    variant === "whatsNew" &&
      layout === "vertical" &&
      "w-full max-w-[220px] flex-col items-stretch gap-4 border border-border-primary bg-surface-secondary p-4 text-content-primary",
    variant === "whatsNew" &&
      layout === "compact" &&
      "w-full max-w-[446px] items-start gap-4 bg-surface-purple-muted p-4 text-content-primary",
    isAppStoreVariant(variant) && "w-full max-w-[280px] flex-col gap-4 p-6",
    layout === "vertical" && variant === "Default" && "max-w-[360px]",
    layout === "horizontal" && variant === "Default" && "w-full max-w-[600px] items-start",
    className,
  );
}

type BannerSectionProps = React.ComponentPropsWithoutRef<"section"> & {
  labelledBy?: string;
};

const BannerSection = React.forwardRef<HTMLElement, BannerSectionProps>(
  ({ className, labelledBy, children, ...rest }, ref) => (
    <section
      ref={ref}
      aria-labelledby={labelledBy}
      data-testid="banner"
      className={className}
      {...rest}
    >
      {children}
    </section>
  ),
);
BannerSection.displayName = "BannerSection";

type GuideBodyProps = Pick<BannerProps, "eyebrow" | "title" | "description" | "textAction"> & {
  appStoreVariant: AppStoreVariant;
  labelledBy?: string;
};

function BannerGuideBody({
  appStoreVariant,
  eyebrow,
  title,
  description,
  textAction,
  labelledBy,
}: GuideBodyProps) {
  return (
    <>
      {eyebrow !== undefined && eyebrow !== null && eyebrow !== false && (
        <Badge
          variant={GUIDE_BADGE_VARIANT[appStoreVariant]}
          leftDot={false}
          className="typography-semibold-badge self-start"
        >
          {eyebrow}
        </Badge>
      )}
      {title !== undefined && title !== null && title !== false && (
        <p id={labelledBy} className="typography-semibold-body-lg text-content-primary">
          {title}
        </p>
      )}
      {description !== undefined && description !== null && description !== false && (
        <p className="typography-regular-body-md text-content-secondary">{description}</p>
      )}
      {textAction}
    </>
  );
}

type FeatureBodyProps = Pick<BannerProps, "title" | "description" | "textAction" | "media"> & {
  layout: BannerLayout;
  labelledBy?: string;
};

function BannerFeatureBody({
  layout,
  media,
  title,
  description,
  textAction,
  labelledBy,
}: FeatureBodyProps) {
  const titleClass =
    layout === "vertical"
      ? "typography-semibold-body-lg text-content-primary"
      : "typography-semibold-body-lg text-[18px] leading-6 text-content-primary";
  const mediaWrap =
    layout === "compact"
      ? "size-20 shrink-0 overflow-hidden rounded-sm"
      : "size-[132px] shrink-0 overflow-hidden rounded-sm";

  return (
    <>
      {media !== undefined && media !== null && (
        <div className={cn(mediaWrap, layout === "vertical" && "w-full [&>*]:mx-auto")}>
          {media}
        </div>
      )}
      <div
        className={cn(
          "flex min-w-0 flex-col gap-2",
          layout === "horizontal" || layout === "compact" ? "flex-1 justify-end" : "w-full",
        )}
      >
        {title !== undefined && title !== null && title !== false && (
          <div id={labelledBy} className={titleClass}>
            {title}
          </div>
        )}
        {description !== undefined && description !== null && description !== false && (
          <p className="typography-regular-body-md text-content-secondary">{description}</p>
        )}
        {textAction}
      </div>
    </>
  );
}

type SubtleBodyProps = Pick<
  BannerProps,
  | "media"
  | "leadBadge"
  | "title"
  | "description"
  | "secondaryLine"
  | "stackedAction"
  | "statusRow"
  | "primaryAction"
> & { labelledBy?: string };

function BannerSubtleBody({
  media,
  leadBadge,
  title,
  description,
  secondaryLine,
  stackedAction,
  statusRow,
  primaryAction,
  labelledBy,
}: SubtleBodyProps) {
  const mediaSizeDefault = "size-12 shrink-0 overflow-hidden rounded-xl";
  return (
    <>
      {media !== undefined && media !== null && <div className={mediaSizeDefault}>{media}</div>}
      <div className="flex min-w-0 flex-1 items-end gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {leadBadge !== undefined && leadBadge !== null && (
            <div className="flex flex-wrap items-center gap-2">{leadBadge}</div>
          )}
          <div className="flex flex-col gap-1">
            {title !== undefined && title !== null && title !== false && (
              <div id={labelledBy} className="typography-bold-heading-xs text-content-primary">
                {title}
              </div>
            )}
            <div className="flex flex-col gap-2">
              {description !== undefined && description !== null && description !== false && (
                <p className="typography-regular-body-md text-content-primary">{description}</p>
              )}
              {secondaryLine !== undefined && secondaryLine !== null && secondaryLine !== false && (
                <p className="typography-regular-body-sm text-content-primary">{secondaryLine}</p>
              )}
            </div>
          </div>
          {stackedAction !== undefined && stackedAction !== null && (
            <div className="flex flex-col items-end self-start">{stackedAction}</div>
          )}
          {statusRow !== undefined && statusRow !== null && (
            <div className="flex flex-wrap items-center gap-2">{statusRow}</div>
          )}
        </div>
        {primaryAction !== undefined && primaryAction !== null && (
          <div className="shrink-0 self-center">{primaryAction}</div>
        )}
      </div>
    </>
  );
}

type InverseBodyProps = Pick<
  BannerProps,
  "media" | "eyebrow" | "title" | "description" | "primaryAction"
> & {
  layout: BannerLayout;
  labelledBy?: string;
  dismissSlot: React.ReactNode;
};

function BannerInverseBody({
  layout,
  media,
  eyebrow,
  title,
  description,
  primaryAction,
  labelledBy,
  dismissSlot,
}: InverseBodyProps) {
  const mediaSizeDefault = "size-12 shrink-0 overflow-hidden rounded-xl";
  const titleClassInverse = "typography-bold-heading-xs text-content-primary-inverted";
  const textColumn = (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      {eyebrow !== undefined && eyebrow !== null && eyebrow !== false && (
        <p className="typography-semibold-body-sm text-content-primary-inverted">{eyebrow}</p>
      )}
      {title !== undefined && title !== null && title !== false && (
        <div id={labelledBy} className={titleClassInverse}>
          {title}
        </div>
      )}
      {description !== undefined && description !== null && description !== false && (
        <p className="typography-regular-body-md text-content-primary-inverted">{description}</p>
      )}
    </div>
  );

  return (
    <>
      {media !== undefined && media !== null && <div className={mediaSizeDefault}>{media}</div>}
      {layout === "horizontal" ? (
        <div className="flex min-w-0 flex-1 items-end gap-3">
          {textColumn}
          {primaryAction !== undefined && primaryAction !== null && (
            <div className="shrink-0">{primaryAction}</div>
          )}
        </div>
      ) : (
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {textColumn}
          {primaryAction !== undefined && primaryAction !== null && <div>{primaryAction}</div>}
        </div>
      )}
      {dismissSlot}
    </>
  );
}

export const Banner = React.forwardRef<HTMLElement, BannerProps>(
  (
    {
      className,
      variant,
      layout: layoutProp,
      media,
      eyebrow,
      leadBadge,
      title,
      description,
      secondaryLine,
      stackedAction,
      statusRow,
      primaryAction,
      textAction,
      onDismiss,
      dismissLabel = "Dismiss banner",
      ...props
    },
    ref,
  ) => {
    const layout = resolveLayout(variant, layoutProp);
    const showDismiss = onDismiss !== undefined && variant === "Default";
    const titleId = React.useId();
    const regionLabelledBy =
      title !== undefined && title !== null && title !== false ? titleId : undefined;

    const rootClass = bannerRootClass(variant, layout, className);

    if (isAppStoreVariant(variant)) {
      return (
        <BannerSection
          ref={ref}
          labelledBy={regionLabelledBy}
          style={guideGradient[variant]}
          className={rootClass}
          {...props}
        >
          <BannerGuideBody
            appStoreVariant={variant}
            eyebrow={eyebrow}
            title={title}
            description={description}
            textAction={textAction}
            labelledBy={regionLabelledBy}
          />
        </BannerSection>
      );
    }

    if (variant === "whatsNew") {
      return (
        <BannerSection ref={ref} labelledBy={regionLabelledBy} className={rootClass} {...props}>
          <BannerFeatureBody
            layout={layout}
            media={media}
            title={title}
            description={description}
            textAction={textAction}
            labelledBy={regionLabelledBy}
          />
        </BannerSection>
      );
    }

    if (variant === "Subtle") {
      return (
        <BannerSection ref={ref} labelledBy={regionLabelledBy} className={rootClass} {...props}>
          <BannerSubtleBody
            media={media}
            leadBadge={leadBadge}
            title={title}
            description={description}
            secondaryLine={secondaryLine}
            stackedAction={stackedAction}
            statusRow={statusRow}
            primaryAction={primaryAction}
            labelledBy={regionLabelledBy}
          />
        </BannerSection>
      );
    }

    const dismissSlot =
      showDismiss && onDismiss !== undefined ? (
        <BannerDismiss onDismiss={onDismiss} dismissLabel={dismissLabel} />
      ) : null;

    return (
      <BannerSection ref={ref} labelledBy={regionLabelledBy} className={rootClass} {...props}>
        <div className="flex w-full items-start gap-3">
          <BannerInverseBody
            layout={layout}
            media={media}
            eyebrow={eyebrow}
            title={title}
            description={description}
            primaryAction={primaryAction}
            labelledBy={regionLabelledBy}
            dismissSlot={dismissSlot}
          />
        </div>
      </BannerSection>
    );
  },
);

Banner.displayName = "Banner";
