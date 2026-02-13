import * as TabsPrimitive from "@radix-ui/react-tabs";
import type * as React from "react";

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
export const Tabs = TabsPrimitive.Root;
