import { useCallback } from 'react';
import type { Selector } from 'reselect';
import { createSelector } from 'reselect';
import { useSelector } from 'umi';

/**
 * 浅比较更新
 */
export const useShallowEqualSelector = <TState, TSelected>(
  selector: (state: TState) => TSelected,
) => useSelector(selector);

/**
 * 获取指定命名空间 model 下的 state
 *
 * @param {N} namespace 命名空间
 *
 * @returns {FullModelStates[N]}
 */
export const useStoreState = <N extends keyof FullModelStates>(namespace: N) =>
  useSelector((state: FullModelStates) => state[namespace]);

/**
 * 获取多个指定命名空间 model 下的 state
 *
 * @param {N} namespace 命名空间
 *
 * @returns {FullModelStates[N]}
 */
export function useMultipleStoreState<N extends keyof FullModelStates>(namespace: N[]) {
  return useSelector((state: FullModelStates) =>
    namespace.reduce((res, key) => {
      res[key] = state[key];

      return res;
    }, Object.create(null)),
  ) as { [K in N]: FullModelStates[K] };
}

/**
 * @see https://www.zhihu.com/question/332090851/answer/732946648
 *
 * @param {any[]} args
 */
export function useScopedSelector<S, R, T>(
  selectors: Selector<S, R>[],
  combiner: (...res: R[]) => T,
  deps: any[],
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const selector = useCallback(createSelector(selectors, combiner), deps);

  return useSelector(selector);
}
