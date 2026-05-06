import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconSize } from "../Icons/types";
import type { InternalLottieIconProps, LottieAnimationItem, LottieIconProps } from "./types";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const SIZE_CLASS: Record<IconSize, string> = {
  16: "size-4",
  24: "size-6",
  32: "size-8",
};

const INTERACTIVE_SELECTOR =
  "a[href],button,input,select,textarea,summary,[role='button'],[role='link'],[role='menuitem'],[role='tab']";

const LAYER_TRANSITION =
  "motion-safe:transition-opacity motion-safe:duration-100 motion-safe:ease-in-out";

interface LottieModule {
  loadAnimation: (params: {
    container: Element;
    renderer: "svg";
    loop: boolean;
    autoplay: boolean;
    animationData: unknown;
    rendererSettings?: { progressiveLoad?: boolean };
  }) => LottieAnimationItem;
}

let lottieModulePromise: Promise<LottieModule> | null = null;
function loadLottie(): Promise<LottieModule> {
  if (!lottieModulePromise) {
    lottieModulePromise = import(
      /* @vite-ignore */
      "lottie-web/build/player/lottie_light"
    ).then((m: unknown) => {
      const mod = m as { default?: LottieModule } & LottieModule;
      return mod.default ?? mod;
    });
  }
  return lottieModulePromise;
}

/**
 * Internal renderer for animated Lottie icons. Each public icon (e.g.
 * `HomeLottieIcon`) is a thin wrapper that supplies its own static `Fallback`
 * and a dynamic `loadAnimationData` loader.
 *
 * The static fallback renders synchronously. The Lottie runtime and JSON are
 * fetched only on first interaction (or first `play=true`), then cached for
 * the lifetime of the page. Honors `prefers-reduced-motion` by skipping the
 * fetch entirely and keeping the static fallback.
 *
 * In the default `trigger="hover"` mode, playback follows hover/focus on the
 * closest interactive ancestor (button, link, role=button, etc.) so the icon
 * is a drop-in for static `*Icon` components inside `<button>` or `<a>`.
 */
export const LottieIcon = React.forwardRef<HTMLSpanElement, InternalLottieIconProps>(
  (
    { size = 24, trigger = "hover", play, Fallback, loadAnimationData, className, ...spanProps },
    forwardedRef,
  ) => {
    const wrapperRef = React.useRef<HTMLSpanElement>(null);
    React.useImperativeHandle(forwardedRef, () => wrapperRef.current as HTMLSpanElement);
    const containerRef = React.useRef<HTMLSpanElement>(null);
    const animRef = React.useRef<LottieAnimationItem | null>(null);

    const prefersReducedMotion = usePrefersReducedMotion();
    const isControlled = play !== undefined || trigger === "manual";
    const [hovered, setHovered] = React.useState(false);
    const isPlaying = isControlled ? !!play : hovered;

    const [loaded, setLoaded] = React.useState(false);
    const playRef = React.useRef(isPlaying);
    playRef.current = isPlaying;

    React.useEffect(() => {
      if (isControlled) return;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const target = (wrapper.closest(INTERACTIVE_SELECTOR) as HTMLElement | null) ?? wrapper;
      const enter = () => setHovered(true);
      const leave = () => setHovered(false);
      target.addEventListener("pointerenter", enter);
      target.addEventListener("pointerleave", leave);
      target.addEventListener("focus", enter);
      target.addEventListener("blur", leave);
      if (target.matches?.(":hover")) setHovered(true);
      return () => {
        target.removeEventListener("pointerenter", enter);
        target.removeEventListener("pointerleave", leave);
        target.removeEventListener("focus", enter);
        target.removeEventListener("blur", leave);
      };
    }, [isControlled]);

    React.useEffect(() => {
      if (!isPlaying || loaded || prefersReducedMotion) return;
      let cancelled = false;
      Promise.all([loadLottie(), loadAnimationData()])
        .then(([lottie, data]) => {
          if (cancelled || !containerRef.current) return;
          const animationData = (data as { default?: unknown }).default ?? data;
          const anim = lottie.loadAnimation({
            container: containerRef.current,
            renderer: "svg",
            loop: false,
            autoplay: false,
            animationData,
            rendererSettings: { progressiveLoad: true },
          });
          animRef.current = anim;
          setLoaded(true);
          if (playRef.current) anim.goToAndPlay(0, true);
        })
        .catch((err) => {
          if (process.env.NODE_ENV !== "production") {
            console.warn("[fanvue/ui] LottieIcon failed to load animation:", err);
          }
        });
      return () => {
        cancelled = true;
      };
    }, [isPlaying, loaded, prefersReducedMotion, loadAnimationData]);

    React.useEffect(() => {
      if (!loaded || !animRef.current) return;
      if (isPlaying) animRef.current.goToAndPlay(0, true);
      else animRef.current.goToAndStop(0, true);
    }, [isPlaying, loaded]);

    React.useEffect(
      () => () => {
        animRef.current?.destroy();
        animRef.current = null;
      },
      [],
    );

    const showLottie = loaded && !prefersReducedMotion;

    return (
      <span
        ref={wrapperRef}
        aria-hidden={spanProps["aria-label"] ? undefined : "true"}
        className={cn("relative inline-block shrink-0", SIZE_CLASS[size], className)}
        {...spanProps}
      >
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            LAYER_TRANSITION,
            showLottie ? "opacity-0" : "opacity-100",
          )}
          aria-hidden="true"
        >
          <Fallback size={size} />
        </span>
        <span
          ref={containerRef}
          aria-hidden="true"
          className={cn(
            "absolute inset-0 [&>svg]:size-full",
            LAYER_TRANSITION,
            showLottie ? "opacity-100" : "opacity-0",
          )}
        />
      </span>
    );
  },
);

LottieIcon.displayName = "LottieIcon";

export type { LottieIconProps };
