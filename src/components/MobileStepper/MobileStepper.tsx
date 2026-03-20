import * as React from "react";
import { cn } from "@/utils/cn";
import { ProgressBar } from "../ProgressBar/ProgressBar";

/** Display variant for the step indicator. */
export type MobileStepperVariant = "dots" | "progress" | "text";

/** Positioning mode — `"static"` flows normally, `"bottom"` fixes to the viewport bottom. */
export type MobileStepperPosition = "static" | "bottom";

export interface MobileStepperProps extends React.HTMLAttributes<HTMLElement> {
  /** Total number of steps. */
  steps: number;
  /** Zero-indexed active step, clamped to `0` – `steps - 1`. */
  activeStep: number;
  /** Step indicator style. @default "dots" */
  variant?: MobileStepperVariant;
  /** Content rendered on the left (typically a "Back" button). */
  backButton?: React.ReactNode;
  /** Content rendered on the right (typically a "Next" button). */
  nextButton?: React.ReactNode;
  /** Positioning mode. @default "static" */
  position?: MobileStepperPosition;
  /** Accessible label for the stepper region. @default "Progress" */
  ariaLabel?: string;
  /** Accessible label for the step progress indicator (dots/progress bar). @default "Step progress" */
  stepProgressLabel?: string;
  /**
   * Formatter for the `aria-valuetext` on dots and progress variants.
   * Receives `(activeStep, totalSteps)` where `activeStep` is 1-indexed.
   * @default (active, total) => \`Step ${active} of ${total}\`
   */
  formatStepLabel?: (activeStep: number, totalSteps: number) => string;
  /**
   * Custom formatter for the text variant.
   * Receives `(activeStep, steps)` where `activeStep` is 1-indexed for display.
   * Only used when `variant` is `"text"`.
   * @default (active, total) => \`${active} / ${total}\`
   */
  formatText?: (activeStep: number, totalSteps: number) => string;
}

function defaultFormatText(activeStep: number, totalSteps: number): string {
  return `${activeStep} / ${totalSteps}`;
}

function defaultFormatStepLabel(activeStep: number, totalSteps: number): string {
  return `Step ${activeStep} of ${totalSteps}`;
}

/**
 * A compact, mobile-friendly stepper that shows progress through a sequence of
 * steps. Supports three indicator variants: dots, a progress bar, or text.
 *
 * @example
 * ```tsx
 * <MobileStepper
 *   steps={6}
 *   activeStep={2}
 *   variant="dots"
 *   backButton={<Button size="sm" onClick={handleBack}>Back</Button>}
 *   nextButton={<Button size="sm" onClick={handleNext}>Next</Button>}
 * />
 * ```
 */
export const MobileStepper = React.forwardRef<HTMLElement, MobileStepperProps>(
  (
    {
      steps,
      activeStep,
      variant = "dots",
      backButton,
      nextButton,
      position = "static",
      ariaLabel = "Progress",
      stepProgressLabel = "Step progress",
      formatStepLabel = defaultFormatStepLabel,
      formatText = defaultFormatText,
      className,
      ...props
    },
    ref,
  ) => {
    const safeSteps = Math.max(1, steps);
    const clampedStep = Math.min(safeSteps - 1, Math.max(0, activeStep));
    const progressValue = safeSteps > 1 ? (clampedStep / (safeSteps - 1)) * 100 : 100;
    const stepText = formatStepLabel(clampedStep + 1, safeSteps);

    const hasButtons = backButton != null || nextButton != null;

    const sharedClassName = cn(
      "flex w-full items-center justify-between gap-2 bg-background-surface px-2 py-2",
      position === "bottom" && "fixed inset-x-0 bottom-0 z-50 pb-[env(safe-area-inset-bottom)]",
      className,
    );

    const content = (
      <>
        {backButton != null && <div className="flex shrink-0">{backButton}</div>}

        <div className="flex min-w-0 flex-1 items-center justify-center overflow-hidden">
          {variant === "dots" && (
            <output aria-live="polite" className="flex items-center">
              <div
                role="progressbar"
                aria-label={stepProgressLabel}
                aria-valuenow={clampedStep + 1}
                aria-valuemin={1}
                aria-valuemax={safeSteps}
                aria-valuetext={stepText}
                className="flex flex-wrap items-center gap-1"
              >
                {Array.from({ length: safeSteps }, (_, i) => {
                  const state =
                    i < clampedStep ? "completed" : i === clampedStep ? "active" : "incomplete";
                  return (
                    <span
                      // biome-ignore lint/suspicious/noArrayIndexKey: static dot list never reorders
                      key={`step-${i}`}
                      data-state={state}
                      className={cn(
                        "block size-2 shrink-0 rounded-full motion-safe:transition-colors motion-safe:duration-150",
                        state === "active" ? "bg-content-primary" : "bg-neutral-alphas-200",
                      )}
                      aria-hidden="true"
                    />
                  );
                })}
              </div>
              <span className="sr-only">{stepText}</span>
            </output>
          )}

          {variant === "progress" && (
            <output aria-live="polite" className="w-full max-w-md px-2">
              <ProgressBar
                value={progressValue}
                size="small"
                variant="generic"
                ariaLabel={stepProgressLabel}
                ariaValueText={stepText}
              />
            </output>
          )}

          {variant === "text" && (
            <output
              aria-live="polite"
              className="typography-regular-body-sm truncate text-content-secondary"
            >
              {formatText(clampedStep + 1, safeSteps)}
            </output>
          )}
        </div>

        {nextButton != null && <div className="flex shrink-0">{nextButton}</div>}
      </>
    );

    if (hasButtons) {
      return (
        <nav
          ref={ref as React.Ref<HTMLElement>}
          aria-label={ariaLabel}
          className={sharedClassName}
          {...props}
        >
          {content}
        </nav>
      );
    }

    return (
      <fieldset
        ref={ref as React.Ref<HTMLFieldSetElement>}
        aria-label={ariaLabel}
        className={cn(sharedClassName, "m-0 border-0 p-0")}
        {...props}
      >
        {content}
      </fieldset>
    );
  },
);

MobileStepper.displayName = "MobileStepper";
