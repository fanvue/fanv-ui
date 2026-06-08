import * as React from "react";

type CyclingTextSizingOption = "longest" | "current";

type CycleState = {
  currentIndex: number;
  incomingIndex: number | null;
  incomingEntered: boolean;
  transitioning: boolean;
};

type CycleAction =
  | { type: "tick"; itemCount: number }
  | { type: "incoming_entered" }
  | { type: "transition_complete" }
  | { type: "pause_clear" }
  | { type: "clamp_after_items_change"; itemCount: number };

const initialCycleState: CycleState = {
  currentIndex: 0,
  incomingIndex: null,
  incomingEntered: false,
  transitioning: false,
};

function cycleReducer(state: CycleState, action: CycleAction): CycleState {
  switch (action.type) {
    case "tick": {
      if (action.itemCount <= 1) return state;
      const next = (state.currentIndex + 1) % action.itemCount;
      return {
        ...state,
        incomingIndex: next,
        incomingEntered: false,
        transitioning: true,
      };
    }
    case "incoming_entered":
      return { ...state, incomingEntered: true };
    case "transition_complete": {
      if (!state.transitioning || state.incomingIndex === null) return state;
      return {
        currentIndex: state.incomingIndex,
        incomingIndex: null,
        incomingEntered: false,
        transitioning: false,
      };
    }
    case "pause_clear":
      return {
        ...state,
        incomingIndex: null,
        incomingEntered: false,
        transitioning: false,
      };
    case "clamp_after_items_change": {
      if (action.itemCount === 0) return state;
      const idx = state.currentIndex >= action.itemCount ? 0 : state.currentIndex;
      return {
        currentIndex: idx,
        incomingIndex: null,
        incomingEntered: false,
        transitioning: false,
      };
    }
    default:
      return state;
  }
}

export function useCyclingCycle(
  items: readonly string[],
  sizing: CyclingTextSizingOption,
  intervalMs: number,
  paused: boolean,
  docVisible: boolean,
  transitionMs: number,
) {
  const [cycle, dispatch] = React.useReducer(cycleReducer, initialCycleState);

  const enterOuterFrameRef = React.useRef<ReturnType<typeof requestAnimationFrame> | null>(null);
  const enterInnerFrameRef = React.useRef<ReturnType<typeof requestAnimationFrame> | null>(null);
  const fallbackTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const cycleTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCycleTimeout = React.useCallback(() => {
    if (cycleTimeoutRef.current !== null) {
      clearTimeout(cycleTimeoutRef.current);
      cycleTimeoutRef.current = null;
    }
  }, []);

  const clearAnimationArtifacts = React.useCallback(() => {
    if (enterOuterFrameRef.current !== null) {
      cancelAnimationFrame(enterOuterFrameRef.current);
      enterOuterFrameRef.current = null;
    }
    if (enterInnerFrameRef.current !== null) {
      cancelAnimationFrame(enterInnerFrameRef.current);
      enterInnerFrameRef.current = null;
    }
    if (fallbackTimerRef.current !== null) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    clearCycleTimeout();
  }, [clearCycleTimeout]);

  const itemCount = items.length;

  React.useEffect(() => {
    if (itemCount === 0) return;
    dispatch({ type: "clamp_after_items_change", itemCount });
  }, [itemCount]);

  const safeCurrentIndex = itemCount === 0 ? 0 : cycle.currentIndex % itemCount;
  const safeIncomingIndex =
    cycle.incomingIndex === null || itemCount === 0 ? null : cycle.incomingIndex % itemCount;

  const currentLabel = itemCount === 0 ? "" : (items[safeCurrentIndex] ?? "");
  const incomingLabel = safeIncomingIndex === null ? null : (items[safeIncomingIndex] ?? "");

  const longestItem = React.useMemo(() => {
    if (itemCount === 0) return "";
    let longest = items[0] ?? "";
    for (const item of items) {
      if (item.length > longest.length) longest = item;
    }
    return longest;
  }, [items, itemCount]);

  const sizingLabel =
    sizing === "longest"
      ? longestItem
      : incomingLabel && incomingLabel.length > currentLabel.length
        ? incomingLabel
        : currentLabel;

  const shouldCycle = !paused && docVisible && itemCount > 1;

  React.useEffect(() => {
    if (!shouldCycle || itemCount <= 1) {
      clearCycleTimeout();
      return;
    }

    if (cycle.transitioning) {
      return;
    }

    cycleTimeoutRef.current = setTimeout(() => {
      cycleTimeoutRef.current = null;
      dispatch({ type: "tick", itemCount });
    }, intervalMs);

    return () => {
      clearCycleTimeout();
    };
  }, [shouldCycle, itemCount, intervalMs, cycle.transitioning, clearCycleTimeout]);

  React.useEffect(() => {
    if (paused) {
      clearAnimationArtifacts();
      dispatch({ type: "pause_clear" });
    }
  }, [paused, clearAnimationArtifacts]);

  React.useEffect(() => {
    return () => {
      clearAnimationArtifacts();
    };
  }, [clearAnimationArtifacts]);

  React.useEffect(() => {
    if (!cycle.transitioning || cycle.incomingIndex === null || cycle.incomingEntered) {
      return;
    }

    if (enterOuterFrameRef.current !== null) {
      cancelAnimationFrame(enterOuterFrameRef.current);
    }
    if (enterInnerFrameRef.current !== null) {
      cancelAnimationFrame(enterInnerFrameRef.current);
    }

    enterOuterFrameRef.current = requestAnimationFrame(() => {
      enterOuterFrameRef.current = null;
      enterInnerFrameRef.current = requestAnimationFrame(() => {
        enterInnerFrameRef.current = null;
        dispatch({ type: "incoming_entered" });
      });
    });

    return () => {
      if (enterOuterFrameRef.current !== null) {
        cancelAnimationFrame(enterOuterFrameRef.current);
        enterOuterFrameRef.current = null;
      }
      if (enterInnerFrameRef.current !== null) {
        cancelAnimationFrame(enterInnerFrameRef.current);
        enterInnerFrameRef.current = null;
      }
    };
  }, [cycle.transitioning, cycle.incomingIndex, cycle.incomingEntered]);

  React.useEffect(() => {
    if (!cycle.transitioning) {
      return;
    }
    if (fallbackTimerRef.current !== null) {
      clearTimeout(fallbackTimerRef.current);
    }
    fallbackTimerRef.current = setTimeout(() => {
      dispatch({ type: "transition_complete" });
      fallbackTimerRef.current = null;
    }, transitionMs);

    return () => {
      if (fallbackTimerRef.current !== null) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
    };
  }, [cycle.transitioning, transitionMs]);

  const onOutgoingTransitionEnd = React.useCallback(
    (event: React.TransitionEvent<HTMLSpanElement>) => {
      if (!cycle.transitioning) return;
      if (event.propertyName !== "opacity") return;
      if (fallbackTimerRef.current !== null) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
      dispatch({ type: "transition_complete" });
    },
    [cycle.transitioning],
  );

  return {
    cycle,
    currentIndex: safeCurrentIndex,
    currentLabel,
    incomingLabel,
    sizingLabel,
    onOutgoingTransitionEnd,
  };
}
