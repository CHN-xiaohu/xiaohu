import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import { useMount } from 'ahooks';
import { useParams } from 'umi';

import type { RouteItem } from '@/typings/app';
import { getArrayLastItem } from '@/utils';

/**
 * 根据条件，设置最后一个面包屑的文字为指定文字
 *
 * @example useSetBreadcrumbTextToCreateOrUpdate(id, '文章');
 *
 * @param text 文字
 */
export const useSetBreadcrumbTextToCreateOrUpdate = (text?: string) => {
  const { id } = useParams<{ id: string }>();

  useMount(() => {
    if (!id) {
      return;
    }

    setTimeout(() => {
      // eslint-disable-next-line no-underscore-dangle
      const breadcrumb = window.__AppBreadcrumb;
      const currentRoute = getArrayLastItem(breadcrumb, {} as RouteItem);
      if (!currentRoute?.edit_title) {
        return;
      }

      const breadcrumbEndNode = document.querySelector('#setBreadcrumbTextToCreateOrUpdate');
      const breadcrumbText = text || currentRoute.edit_title;
      if (breadcrumbEndNode && breadcrumbText) {
        requestAnimationFrame(() => {
          breadcrumbEndNode.innerHTML = breadcrumbText;
        });
      }
    });
  });
};

export const useFetch = (fetcher: () => Promise<any>) => {
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState(0);
  const [data, setData] = useState(null);

  useEffect(() => {
    setLoading(true);

    fetcher()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [fetcher, identifier]);

  const reFetch = () => setIdentifier(identifier + 1);

  return { data, loading, reFetch };
};

export function useLoading(value = false) {
  const [isLoading, setLoading] = useState(value);

  const openLoading = () => {
    setLoading(true);
  };

  const closeLoading = () => {
    setLoading(false);
  };

  return { isLoading, openLoading, closeLoading };
}

export function useLoadingWrapper(
  props: { loading?: boolean; seconds?: number; deps?: any[] } = {},
) {
  const { loading = false, seconds = 0, deps = [] } = props;
  const { isLoading, openLoading, closeLoading } = useLoading(loading);

  const runRequest = useCallback((fn: Function) => {
    openLoading();

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        if ((fn as any).then) {
          (fn as any).then((result: any) => resolve(result));
        } else {
          const result = await fn();

          resolve(result);
        }
      } catch (error) {
        reject(error);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      seconds === 0
        ? requestAnimationFrame(() => closeLoading())
        : setTimeout(() => {
            closeLoading();
          }, seconds * 1000);
    });
  }, deps);

  return { isLoading, runRequest };
}

export function useCurrentValue<T>(value: T): React.RefObject<T> {
  const ref = useRef(value);
  ref.current = value;

  return ref;
}

export const useDebounceByMemo = <C extends (...args: any[]) => any>(
  fn: C,
  options?: { delay?: number; deps?: any[] },
) => {
  const { delay = 300, deps = [] } = options || {};

  const debouncedFunction = useRef<C>(fn);
  debouncedFunction.current = fn;

  return useMemo(() => debounce(debouncedFunction.current, delay), deps);
};
