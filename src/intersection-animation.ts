// 要素がビューポートに入ったらクラスをつける

/** 監視対象のセレクタ */
const TARGET_SELECTOR = ".js-intersection";
/** 画面内に入ったときにつけるクラス */
const VISIBLE_CLASS = "-visible";
/** (要素の見えている部分 / 要素全体) の比率 */
const DEFAULT_INTERSECTION_THRESHOLD = 0.5;
/** デフォルト値以外を設定するための属性 */
const INTERSECTION_THRESHOLD_ATTRIBUTE = "data-intersection-threshold";
/** (要素の見えている部分 / ブラウザ) の比率 */
const DEFAULT_OCCUPATION_THRESHOLD = 0.2;

/** @type {IntersectionObserverInit} */
const OBSERVER_OPTION = {
  threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
};

/**
 * targetの intersectionThreshold を計算する
 * （INTERSECTION_THRESHOLD_ATTRIBUTE に値が設定されていたらそれを、
 * 設定されていなかったら commonThreshold を返す）
 *
 */
function calcThreshold(target: Element, commonThreshold: number): number {
  const attribute = target.getAttribute(INTERSECTION_THRESHOLD_ATTRIBUTE);
  if (attribute == null) {
    return commonThreshold;
  }

  const n = Number(attribute);
  return isNaN(n) ? commonThreshold : n;
}

/**
 * intersection が発火する可能性があるかどうか
 *
 * 要素 * intersectionRatio がブラウザより大きい場合は
 * どれだけスクロールしても intersection が発火しない
 *
 */
function cannotIntersect(
  entry: IntersectionObserverEntry,
  threshold: number
): boolean {
  return (
    document.documentElement.clientHeight <
    entry.target.clientHeight * threshold
  );
}

type Config = {
  readonly targetSelector: string;
  readonly visibleClass: string;
  readonly intersectionThreshold: number;
  readonly occupationThreshold: number;
};

const defaultConfig: Config = {
  targetSelector: TARGET_SELECTOR,
  visibleClass: VISIBLE_CLASS,
  intersectionThreshold: DEFAULT_INTERSECTION_THRESHOLD,
  occupationThreshold: DEFAULT_OCCUPATION_THRESHOLD,
};

/**
 * targetSelector で取得した要素たちの intersectionRatio が
 * intersectionThreshold を超えたときに
 * visibleClass をつける
 *
 */
export function init(config: Partial<Config>): void {
  const {
    targetSelector,
    visibleClass,
    intersectionThreshold,
    occupationThreshold,
  } = { ...defaultConfig, ...config };

  const onIntersection = (target: Element) => {
    target.classList.add(visibleClass);
  };

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) {
        continue;
      }

      const threshold = calcThreshold(entry.target, intersectionThreshold);

      if (entry.intersectionRatio >= threshold) {
        onIntersection(entry.target);
        observer.unobserve(entry.target);
        continue;
      }

      if (cannotIntersect(entry, threshold)) {
        // 要素がブラウザの一定割合を占めたときにも処理を行う
        // --> スマホで見たときに要素が縦長になり、ブラウザ幅より高くなることもあるため
        const occupiedByTarget =
          1 -
          entry.target.getBoundingClientRect().top /
            document.documentElement.clientHeight;

        if (occupiedByTarget > occupationThreshold) {
          onIntersection(entry.target);
          observer.unobserve(entry.target);
        }
      }
    }
  }, OBSERVER_OPTION);

  const targets = document.querySelectorAll(targetSelector);
  for (const target of targets) {
    observer.observe(target);
  }
}
