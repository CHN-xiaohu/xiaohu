import { isFn } from '@/utils';

import type { TFN, UseTableOptions, FnParams } from './useTable';
import { useTable } from './useTable';

export const useZWXExclusiveTable = <
  D extends AnyObject = AnyObject,
  P extends FnParams = FnParams
>(
  fn: TFN<P>,
  options?: UseTableOptions<D>,
) => {
  const { formatSearchParams, defaultPageSize = 20, ...lastOptions } = options || {};

  return useTable(fn, {
    defaultPageSize,
    formatResult: (res) => ({
      total: res.data.total,
      data: res.data.records || res.data,
    }),
    formatSearchParams: (params) => {
      const { pageSize, ...lastParams } = params;

      return {
        ...(isFn(formatSearchParams) ? formatSearchParams(params) : lastParams),
        size: pageSize,
      };
    },
    ...(lastOptions || {}),
  });
};
