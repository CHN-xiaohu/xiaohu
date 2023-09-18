import { useRef, useState, useEffect, useCallback } from 'react';

export function usePrevious(value: any) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export function usePreviousAndNextValue(value: any) {
  const [next, setNextValue] = useState(value);

  const previousValue = usePrevious(next);

  return {
    previousValue,
    setNextValue,
  };
}

export function useForceUpdate() {
  const [, setCount] = useState(0);

  return useCallback(() => setCount((s) => s + 1), []);
}
