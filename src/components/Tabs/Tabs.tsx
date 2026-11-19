import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

/**
 * Value a {@link TabsOverflow} tab carries while none of its items is active.
 * {@link Tabs} never reports or stores it, so focusing More under automatic
 * activation selects nothing.
 */
export const OVERFLOW_TAB_VALUE = "fanvue-ui-tabs-overflow";

/** Props for the {@link Tabs} root component. Extends Radix `Tabs.Root` props. */
export type TabsProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>;

/**
 * Root container for a tabbed interface. Manages the active tab state and
 * coordinates {@link TabsList}, {@link TabsTrigger}, and {@link TabsContent}.
 *
 * Built on Radix UI `Tabs`.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="tab1">
 *   <TabsList>
 *     <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *     <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">Content 1</TabsContent>
 *   <TabsContent value="tab2">Content 2</TabsContent>
 * </Tabs>
 * ```
 */
export const TabsValueContext = React.createContext<{
  value: string | undefined;
  select: (value: string) => void;
}>({ value: undefined, select: () => {} });

export const Tabs = React.forwardRef<React.ComponentRef<typeof TabsPrimitive.Root>, TabsProps>(
  ({ value: valueProp, defaultValue, onValueChange, ...props }, ref) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : uncontrolledValue;

    const select = React.useCallback(
      (next: string) => {
        if (next === OVERFLOW_TAB_VALUE) return;
        if (!isControlled) setUncontrolledValue(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const context = React.useMemo(() => ({ value, select }), [value, select]);

    return (
      <TabsValueContext.Provider value={context}>
        <TabsPrimitive.Root ref={ref} value={value ?? ""} onValueChange={select} {...props} />
      </TabsValueContext.Provider>
    );
  },
);

Tabs.displayName = "Tabs";
