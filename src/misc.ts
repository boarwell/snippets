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
