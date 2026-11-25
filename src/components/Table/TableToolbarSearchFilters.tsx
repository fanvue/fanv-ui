import * as React from "react";
import { cn } from "@/utils/cn";
import { CloseIcon } from "../Icons/CloseIcon";
import { Tag } from "../Tag/Tag";
import { useFittingCount } from "./useFittingCount";

/** An applied filter shown inside a `TableToolbarSearch`, e.g. "Platform is Instagram". */
export interface TableToolbarSearchFilter {
  /** Stable key for the filter. */
  id: string;
  /** Secondary text, e.g. "Platform is". */
  name: string;
  /** Primary text, e.g. "Instagram, YouTube". */
  value: string;
  /** 16px icon displayed before the text. */
  icon?: React.ReactNode;
  /** Called when the filter's × button is pressed. */
  onRemove: () => void;
  /** Accessible name of the × button, as one translated string such as "Remove Platform filter". */
  removeLabel: string;
}

/** The applied filters of a `TableToolbarSearch`. `formatHiddenFilters` is required with `filters`. */
export type TableToolbarSearchFiltersProps =
  | {
      /**
       * Applied filters, shown between the search icon and the input from the `md` breakpoint up.
       * Array order is the priority: the leading filters that fit are shown and the rest collapse
       * into a "+N" tag.
       */
      filters: readonly TableToolbarSearchFilter[];
      /** Accessible text of the "+N" tag, e.g. `(count) => \`${count} more filters\``. */
      formatHiddenFilters: (count: number) => string;
    }
  | { filters?: undefined; formatHiddenFilters?: undefined };

/** The "Clear all" action of a `TableToolbarSearch`. Its label and handler come as a pair. */
export type TableToolbarSearchClearFiltersProps =
  | {
      /** Label of the "Clear all" action, shown after the input while a filter is applied. */
      clearFiltersLabel: string;
      /** Called when "Clear all" is pressed. */
      onClearFilters: () => void;
    }
  | { clearFiltersLabel?: undefined; onClearFilters?: undefined };

function SearchFilter({
  filter,
  className,
}: {
  filter: TableToolbarSearchFilter;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "typography-description-12px-regular inline-flex h-6 items-center gap-2 whitespace-nowrap text-content-secondary",
        className,
      )}
    >
      {filter.icon && (
        <span
          aria-hidden
          className="inline-flex size-4 shrink-0 items-center justify-center [&>svg]:size-4"
        >
          {filter.icon}
        </span>
      )}
      <span className="min-w-0 truncate">
        {filter.name} <span className="text-content-primary">{filter.value}</span>
      </span>
      <button
        type="button"
        aria-label={filter.removeLabel}
        onClick={filter.onRemove}
        className="inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-xs border-none bg-transparent p-0 text-icons-secondary outline-none hover:text-icons-primary focus-visible:shadow-focus-ring"
      >
        <CloseIcon size={16} />
      </button>
    </span>
  );
}

/**
 * Wraps the search input of a `TableToolbarSearch` and puts the applied filters before it. Without
 * `filters` it renders the input alone.
 */
export function SearchFilters(
  props: TableToolbarSearchFiltersProps & { children: React.ReactNode },
) {
  if (!props.filters) return props.children;
  return (
    <SearchFiltersSlot filters={props.filters} formatHiddenFilters={props.formatHiddenFilters}>
      {props.children}
    </SearchFiltersSlot>
  );
}

interface SearchFiltersSlotProps {
  filters: readonly TableToolbarSearchFilter[];
  formatHiddenFilters: (count: number) => string;
  children: React.ReactNode;
}

/**
 * The input keeps at least 96px; the filters that do not fit in the rest collapse into a "+N" tag.
 * The ruler's `right-26` is the input's `min-w-24` plus the wrapper's `gap-2`: change them together.
 */
function SearchFiltersSlot({ filters, formatHiddenFilters, children }: SearchFiltersSlotProps) {
  const rulerRef = React.useRef<HTMLDivElement>(null);
  const fittingCount = useFittingCount(rulerRef, filters.length);
  const visibleCount = Math.min(fittingCount ?? filters.length, filters.length);
  const hiddenCount = filters.length - visibleCount;

  return (
    <div className="relative flex min-w-0 flex-1 items-center gap-2 [&>input]:min-w-24">
      <div
        ref={rulerRef}
        aria-hidden
        inert
        className="pointer-events-none invisible absolute top-0 right-26 left-0 hidden h-0 overflow-hidden md:block"
      >
        <div className="flex w-max items-center gap-4">
          {filters.map((filter) => (
            <SearchFilter key={filter.id} filter={filter} className="shrink-0" />
          ))}
          <Tag>{`+${Math.max(filters.length - 1, 1)}`}</Tag>
        </div>
      </div>
      {filters.length > 0 && (
        <div className="hidden min-w-0 items-center gap-4 md:flex">
          {filters.slice(0, visibleCount).map((filter, index) => (
            <SearchFilter
              key={filter.id}
              filter={filter}
              className={index === 0 ? "min-w-0" : "shrink-0"}
            />
          ))}
          {hiddenCount > 0 && (
            <span className="inline-flex shrink-0">
              <Tag aria-hidden>{`+${hiddenCount}`}</Tag>
              <span className="sr-only">{formatHiddenFilters(hiddenCount)}</span>
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

/** The "Clear all" text action after the search input, hidden below `md` like the filters. */
export function ClearSearchFilters({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="typography-description-12px-regular hidden h-6 shrink-0 cursor-pointer items-center whitespace-nowrap rounded-xs border-none bg-transparent p-0 text-content-secondary outline-none hover:text-content-primary focus-visible:shadow-focus-ring md:inline-flex"
    >
      {label}
    </button>
  );
}
