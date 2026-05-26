import type { AutocompleteGroup, AutocompleteOption } from "./Autocomplete";

export const CREATE_PREFIX = "__create__";

export function defaultFilter(option: AutocompleteOption, query: string): boolean {
  const label = option.label ?? option.value;
  return label.toLowerCase().includes(query.toLowerCase());
}

export function getLabel(option: AutocompleteOption): string {
  return option.label ?? option.value;
}

/**
 * Section structure consumed by `AutocompleteDropdownContent` to render the
 * grouped layout. `pinned` options bypass the filter; `ungrouped` options
 * have no `groupId`; `groups` preserves the order declared by the consumer's
 * `groups` prop and omits any group with zero visible options.
 *
 * The flat `visibleOptions` list (built in `useAutocomplete`) keeps the same
 * order as this structure (pinned → ungrouped → groups in order, options in
 * declaration order within each section) so `aria-activedescendant` and
 * keyboard navigation work against a single flat index.
 */
export interface AutocompleteVisibleSection {
  group: AutocompleteGroup;
  options: AutocompleteOption[];
}

export interface AutocompleteVisibleSections {
  pinned: AutocompleteOption[];
  ungrouped: AutocompleteOption[];
  groups: AutocompleteVisibleSection[];
}

/**
 * Splits `options` into pinned / ungrouped / per-group buckets, applies the
 * provided filter to non-pinned options only, and drops empty groups.
 *
 * Group-heading matching: when the query matches a group's `label`
 * (case-insensitive substring, same as the default option filter), every
 * option under that group is kept regardless of whether it individually
 * matches the per-option `filter`. This supports the common "group heading
 * is the searchable label, items are sub-rows" shape (e.g. group =
 * product name, items = prices). Pinned options always bypass filtering.
 */
export function getVisibleSections(
  options: AutocompleteOption[],
  groups: AutocompleteGroup[] | undefined,
  filter: (option: AutocompleteOption, query: string) => boolean,
  query: string,
): AutocompleteVisibleSections {
  const pinned: AutocompleteOption[] = [];
  const ungrouped: AutocompleteOption[] = [];
  const byGroup = new Map<string, AutocompleteOption[]>();
  const knownGroupIds = new Set(groups?.map((g) => g.id));

  const lowerQuery = query.toLowerCase();
  const groupMatchedByHeading = new Set<string>(
    query
      ? (groups ?? []).filter((g) => g.label.toLowerCase().includes(lowerQuery)).map((g) => g.id)
      : [],
  );

  for (const option of options) {
    if (option.pinned) {
      pinned.push(option);
      continue;
    }
    const inMatchedGroup = !!option.groupId && groupMatchedByHeading.has(option.groupId);
    if (query && !inMatchedGroup && !filter(option, query)) continue;
    if (option.groupId && knownGroupIds.has(option.groupId)) {
      const bucket = byGroup.get(option.groupId) ?? [];
      bucket.push(option);
      byGroup.set(option.groupId, bucket);
    } else {
      ungrouped.push(option);
    }
  }

  const visibleGroups: AutocompleteVisibleSection[] = (groups ?? [])
    .map((group) => ({ group, options: byGroup.get(group.id) ?? [] }))
    .filter((section) => section.options.length > 0);

  return { pinned, ungrouped, groups: visibleGroups };
}

/** Flattens visible sections into the cursor-indexed list. */
export function flattenVisibleSections(
  sections: AutocompleteVisibleSections,
): AutocompleteOption[] {
  return [...sections.pinned, ...sections.ungrouped, ...sections.groups.flatMap((s) => s.options)];
}
