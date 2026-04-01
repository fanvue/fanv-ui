import * as React from "react";
import { cn } from "@/utils/cn";
import { CheckIcon } from "../Icons/CheckIcon";

/** Current state of a step in the stepper. */
export type StepperStepState = "completed" | "active" | "upcoming";

/** Size preset for the step indicator and labels. */
export type StepperStepSize = "sm" | "md" | "lg";

export interface StepperStepProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current state of the step. @default "upcoming" */
  state?: StepperStepState;
  /** Size preset for the indicator and labels. @default "md" */
  size?: StepperStepSize;
  /** Step number displayed in the indicator for active and upcoming states. */
  stepNumber?: number;
  /** Primary label shown below the indicator. */
  title?: string;
  /** Secondary description shown below the title. */
  description?: string;
}

const INDICATOR_SIZE: Record<StepperStepSize, string> = {
  sm: "size-6",
  md: "size-8",
  lg: "size-10",
};

const INDICATOR_STATE: Record<StepperStepState, string> = {
  completed: "bg-success-surface",
  active: "border border-brand-primary-default bg-brand-primary-muted",
  upcoming: "bg-neutral-alphas-50",
};

const NUMBER_TYPOGRAPHY: Record<StepperStepSize, string> = {
  sm: "typography-semibold-body-sm",
  md: "typography-semibold-body-md",
  lg: "typography-semibold-body-lg",
};

const NUMBER_COLOR: Record<StepperStepState, string> = {
  completed: "",
  active: "text-content-primary",
  upcoming: "text-content-secondary",
};

const CONTAINER_GAP: Record<StepperStepSize, string> = {
  sm: "gap-1",
  md: "gap-2",
  lg: "gap-2",
};

const TITLE_TYPOGRAPHY: Record<StepperStepSize, string> = {
  sm: "typography-regular-body-sm",
  md: "typography-regular-body-md",
  lg: "typography-regular-body-lg",
};

const DESCRIPTION_TYPOGRAPHY: Record<StepperStepSize, string> = {
  sm: "typography-regular-body-sm",
  md: "typography-regular-body-sm",
  lg: "typography-regular-body-md",
};

const LABEL_COLOR: Record<StepperStepState, string> = {
  completed: "text-content-secondary",
  active: "text-content-primary",
  upcoming: "text-content-tertiary",
};

const LABEL_ALIGNMENT: Record<StepperStepState, string> = {
  completed: "items-start",
  active: "items-start",
  upcoming: "items-center",
};

const CHECK_ICON_SIZE: Record<StepperStepSize, string> = {
  sm: "size-3",
  md: "size-4",
  lg: "size-5",
};

/**
 * A single step indicator with optional labels, used standalone or within a {@link Stepper}.
 *
 * @example
 * ```tsx
 * <StepperStep state="active" stepNumber={2} title="Profile" description="Set up profile" />
 * ```
 */
export const StepperStep = React.forwardRef<HTMLDivElement, StepperStepProps>(
  (
    { state = "upcoming", size = "md", stepNumber, title, description, className, ...props },
    ref,
  ) => {
    const hasLabels = title != null || description != null;

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center", CONTAINER_GAP[size], className)}
        {...props}
      >
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full",
            INDICATOR_SIZE[size],
            INDICATOR_STATE[state],
          )}
          aria-hidden="true"
        >
          {state === "completed" ? (
            <CheckIcon className={cn(CHECK_ICON_SIZE[size], "text-success-content")} />
          ) : (
            <span className={cn(NUMBER_TYPOGRAPHY[size], NUMBER_COLOR[state])}>{stepNumber}</span>
          )}
        </div>

        {hasLabels && (
          <div className={cn("flex flex-col gap-1", LABEL_COLOR[state], LABEL_ALIGNMENT[state])}>
            {title != null && <span className={TITLE_TYPOGRAPHY[size]}>{title}</span>}
            {description != null && (
              <span className={DESCRIPTION_TYPOGRAPHY[size]}>{description}</span>
            )}
          </div>
        )}
      </div>
    );
  },
);

StepperStep.displayName = "StepperStep";
