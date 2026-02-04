import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";

export type ButtonStyle =
  | "Primary"
  | "Secondary"
  | "Tertiary"
  | "Link"
  | "Brand"
  | "Destructive"
  | "White"
  | "Switch"
  | "Tertiary Destructive"
  | "Text";

export type ButtonSize = "48" | "40" | "32" | "24";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button */
  Style?: ButtonStyle;
  /** Size of the button in pixels */
  Size?: ButtonSize;
  /** Left icon element */
  leftIcon?: React.ReactNode;
  /** Right icon element */
  rightIcon?: React.ReactNode;
  /** Show loading spinner */
  loading?: boolean;
  /** Active state for Switch style buttons */
  active?: boolean;
  /** Render as a different element using Radix Slot */
  asChild?: boolean;
  /** Old price shown with strikethrough before the current price */
  discount?: string;
  /** Current price shown inside the button after the label/icons */
  price?: string;
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  "48": "h-12 px-4 py-3 text-lg leading-6",
  "40": "h-10 px-4 py-[9px] text-base leading-[22px]",
  "32": "h-8 px-3 py-[7px] text-sm leading-[18px]",
  "24": "h-6 px-0 py-[3px] text-sm leading-[18px]",
};

const ICON_SIZE: Record<ButtonSize, number> = {
  "48": 20,
  "40": 20,
  "32": 16,
  "24": 14,
};

const STYLE_CLASSES: Record<ButtonStyle, string> = {
  Primary:
    "bg-neutral-400 text-body-300 hover:bg-brand-green-500 hover:text-body-black-solid-constant",
  Secondary:
    "border border-body-100 bg-transparent text-body-100 hover:bg-brand-green-50 focus-visible:border-transparent focus-visible:shadow-[0_0_0_2px_var(--color-brand-purple-500)]",
  Tertiary: "bg-transparent text-body-100 hover:bg-brand-green-50",
  Link: "bg-transparent text-body-100 underline decoration-solid hover:bg-brand-green-50",
  Brand: "bg-brand-green-500 text-body-black-solid-constant hover:bg-brand-pink-500",
  Destructive:
    "bg-error-500 text-body-white-solid-constant hover:bg-background-solid dark:hover:bg-background-white-solid-constant dark:hover:text-error-500",
  White:
    "bg-background-white-solid-constant text-body-black-solid-constant hover:bg-brand-green-500",
  Switch: "bg-transparent text-body-100 hover:bg-brand-green-50",
  "Tertiary Destructive": "bg-transparent text-error-500 hover:bg-error-50",
  Text: "bg-transparent text-body-100 hover:bg-background-600",
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
  const spinnerSize = ICON_SIZE[size];

  return (
    <span className="animate-spin" aria-hidden="true">
      <svg
        width={spinnerSize}
        height={spinnerSize}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Loading</title>
        <circle
          cx="10"
          cy="10"
          r="8"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M10 2C14.4183 2 18 5.58172 18 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
};

function renderContent({
  loading,
  asChild,
  children,
  Size,
  leftIcon,
  rightIcon,
  iconSize,
  discount,
  price,
}: {
  loading: boolean;
  asChild: boolean;
  children: React.ReactNode;
  Size: ButtonSize;
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
  iconSize: number;
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
        <LoadingSpinner size={Size} />,
      );
    }
    return (
      <>
        <LoadingSpinner size={Size} />
        <span className="sr-only">{children}</span>
      </>
    );
  }

  if (asChild) return children;

  return (
    <>
      {leftIcon && (
        <span
          className="flex shrink-0 items-center justify-center"
          style={{ width: iconSize, height: iconSize }}
          aria-hidden="true"
        >
          {leftIcon}
        </span>
      )}
      {children}
      {rightIcon && (
        <span
          className="flex shrink-0 items-center justify-center"
          style={{ width: iconSize, height: iconSize }}
          aria-hidden="true"
        >
          {rightIcon}
        </span>
      )}
      {discount != null && (
        <span className="font-medium line-through" aria-hidden="true">
          {discount}
        </span>
      )}
      {price != null && (
        <span className="font-medium" aria-hidden="true">
          {price}
        </span>
      )}
    </>
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      Style = "Primary",
      Size = "48",
      leftIcon,
      rightIcon,
      loading = false,
      active = false,
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
    const iconSize = ICON_SIZE[Size];
    const switchActiveClass = Style === "Switch" && active ? "bg-neutral-400 text-body-300" : "";

    const buttonSpecificProps = !asChild
      ? { "data-testid": "button", disabled: isDisabled }
      : isDisabled
        ? { "aria-disabled": true }
        : {};

    const activeProps = active ? { "data-active": true } : {};

    // When asChild + loading, extract text from children for aria-label since we
    // can't wrap element children in an sr-only span (creates invalid nested markup)
    const loadingLabelProps = loading && asChild ? { "aria-label": getTextContent(children) } : {};

    const content = renderContent({
      loading,
      asChild,
      children,
      Size,
      leftIcon,
      rightIcon,
      iconSize,
      discount,
      price,
    });

    return (
      <Comp
        ref={ref}
        {...buttonSpecificProps}
        {...activeProps}
        aria-busy={loading}
        {...loadingLabelProps}
        className={cn(
          // Base styles
          "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold transition-colors",
          // Focus ring
          "focus-visible:shadow-[0_0_0_2px_var(--color-background-inverse-solid),0_0_0_4px_var(--color-brand-purple-500)] focus-visible:outline-none",
          // Disabled state
          "disabled:pointer-events-none disabled:opacity-50",
          "aria-disabled:pointer-events-none aria-disabled:opacity-50",
          // Size styles
          SIZE_CLASSES[Size],
          // Variant styles
          STYLE_CLASSES[Style],
          switchActiveClass,
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
