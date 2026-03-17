import type * as React from "react";
import { CloseIcon } from "../Icons/CloseIcon";
import type { AutocompleteOption } from "./Autocomplete";
import { getLabel } from "./constants";

export function AutocompleteTag({
  option,
  disabled,
  onRemove,
  renderTag,
}: {
  option: AutocompleteOption;
  disabled: boolean;
  onRemove: () => void;
  renderTag?: (option: AutocompleteOption, onRemove: () => void) => React.ReactNode;
}) {
  if (renderTag) {
    return <span>{renderTag(option, onRemove)}</span>;
  }

  return (
    <span className="typography-regular-body-sm inline-flex max-w-full items-center gap-1 rounded-md bg-neutral-200 px-2 py-0.5 text-foreground-default">
      <span className="truncate">{getLabel(option)}</span>
      <button
        type="button"
        tabIndex={-1}
        aria-label={`Remove ${getLabel(option)}`}
        className="flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm text-foreground-secondary hover:text-foreground-default active:scale-95"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        disabled={disabled}
      >
        <CloseIcon className="size-3" />
      </button>
    </span>
  );
}
