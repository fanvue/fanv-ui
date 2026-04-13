import * as React from "react";
import { cn } from "../../utils/cn";

export interface BottomNavigationProps extends React.HTMLAttributes<HTMLElement> {
  /** The currently selected action value. */
  value?: string;
  /** Called when the selected action changes. */
  onValueChange?: (value: string) => void;
  /** When `true`, the navigation bar is hidden on viewports wider than `md` (768 px). @default false */
  hideOnDesktop?: boolean;
  /** When `true`, renders the information-architecture style with visible labels and a sliding active indicator. @default false */
  hasInformationArchitectureNav?: boolean;
}

interface BottomNavigationContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  hasInformationArchitectureNav: boolean;
}

const BottomNavigationContext = React.createContext<BottomNavigationContextValue>({
  hasInformationArchitectureNav: false,
});

export function useBottomNavigationContext(): BottomNavigationContextValue {
  return React.useContext(BottomNavigationContext);
}

function resolveChildren(children: React.ReactNode, value: string | undefined) {
  const items = React.Children.toArray(children);
  for (let i = 0; i < items.length; i++) {
    const child = items[i];
    if (React.isValidElement<{ value?: string }>(child) && child.props.value === value) {
      return { count: items.length, activeIndex: i };
    }
  }
  return { count: items.length, activeIndex: undefined };
}

export const BottomNavigation = React.forwardRef<HTMLElement, BottomNavigationProps>(
  (
    {
      className,
      children,
      value,
      onValueChange,
      hasInformationArchitectureNav = false,
      hideOnDesktop = false,
      ...props
    },
    ref,
  ) => {
    const contextValue = React.useMemo<BottomNavigationContextValue>(
      () => ({ value, onValueChange, hasInformationArchitectureNav }),
      [value, onValueChange, hasInformationArchitectureNav],
    );

    if (hasInformationArchitectureNav) {
      const { count: itemCount, activeIndex } = resolveChildren(children, value);
      const { style, ...restProps } = props;

      return (
        <BottomNavigationContext.Provider value={contextValue}>
          <nav
            ref={ref}
            {...restProps}
            className={cn(
              "fixed inset-x-0 bottom-0 flex h-[calc(env(safe-area-inset-bottom,0px)+80px)] items-stretch justify-around pb-[env(safe-area-inset-bottom,0px)]",
              "border-neutral-alphas-200 border-t bg-bg-primary",
              hideOnDesktop && "md:hidden",
              className,
            )}
            style={
              { zIndex: "var(--fanvue-ui-portal-z-index, 50)", ...style } as React.CSSProperties
            }
          >
            {activeIndex != null && (
              <div
                aria-hidden="true"
                data-part="indicator"
                className="pointer-events-none absolute inset-x-0 -top-px h-0"
              >
                <div
                  className="absolute top-0 flex -translate-x-1/2 flex-col items-center motion-safe:transition-[left] motion-safe:duration-300 motion-safe:ease-in-out"
                  style={{
                    left: `calc((${activeIndex} + 0.5) * (100% / ${itemCount}))`,
                    width: `calc(100% / ${itemCount})`,
                  }}
                >
                  <div className="h-px w-full bg-linear-to-r from-transparent via-(--color-special-bottom-nav-highlight) to-transparent" />
                  <div className="h-20 w-full overflow-hidden">
                    <div className="mx-auto aspect-square w-[70%] max-w-[70px] -translate-y-1/2 rounded-full bg-(--color-special-bottom-nav-highlight) opacity-30 blur-[min(20px,2vw)] dark:opacity-15" />
                  </div>
                </div>
              </div>
            )}
            {children}
          </nav>
        </BottomNavigationContext.Provider>
      );
    }

    return (
      <BottomNavigationContext.Provider value={contextValue}>
        <nav
          ref={ref}
          className={cn(
            "fixed inset-x-0 bottom-0",
            "flex h-[calc(env(safe-area-inset-bottom,0px)+68px)] items-center justify-around",
            "border-neutral-alphas-200 border-t bg-bg-primary",
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
