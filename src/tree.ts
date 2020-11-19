/**
 * 木構造のデータ
 *
 * @example
 * type Section = {
 *   id: string;
 *   label: string;
 * }
 *
 * const sectionTree: Tree<Section> = {
 *   id: 'hoge',
 *   label: 'fuga',
 *   children: [{ id: 'piyo', label: 'hogehoge' }]
 * }
 */
export type Tree<T> = T & {
  children?: Tree<T>[];
};

/**
 * textを含むtree[key]があるかどうか
 *
 * @example
 * type Labeled = {
 *   label: string
 * }
 *
 * const tree: Tree<Labeled> = {
 *   label: 'hoge',
 *   children: [{label: 'fuga'}]
 * }
 *
 * hasMatchingText<'label', Labeled>(tree, 'id', 'hoge') // true
 */
export function hasMatchingText<
  K extends string | number | symbol,
  T extends { [key in K]: string }
>(tree: Tree<T>, key: K, text: string): boolean {
  if (tree[key].includes(text)) {
    return true;
  }

  if (tree.children) {
    return tree.children.some((child) => hasMatchingText(child, key, text));
  }

  return false;
}

/**
 * Tree<T>からkeyの値の配列を作る
 *
 * @example
 * type Labeled = {
 *   label: string
 * }
 *
 * const tree: Tree<Labeled> = {
 *   label: 'hoge',
 *   children: [{label: 'fuga'}]
 * }
 *
 * hasMatchingText<'label', Labeled>(tree, 'id') // ['hoge', 'fuga']
 */
export function getValuesOfKey<
  K extends string | number | symbol,
  T extends { [key in K]: T[K] }
>(tree: Tree<T>, key: K): T[K][] {
  const aux = (tree: Tree<T>, res: T[K][]): void => {
    res.push(tree[key]);

    if (!tree.children) {
      return;
    }

    tree.children.forEach((child) => {
      aux(child, res);
    });
  };

  const res: T[K][] = [tree[key]];
  tree.children?.forEach((child) => {
    aux(child, res);
  });

  return res;
}
