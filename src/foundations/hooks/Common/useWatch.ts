/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';
import { useDebounceEffect } from 'ahooks';
import { isEqual } from 'lodash';

type Callback<T> = (prev: T[] | undefined) => void;
type Config = {
  immediate: boolean;
};

/**
 * @see https://github.com/sl1673495/use-watch-hook/blob/master/src/index.ts
 */
export function useWatch<T = any>(
  callback: Callback<T>,
  deps: T[],
  config?: Partial<Config & { ms: number; isAreEqual: boolean }>,
) {
  const { immediate = false, isAreEqual = false } = config || {};

  const prev = useRef<T[]>();
  const inited = useRef(false);
  const stop = useRef(false);

  useEffect(() => {
    if (stop.current) {
      return;
    }

    if (!inited.current) {
      inited.current = true;

      if (!immediate) {
        return;
      }
    }

    if (isAreEqual) {
      if (isEqual(prev.current, deps)) {
        return;
      }
    }

    callback(prev.current);

    prev.current = deps;
  }, deps);

  return () => {
    stop.current = true;
  };
}

export function useDebounceWatch<T = any>(
  callback: Callback<T>,
  deps: T[],
  config?: Partial<Config & { ms: number; isAreEqual: boolean }>,
) {
  const { immediate = false, ms = 300, isAreEqual = false } = config || {};

  const prev = useRef<T[]>();
  const inited = useRef(false);
  const stop = useRef(false);

  useDebounceEffect(
    () => {
      if (stop.current) {
        return;
      }

      if (!inited.current) {
        inited.current = true;

        if (!immediate) {
          return;
        }
      }

      if (isAreEqual) {
        if (isEqual(prev.current, deps)) {
          return;
        }
      }

      callback(prev.current);

      prev.current = deps;
    },
    deps,
    { wait: ms },
  );

  return () => {
    stop.current = true;
  };
}
