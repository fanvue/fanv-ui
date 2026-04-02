import * as React from "react";
import { cn } from "../../utils/cn";

export interface BottomNavigationProps extends React.HTMLAttributes<HTMLElement> {
  /** The currently selected action value. */
  value?: string;
  /** Called when the selected action changes. */
  onValueChange?: (value: string) => void;
  /** When `true`, the navigation bar is hidden on viewports wider than `md` (768 px). @default false */
  hideOnDesktop?: boolean;
}

interface BottomNavigationContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
}

const BottomNavigationContext = React.createContext<BottomNavigationContextValue>({});

export function useBottomNavigationContext(): BottomNavigationContextValue {
  return React.useContext(BottomNavigationContext);
}

export const BottomNavigation = React.forwardRef<HTMLElement, BottomNavigationProps>(
  ({ className, children, value, onValueChange, hideOnDesktop = false, ...props }, ref) => {
    const contextValue = React.useMemo<BottomNavigationContextValue>(
      () => ({ value, onValueChange }),
      [value, onValueChange],
    );

    return (
      <BottomNavigationContext.Provider value={contextValue}>
        <nav
          ref={ref}
          className={cn(
            "fixed inset-x-0 bottom-0",
            "flex h-[calc(env(safe-area-inset-bottom,0px)+68px)] items-center justify-around",
            "border-neutral-alphas-200 border-t bg-background-primary",
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
