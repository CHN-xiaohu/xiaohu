import { useEffect, useRef } from 'react';

export const useEffectOnce = (fn: Function, deps: any[] = []) => {
  const countRef = useRef(0);

  useEffect(() => {
    if (countRef.current > 2) {
      return;
    }

    // useEffect 在初始的时候也会执行一次，所以应该是 = 1 的时候，才是真正的执行时机
    if (countRef.current === 1) {
      fn();
    }

    countRef.current += 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
