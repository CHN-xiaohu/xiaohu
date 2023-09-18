/* eslint-disable react-hooks/exhaustive-deps */
import { useLoadingWrapper, useWatch } from '@/foundations/hooks';
import { isObj } from '@/utils';
import type { Draft } from 'immer';
import { useCallback, useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';

import { useAMAP } from './AmapApiLoader';

const generateSubTag = (dataSource: any[]) =>
  dataSource.map((item) => ({ ...item, isLeaf: false }));

export type District = AMap.DistrictSearch.District & { children?: District[]; isLeaf?: boolean };
type DistrictArray = District[];

// 缓存
export const cacheOptionsMaps = new Map<string, DistrictArray>();

type Options = {
  formatOptions: (v: DistrictArray) => (District & AnyObject)[];
  cacheKey: string;
};

export function useAMAPAddress<T extends District = District>(opts: Options) {
  const { pluginInstances } = useAMAP({ config: { key: '060f5582a23f52cf6c9dff74978e189f' } });
  const dataSourceRef = useRef(cacheOptionsMaps.get(opts.cacheKey) || []);

  const [options, setInnerOptions] = useImmer({
    dataSource: (cacheOptionsMaps.get(opts.cacheKey) || []) as T[],
  });

  const { isLoading, runRequest } = useLoadingWrapper();

  const requestSearchAddress = useCallback(
    (keywords: string) =>
      new Promise<T[]>((resolve, reject) => {
        pluginInstances.DistrictSearch.search(keywords, (status, result) => {
          if (status === 'complete' && isObj(result)) {
            const values = result.districtList?.[0]?.districtList || [];

            resolve(opts?.formatOptions ? opts?.formatOptions(values) : generateSubTag(values));
          } else {
            reject(result);
          }
        });
      }),
    [pluginInstances],
  );

  const setDataSource = useCallback((cb: (v: Draft<T>[]) => void) => {
    setInnerOptions((draft) => {
      cb(draft.dataSource);
    });
  }, []);

  useWatch(() => {
    cacheOptionsMaps.set(opts.cacheKey, options.dataSource);
  }, [options.dataSource]);

  const initProvincialAddressInfo = useCallback(
    () =>
      runRequest(() =>
        requestSearchAddress('中国').then((res) => {
          setInnerOptions((draft) => {
            draft.dataSource = res as any;
          });

          pluginInstances.DistrictSearch.setLevel('district');

          return res;
        }),
      ),
    [requestSearchAddress, opts.cacheKey],
  );

  useEffect(() => {
    if (pluginInstances.DistrictSearch) {
      if (!cacheOptionsMaps.has(opts.cacheKey)) {
        initProvincialAddressInfo();
      }
    }
  }, [pluginInstances.DistrictSearch]);

  return {
    pluginInstances,
    requestSearchAddress,
    dataSource: options.dataSource,
    setInnerOptions,
    setDataSource,
    loading: isLoading,
    dataSourceRef,
  };
}
