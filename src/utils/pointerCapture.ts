export const capturePointer = (element: Element, pointerId: number) => {
  try {
    element.setPointerCapture?.(pointerId);
  } catch {
    return;
  }
};

export const releasePointer = (element: Element, pointerId: number) => {
  try {
    element.releasePointerCapture?.(pointerId);
  } catch {
    return;
  }
};
