import * as React from "react";
import { cn } from "../../utils/cn";
import { DropdownMenuItem, type DropdownMenuItemProps } from "../DropdownMenu/DropdownMenuItem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../DropdownMenu/DropdownMenuRoot";
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

const OverflowSelectionContext = React.createContext<{
  value: string | undefined;
  select: (value: string) => void;
}>({ value: undefined, select: () => {} });

/** Props for the {@link TabsOverflowItem} component. */
export type TabsOverflowItemProps = Omit<DropdownMenuItemProps, "selected" | "onSelect"> & {
  /** The tab's value, as on a {@link TabsTrigger}. */
  value: string;
};

/**
 * A tab listed in a {@link TabsOverflow} menu. The active one takes the menu's
 * selected style and is announced as the checked option.
 */
export const TabsOverflowItem = React.forwardRef<HTMLDivElement, TabsOverflowItemProps>(
  ({ value, ...props }, ref) => {
    const selection = React.useContext(OverflowSelectionContext);
    const isActive = selection.value === value;
    return (
      <DropdownMenuItem
        ref={ref}
        role="menuitemradio"
        aria-checked={isActive}
        selected={isActive}
        onSelect={() => selection.select(value)}
        {...props}
      />
    );
  },
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
  ({ children, ...props }, ref) => {
    const items = React.Children.toArray(children).filter(
      (child): child is React.ReactElement<TabsOverflowItemProps> => React.isValidElement(child),
    );
    if (items.length === 0) return null;
    return (
      <OverflowMenu ref={ref} items={items} {...props}>
        {children}
      </OverflowMenu>
    );
  },
);

TabsOverflow.displayName = "TabsOverflow";

const OverflowMenu = React.forwardRef<
  HTMLButtonElement,
  TabsOverflowProps & { items: React.ReactElement<TabsOverflowItemProps>[] }
>(
  (
    { items, label, value, onValueChange, children, className, onKeyDown, onMouseDown, ...props },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);

    const lastInput = React.useRef<"pointer" | "keyboard">("keyboard");

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
            if (event.defaultPrevented) return;
            if (OPEN_KEYS.has(event.key)) {
              lastInput.current = "keyboard";
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
        <DropdownMenuContent
          align="end"
          aria-label={typeof label === "string" ? label : undefined}
          onPointerDownCapture={() => {
            lastInput.current = "pointer";
          }}
          onKeyDownCapture={() => {
            lastInput.current = "keyboard";
          }}
          onPointerDownOutside={() => {
            lastInput.current = "pointer";
          }}
          onCloseAutoFocus={(event) => {
            if (lastInput.current === "pointer") event.preventDefault();
          }}
        >
          <OverflowSelectionContext.Provider value={{ value, select: onValueChange }}>
            {children}
          </OverflowSelectionContext.Provider>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
);

OverflowMenu.displayName = "OverflowMenu";
