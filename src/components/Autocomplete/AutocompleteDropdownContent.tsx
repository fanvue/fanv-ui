import type * as React from "react";
import { SpinnerIcon } from "../Icons/SpinnerIcon";
import type { AutocompleteOption } from "./Autocomplete";
import { AutocompleteOptionItem } from "./AutocompleteOptionItem";

export function AutocompleteDropdownContent({
  loading,
  loadingText,
  emptyText,
  visibleOptions,
  listboxId,
  activeIndex,
  isMulti,
  selectedMultiValues,
  selectedValue,
  onSelect,
  onMouseEnter,
  renderOption,
}: {
  loading: boolean;
  loadingText?: string;
  emptyText?: string;
  visibleOptions: AutocompleteOption[];
  listboxId: string;
  activeIndex: number;
  isMulti: boolean;
  selectedMultiValues: string[];
  selectedValue: string | null;
  onSelect: (option: AutocompleteOption) => void;
  onMouseEnter: (index: number) => void;
  renderOption?: (
    option: AutocompleteOption,
    state: { selected: boolean; active: boolean },
  ) => React.ReactNode;
}) {
  if (loading) {
    return (
      // biome-ignore lint/a11y/useSemanticElements: <output> is not appropriate here; using role="status" for live region announcements
      <div role="status" className="flex items-center justify-center py-4">
        <SpinnerIcon className="size-5 animate-spin text-foreground-secondary" />
        {loadingText && (
          <span className="typography-regular-body-md ml-2 text-foreground-secondary">
            {loadingText}
          </span>
        )}
      </div>
    );
  }

  if (visibleOptions.length === 0) {
    return (
      <div className="typography-regular-body-md block px-3 py-4 text-center text-foreground-secondary">
        {emptyText}
      </div>
    );
  }

  return (
    <>
      {visibleOptions.map((option, index) => {
        const isSelected = isMulti
          ? selectedMultiValues.includes(option.value)
          : option.value === selectedValue;

        return (
          <AutocompleteOptionItem
            key={option.value}
            option={option}
            optionId={`${listboxId}-option-${index}`}
            index={index}
            isSelected={isSelected}
            isActive={index === activeIndex}
            onSelect={() => onSelect(option)}
            onMouseEnter={() => onMouseEnter(index)}
            renderOption={renderOption}
          />
        );
      })}
    </>
  );
}
