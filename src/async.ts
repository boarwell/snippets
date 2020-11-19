/** timeoutMS（ミリ秒）待つ */
export const sleep = (timeoutMS: number): Promise<unknown> => {
  return new Promise((res) => setTimeout(res, timeoutMS));
};

const getTransitionDuration = (el: HTMLElement): number => {
  const transitionDuration = window.getComputedStyle(el).transitionDuration;
  const parsedDuration = parseFloat(transitionDuration);

  return isNaN(parsedDuration) ? 0 : parsedDuration;
};

/** elにeventが発火されるのを待つ */
export const waitForEvent = (
  el: HTMLElement,
  event: string
): Promise<unknown> => {
  const duration = getTransitionDuration(el);

  if (duration <= 0) {
    return Promise.resolve();
  }

  return Promise.race([
    new Promise((res) => {
      el.addEventListener(event, res, { once: true });
    }),

    sleep(duration * 1000),
  ]);
};

/** elのtransitionendを待つ */
export const waitForTransitionEnd = (el: HTMLElement): Promise<unknown> => {
  return waitForEvent(el, 'transitionend');
};

/** requestAnimationFrameをPromiseにする */
export const waitForAnimationFrame = (): Promise<unknown> => {
  return new Promise((res) => {
    window.requestAnimationFrame(res);
  });
};

