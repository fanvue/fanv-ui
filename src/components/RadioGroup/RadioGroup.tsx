import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";

export type RadioGroupProps = React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>;

export const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>((props, ref) => {
  return <RadioGroupPrimitive.Root ref={ref} {...props} />;
});

RadioGroup.displayName = "RadioGroup";
