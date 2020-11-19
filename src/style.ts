/** ブラウザのデフォルトフォントサイズ */
const BASE_FONT_SIZE = 16;

/**
 * pxをremに変換する
 *
 * @example rem(16) // '1rem'
 */
export const rem = (px: number): string => `${px / BASE_FONT_SIZE}rem`;

/**
 * 基準となるフォントサイズと変換したいpxを受け取ってemにして返す
 *
 * @example em(12)(16) // フォントサイズ12pxのときに16px相当のem
 */
export const em = (baseFontSizePX: number) => (px: number): string =>
  `${px / baseFontSizePX}em`;

