import { Button, ChevronRightIcon, cn } from "@fanvue/ui";

export interface AppStoreBannerProps {
  eyebrow: string;
  headline: string;
  /** Optional body line (Figma landscape variant). */
  description?: string;
  ctaLabel: string;
  onCtaPress?: () => void;
  className?: string;
}

/**
 * Promotional banner from Fanvue Library — app store banner. Narrow tall card below `md` (1280px, Eden / MUI), wide shorter bar from `md` (portrait vs landscape frames).
 */
export function AppStoreBanner({
  eyebrow,
  headline,
  description,
  ctaLabel,
  onCtaPress,
  className,
}: AppStoreBannerProps) {
  return (
    <section
      className={cn(
        "flex w-full max-w-[320px] flex-col gap-3 rounded-[var(--radius-rounded-lg,24px)] bg-brand-secondary-muted px-5 py-6",
        "min-h-[280px] md:min-h-[184px] md:max-w-[820px]",
        className,
      )}
    >
      <div className="flex min-h-px min-w-0 flex-1 flex-col gap-3">
        <p className="typography-semibold-body-lg truncate text-content-primary">{eyebrow}</p>
        <p className="typography-bold-heading-sm text-content-primary">{headline}</p>
        {description ? (
          <p className="typography-regular-body-lg text-content-primary">{description}</p>
        ) : null}
      </div>
      <Button
        type="button"
        variant="text"
        size="24"
        rightIcon={<ChevronRightIcon className="size-3" aria-hidden />}
        onClick={onCtaPress}
        disabled={!onCtaPress}
        className="typography-semibold-body-md h-auto min-h-0 shrink-0 cursor-pointer gap-2 self-start py-0.5 pr-0 pl-0"
      >
        {ctaLabel}
      </Button>
    </section>
  );
}
