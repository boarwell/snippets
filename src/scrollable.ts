// ある要素がスクロール可能になったとき、
// スクロールされたときにクラスをつけ外しする

/** 横スクロールが発生しているときにつけるクラス */
const OVERFLOWING_MARK_CLASS = "-overflow";
/** 横スクロールしたときにつけるクラス */
const SCROLLED_MARK_CLASS = "-scroll";
/** 対象領域をつかまえるセレクタ */
const ROOT_SELECTOR = ".js-scrollable-root";
/** 横スクロールする要素をつかまえるセレクタ */
const CONTAINER_SELECTOR = ".js-scrollable-container";

/**
 * 横スクロールが発生しているかどうか
 */
function isOverflowing(root: Element): boolean {
  return root.clientWidth < root.scrollWidth;
}

/**
 * 横スクロールが発生しているときに実行する
 */
function onOverflow(root: Element): void {
  root.classList.add(OVERFLOWING_MARK_CLASS);
}

/**
 * 横スクロールが発生していないときに実行する
 */
function onNotOverflow(element: Element): void {
  element.classList.remove(OVERFLOWING_MARK_CLASS);
}

/**
 * 横スクロールしたときに実行する
 */
function onScroll(root: Element): void {
  root.classList.add(SCROLLED_MARK_CLASS);
}

/**
 * 横スクロールの先頭に戻ったときに実行する
 */
function onScrollBack(root: Element): void {
  root.classList.remove(SCROLLED_MARK_CLASS);
}

/**
 * ある要素がスクロール可能になったとき、
 * スクロールされたときにクラスをつけ外しする
 */
export function init(): void {
  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const target = entry.target;
      const root = target.closest(ROOT_SELECTOR);

      if (root == null) {
        return;
      }

      if (isOverflowing(target)) {
        onOverflow(root);
      } else {
        onNotOverflow(root);
      }
    }
  });

  const roots = document.querySelectorAll(ROOT_SELECTOR);
  for (const root of roots) {
    const container = root.querySelector(CONTAINER_SELECTOR);
    if (container == null) {
      continue;
    }

    observer.observe(container);

    container.addEventListener("scroll", () => {
      if (container.scrollLeft > 0) {
        onScroll(root);
      } else {
        onScrollBack(root);
      }
    });
  }
}
