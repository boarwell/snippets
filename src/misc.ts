/** ブラウザのファイル選択モーダルを開く */
export const openFile = async (accept?: string): Promise<FileList | null> => {
  return new Promise<FileList | null>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    if (accept !== undefined) {
      input.accept = accept;
    }

    // Safariで動くように
    // https://qiita.com/fukasawah/items/b9dc732d95d99551013d
    (window as any).__tmpInputElement = input;

    input.addEventListener("change", () => {
      resolve(input.files);
      (window as any).__tmpInputElement = null;
    });
    input.click();
  });
};

/** maybeResourceがtruthyだったらfnを実行する  */
export function withResource<T, U = unknown>(
  maybeResource: T | null | undefined,
  fn: (resource: T) => U
): U | undefined {
  if (!maybeResource) {
    return;
  }

  return fn(maybeResource);
}

const DEFAULT_THROTTLE_INTERVAL_MS = 50;

/**
 * @param f 実行する関数
 * @param [interval] 実行間隔（ミリ秒）
 * @return {() => Promise<void>}
 */
export function throttle(
  f: () => void,
  interval: number = DEFAULT_THROTTLE_INTERVAL_MS
) {
  let inThrottle = false;

  return async () => {
    if (inThrottle) {
      return;
    }

    inThrottle = true;
    f();
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, interval);
    });
    inThrottle = false;
  };
}
