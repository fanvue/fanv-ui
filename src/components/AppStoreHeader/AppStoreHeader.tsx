import { cn } from "@fanvue/ui";
import type { ImgHTMLAttributes, ReactNode } from "react";

export interface AppStoreHeaderProps {
  /** Main heading (e.g. two lines with a `<br />` or `whitespace-pre-line` copy). */
  title: ReactNode;
  subtitle: string;
  imageProps: ImgHTMLAttributes<HTMLImageElement>;
  className?: string;
}

/**
 * Hero banner from Fanvue Library — app store header (responsive padding and title scale).
 */
export function AppStoreHeader({ title, subtitle, imageProps, className }: AppStoreHeaderProps) {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden rounded-[var(--radius-rounded-lg,24px)] border border-[var(--primitives-color-gray-100)] p-8 md:p-12",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]">
        <img
          {...imageProps}
          alt=""
          className={cn(
            "absolute size-full max-w-none rounded-[inherit] object-cover",
            imageProps.className,
          )}
        />
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-black/40 to-transparent" />
      </div>

      <div className="relative z-10 flex max-w-[640px] flex-col gap-4 text-content-on-brand-inverted">
        <h2 className="typography-bold-heading-md md:typography-bold-heading-lg leading-10 md:leading-[1.1]">
          {title}
        </h2>
        <p className="typography-semibold-body-lg">{subtitle}</p>
      </div>
    </section>
  );
}
