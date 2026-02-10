import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";
import { SpinnerIcon } from "../Icons/SpinnerIcon";

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

export type ButtonSize = "48" | "40" | "32" | "24";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant of the button */
  variant?: ButtonVariant;
  /** Size of the button in pixels */
  size?: ButtonSize;
  /** Left icon element */
  leftIcon?: React.ReactNode;
  /** Right icon element */
  rightIcon?: React.ReactNode;
  /** Show loading spinner */
  loading?: boolean;
  /** Render as a different element using Radix Slot */
  asChild?: boolean;
  /** Old price shown with strikethrough before the current price */
  discount?: string;
  /** Current price shown inside the button after the label/icons */
  price?: string;
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  "48": "h-12 px-4 py-3 typography-button-large",
  "40": "h-10 px-4 py-2 typography-button-small",
  "32": "h-8 px-3 py-2 typography-body-2-semibold",
  "24": "h-6 px-0 py-1 typography-body-2-semibold",
};

const ICON_SIZE_CLASS: Record<ButtonSize, string> = {
  "48": "size-5",
  "40": "size-5",
  "32": "size-4",
  "24": "size-3.5",
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-neutral-400 text-body-300 hover:bg-brand-green-500 hover:text-body-black-solid-constant",
  secondary:
    "border-body-100 border border-1 border-body-100 bg-transparent text-body-100 hover:bg-brand-green-50",
  tertiary: "bg-transparent text-body-100 hover:bg-brand-green-50",
  link: "bg-transparent text-body-100 underline decoration-solid hover:bg-brand-green-50",
  brand: "bg-brand-green-500 text-body-black-solid-constant hover:bg-brand-pink-500",
  destructive:
    "bg-error-500 text-body-white-solid-constant hover:bg-background-solid dark:hover:bg-background-white-solid-constant dark:hover:text-error-500",
  white:
    "bg-background-white-solid-constant text-body-black-solid-constant hover:bg-brand-green-500",
  tertiaryDestructive: "bg-transparent text-error-500 hover:bg-error-50",
  text: "bg-transparent text-body-100 hover:underline",
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
      {discount != null && (
        <span className="typography-body-1-regular line-through" aria-hidden="true">
          {discount}
        </span>
      )}
      {price != null && <span aria-hidden="true">{price}</span>}
    </>
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "48",
      leftIcon,
      rightIcon,
      loading = false,
      asChild = false,
      disabled,
      children,
      discount,
      price,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;
    const iconSizeClass = ICON_SIZE_CLASS[size];

    const buttonSpecificProps = !asChild
      ? { "data-testid": "button", disabled: isDisabled }
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
          "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full transition-colors",
          // Focus ring
          "focus:shadow-focus focus-visible:outline-none",
          // Disabled state
          "disabled:pointer-events-none disabled:opacity-50",
          "aria-disabled:pointer-events-none aria-disabled:opacity-50",
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
