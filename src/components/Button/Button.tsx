import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";
import { SpinnerIcon } from "../Icons/SpinnerIcon";

/** Visual style variant of the button. */
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "link"
  | "brand"
  | "destructive"
  | "white"
  | "tertiaryDestructive"
  | "text";

/** Button height in pixels. */
export type ButtonSize = "48" | "40" | "32" | "24";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant of the button. @default "primary" */
  variant?: ButtonVariant;
  /** Height of the button in pixels. @default "40" */
  size?: ButtonSize;
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

const SIZE_CLASSES: Record<ButtonSize, string> = {
  "48": "h-12 px-4 py-3 typography-button-large",
  "40": "h-10 px-4 py-2 typography-button-small",
  "32": "h-8 px-3 py-2 typography-body-2-semibold",
  "24": "h-6 px-2 py-1 typography-body-2-semibold",
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

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-neutral-400 text-foreground-inverse hover:bg-brand-accent-default hover:text-foreground-onaccent active:bg-brand-accent-default active:text-foreground-onaccent",
  secondary:
    "border-foreground-default border border-1 border-foreground-default bg-transparent text-foreground-default hover:bg-brand-accent-muted active:bg-brand-accent-muted",
  tertiary:
    "bg-transparent text-foreground-default hover:bg-brand-accent-muted active:bg-brand-accent-muted",
  link: "bg-transparent text-foreground-default underline decoration-solid hover:bg-brand-accent-muted active:bg-brand-accent-muted",
  brand:
    "bg-brand-accent-default text-foreground-onaccent hover:bg-brand-secondary-default active:bg-brand-secondary-default",
  destructive:
    "bg-error-default text-foreground-onaccentinverse hover:bg-surface-pageInverse dark:hover:bg-primitives-light-color-gray-white dark:hover:text-error-default active:bg-surface-pageInverse dark:active:bg-primitives-light-color-gray-white dark:active:text-error-default",
  white:
    "bg-primitives-light-color-gray-white text-foreground-onaccent hover:bg-brand-accent-default active:bg-brand-accent-default",
  tertiaryDestructive:
    "bg-transparent text-error-default hover:bg-error-background active:bg-error-background",
  text: "bg-transparent text-foreground-default hover:underline active:underline",
};

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
    // When asChild, clone the child element with spinner content instead of
    // wrapping in sr-only span (which would nest interactive elements)
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
      {children}
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
            <span className="typography-body-1-regular line-through" aria-hidden="true">
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
 * @example
 * ```tsx
 * <Button variant="brand" size="40" leftIcon={<StarIcon />}>
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
    const isDisabled = disabled || loading;
    const iconSizeClass = ICON_WRAPPER_CLASS[size];

    const buttonSpecificProps = !asChild
      ? {
          type: "button" as const,
          "data-testid": "button",
          disabled: isDisabled,
        }
      : isDisabled
        ? { "aria-disabled": true }
        : {};

    // When asChild + loading, extract text from children for aria-label since we
    // can't wrap element children in an sr-only span (creates invalid nested markup)
    const loadingLabelProps = loading && asChild ? { "aria-label": getTextContent(children) } : {};

    const content = renderContent({
      loading,
      asChild,
      children,
      size,
      leftIcon,
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
          // Base styles
          "inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full transition-colors",
          // Focus ring
          "focus-visible:shadow-focus-ring focus-visible:outline-none",
          // Disabled state
          "disabled:pointer-events-none disabled:opacity-50",
          "aria-disabled:pointer-events-none aria-disabled:opacity-50",
          `${price ? "justify-between" : "justify-center"}`,
          fullWidth && "w-full",
          // Size styles
          SIZE_CLASSES[size],
          // Variant styles
          VARIANT_CLASSES[variant],
          // Manual CSS overrides
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
