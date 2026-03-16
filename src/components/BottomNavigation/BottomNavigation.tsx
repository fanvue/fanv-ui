import * as React from "react";
import { cn } from "../../utils/cn";

/* ---------------------------------- Types --------------------------------- */

export interface BottomNavigationProps extends React.HTMLAttributes<HTMLElement> {
  /** The currently selected action value. */
  value?: string;
  /** Called when the selected action changes. */
  onValueChange?: (value: string) => void;
  /** When `true`, labels are only shown on the active action. @default false */
  showLabelsOnlyWhenActive?: boolean;
  /** When `true`, all labels are hidden. @default false */
  hideLabels?: boolean;
  /** When `true`, the navigation bar is hidden on viewports wider than `md` (768 px). @default false */
  hideOnDesktop?: boolean;
}

/* --------------------------------- Context -------------------------------- */

interface BottomNavigationContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  showLabelsOnlyWhenActive: boolean;
  hideLabels: boolean;
}

const BottomNavigationContext = React.createContext<BottomNavigationContextValue>({
  showLabelsOnlyWhenActive: false,
  hideLabels: false,
});

export function useBottomNavigationContext(): BottomNavigationContextValue {
  return React.useContext(BottomNavigationContext);
}

/* ------------------------------- Component -------------------------------- */

export const BottomNavigation = React.forwardRef<HTMLElement, BottomNavigationProps>(
  (
    {
      className,
      children,
      value,
      onValueChange,
      showLabelsOnlyWhenActive = false,
      hideLabels = false,
      hideOnDesktop = false,
      ...props
    },
    ref,
  ) => {
    const ctx = React.useMemo<BottomNavigationContextValue>(
      () => ({ value, onValueChange, showLabelsOnlyWhenActive, hideLabels }),
      [value, onValueChange, showLabelsOnlyWhenActive, hideLabels],
    );

    return (
      <BottomNavigationContext.Provider value={ctx}>
        <nav
          ref={ref}
          className={cn(
            "fixed inset-x-0 bottom-0",
            "flex h-[calc(env(safe-area-inset-bottom,0px)+68px)] items-center justify-around",
            "border-neutral-200 border-t bg-surface-page/[.82] backdrop-blur-[16px]",
            "pb-[env(safe-area-inset-bottom,0px)]",
            hideOnDesktop && "md:hidden",
            className,
          )}
          style={{ zIndex: "var(--fanvue-ui-portal-z-index, 50)", ...props.style }}
          {...props}
        >
          {children}
        </nav>
      </BottomNavigationContext.Provider>
    );
  },
);

BottomNavigation.displayName = "BottomNavigation";
