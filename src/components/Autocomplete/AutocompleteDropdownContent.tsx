import type * as React from "react";
import { cn } from "@/utils/cn";
import { SpinnerIcon } from "../Icons/SpinnerIcon";
import type { AutocompleteGroup, AutocompleteOption } from "./Autocomplete";
import { AutocompleteOptionItem } from "./AutocompleteOptionItem";
import type { AutocompleteVisibleSections } from "./constants";

interface AutocompleteDropdownContentProps {
  loading: boolean;
  loadingText?: string;
  emptyText?: string;
  visibleOptions: AutocompleteOption[];
  visibleSections: AutocompleteVisibleSections;
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
  renderGroupHeading?: (group: AutocompleteGroup) => React.ReactNode;
}

function DefaultGroupHeading({ children }: { children: React.ReactNode }) {
  return (
    <span className="typography-semibold-body-sm block px-3 pt-2 pb-1 text-content-secondary uppercase tracking-wide">
      {children}
    </span>
  );
}

export function AutocompleteDropdownContent({
  loading,
  loadingText,
  emptyText,
  visibleOptions,
  visibleSections,
  listboxId,
  activeIndex,
  isMulti,
  selectedMultiValues,
  selectedValue,
  onSelect,
  onMouseEnter,
  renderOption,
  renderGroupHeading,
}: AutocompleteDropdownContentProps) {
  if (loading) {
    return (
      // biome-ignore lint/a11y/useSemanticElements: <output> is not appropriate here; using role="status" for live region announcements
      <div role="status" className="flex items-center justify-center py-4">
        <SpinnerIcon className="size-5 animate-spin text-content-secondary" />
        {loadingText && (
          <span className="typography-regular-body-md ml-2 text-content-secondary">
            {loadingText}
          </span>
        )}
      </div>
    );
  }

  const { pinned, ungrouped, groups } = visibleSections;
  const hasTopBlock = pinned.length > 0 || ungrouped.length > 0;
  const hasGroups = groups.length > 0;
  const nonPinnedVisibleCount = ungrouped.length + groups.reduce((n, g) => n + g.options.length, 0);

  if (visibleOptions.length === 0) {
    return (
      <div className="typography-regular-body-md block px-3 py-4 text-center text-content-secondary">
        {emptyText}
      </div>
    );
  }

  let cursor = 0;
  const renderOptionRow = (option: AutocompleteOption) => {
    const index = cursor++;
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
  };

  const showDivider = hasTopBlock && hasGroups;
  const emptyAfterPinned = nonPinnedVisibleCount === 0 && pinned.length > 0;

  return (
    <>
      {pinned.map(renderOptionRow)}
      {ungrouped.map(renderOptionRow)}
      {groups.map((section, sectionIndex) => {
        const headingId = `${listboxId}-group-${section.group.id}`;
        const headingNode = renderGroupHeading
          ? renderGroupHeading(section.group)
          : section.group.label;
        return (
          // biome-ignore lint/a11y/useSemanticElements: <fieldset> carries form semantics and default styling we don't want inside a listbox; role="group" is the correct ARIA pattern here
          <div
            key={section.group.id}
            role="group"
            aria-labelledby={headingId}
            className={cn(
              showDivider && sectionIndex === 0 && "mt-1 border-neutral-alphas-200 border-t pt-1",
            )}
          >
            <div role="presentation" id={headingId}>
              {renderGroupHeading ? (
                headingNode
              ) : (
                <DefaultGroupHeading>{headingNode}</DefaultGroupHeading>
              )}
            </div>
            {section.options.map(renderOptionRow)}
          </div>
        );
      })}
      {emptyAfterPinned && (
        <div className="typography-regular-body-md block px-3 py-4 text-center text-content-secondary">
          {emptyText}
        </div>
      )}
    </>
  );
}
