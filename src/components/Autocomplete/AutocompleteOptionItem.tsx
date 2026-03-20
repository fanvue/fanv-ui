import type * as React from "react";
import { cn } from "@/utils/cn";
import { CheckIcon } from "../Icons/CheckIcon";
import type { AutocompleteOption } from "./Autocomplete";
import { CREATE_PREFIX, getLabel } from "./constants";

export function AutocompleteOptionItem({
  option,
  optionId,
  index,
  isSelected,
  isActive,
  onSelect,
  onMouseEnter,
  renderOption,
}: {
  option: AutocompleteOption;
  optionId: string;
  index: number;
  isSelected: boolean;
  isActive: boolean;
  onSelect: () => void;
  onMouseEnter: () => void;
  renderOption?: (
    option: AutocompleteOption,
    state: { selected: boolean; active: boolean },
  ) => React.ReactNode;
}) {
  const isCreate = option.value.startsWith(CREATE_PREFIX);

  return (
    <div
      id={optionId}
      role="option"
      tabIndex={-1}
      aria-selected={isSelected}
      aria-disabled={option.disabled || undefined}
      data-option-index={index}
      className={cn(
        "typography-regular-body-lg relative flex w-full cursor-pointer select-none items-center gap-2 rounded-xs py-2 pr-2 pl-3 text-content-primary outline-none",
        isActive && "bg-neutral-alphas-100",
        option.disabled && "pointer-events-none opacity-50",
        isCreate && "italic",
      )}
      onMouseEnter={onMouseEnter}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        if (!option.disabled) onSelect();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!option.disabled) onSelect();
        }
      }}
    >
      {renderOption ? (
        renderOption(option, { selected: isSelected, active: isActive })
      ) : (
        <>
          <span className="min-w-0 flex-1 truncate">{getLabel(option)}</span>
          {isSelected && (
            <span className="ml-auto flex size-4 shrink-0 items-center justify-center">
              <CheckIcon className="size-4 text-content-primary" />
            </span>
          )}
        </>
      )}
    </div>
  );
}
