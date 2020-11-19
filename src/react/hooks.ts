import * as React from "react";

type OpenHandler = {
  readonly isOpen: boolean;
  readonly open: () => void;
  readonly close: () => void;
  readonly toggle: () => void;
};

/** 開く、閉じる、トグルするの操作と状態を返す */
export const useOpener = (initialState: boolean): OpenHandler => {
  const [isOpen, setIsOpen] = React.useState(initialState ?? false);

  const open = React.useCallback(() => {
    setIsOpen(true);
  }, []);
  const close = React.useCallback(() => {
    setIsOpen(false);
  }, []);
  const toggle = React.useCallback(() => {
    setIsOpen((cur) => !cur);
  }, []);

  return { isOpen, open, close, toggle };
};
