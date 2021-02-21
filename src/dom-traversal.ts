// 実行する関数
function setInert(element: HTMLElement): void {
  const original = element.getAttribute("inert");
  if (original != null) {
    element.setAttribute("data-inert", original);
  }

  element.setAttribute("inert", "");
}

function restoreInert(element: HTMLElement): void {
  const saved = element.getAttribute("data-inert");
  if (saved == null) {
    element.removeAttribute("inert");
    return;
  }

  element.setAttribute("inert", saved);
}

// Generatorを使うパターン

/**
 * 兄弟を列挙する
 *
 * @example
 * for (const ancestor of traverseAncestors(element)) {
 *   doSomething(ancestor);
 * }
 */
function* getSiblings(element: HTMLElement) {
  const parent = element.parentElement;
  if (parent == null) {
    return;
  }

  for (const sibling of parent.children) {
    if (sibling === element) {
      continue;
    }

    yield sibling as HTMLElement;
  }
}

/**
 * 親を列挙する（document.bodyは除く）
 *
 * @example
 * for (const parent of traverseParent(element)) {
 *  doSomething(parent);
 * }
 */
function* traverseParent(element: HTMLElement) {
  let parent: HTMLElement | null = element.parentElement;

  while (parent !== null && parent !== document.body) {
    yield parent;

    parent = parent.parentElement;
  }
}

/**
 * 親とその兄弟たちを列挙する
 *
 * @example
 * for (const ancestor of traverseAncestors(element)) {
 *   doSomething(ancestor);
 * }
 */
function* traverseAncestors(element: HTMLElement) {
  for (const parent of traverseParent(element)) {
    yield parent;

    for (const sibling of getSiblings(parent)) {
      yield sibling;
    }
  }
}

/** Generatorを使うパターン */
function mainGenerator(element: HTMLElement) {
  for (const sibling of getSiblings(element)) {
    setInert(sibling);
  }

  for (const ancestor of traverseAncestors(element)) {
    setInert(ancestor);
  }
}

// コールバック関数を使うパターン
type Callback = (element: HTMLElement) => void;

/** 兄弟を列挙して関数を実行する */
function iterateOverSiblings(element: HTMLElement, f: Callback): void {
  const parent = element.parentElement;
  if (parent == null) {
    return;
  }

  for (const sibling of parent.children) {
    if (sibling === element) {
      continue;
    }

    f(sibling as HTMLElement);
  }
}

/** 親をたどって関数を実行する */
function traverse(element: HTMLElement, f: Callback): void {
  iterateOverSiblings(element, f);
  const parent = element.parentElement;

  if (parent != document.body && parent != null) {
    traverse(parent, f);
  }
}

/** コールバック関数を使うパターン */
function mainCallback(element: HTMLElement) {
  traverse(element, setInert);
}

// inertをつける処理をクラスで行うパターン
type OriginalValueMemo = Map<HTMLElement, string | null>;

type Config = Readonly<{
  attr: string;
  value: string;
}>;

class AttributeSetter {
  #memo: OriginalValueMemo = new Map();
  #attr: string;
  #value: string;

  constructor({ attr, value }: Config) {
    this.#attr = attr;
    this.#value = value;
  }

  register(element: HTMLElement) {
    this.#memo.set(element, element.getAttribute(this.#attr));
  }

  run() {
    for (const [element] of this.#memo) {
      element.setAttribute(this.#attr, this.#value);
    }
  }

  undo() {
    for (const [element, original] of this.#memo) {
      if (original == null) {
        element.removeAttribute(this.#attr);
        continue;
      }

      element.setAttribute(this.#attr, original);
    }
  }
}

function mainClass() {
  const start = document.querySelector("#hoge") as HTMLElement;
  const inertSetter = new AttributeSetter({ attr: "inert", value: "" });

  traverse(start, (element) => {
    inertSetter.register(element);
  });
  inertSetter.run();

  setTimeout(() => {
    inertSetter.undo();
  }, 5000);
}
