import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";
import { AIIcon } from "../Icons/AIIcon";
import { SpinnerIcon } from "../Icons/SpinnerIcon";

/** Visual style variant of the button. */
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "link"
  | "brand"
  | "destructive"
  | "white"
  | "alwaysBlack"
  | "ai"
  | "tertiaryDestructive"
  | "text";

/** Button height in pixels. */
export type ButtonSize = "48" | "40" | "32" | "24";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant of the button. @default "primary" */
  variant?: ButtonVariant;
  /** Height of the button in pixels. @default "40" */
  size?: ButtonSize;
  /**
   * Forces the dark-surface treatment regardless of theme. Only honored on
   * `primary`, `secondary`, `tertiary`, and `outline` variants; ignored on
   * all others. Use when placing the button on a dark background in a light
   * theme (e.g. an inverted hero or modal).
   * @default false
   */
  negative?: boolean;
  /** Icon element displayed before the label. */
  leftIcon?: React.ReactNode;
  /** Icon element displayed after the label. */
  rightIcon?: React.ReactNode;
  /** When `true`, replaces the label with a spinner and disables interaction. @default false */
  loading?: boolean;
  /** Merge props onto a child element instead of rendering a `<button>`. @default false */
  asChild?: boolean;
  /** Old price shown with a strikethrough before the current price. */
  discount?: string;
  /** Current price shown inside the button after the label and icons. */
  price?: string;
  /** When `true`, the button will take the full width of its container. @default false */
  fullWidth?: boolean;
}

const NEGATIVE_AWARE_VARIANTS = new Set<ButtonVariant>([
  "primary",
  "secondary",
  "tertiary",
  "outline",
]);

const SIZE_CLASSES: Record<ButtonSize, string> = {
  "48": "h-12 px-6 py-3 typography-semibold-body-lg",
  "40": "h-10 px-4 py-2 typography-semibold-body-lg",
  "32": "h-8 px-3 py-[7px] typography-semibold-body-md",
  "24": "h-6 px-2 py-1 typography-semibold-body-md",
};

const ICON_SIZE_CLASS: Record<ButtonSize, string> = {
  "48": "size-5",
  "40": "size-5",
  "32": "size-4",
  "24": "size-3.5",
};

/** Targets only direct SVG children so non-icon content (e.g. Pill) can size naturally. */
const ICON_WRAPPER_CLASS: Record<ButtonSize, string> = {
  "48": "[&>svg]:size-5",
  "40": "[&>svg]:size-5",
  "32": "[&>svg]:size-4",
  "24": "[&>svg]:size-3.5",
};

/** AI variant uses a fixed-angle gradient defined in the Figma design tokens. */
const AI_GRADIENT_DEFAULT =
  "bg-[linear-gradient(50deg,var(--color-buttons-ai-background-gradient-default-start)_11.87%,var(--color-buttons-ai-background-gradient-default-end)_112.39%)]";
const AI_GRADIENT_HOVER =
  "hover:bg-[linear-gradient(50deg,var(--color-buttons-ai-background-gradient-hover-start)_11.87%,var(--color-buttons-ai-background-gradient-hover-end)_112.39%)]";

/**
 * Variants without a v2 design that should keep the legacy opacity-based
 * disabled treatment instead of the new per-variant disabled tokens.
 */
const LEGACY_DISABLED_VARIANTS = new Set<ButtonVariant>(["link", "tertiaryDestructive", "text"]);

function getDisabledClasses(variant: ButtonVariant, isNegative: boolean): string {
  if (LEGACY_DISABLED_VARIANTS.has(variant)) {
    return cn(getEnabledClasses(variant, false), "opacity-50");
  }
  if (variant === "tertiary") {
    return "bg-transparent text-content-disabled";
  }
  if (variant === "outline") {
    return cn(
      "border bg-transparent text-content-disabled",
      isNegative ? "border-buttons-disabled-negative" : "border-buttons-disabled-default",
    );
  }
  return cn(
    isNegative ? "bg-buttons-disabled-negative" : "bg-buttons-disabled-default",
    "text-content-disabled",
  );
}

function getEnabledClasses(variant: ButtonVariant, isNegative: boolean): string {
  switch (variant) {
    case "primary":
      return isNegative
        ? "bg-buttons-primary-negative-default text-content-primary hover:bg-buttons-primary-negative-hover active:bg-buttons-primary-negative-hover"
        : "bg-buttons-primary text-content-primary-inverted hover:bg-buttons-primary-hover hover:text-content-primary-inverted active:bg-buttons-primary-hover active:text-content-primary-inverted";
    case "secondary":
      return isNegative
        ? "bg-buttons-secondary-negative-default text-content-primary-inverted hover:bg-buttons-secondary-negative-hover active:bg-buttons-secondary-negative-hover"
        : "bg-buttons-secondary-default text-content-primary hover:bg-buttons-secondary-hover active:bg-buttons-secondary-hover";
    case "tertiary":
      return isNegative
        ? "bg-transparent text-content-primary-inverted hover:bg-buttons-tertiary-negative-hover active:bg-buttons-tertiary-negative-hover"
        : "bg-transparent text-content-primary hover:bg-buttons-tertiary-hover active:bg-buttons-tertiary-hover";
    case "outline":
      return isNegative
        ? "border border-buttons-outline-negative-default bg-transparent text-content-primary-inverted hover:bg-buttons-outline-negative-hover active:bg-buttons-outline-negative-hover"
        : "border border-buttons-outline-default bg-transparent text-content-primary hover:bg-buttons-outline-hover active:bg-buttons-outline-hover";
    case "brand":
      return "bg-buttons-brand text-content-on-brand hover:bg-buttons-brand-hover hover:text-content-on-brand active:bg-buttons-brand-hover active:text-content-on-brand";
    case "destructive":
      return "bg-buttons-error-default text-content-always-white hover:bg-buttons-error-hover hover:text-content-always-white active:bg-buttons-error-hover active:text-content-always-white";
    case "white":
      return "bg-buttons-always-white-default text-content-always-black hover:bg-buttons-always-white-hover hover:text-content-always-black active:bg-buttons-always-white-hover active:text-content-always-black";
    case "alwaysBlack":
      return "bg-buttons-always-black-default text-content-always-white hover:bg-buttons-always-black-hover hover:text-content-always-white active:bg-buttons-always-black-hover active:text-content-always-white";
    case "ai":
      return cn(
        "border border-buttons-ai-stroke-end text-content-always-white shadow-ai-button-glow",
        AI_GRADIENT_DEFAULT,
        AI_GRADIENT_HOVER,
      );
    case "link":
      return "bg-transparent text-content-primary underline decoration-solid hover:bg-buttons-tertiary-hover active:bg-buttons-tertiary-hover";
    case "tertiaryDestructive":
      return "bg-transparent text-error-content hover:bg-error-surface active:bg-error-surface";
    case "text":
      return "bg-transparent text-content-primary hover:underline active:underline";
  }
}

function getVariantClasses(variant: ButtonVariant, negative: boolean, disabled: boolean): string {
  const isNegative = NEGATIVE_AWARE_VARIANTS.has(variant) && negative;
  if (disabled) {
    return getDisabledClasses(variant, isNegative);
  }
  return getEnabledClasses(variant, isNegative);
}

/** Recursively extract text content from React nodes for accessible labels */
function getTextContent(node: React.ReactNode): string | undefined {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (React.isValidElement(node)) {
    return getTextContent((node.props as { children?: React.ReactNode }).children);
  }
  if (Array.isArray(node)) {
    const text = node.map(getTextContent).filter(Boolean).join("");
    return text || undefined;
  }
  return undefined;
}

const LoadingSpinner = ({ size }: { size: ButtonSize }) => {
  return (
    <span className="animate-spin" aria-hidden="true">
      <SpinnerIcon className={ICON_SIZE_CLASS[size]}>
        <title>Loading</title>
      </SpinnerIcon>
    </span>
  );
};

function renderContent({
  loading,
  asChild,
  children,
  size,
  leftIcon,
  rightIcon,
  iconSizeClass,
  discount,
  price,
}: {
  loading: boolean;
  asChild: boolean;
  children: React.ReactNode;
  size: ButtonSize;
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
  iconSizeClass: string;
  discount?: string;
  price?: string;
  fullWidth?: boolean;
}) {
  if (loading) {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(
        children as React.ReactElement<{ children?: React.ReactNode }>,
        undefined,
        <LoadingSpinner size={size} />,
      );
    }
    return (
      <>
        <LoadingSpinner size={size} />
        <span className="sr-only">{children}</span>
      </>
    );
  }

  if (asChild) return children;

  return (
    <>
      {leftIcon && (
        <span
          className={cn("flex shrink-0 items-center justify-center", iconSizeClass)}
          aria-hidden="true"
        >
          {leftIcon}
        </span>
      )}
      {React.Children.map(children, (child) =>
        typeof child === "string" ? (
          child.trim() ? (
            <span className="min-w-0 truncate">{child}</span>
          ) : null
        ) : typeof child === "number" ? (
          <span className="min-w-0 truncate">{child}</span>
        ) : (
          child
        ),
      )}
      {rightIcon && (
        <span
          className={cn("flex shrink-0 items-center justify-center", iconSizeClass)}
          aria-hidden="true"
        >
          {rightIcon}
        </span>
      )}
      {(price || discount) && (
        <div>
          {discount && (
            <span className="typography-regular-body-lg line-through" aria-hidden="true">
              {discount}
            </span>
          )}
          {price && (
            <span className="ml-2" aria-hidden="true">
              {price}
            </span>
          )}
        </div>
      )}
    </>
  );
}

/**
 * A versatile button component with multiple visual variants, sizes, icon
 * slots, loading state, and optional pricing display.
 *
 * Pass `negative` when rendering on a dark surface to opt into the inverted
 * treatment for `primary`, `secondary`, `tertiary`, and `outline` variants.
 *
 * The `ai` variant ships with the AI sparkle icon baked in (locked at 16px
 * regardless of button size); pass `leftIcon` to override the default sparkle.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="40" leftIcon={<StarIcon />}>
 *   Subscribe
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "40",
      negative = false,
      leftIcon,
      rightIcon,
      loading = false,
      asChild = false,
      disabled,
      children,
      discount,
      price,
      fullWidth = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = Boolean(disabled) || loading;
    const iconSizeClass = variant === "ai" ? "[&>svg]:size-4" : ICON_WRAPPER_CLASS[size];
    const effectiveLeftIcon = leftIcon ?? (variant === "ai" ? <AIIcon filled /> : undefined);

    const buttonSpecificProps = !asChild
      ? {
          type: "button" as const,
          "data-testid": "button",
          disabled: isDisabled,
        }
      : isDisabled
        ? { "aria-disabled": true }
        : {};

    const loadingLabelProps = loading && asChild ? { "aria-label": getTextContent(children) } : {};

    const content = renderContent({
      loading,
      asChild,
      children,
      size,
      leftIcon: effectiveLeftIcon,
      rightIcon,
      iconSizeClass,
      discount,
      price,
    });

    return (
      <Comp
        ref={ref}
        {...buttonSpecificProps}
        aria-busy={loading}
        {...loadingLabelProps}
        className={cn(
          "inline-flex min-w-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full transition-colors",
          "focus-visible:shadow-focus-ring focus-visible:outline-none",
          isDisabled && "pointer-events-none cursor-not-allowed",
          `${price ? "justify-between" : "justify-center"}`,
          fullWidth && "w-full",
          SIZE_CLASSES[size],
          getVariantClasses(variant, negative, isDisabled),
          className,
        )}
        {...props}
      >
        {content}
      </Comp>
    );
  },
);

Button.displayName = "Button";
