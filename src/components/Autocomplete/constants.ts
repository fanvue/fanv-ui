import type { AutocompleteOption, AutocompleteSize } from "./Autocomplete";

export const CREATE_PREFIX = "__create__";

export const CONTAINER_HEIGHT: Record<AutocompleteSize, string> = {
  "48": "min-h-12",
  "40": "min-h-10",
  "32": "min-h-8",
};

export const INPUT_SIZE_CLASSES: Record<AutocompleteSize, string> = {
  "48": "py-3 typography-regular-body-lg",
  "40": "py-2 typography-regular-body-lg",
  "32": "py-2 typography-regular-body-md",
};

export const PADDING_HORIZONTAL: Record<AutocompleteSize, string> = {
  "48": "px-4",
  "40": "px-4",
  "32": "px-3",
};

export const ICON_SPACING: Record<AutocompleteSize, string> = {
  "48": "gap-3",
  "40": "gap-3",
  "32": "gap-2",
};

export function defaultFilter(option: AutocompleteOption, query: string): boolean {
  const label = option.label ?? option.value;
  return label.toLowerCase().includes(query.toLowerCase());
}

export function getLabel(option: AutocompleteOption): string {
  return option.label ?? option.value;
}
