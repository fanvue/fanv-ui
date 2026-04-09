import type { AutocompleteOption } from "./Autocomplete";

export const CREATE_PREFIX = "__create__";

export function defaultFilter(option: AutocompleteOption, query: string): boolean {
  const label = option.label ?? option.value;
  return label.toLowerCase().includes(query.toLowerCase());
}

export function getLabel(option: AutocompleteOption): string {
  return option.label ?? option.value;
}
