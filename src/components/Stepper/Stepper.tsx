import * as React from "react";
import { cn } from "@/utils/cn";
import { StepperStep, type StepperStepSize } from "./StepperStep";

/** Configuration for a single step within a {@link Stepper}. */
export interface StepItem {
  /** Primary label for the step. */
  title: string;
  /** Secondary description for the step. */
  description?: string;
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Zero-based index of the currently active step. Steps before this are marked completed. */
  activeStep: number;
  /** Configuration for each step. */
  steps: StepItem[];
  /** Size preset applied to all step indicators and labels. @default "md" */
  size?: StepperStepSize;
}

const CONNECTOR_MARGIN: Record<StepperStepSize, string> = {
  sm: "mt-3",
  md: "mt-4",
  lg: "mt-5",
};

/**
 * A horizontal progress stepper that displays a sequence of steps with
 * completed, active, and upcoming states.
 *
 * @example
 * ```tsx
 * <Stepper
 *   activeStep={1}
 *   steps={[
 *     { title: "Account", description: "Create account" },
 *     { title: "Profile", description: "Set up profile" },
 *     { title: "Done", description: "All set!" },
 *   ]}
 * />
 * ```
 */
export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ activeStep, steps, size = "md", className, ...props }, ref) => {
    return (
      // biome-ignore lint/a11y/useSemanticElements: <fieldset> adds unwanted browser styling for a non-interactive progress indicator
      <div
        ref={ref}
        role="group"
        aria-label="Progress"
        className={cn("flex items-start", className)}
        {...props}
      >
        {steps.map((step, index) => {
          const state =
            index < activeStep ? "completed" : index === activeStep ? "active" : "upcoming";

          return (
            <React.Fragment key={index}>
              <StepperStep
                state={state}
                size={size}
                stepNumber={index + 1}
                title={step.title}
                description={step.description}
                className="shrink-0"
              />
              {index < steps.length - 1 && (
                <div
                  className={cn("h-px min-w-6 flex-1 bg-border-primary", CONNECTOR_MARGIN[size])}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  },
);

Stepper.displayName = "Stepper";
