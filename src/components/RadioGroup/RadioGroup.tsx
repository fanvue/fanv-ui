import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";

/** Props for the {@link RadioGroup} component. Extends the Radix `RadioGroup.Root` props. */
export type RadioGroupProps = React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>;

/**
 * Groups {@link Radio} items into a single controlled or uncontrolled selection.
 * Built on Radix UI `RadioGroup.Root`.
 *
 * @example
 * ```tsx
 * <RadioGroup value={value} onValueChange={setValue}>
 *   <Radio value="a" label="Option A" />
 *   <Radio value="b" label="Option B" />
 * </RadioGroup>
 * ```
 */
export const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>((props, ref) => {
  return <RadioGroupPrimitive.Root ref={ref} {...props} />;
});

RadioGroup.displayName = "RadioGroup";
