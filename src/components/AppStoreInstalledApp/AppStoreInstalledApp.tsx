import { ArrowUpRightIcon, Button, cn, IconButton, MoreVerticalIcon } from "@fanvue/ui";
import type { ImgHTMLAttributes } from "react";

export interface AppStoreInstalledAppProps {
  title: string;
  builderName: string;
  imageProps: ImgHTMLAttributes<HTMLImageElement>;
  onOpen?: () => void;
  openLabel?: string;
  onMenuPress?: () => void;
  menuLabel?: string;
  className?: string;
}

/**
 * Installed app row from Fanvue Library — product image, title, builder, Open, overflow menu.
 */
export function AppStoreInstalledApp({
  title,
  builderName,
  imageProps,
  onOpen,
  openLabel = "Open",
  onMenuPress,
  menuLabel = "More actions",
  className,
}: AppStoreInstalledAppProps) {
  return (
    <div
      className={cn(
        "flex w-full max-w-[440px] items-start justify-end gap-5 overflow-hidden rounded-[var(--radius-rounded-md,16px)]",
        className,
      )}
    >
      <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl">
        <img
          {...imageProps}
          alt={imageProps.alt ?? ""}
          className={cn(
            "pointer-events-none size-full max-w-none rounded-2xl object-cover",
            imageProps.className,
          )}
        />
      </div>

      <div className="flex min-h-px min-w-0 flex-1 flex-col gap-3">
        <div className="flex w-full items-center gap-0">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex w-full items-center gap-3">
              <p className="typography-regular-body-lg min-w-0 flex-1 truncate font-medium text-content-primary">
                {title}
              </p>
              {onMenuPress ? (
                <IconButton
                  type="button"
                  variant="tertiary"
                  size="32"
                  icon={<MoreVerticalIcon className="size-4" />}
                  aria-label={menuLabel}
                  onClick={onMenuPress}
                  className="shrink-0 p-1"
                />
              ) : null}
            </div>
            <p className="typography-regular-body-sm truncate text-content-secondary">
              {builderName}
            </p>
          </div>
        </div>

        <div className="flex w-full items-center gap-4">
          <Button
            type="button"
            variant="text"
            size="24"
            leftIcon={<ArrowUpRightIcon className="size-3" aria-hidden />}
            onClick={onOpen}
            disabled={!onOpen}
            className="h-auto min-h-0 gap-2 py-0.5 pr-0 pl-0"
          >
            {openLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
