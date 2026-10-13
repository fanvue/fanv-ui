import * as React from "react";
import { cn } from "../../utils/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../DropdownMenu/DropdownMenuRoot";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  type DropdownMenuRadioItemProps,
} from "../DropdownMenu/DropdownMenuSelectionItems";
import { ChevronDownIcon } from "../Icons/ChevronDownIcon";
import { OVERFLOW_TAB_VALUE } from "./Tabs";
import { TabsTrigger, type TabsTriggerProps } from "./TabsTrigger";

const OPEN_KEYS = new Set(["Enter", " ", "ArrowDown"]);

/** Props for the {@link TabsOverflow} component. */
export interface TabsOverflowProps
  extends Omit<TabsTriggerProps, "value" | "children" | "asChild" | "onValueChange"> {
  /** Text shown on the tab while none of its items is active, e.g. "More". */
  label: React.ReactNode;
  /** The `Tabs` value, so the tab can show and mark an active overflow item. */
  value: string | undefined;
  /** Called with an item's value when it is picked from the menu. */
  onValueChange: (value: string) => void;
  /** {@link TabsOverflowItem} elements, one per tab that doesn't fit the row. */
  children?: React.ReactNode;
}

/** Props for the {@link TabsOverflowItem} component. */
export type TabsOverflowItemProps = DropdownMenuRadioItemProps;

/** A tab listed in a {@link TabsOverflow} menu. */
export const TabsOverflowItem = React.forwardRef<HTMLDivElement, TabsOverflowItemProps>(
  (props, ref) => <DropdownMenuRadioItem ref={ref} {...props} />,
);

TabsOverflowItem.displayName = "TabsOverflowItem";

/**
 * The last tab in a {@link TabsList}, opening a menu of the tabs that don't fit
 * the row. It sits in the row's arrow-key order, opens with click, Enter, Space
 * or ArrowDown, and never selects anything itself. While one of its items is
 * active it shows that item's label and is the selected tab.
 *
 * Use with a controlled `Tabs` (`value` + `onValueChange`), passing the same
 * pair here. Renders nothing when it has no items.
 *
 * @example
 * ```tsx
 * <Tabs value={tab} onValueChange={setTab}>
 *   <TabsList appearance="pill">
 *     <TabsTrigger value="all">All</TabsTrigger>
 *     <TabsOverflow label="More" value={tab} onValueChange={setTab}>
 *       <TabsOverflowItem value="tips">Tips</TabsOverflowItem>
 *     </TabsOverflow>
 *   </TabsList>
 * </Tabs>
 * ```
 */
export const TabsOverflow = React.forwardRef<HTMLButtonElement, TabsOverflowProps>(
  ({ label, value, onValueChange, children, className, onKeyDown, onMouseDown, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    const items = React.Children.toArray(children).filter(
      (child): child is React.ReactElement<TabsOverflowItemProps> => React.isValidElement(child),
    );

    if (items.length === 0) {
      if (open) setOpen(false);
      return null;
    }

    const activeItem = items.find((item) => item.props.value === value);

    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <TabsTrigger
          ref={ref}
          asChild
          value={activeItem ? activeItem.props.value : OVERFLOW_TAB_VALUE}
          {...(!activeItem && { "aria-controls": undefined })}
          className={className}
          onMouseDown={(event) => {
            onMouseDown?.(event);
            event.preventDefault();
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (OPEN_KEYS.has(event.key)) {
              event.preventDefault();
              setOpen(true);
            }
          }}
          {...props}
        >
          <DropdownMenuTrigger>
            <span className="flex items-center gap-2">
              {activeItem ? activeItem.props.children : label}
              <ChevronDownIcon
                size={16}
                className={cn("motion-safe:transition-transform", open && "rotate-180")}
              />
            </span>
          </DropdownMenuTrigger>
        </TabsTrigger>
        <DropdownMenuContent align="end" aria-label={typeof label === "string" ? label : undefined}>
          <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
            {children}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
);

TabsOverflow.displayName = "TabsOverflow";
