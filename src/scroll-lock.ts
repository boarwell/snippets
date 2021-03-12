// @ts-check

const ORIGINAL_OVERFLOW_STORE_ATTRIBUTE = "data-overflow";
const ORIGINAL_PADDING_RIGHT_STORE_ATTRIBUTE = "data-padding-right";
const DEFAULT_SET_PADDING_TARGETS: ReadonlyArray<HTMLElement> = [document.body];

function getScrollbarWidth(): number {
  return window.innerWidth - document.documentElement.clientWidth;
}

function setScrollbarWidthPadding(target: HTMLElement): void {
  const scrollbarWidth = getScrollbarWidth();

  const computed = window.getComputedStyle(target);

  const originalPaddingRightValue = computed.paddingRight;
  target.setAttribute(
    ORIGINAL_PADDING_RIGHT_STORE_ATTRIBUTE,
    originalPaddingRightValue
  );

  target.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : "";
}

function unsetScrollbarWidthPadding(target: HTMLElement): void {
  const originalPaddingRightValue = target.getAttribute(
    ORIGINAL_PADDING_RIGHT_STORE_ATTRIBUTE
  );

  target.style.paddingRight = originalPaddingRightValue ?? "";
}

function scrollLockCore(): void {
  const computed = window.getComputedStyle(document.body);

  const originalOverflowValue = computed.overflow;
  document.body.setAttribute(
    ORIGINAL_OVERFLOW_STORE_ATTRIBUTE,
    originalOverflowValue
  );
  document.body.style.overflow = "hidden";
}

let isLocked = false;

export function scrollLock(
  setPaddingTargets: ReadonlyArray<HTMLElement> = DEFAULT_SET_PADDING_TARGETS
): void {
  if (isLocked) {
    return;
  }

  for (const target of setPaddingTargets) {
    setScrollbarWidthPadding(target);
  }

  scrollLockCore();
  isLocked = true;
}

export function scrollUnlock(
  setPaddingTargets: ReadonlyArray<HTMLElement> = DEFAULT_SET_PADDING_TARGETS
): void {
  if (!isLocked) {
    return;
  }

  for (const target of setPaddingTargets) {
    unsetScrollbarWidthPadding(target);
  }

  const originalOverflowValue = document.body.getAttribute(
    ORIGINAL_OVERFLOW_STORE_ATTRIBUTE
  );
  document.body.style.overflow = originalOverflowValue ?? "";

  isLocked = false;
}
