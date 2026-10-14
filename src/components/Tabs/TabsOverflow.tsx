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
  ({ label, value, onValueChange, children, className, onKeyDown, onMouseDown, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    const contentRef = React.useRef<HTMLSpanElement | null>(null);
    const setButtonRef = (node: HTMLButtonElement | null) => {
      buttonRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    const placedRef = React.useRef(false);
    const fitWidth = React.useCallback(() => {
      const button = buttonRef.current;
      const content = contentRef.current;
      if (!button || !content) {
        placedRef.current = false;
        return;
      }
      const style = getComputedStyle(button);
      const padding = Number.parseFloat(style.paddingLeft) + Number.parseFloat(style.paddingRight);
      const width = `${content.offsetWidth + padding}px`;
      if (button.style.width === width) return;
      if (placedRef.current) {
        button.style.width = width;
        return;
      }
      button.style.transitionDuration = "0s";
      button.style.width = width;
      button.getBoundingClientRect();
      button.style.transitionDuration = "";
      placedRef.current = true;
    }, []);

    React.useLayoutEffect(fitWidth);

    const resizeObserverRef = React.useRef<ResizeObserver | null>(null);
    const setContentRef = React.useCallback(
      (node: HTMLSpanElement | null) => {
        resizeObserverRef.current?.disconnect();
        resizeObserverRef.current = null;
        contentRef.current = node;
        if (!node) return;
        const observer = new ResizeObserver(fitWidth);
        observer.observe(node);
        resizeObserverRef.current = observer;
      },
      [fitWidth],
    );

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
          ref={setButtonRef}
          asChild
          value={activeItem ? activeItem.props.value : OVERFLOW_TAB_VALUE}
          {...(!activeItem && { "aria-controls": undefined })}
          className={cn(
            "overflow-hidden motion-safe:transition-[width,color] motion-safe:duration-200",
            className,
          )}
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
            <span
              ref={setContentRef}
              className="flex shrink-0 items-center gap-2 whitespace-nowrap"
            >
              {activeItem ? activeItem.props.children : label}
              <ChevronDownIcon
                size={16}
                className={cn("motion-safe:transition-transform", open && "rotate-180")}
              />
            </span>
          </DropdownMenuTrigger>
        </TabsTrigger>
        <DropdownMenuContent align="end" aria-label={typeof label === "string" ? label : undefined}>
          <OverflowSelectionContext.Provider value={{ value, select: onValueChange }}>
            {children}
          </OverflowSelectionContext.Provider>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
);

TabsOverflow.displayName = "TabsOverflow";
