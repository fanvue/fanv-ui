/**
 * Classes behind the icon `spin` prop: a full turn per second when motion is
 * allowed, a pulse in place under `prefers-reduced-motion`. Uses the same
 * `spin` keyframes as Tailwind's `animate-spin`, so an icon that also carries
 * that class still turns at one speed.
 *
 * Internal — not exported from the package.
 */
export const ICON_SPIN_CLASS = "motion-safe:animate-spin motion-reduce:animate-pulse";
